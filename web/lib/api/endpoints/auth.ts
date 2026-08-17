import "server-only";
import { serverApi } from "../server";
import type { CurrentAdmin } from "./types";

export const authApi = {
  /** Forwards the incoming request's session cookie - server components only. */
  me: (cookie: string) => serverApi.get<CurrentAdmin>("/auth/me", { cookie }),
};
