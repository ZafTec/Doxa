import "server-only";
import { serverApi } from "../server";
import type { CreateAssetPayload } from "./types";

export const assetTags = {
  byVariant: (variantId: string) => `asset:variant:${variantId}`,
} as const;

export const assetsApi = {
  byVariant: (variantId: string, opts?: { revalidate?: number | false }) =>
    serverApi.get<string[]>(`/asset/${variantId}`, {
      revalidate: opts?.revalidate ?? 60,
      tags: [assetTags.byVariant(variantId)],
    }),

  create: (payload: CreateAssetPayload) =>
    serverApi.post<{ message: string }>("/asset/create", payload),
};
