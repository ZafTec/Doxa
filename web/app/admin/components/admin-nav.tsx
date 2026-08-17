"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@/lib/api";

const links: Array<{ label: string; href: string; requires?: AdminRole }> = [
  { label: "Dashboard", href: "/admin" },
  { label: "Items", href: "/admin/items" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Admin Users", href: "/admin/users", requires: "SUPER_ADMIN" },
];

export function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links
        .filter((link) => !link.requires || link.requires === role)
        .map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                "block border-l-2 px-4 py-2 text-sm transition-colors " +
                (active
                  ? "border-accent text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground")
              }
            >
              {link.label}
            </Link>
          );
        })}
    </nav>
  );
}
