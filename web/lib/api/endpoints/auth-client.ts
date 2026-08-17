import { api } from "../client";

export const authClientApi = {
  /** Browser sends the session cookie automatically (axios withCredentials). */
  logout: () => api.post<{ ok: true }>("/auth/logout"),
};
