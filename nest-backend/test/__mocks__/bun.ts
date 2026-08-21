/**
 * Jest's own module resolver doesn't know about Bun's built-in `bun` module -
 * it isn't a real npm package under node_modules, so `import { S3Client }
 * from "bun"` only resolves under Bun's runtime, never Jest's CommonJS-style
 * resolver (even when the outer `jest` process is itself launched via
 * `bun run`). Mapped in via `moduleNameMapper` in both jest configs so
 * anything that transitively imports asset-storage.providers.ts - like the
 * full AppModule in e2e tests - doesn't fail to resolve. Nothing here talks
 * to real S3; tests that care about behavior stub `storage`/`signer`
 * themselves (see asset.service.spec.ts).
 */
export class S3Client {
  constructor(_options?: unknown) {}

  presign(_key: string, _options?: unknown): string {
    return "https://example.invalid/presigned";
  }

  async stat(_key: string): Promise<{ size: number; etag: string }> {
    return { size: 0, etag: "test-etag" };
  }

  async write(_key: string, _data: unknown, _options?: unknown): Promise<void> {}

  async delete(_key: string): Promise<void> {}

  async exists(_key: string): Promise<boolean> {
    return false;
  }
}
