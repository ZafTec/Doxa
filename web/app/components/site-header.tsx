"use client";

import { useUiStore, type UiState } from "@/lib/store";

const themes: UiState["theme"][] = ["light", "dark", "system"];

export function SiteHeader() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="rounded-md border border-border px-2 py-1 text-sm hover:bg-muted"
        >
          ☰
        </button>
        <span className="font-mono text-sm tracking-wide uppercase">Doxa</span>
      </div>

      <div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-xs">
        {themes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            className={
              "rounded-sm px-2 py-1 capitalize transition " +
              (theme === t
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted")
            }
          >
            {t}
          </button>
        ))}
      </div>
    </header>
  );
}
