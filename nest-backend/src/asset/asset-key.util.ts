import { extensionByContentType } from './asset.schema';

export function buildAssetKey(
  itemVariantId: string,
  contentType: keyof typeof extensionByContentType,
): string {
  const extension = extensionByContentType[contentType];

  return `item-variants/${itemVariantId}/${crypto.randomUUID()}.${extension}`;
}

export function assetKeyBelongsToVariant(
  key: string,
  itemVariantId: string,
): boolean {
  return key.startsWith(`item-variants/${itemVariantId}/`);
}
