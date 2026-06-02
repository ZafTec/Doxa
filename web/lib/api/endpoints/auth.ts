import { api } from "../client";
import type { AuthUser } from "@/lib/store/auth.store";

export type LoginPayload = { email: string; password: string };
export type SignupPayload = { name: string; email: string; password: string };
export type AuthResponse = { user: AuthUser; token: string };

export const authApi = {
  login: (payload: LoginPayload) => api.post<AuthResponse>("/auth/login", payload),
  signup: (payload: SignupPayload) => api.post<AuthResponse>("/auth/signup", payload),
  logout: () => api.post<void>("/auth/logout"),
  me: () => api.get<AuthUser>("/auth/me"),
};
