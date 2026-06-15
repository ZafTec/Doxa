import "server-only";
import { serverApi } from "../server";
import type {
  CreateItemPayload,
  Item,
  ItemListQuery,
  Paginated,
} from "./types";

/**
 * Cache tags for `revalidateTag` from webhooks / admin actions.
 * Re-export so route handlers can invalidate without knowing the strings.
 */
export const itemTags = {
  all: "items",
  byId: (id: string) => `item:${id}`,
} as const;

function toQueryString(q: ItemListQuery = {}): string {
  const params = new URLSearchParams();
  if (q.category?.length) params.set("category", q.category.join(","));
  if (q.brand?.length) params.set("brand", q.brand.join(","));
  if (q.pageNumber !== undefined) params.set("pageNumber", String(q.pageNumber));
  if (q.pageSize !== undefined) params.set("pageSize", String(q.pageSize));
  const s = params.toString();
  return s ? `?${s}` : "";
}

export const itemsApi = {
  list: (query: ItemListQuery = {}, opts?: { revalidate?: number | false }) =>
    serverApi.get<Paginated<Item>>(`/item${toQueryString(query)}`, {
      revalidate: opts?.revalidate ?? 60,
      tags: [itemTags.all],
    }),

  byId: (id: string, opts?: { revalidate?: number | false }) =>
    serverApi.get<Item>(`/item/${id}`, {
      revalidate: opts?.revalidate ?? 60,
      tags: [itemTags.all, itemTags.byId(id)],
    }),

  create: (payload: CreateItemPayload) =>
    serverApi.post<Item>("/item/create", payload),
};
