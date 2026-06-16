export { api, apiClient } from "./client";
export { serverApi, serverFetch } from "./server";
export { ApiError } from "./errors";
export type { ApiErrorPayload, ApiResponse } from "./types";

export { itemsApi, itemTags } from "./endpoints/items";
export { categoriesApi, categoryTags } from "./endpoints/categories";
export { assetsApi, assetTags } from "./endpoints/assets";
export type {
  Asset,
  Category,
  CreateAssetPayload,
  CreateCategoryPayload,
  CreateItemPayload,
  CreateItemVariantPayload,
  ISODateString,
  Item,
  ItemDetails,
  ItemListQuery,
  ItemVariant,
  ItemVariantSummary,
  Paginated,
} from "./endpoints/types";
