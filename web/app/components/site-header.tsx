"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useUiStore } from "@/lib/store";
import { ThemeToggle } from "./theme-toggle";
import { CartButton } from "./cart-button";

const navLinks = [
  { label: "Watches", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "Stories", href: "/stories" },
];

export function SiteHeader() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Open menu"
            className="rounded p-2 text-foreground transition-colors hover:bg-muted"
          >
            <Menu className="size-5" />
          </button>
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] text-foreground"
          >
            DOXA
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="border-b border-transparent py-5 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
