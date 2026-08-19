"use client";

import { Contrast } from "lucide-react";
import { useUiStore, type UiState } from "@/lib/store";
import { IconButton } from "./ui/icon-button";

const order: UiState["theme"][] = ["light", "dark", "system"];

/**
 * Single icon button that cycles light → dark → system. Compact for the
 * header; a fuller segmented control can live on a settings page later.
 */
export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  const next = order[(order.indexOf(theme) + 1) % order.length];

  function handleClick() {
    // Zustand's persist middleware rehydrates `theme` from localStorage
    // asynchronously, after the first paint. A click that lands in that
    // window would otherwise cycle from the stale default ("system")
    // instead of the real current theme, so this reads the live store
    // value at click time rather than the value this render closed over -
    // that's what made the toggle occasionally need a second click.
    const current = useUiStore.getState().theme;
    setTheme(order[(order.indexOf(current) + 1) % order.length]);
  }

  return (
    <IconButton onClick={handleClick} aria-label={`Theme: ${theme} (click for ${next})`}>
      <Contrast className="size-5" />
    </IconButton>
  );
}
