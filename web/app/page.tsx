import { categoriesApi, itemsApi } from "@/lib/api";
import { HeroBand } from "./components/catalog/hero-band";
import { FilterBar, type ActiveFilter } from "./components/catalog/filter-bar";
import { FilterControls } from "./components/catalog/filter-controls";
import { CatalogGrid } from "./components/catalog/catalog-grid";
import { Pagination } from "./components/catalog/pagination";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const PAGE_SIZE = 9;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(asString(sp.page) ?? "1", 10) || 1);
  const brand = asCsv(sp.brand);
  const category = asCsv(sp.category);

  // Fetch catalog + categories in parallel; both feed UI controls.
  const [result, categoryRows, allBrandsResult] = await Promise.all([
    itemsApi
      .list({
        brand,
        category,
        pageNumber: currentPage - 1,
        pageSize: PAGE_SIZE,
      })
      .catch(() => null),
    categoriesApi.list().catch(() => []),
    itemsApi.list({ pageSize: 100 }).catch(() => null),
  ]);

  const items = result?.data ?? [];
  const totalCount = result?.metadata.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const brandOptions = uniqueBrands(allBrandsResult?.data ?? []).map((b) => ({
    value: b,
    label: b,
  }));
  const categoryOptions = (categoryRows ?? []).map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const filters: ActiveFilter[] = [];
  if (brand?.length) {
    filters.push({
      key: "brand",
      label: `Brand: ${brand.join(", ")}`,
      removeHref: hrefWithout(sp, "brand"),
    });
  }
  if (category?.length) {
    filters.push({
      key: "category",
      label: `Category: ${category.join(", ")}`,
      removeHref: hrefWithout(sp, "category"),
    });
  }

  const resultLabel = result
    ? `${items.length} of ${totalCount} results`
    : "Catalog unavailable";

  return (
    <>
      <HeroBand />
      <FilterControls brands={brandOptions} categories={categoryOptions} />
      <FilterBar filters={filters} resultLabel={resultLabel} />
      <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 lg:px-20">
        <CatalogGrid items={items} />
      </section>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hrefForPage={(p) => hrefWithPage(sp, p)}
      />
    </>
  );
}

function uniqueBrands(items: Array<{ brand: string }>): string[] {
  const set = new Set<string>();
  for (const i of items) set.add(i.brand);
  return [...set].sort();
}

function asString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function asCsv(v: string | string[] | undefined): string[] | undefined {
  const s = asString(v);
  if (!s) return undefined;
  const list = s.split(",").map((p) => p.trim()).filter(Boolean);
  return list.length ? list : undefined;
}

function searchParamsToRecord(
  sp: Awaited<SearchParams>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue;
    out[k] = Array.isArray(v) ? v.join(",") : v;
  }
  return out;
}

function hrefWithout(sp: Awaited<SearchParams>, key: string): string {
  const params = new URLSearchParams(searchParamsToRecord(sp));
  params.delete(key);
  params.delete("page");
  const q = params.toString();
  return q ? `/?${q}` : "/";
}

function hrefWithPage(sp: Awaited<SearchParams>, page: number): string {
  const params = new URLSearchParams(searchParamsToRecord(sp));
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const q = params.toString();
  return q ? `/?${q}` : "/";
}
