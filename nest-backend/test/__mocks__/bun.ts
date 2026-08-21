/**
 * Jest's own module resolver doesn't know about Bun's built-in `bun` module -
 * it isn't a real npm package under node_modules, so `import { S3Client }
 * from "bun"` only resolves under Bun's runtime, never Jest's CommonJS-style
 * resolver (even when the outer `jest` process is itself launched via
 * `bun run`). Mapped in via `moduleNameMapper` in both jest configs so
 * anything that transitively imports asset-storage.providers.ts - like the
 * full AppModule in e2e tests - doesn't fail to resolve. Nothing here talks
 * to real S3; tests that care about behavior stub `storage`/`signer`
 * themselves (see asset.service.spec.ts). `tsc`/`nest build` never see this
 * file - they resolve `bun` from its real ambient types, unaffected by
 * Jest's moduleNameMapper - so this only needs to satisfy Jest at runtime.
 */
export class S3Client {
  presign = jest.fn(() => 'https://example.invalid/presigned');
  stat = jest.fn(() => Promise.resolve({ size: 0, etag: 'test-etag' }));
  write = jest.fn(() => Promise.resolve());
  delete = jest.fn(() => Promise.resolve());
}
