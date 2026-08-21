import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin panel is auth-gated already; keeping it out of search
      // indexes too is just SEO hygiene, not a security boundary.
      disallow: "/admin",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
