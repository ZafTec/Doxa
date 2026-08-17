import { api } from "../client";
import type { Category, CreateCategoryPayload } from "./types";

export const categoriesClientApi = {
  create: (payload: CreateCategoryPayload) =>
    api.post<Category>("/category/create", payload),
};
