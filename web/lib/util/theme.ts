import type { Theme } from "@/lib/store";

/** What a theme preference actually looks like right now - "system" isn't a visible state, it's a pointer to one of these two. */
export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
