import { api } from "../client";
import type { CreateItemPayload, CreateItemVariantPayload, Item } from "./types";

export const itemsClientApi = {
  create: (payload: CreateItemPayload) => api.post<Item>("/item/create", payload),

  createVariant: (payload: CreateItemVariantPayload) =>
    api.post<unknown>("/item/createItemVariant", payload),
};
