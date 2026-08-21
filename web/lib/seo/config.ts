/**
 * Single source of truth for site-wide SEO facts. Everything metadata-related
 * (root layout, per-page generateMetadata, sitemap, robots, the OG image)
 * reads from here so there is exactly one place to update the site name,
 * base URL, or default copy - see AGENTS.md "Design language" for why we
 * don't want a second copy of this drifting into individual pages.
 */

function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  return raw.replace(/\/$/, "");
}

export const siteConfig = {
  name: "Doxa",
  url: siteUrl(),
  /** Used as the <title> template suffix and OG site_name. */
  titleTemplate: "%s | Doxa",
  defaultTitle: "Doxa - Watches",
  /** Short form for tight spaces (the OG card, social bios). */
  tagline: "Honest pricing, clear specs. No upsell games.",
  /**
   * Grounded in PRODUCT.md's confirmed positioning (price/value transparency,
   * curated catalog, Ethiopia launch market) - nothing invented here.
   */
  description:
    "Doxa is a straightforward watch storefront: honest pricing, clear specs, no upsell games. Browse a curated watch catalog, shipping from Addis Ababa.",
  baseKeywords: [
    "Doxa",
    "watches",
    "watch store",
    "buy watches online",
    "watches Ethiopia",
    "watches Addis Ababa",
  ],
  ogImagePath: "/opengraph-image",
} as const;

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
