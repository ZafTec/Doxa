"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { useUiStore } from "@/lib/store";
import { IconButton } from "./ui/icon-button";
import { Eyebrow } from "./ui/eyebrow";

// Matches the cart drawer's spring - the two slide-out panels should feel identical.
const drawerSpring = { type: "spring", duration: 0.35, bounce: 0.15 } as const;

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
      <motion.div
        onClick={() => setOpen(false)}
        aria-hidden
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{ pointerEvents: open ? "auto" : "none" }}
        className="fixed inset-0 z-40 bg-black/40"
      />
      <motion.aside
        initial={false}
        animate={{ transform: open ? "translateX(0%)" : "translateX(-100%)" }}
        transition={drawerSpring}
        className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background p-6"
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
      </motion.aside>
    </>
  );
}
