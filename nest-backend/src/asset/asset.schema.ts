import { z } from 'zod';

export const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

export const extensionByContentType: Record<
  (typeof allowedImageTypes)[number],
  string
> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export function isAllowedImageContentType(
  value: string,
): value is (typeof allowedImageTypes)[number] {
  return (allowedImageTypes as readonly string[]).includes(value);
}

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_ASSETS_PER_VARIANT = 8;
export const PRESIGN_EXPIRES_IN_SECONDS = 5 * 60;

export const presignAssetUploadSchema = z.object({
  itemVariantId: z.string().uuid(),
  fileName: z.string().trim().min(1).max(255),
  contentType: z.enum(allowedImageTypes),
  size: z.number().int().positive().max(MAX_IMAGE_SIZE),
});

export const completeAssetUploadSchema = z.object({
  itemVariantId: z.string().uuid(),
  key: z.string().min(1).max(1024),
  originalName: z.string().trim().min(1).max(255),
  expectedContentType: z.enum(allowedImageTypes),
  expectedSize: z.number().int().positive().max(MAX_IMAGE_SIZE),
});

export const importAssetFromUrlSchema = z.object({
  itemVariantId: z.string().uuid(),
  url: z.string().url().max(2048),
});

export type PresignAssetUploadDto = z.infer<typeof presignAssetUploadSchema>;
export type CompleteAssetUploadDto = z.infer<typeof completeAssetUploadSchema>;
export type ImportAssetFromUrlDto = z.infer<typeof importAssetFromUrlSchema>;
