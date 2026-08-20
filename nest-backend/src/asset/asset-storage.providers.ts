import type { Provider } from '@nestjs/common';
import { S3Client } from 'bun';

export const INTERNAL_S3 = Symbol('INTERNAL_S3');
export const PUBLIC_S3_SIGNER = Symbol('PUBLIC_S3_SIGNER');

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function s3Credentials() {
  return {
    accessKeyId: requiredEnv('S3_ACCESS_KEY_ID'),
    secretAccessKey: requiredEnv('S3_SECRET_ACCESS_KEY'),
    bucket: requiredEnv('S3_BUCKET'),
    region: process.env.S3_REGION ?? 'us-east-1',
  };
}

export const internalS3Provider: Provider = {
  provide: INTERNAL_S3,
  useFactory: () =>
    new S3Client({
      ...s3Credentials(),
      endpoint: requiredEnv('S3_INTERNAL_ENDPOINT'),
    }),
};

export const publicS3SignerProvider: Provider = {
  provide: PUBLIC_S3_SIGNER,
  useFactory: () =>
    new S3Client({
      ...s3Credentials(),
      endpoint: requiredEnv('S3_PUBLIC_ENDPOINT'),
    }),
};
