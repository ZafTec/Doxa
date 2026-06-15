import "server-only";
import { serverApi } from "../server";
import type { Category, CreateCategoryPayload } from "./types";

export const categoryTags = {
  all: "categories",
} as const;

export const categoriesApi = {
  list: (opts?: { revalidate?: number | false }) =>
    serverApi.get<Category[]>("/category", {
      revalidate: opts?.revalidate ?? 300,
      tags: [categoryTags.all],
    }),

  create: (payload: CreateCategoryPayload) =>
    serverApi.post<Category>("/category/create", payload),
};
