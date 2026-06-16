"use client";

import { Contrast } from "lucide-react";
import { useUiStore, type UiState } from "@/lib/store";

const order: UiState["theme"][] = ["light", "dark", "system"];

/**
 * Single icon button that cycles light → dark → system. Compact for the
 * header; a fuller segmented control can live on a settings page later.
 */
export function ThemeToggle() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  const next = order[(order.indexOf(theme) + 1) % order.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${theme} (click for ${next})`}
      className="rounded p-2 text-foreground transition-colors hover:bg-muted"
    >
      <Contrast className="size-5" />
    </button>
  );
}
