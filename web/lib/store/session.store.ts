import { create } from "zustand";
import type { AuthUser } from "@/lib/api/endpoints/auth";

export type SessionState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, hydrated: true }),
  clear: () => set({ user: null, isAuthenticated: false, hydrated: true }),
}));
