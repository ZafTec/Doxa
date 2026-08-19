import type { ItemListItem, ItemVariant } from "@/lib/api";

/**
 * Catalog-card display title. Prefer the first price-ordered variant name,
 * then fall back to the parent item's description.
 */
export function itemTitle(
  item: Pick<ItemListItem, "description" | "brand" | "itemVariants">,
): string {
  const first = item.itemVariants[0];
  if (first?.name) return first.name;
  return item.description;
}

export function defaultVariant(
  item: Pick<ItemListItem, "itemVariants">,
): ItemVariant | undefined {
  const variants = item.itemVariants;
  return variants.find((v) => v.stockQuantity > 0) ?? variants[0];
}

export function minPrice(item: Pick<ItemListItem, "itemVariants">): number | undefined {
  const variants = item.itemVariants;
  if (variants.length === 0) return undefined;
  return Math.min(...variants.map((v) => v.price));
}
