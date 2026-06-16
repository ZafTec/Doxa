import type { Item, ItemVariant } from "@/lib/api";

/**
 * Catalog-card display title. The backend list endpoint returns `Item` rows
 * without variant data, so we fall back to `brand` + first line of
 * `description` until variants are joined. Once `GET /item` includes
 * variants, prefer `itemVariants[0].name` to match the PDP title.
 */
export function itemTitle(item: Pick<Item, "description" | "brand" | "itemVariants">): string {
  const first = item.itemVariants?.[0];
  if (first?.name) return first.name;
  return item.description;
}

export function defaultVariant(item: Pick<Item, "itemVariants">): ItemVariant | undefined {
  const variants = item.itemVariants ?? [];
  return variants.find((v) => v.stockQuantity > 0) ?? variants[0];
}

export function minPrice(item: Pick<Item, "itemVariants">): number | undefined {
  const variants = item.itemVariants ?? [];
  if (variants.length === 0) return undefined;
  return Math.min(...variants.map((v) => v.price));
}
