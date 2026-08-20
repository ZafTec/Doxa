import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.zaftech.co", pathname: "/doxa-assets/**" },
      // Local MinIO, for dev against `docker run minio/minio` (see
      // docs/s3-assets-implementation-guide.md). Declared for completeness,
      // but Next's image optimizer independently refuses any upstream host
      // that resolves to a private IP - "localhost" always does - so this
      // pattern alone can't make it optimizable. The asset manager passes
      // `unoptimized` for non-storage.zaftech.co hosts for that reason.
      { protocol: "http", hostname: "localhost", port: "9000", pathname: "/doxa-assets/**" },
      // Legacy seed data predating the S3 migration. TODO: drop once all
      // Asset rows have been backfilled with real MinIO keys.
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "contribution.usercontent.google.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
