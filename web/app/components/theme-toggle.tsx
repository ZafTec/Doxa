"use client";

import { Contrast } from "lucide-react";
import { useUiStore } from "@/lib/store";
import { resolveTheme } from "@/lib/util/theme";
import { IconButton } from "./ui/icon-button";

/**
 * Always flips the theme that's actually on screen, not the stored
 * preference. "system" isn't a step in this cycle - it's just the
 * starting default, and it can visually equal "dark" (whenever the OS
 * prefers dark), in which case a light<->dark<->system cycle has a click
 * that changes the stored value but not anything the user can see, which
 * reads as "the button needs two clicks." A settings page can expose the
 * full light/dark/system choice later; this icon only needs the toggle.
 */
export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  function handleClick() {
    // Read the live store value, not this render's closed-over `theme` -
    // Zustand's persist rehydrates from localStorage asynchronously, so a
    // click landing before that finishes would otherwise flip from the
    // default ("system") instead of the real current theme.
    const current = resolveTheme(useUiStore.getState().theme);
    setTheme(current === "dark" ? "light" : "dark");
  }

  const isDark = resolveTheme(theme) === "dark";

  return (
    <IconButton
      onClick={handleClick}
      aria-label={`Theme: ${isDark ? "dark" : "light"} (click for ${isDark ? "light" : "dark"})`}
      // theme is also unknown to the server for the same reason as above -
      // the label briefly reflects the default until localStorage
      // rehydrates. Cosmetic (screen readers only), so suppress rather
      // than gate the whole button behind a mount check.
      suppressHydrationWarning
    >
      <Contrast className="size-5" />
    </IconButton>
  );
}
