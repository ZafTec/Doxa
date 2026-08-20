import "server-only";
import { serverApi } from "../server";
import type { Asset } from "./types";

export const assetsAdminApi = {
  /** Admin-only - forwards the incoming request's session cookie. */
  byVariant: (itemVariantId: string, cookie: string) =>
    serverApi.get<Asset[]>(`/asset/by-variant/${itemVariantId}`, {
      cookie,
      revalidate: 0,
    }),
};
