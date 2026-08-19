/**
 * Backend-shaped domain types. Mirrors `nest-backend/prisma/schema.prisma`
 * and the response shapes returned by Nest controllers.
 *
 * IMPORTANT - Item vs ItemVariant:
 *   Item is the wrapper (brand, top-level description, category). Variants
 *   carry the user-pickable axes: color, price, stock, plus their own
 *   marketing name + description, plus assets (image URLs).
 *
 *   List and PDP reads use explicit endpoint contracts. Variant-specific
 *   fields and assets stay on their owning variant.
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
  /** Asset shape included by the item list endpoint. */
  assets: Array<{ url: string }>;
};

export type ItemDetailsVariant = {
  id: string;
  color: string;
  stockQuantity: number;
  /** Minor units (e.g. cents). Never floats. */
  price: number;
  name: string;
  description: string;
  assets: string[];
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
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

/** Response shape returned by `GET /item`. */
export type ItemListItem = Item & {
  category: Category;
  itemVariants: ItemVariant[];
};

/** Response shape returned by `GET /item/:id`. */
export type ItemDetails = {
  id: string;
  brand: string;
  description: string;
  category: Category;
  variants: ItemDetailsVariant[];
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

export type AdminRole = "SUPER_ADMIN" | "EDITOR";

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
  lastLoginAt: ISODateString | null;
  /** Seeded bootstrap admin - can never be role-changed or removed. */
  isProtected: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CurrentAdmin = {
  id: string;
  email: string;
  name: string | null;
  role: AdminRole;
};

export type CreateAdminUserPayload = {
  email: string;
  name?: string;
  role: AdminRole;
};

export type UpdateAdminUserRolePayload = {
  role: AdminRole;
};
