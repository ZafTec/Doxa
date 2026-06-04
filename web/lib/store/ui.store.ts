import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

export type UiState = {
  theme: Theme;
  sidebarOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: "doxa.ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
