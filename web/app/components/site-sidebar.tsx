"use client";

import { useUiStore } from "@/lib/store";

const links = [
  { label: "Watches", href: "#" },
  { label: "New Arrivals", href: "#" },
  { label: "Collections", href: "#" },
  { label: "About", href: "#" },
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
          "fixed inset-0 z-30 bg-black/40 transition-opacity " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      <aside
        className={
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-background p-5 transition-transform " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-mono text-xs tracking-wide uppercase text-muted-foreground">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-md px-2 py-1 text-sm hover:bg-muted"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-md px-2 py-2 text-sm hover:bg-muted"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
