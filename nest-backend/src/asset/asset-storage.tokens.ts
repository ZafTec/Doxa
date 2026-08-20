// Kept in their own module, separate from `asset-storage.providers.ts`, so
// that `AssetService` (and its Jest specs, which run under Node) can
// reference these tokens without transitively importing `bun` - a runtime
// built-in that only resolves under the Bun runtime, not Node/Jest.
export const INTERNAL_S3 = Symbol('INTERNAL_S3');
export const PUBLIC_S3_SIGNER = Symbol('PUBLIC_S3_SIGNER');
