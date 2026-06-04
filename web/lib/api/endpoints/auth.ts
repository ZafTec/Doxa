import { api } from "../client";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type LoginPayload = { email: string; password: string };
export type SignupPayload = { name: string; email: string; password: string };

export const authApi = {
  login: (payload: LoginPayload) => api.post<AuthUser>("/auth/login", payload),
  signup: (payload: SignupPayload) => api.post<AuthUser>("/auth/signup", payload),
  logout: () => api.post<void>("/auth/logout"),
  me: () => api.get<AuthUser>("/auth/me"),
};
