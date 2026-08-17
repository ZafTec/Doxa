import { api } from "../client";
import type { AdminUser, CreateAdminUserPayload, UpdateAdminUserRolePayload } from "./types";

export const adminUsersClientApi = {
  create: (payload: CreateAdminUserPayload) =>
    api.post<AdminUser>("/admin-user/create", payload),

  updateRole: (id: string, payload: UpdateAdminUserRolePayload) =>
    api.patch<AdminUser>(`/admin-user/${id}`, payload),

  remove: (id: string) => api.delete<void>(`/admin-user/${id}`),
};
