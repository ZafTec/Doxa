import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { S3Client } from 'bun';
import { AssetService } from './asset.service';
import { MAX_ASSETS_PER_VARIANT } from './asset.schema';
import type { PrismaService } from '../prisma/prisma.service';

process.env.ASSET_PUBLIC_BASE_URL ??= 'https://storage.zaftech.co/doxa-assets';

function buildService() {
  const prisma = {
    itemVariant: { findUnique: jest.fn() },
    asset: {
      count: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };
  const storage = { stat: jest.fn(), delete: jest.fn(), write: jest.fn() };
  const signer = { presign: jest.fn() };

  const service = new AssetService(
    prisma as unknown as PrismaService,
    storage as unknown as S3Client,
    signer as unknown as S3Client,
  );
  return { service, prisma, storage, signer };
}

const VARIANT_ID = '11111111-1111-1111-1111-111111111111';

describe('AssetService', () => {
  describe('presignUpload', () => {
    it('rejects when the ItemVariant does not exist', async () => {
      const { service, prisma } = buildService();
      prisma.itemVariant.findUnique.mockResolvedValue(null);

      await expect(
        service.presignUpload({
          itemVariantId: VARIANT_ID,
          fileName: 'a.jpg',
          contentType: 'image/jpeg',
          size: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects once the variant is at the asset cap', async () => {
      const { service, prisma } = buildService();
      prisma.itemVariant.findUnique.mockResolvedValue({ id: VARIANT_ID });
      prisma.asset.count.mockResolvedValue(MAX_ASSETS_PER_VARIANT);

      await expect(
        service.presignUpload({
          itemVariantId: VARIANT_ID,
          fileName: 'a.jpg',
          contentType: 'image/jpeg',
          size: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('signs a key namespaced under the variant using the public signer', async () => {
      const { service, prisma, signer } = buildService();
      prisma.itemVariant.findUnique.mockResolvedValue({ id: VARIANT_ID });
      prisma.asset.count.mockResolvedValue(0);
      signer.presign.mockReturnValue('https://storage.zaftech.co/signed');

      const ticket = await service.presignUpload({
        itemVariantId: VARIANT_ID,
        fileName: 'a.jpg',
        contentType: 'image/jpeg',
        size: 100,
      });

      expect(ticket.uploadUrl).toBe('https://storage.zaftech.co/signed');
      expect(ticket.key.startsWith(`item-variants/${VARIANT_ID}/`)).toBe(true);
      expect(signer.presign).toHaveBeenCalledWith(
        ticket.key,
        expect.objectContaining({ method: 'PUT', type: 'image/jpeg' }),
      );
    });
  });

  describe('completeUpload', () => {
    const baseDto = {
      itemVariantId: VARIANT_ID,
      originalName: 'a.jpg',
      expectedContentType: 'image/jpeg' as const,
      expectedSize: 1234,
    };

    it('rejects a key that does not belong to the variant', async () => {
      const { service, prisma } = buildService();
      prisma.itemVariant.findUnique.mockResolvedValue({ id: VARIANT_ID });

      await expect(
        service.completeUpload({
          ...baseDto,
          key: 'item-variants/other-variant/a.jpg',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects when the object was never uploaded to storage', async () => {
      const { service, prisma, storage } = buildService();
      prisma.itemVariant.findUnique.mockResolvedValue({ id: VARIANT_ID });
      storage.stat.mockRejectedValue(new Error('NotFound'));

      await expect(
        service.completeUpload({
          ...baseDto,
          key: `item-variants/${VARIANT_ID}/a.jpg`,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects when the uploaded size does not match what was declared', async () => {
      const { service, prisma, storage } = buildService();
      prisma.itemVariant.findUnique.mockResolvedValue({ id: VARIANT_ID });
      storage.stat.mockResolvedValue({ size: 999, etag: 'etag' });

      await expect(
        service.completeUpload({
          ...baseDto,
          key: `item-variants/${VARIANT_ID}/a.jpg`,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('upserts by key so a repeated completion call is idempotent', async () => {
      const { service, prisma, storage } = buildService();
      prisma.itemVariant.findUnique.mockResolvedValue({ id: VARIANT_ID });
      storage.stat.mockResolvedValue({ size: 1234, etag: 'etag' });
      prisma.asset.count.mockResolvedValue(0);
      prisma.asset.upsert.mockResolvedValue({ id: 'asset-1' });

      const key = `item-variants/${VARIANT_ID}/a.jpg`;
      await service.completeUpload({ ...baseDto, key });
      await service.completeUpload({ ...baseDto, key });

      expect(prisma.asset.upsert).toHaveBeenCalledTimes(2);
      expect(prisma.asset.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { key } }),
      );
    });
  });

  describe('deleteAsset', () => {
    it('404s when the asset does not exist', async () => {
      const { service, prisma } = buildService();
      prisma.asset.findUnique.mockResolvedValue(null);

      await expect(service.deleteAsset('missing')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deletes the stored object by its key, then the database row', async () => {
      const { service, prisma, storage } = buildService();
      prisma.asset.findUnique.mockResolvedValue({
        id: 'asset-1',
        key: 'item-variants/x/a.jpg',
      });
      prisma.asset.delete.mockResolvedValue({ id: 'asset-1' });

      await service.deleteAsset('asset-1');

      expect(storage.delete).toHaveBeenCalledWith('item-variants/x/a.jpg');
      expect(prisma.asset.delete).toHaveBeenCalledWith({
        where: { id: 'asset-1' },
      });
    });

    it('skips the storage delete for legacy assets with no key', async () => {
      const { service, prisma, storage } = buildService();
      prisma.asset.findUnique.mockResolvedValue({ id: 'asset-1', key: null });
      prisma.asset.delete.mockResolvedValue({ id: 'asset-1' });

      await service.deleteAsset('asset-1');

      expect(storage.delete).not.toHaveBeenCalled();
    });
  });
});
