import { assetKeyBelongsToVariant, buildAssetKey } from './asset-key.util';

describe('asset key utilities', () => {
  it('builds a key namespaced under the variant id with the right extension', () => {
    const key = buildAssetKey('variant-1', 'image/webp');

    expect(key).toMatch(/^item-variants\/variant-1\/[0-9a-f-]{36}\.webp$/);
  });

  it('generates a fresh key on every call', () => {
    const a = buildAssetKey('variant-1', 'image/jpeg');
    const b = buildAssetKey('variant-1', 'image/jpeg');

    expect(a).not.toBe(b);
  });

  it('confirms a key belongs to its variant prefix', () => {
    const key = buildAssetKey('variant-1', 'image/png');

    expect(assetKeyBelongsToVariant(key, 'variant-1')).toBe(true);
    expect(assetKeyBelongsToVariant(key, 'variant-2')).toBe(false);
  });

  it('rejects a key merely prefixed by another variant id', () => {
    // "variant-1-evil" starts with "variant-1" as a string, but must not
    // pass the "variant-1/" segment-boundary check.
    expect(
      assetKeyBelongsToVariant(
        'item-variants/variant-1-evil/x.jpg',
        'variant-1',
      ),
    ).toBe(false);
  });
});
