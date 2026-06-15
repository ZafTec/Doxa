/**
 * Backend-shaped domain types. Mirrors `nest-backend/prisma/schema.prisma`
 * and the response shape returned by Nest controllers.
 *
 * IMPORTANT — Item vs ItemVariant:
 *   Item is the wrapper (brand, description, category). The variant carries
 *   the things a shopper actually picks: color, price, stock.
 *   The current Prisma schema models this 1:1 (`itemVariant ItemVariant?`),
 *   but we model it as 1:N here because that's what a real watch catalog
 *   needs (same model, multiple colorways). The backend will flip the schema
 *   to `itemVariants ItemVariant[]` to match.
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

export type CreateCategoryPayload = {
  name: string;
};
