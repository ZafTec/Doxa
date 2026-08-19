"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useUiStore } from "@/lib/store";
import { IconButton } from "./ui/icon-button";
import { Eyebrow } from "./ui/eyebrow";

const sections = [
  {
    label: "Shop",
    links: [
      { label: "All Watches", href: "/" },
      { label: "Dive", href: "/?category=Dive" },
      { label: "Dress", href: "/?category=Dress" },
      { label: "Field", href: "/?category=Field" },
      { label: "Chronograph", href: "/?category=Chronograph" },
    ],
  },
  {
    label: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Journal", href: "/stories" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function SiteSidebar() {
  const open = useUiStore((s) => s.sidebarOpen);
  const setOpen = useUiStore((s) => s.setSidebarOpen);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={
          "fixed inset-0 z-40 bg-black/40 transition-opacity " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      <aside
        className={
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-background p-6 transition-transform duration-240 ease-out " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xl font-bold tracking-[0.2em]">DOXA</span>
          <IconButton size="sm" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="size-5" />
          </IconButton>
        </div>

        <nav className="space-y-8">
          {sections.map((section) => (
            <div key={section.label}>
              <Eyebrow as="h4" className="mb-4">
                {section.label}
              </Eyebrow>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
