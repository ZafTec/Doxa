"use client";

import { useEffect } from "react";
import { useUiStore } from "@/lib/store";

function resolveTheme(theme: "light" | "dark" | "system"): "light" | "dark" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

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
