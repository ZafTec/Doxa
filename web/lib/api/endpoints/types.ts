/**
 * Backend-shaped domain types. Mirrors `nest-backend/prisma/schema.prisma`
 * and the response shapes returned by Nest controllers.
 *
 * IMPORTANT — Item vs ItemVariant:
 *   Item is the wrapper (brand, top-level description, category). Variants
 *   carry the user-pickable axes: color, price, stock, plus their own
 *   marketing name + description, plus assets (image URLs).
 *
 *   PDP reads use `ItemDetails` (a flat shape the backend assembles from the
 *   first variant); the list endpoint still returns plain Item rows.
 */

export type ISODateString = string;

export type Category = {
  id: string;
  name: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type ItemVariant = {
  id: string;
  itemId: string;
  color: string;
  stockQuantity: number;
  /** Minor units (e.g. cents). Never floats. */
  price: number;
  name: string;
  description: string;
  /**
   * Included by the list endpoint as a slim shape (just `url`); the full
   * `Asset` row isn't always in this payload.
   */
  assets?: Array<{ url: string }>;
};

/**
 * Trimmed variant shape returned by `GET /item/:id/variant` and embedded
 * inside `ItemDetails.variants`. Only what's needed for the variant picker.
 */
export type ItemVariantSummary = {
  id: string;
  color: string;
  price: number;
};

export type Asset = {
  id: string;
  url: string;
  itemVariantId: string;
};

export type Item = {
  id: string;
  brand: string;
  description: string;
  categoryId: string;
  category?: Category;
  itemVariants?: ItemVariant[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

/**
 * Response shape returned by `GET /item/:id` — assembled by the backend
 * from the item's first variant. Fields are flattened for direct UI use:
 *   `name` / `description` / `price` come from the first variant.
 *   `assets` is the image URL list for the first variant.
 *   `variants` is the slim picker list (all variants).
 */
export type ItemDetails = {
  name: string;
  description: string;
  price: number;
  assets: string[];
  variants: { itemVariants: ItemVariantSummary[] } | null;
};

/**
 * Pagination envelope returned by Nest controllers.
 * `pageNumber` is 0-indexed on the backend.
 */
export type Paginated<T> = {
  data: T[];
  metadata: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  };
};

export type ItemListQuery = {
  /** Comma-separated category names; backend treats as `IN` array. */
  category?: string[];
  /** Comma-separated brand names; backend treats as `IN` array. */
  brand?: string[];
  /** 0-indexed page number; backend default 0. */
  pageNumber?: number;
  /** Backend default 10. */
  pageSize?: number;
};

export type CreateItemPayload = {
  brand: string;
  categoryId: string;
  description: string;
};

export type CreateItemVariantPayload = {
  itemId: string;
  color: string;
  price: number;
  stockQuantity: number;
};

export type CreateAssetPayload = {
  itemVariantId: string;
  urls: string[];
};

export type CreateCategoryPayload = {
  name: string;
};
