import type { MetadataRoute } from "next";
import { itemsApi } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo/config";

// Regenerate hourly - frequent enough to pick up new/removed catalog items
// without hammering the backend on every crawl.
export const revalidate = 3600;

type StaticRoute = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

// Every real, resolvable (storefront) route - see web/AGENTS.md project
// layout. Keep this in sync with app/(storefront)/**/page.tsx; a sitemap
// entry for a route that 404s does more harm than not listing it at all.
const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/collections", changeFrequency: "weekly", priority: 0.6 },
  { path: "/stories", changeFrequency: "weekly", priority: 0.5 },
  { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  { path: "/retailers", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
  { path: "/newsletter", changeFrequency: "yearly", priority: 0.3 },
  { path: "/help/service", changeFrequency: "monthly", priority: 0.3 },
  { path: "/help/shipping", changeFrequency: "monthly", priority: 0.3 },
  { path: "/help/faq", changeFrequency: "monthly", priority: 0.3 },
  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.1 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.1 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const items = await fetchAllItems();
  const itemEntries: MetadataRoute.Sitemap = items.map((item) => ({
    url: absoluteUrl(`/watches/${item.id}`),
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...itemEntries];
}

async function fetchAllItems() {
  const pageSize = 100;
  const all: Awaited<ReturnType<typeof itemsApi.list>>["data"] = [];

  for (let pageNumber = 0; ; pageNumber++) {
    const page = await itemsApi.list({ pageNumber, pageSize }).catch(() => null);
    if (!page || page.data.length === 0) break;
    all.push(...page.data);
    if (page.data.length < pageSize) break;
  }

  return all;
}
