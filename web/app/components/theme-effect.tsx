"use client";

import { useEffect } from "react";
import { useUiStore } from "@/lib/store";
import { resolveTheme } from "@/lib/util/theme";

export function ThemeEffect() {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => root.classList.toggle("dark", resolveTheme(theme) === "dark");
    apply();

    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [theme]);

  return null;
}
