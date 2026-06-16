import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      // Stitch / Gemini-generated placeholder images. TODO: drop both
      // entries once the backend's Asset rows point to Cloudinary URLs.
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "contribution.usercontent.google.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
