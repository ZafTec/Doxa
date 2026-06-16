import type { Item, ItemVariant } from "@/lib/api";

/**
 * The backend's `Item` lacks a `name` field; we present `brand` as the
 * eyebrow and `description` as the title. Until the backend grows a
 * dedicated name column, this helper centralizes how a product is labeled.
 */
export function itemTitle(item: Pick<Item, "description">): string {
  return item.description;
}

/**
 * Choose the variant to display by default — first one with stock, falling
 * back to the first variant overall. Returns `undefined` if the item has
 * no variants (backend hasn't seeded variants or queries don't include them
 * yet — see `nest-backend/src/item/item.service.ts`).
 */
export function defaultVariant(item: Pick<Item, "itemVariants">): ItemVariant | undefined {
  const variants = item.itemVariants ?? [];
  return variants.find((v) => v.stockQuantity > 0) ?? variants[0];
}

/**
 * Lowest variant price in minor units. Useful for catalog cards where we
 * show a "from" price. Returns `undefined` if no variants are loaded.
 */
export function minPrice(item: Pick<Item, "itemVariants">): number | undefined {
  const variants = item.itemVariants ?? [];
  if (variants.length === 0) return undefined;
  return Math.min(...variants.map((v) => v.price));
}
