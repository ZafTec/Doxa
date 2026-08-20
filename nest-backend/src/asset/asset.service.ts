import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { S3Client } from 'bun';
import { PrismaService } from '../prisma/prisma.service';
import { INTERNAL_S3, PUBLIC_S3_SIGNER } from './asset-storage.providers';
import { assetKeyBelongsToVariant, buildAssetKey } from './asset-key.util';
import { assertPublicHttpUrl } from './asset-url-guard';
import {
  isAllowedImageContentType,
  MAX_ASSETS_PER_VARIANT,
  MAX_IMAGE_SIZE,
  PRESIGN_EXPIRES_IN_SECONDS,
  type CompleteAssetUploadDto,
  type ImportAssetFromUrlDto,
  type PresignAssetUploadDto,
} from './asset.schema';

const URL_FETCH_TIMEOUT_MS = 15_000;

async function readBodyWithLimit(
  response: Response,
  maxBytes: number,
): Promise<Buffer> {
  const reader = response.body?.getReader();
  if (!reader) {
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > maxBytes) {
      throw new BadRequestException(
        `Image exceeds maximum size of ${maxBytes} bytes`,
      );
    }
    return buffer;
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) {
      await reader.cancel();
      throw new BadRequestException(
        `Image exceeds maximum size of ${maxBytes} bytes`,
      );
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function publicAssetUrl(key: string): string {
  const baseUrl = requiredEnv('ASSET_PUBLIC_BASE_URL').replace(/\/$/, '');
  return `${baseUrl}/${key}`;
}

@Injectable()
export class AssetService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(INTERNAL_S3) private readonly storage: S3Client,
    @Inject(PUBLIC_S3_SIGNER) private readonly signer: S3Client,
  ) {}

  private async requireItemVariant(itemVariantId: string) {
    const itemVariant = await this.prisma.itemVariant.findUnique({
      where: { id: itemVariantId },
    });
    if (!itemVariant) {
      throw new BadRequestException('Invalid ItemVariant ID');
    }
    return itemVariant;
  }

  private async enforceAssetCapacity(itemVariantId: string): Promise<number> {
    const existingCount = await this.prisma.asset.count({
      where: { itemVariantId },
    });
    if (existingCount >= MAX_ASSETS_PER_VARIANT) {
      throw new BadRequestException(
        `A variant may have at most ${MAX_ASSETS_PER_VARIANT} images`,
      );
    }
    return existingCount;
  }

  private async upsertAssetRecord(record: {
    itemVariantId: string;
    key: string;
    originalName: string;
    contentType: string;
    size: number;
    etag: string;
  }) {
    const url = publicAssetUrl(record.key);
    const existingCount = await this.prisma.asset.count({
      where: { itemVariantId: record.itemVariantId },
    });

    return this.prisma.asset.upsert({
      where: { key: record.key },
      create: {
        key: record.key,
        url,
        originalName: record.originalName,
        contentType: record.contentType,
        size: record.size,
        etag: record.etag,
        position: existingCount,
        itemVariantId: record.itemVariantId,
      },
      update: {
        url,
        originalName: record.originalName,
        contentType: record.contentType,
        size: record.size,
        etag: record.etag,
      },
    });
  }

  async presignUpload(dto: PresignAssetUploadDto) {
    await this.requireItemVariant(dto.itemVariantId);
    await this.enforceAssetCapacity(dto.itemVariantId);

    const key = buildAssetKey(dto.itemVariantId, dto.contentType);

    const uploadUrl = this.signer.presign(key, {
      method: 'PUT',
      expiresIn: PRESIGN_EXPIRES_IN_SECONDS,
      type: dto.contentType,
    });

    return {
      key,
      uploadUrl,
      expiresIn: PRESIGN_EXPIRES_IN_SECONDS,
      headers: {
        'Content-Type': dto.contentType,
      },
    };
  }

  async completeUpload(dto: CompleteAssetUploadDto) {
    await this.requireItemVariant(dto.itemVariantId);

    if (!assetKeyBelongsToVariant(dto.key, dto.itemVariantId)) {
      throw new BadRequestException(
        'Object key does not belong to this ItemVariant',
      );
    }

    const stat = await this.storage.stat(dto.key).catch(() => null);
    if (!stat) {
      throw new BadRequestException(
        'Uploaded object not found - it may have expired or never uploaded',
      );
    }

    if (stat.size !== dto.expectedSize) {
      throw new BadRequestException(
        `Uploaded object size (${stat.size}) does not match expected size (${dto.expectedSize})`,
      );
    }

    return this.upsertAssetRecord({
      itemVariantId: dto.itemVariantId,
      key: dto.key,
      originalName: dto.originalName,
      contentType: dto.expectedContentType,
      size: stat.size,
      etag: stat.etag,
    });
  }

  async importFromUrl(dto: ImportAssetFromUrlDto) {
    await this.requireItemVariant(dto.itemVariantId);
    await this.enforceAssetCapacity(dto.itemVariantId);

    const sourceUrl = await assertPublicHttpUrl(dto.url);

    let response: Response;
    try {
      response = await fetch(sourceUrl, {
        // Never follow redirects: a URL that passed the SSRF guard could
        // otherwise 3xx to an internal address at fetch time.
        redirect: 'manual',
        signal: AbortSignal.timeout(URL_FETCH_TIMEOUT_MS),
      });
    } catch {
      throw new BadRequestException('Could not fetch the image URL');
    }
    // Bun's fetch doesn't surface `redirect: "manual"` redirects as
    // `type: "opaqueredirect"` (unlike spec/browser fetch) - it returns the
    // raw 3xx response instead, without following it. Check the status
    // range directly so the intent survives either behavior.
    if (
      response.type === 'opaqueredirect' ||
      (response.status >= 300 && response.status < 400)
    ) {
      throw new BadRequestException('URL must not redirect');
    }
    if (!response.ok) {
      throw new BadRequestException(
        `Image URL responded with status ${response.status}`,
      );
    }

    const contentType = response.headers
      .get('content-type')
      ?.split(';')[0]
      ?.trim()
      .toLowerCase();
    if (!contentType || !isAllowedImageContentType(contentType)) {
      throw new BadRequestException(
        'URL did not return a supported image type (JPEG, PNG, WebP, or AVIF)',
      );
    }

    const contentLength = Number(response.headers.get('content-length'));
    if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_SIZE) {
      throw new BadRequestException(
        `Image exceeds maximum size of ${MAX_IMAGE_SIZE} bytes`,
      );
    }

    const buffer = await readBodyWithLimit(response, MAX_IMAGE_SIZE);

    const key = buildAssetKey(dto.itemVariantId, contentType);
    await this.storage.write(key, buffer, { type: contentType });
    const stat = await this.storage.stat(key);

    const lastSegment = decodeURIComponent(
      sourceUrl.pathname.split('/').filter(Boolean).pop() ?? '',
    );

    return this.upsertAssetRecord({
      itemVariantId: dto.itemVariantId,
      key,
      originalName: lastSegment || 'image',
      contentType,
      size: stat.size,
      etag: stat.etag,
    });
  }

  async listAssetsForVariant(itemVariantId: string) {
    await this.requireItemVariant(itemVariantId);

    return this.prisma.asset.findMany({
      where: { itemVariantId },
      orderBy: { position: 'asc' },
    });
  }

  async fetchAssetByItemVariantId(itemVariantId: string) {
    const itemVariant = await this.prisma.itemVariant.findUnique({
      where: { id: itemVariantId },
    });
    if (!itemVariant) {
      throw new BadRequestException('Invalid ItemVariant ID');
    }
    const assets = await this.prisma.asset.findMany({
      where: { itemVariantId },
      orderBy: { position: 'asc' },
      select: { url: true },
    });

    return assets.map((asset) => asset.url);
  }

  async deleteAsset(assetId: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId },
    });
    if (!asset) {
      throw new NotFoundException('Asset not found');
    }

    if (asset.key) {
      await this.storage.delete(asset.key);
    }

    await this.prisma.asset.delete({ where: { id: assetId } });

    return { message: 'Asset deleted' };
  }
}
