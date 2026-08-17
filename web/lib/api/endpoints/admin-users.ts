import "server-only";
import { serverApi } from "../server";
import type { AdminUser } from "./types";

export const adminUsersApi = {
  /** SUPER_ADMIN only - forwards the incoming request's session cookie. */
  list: (cookie: string) => serverApi.get<AdminUser[]>("/admin-user", { cookie }),
};
