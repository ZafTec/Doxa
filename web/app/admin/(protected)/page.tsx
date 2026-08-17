import Link from "next/link";
import { cookies } from "next/headers";
import { authApi } from "@/lib/api/endpoints/auth";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const admin = await authApi.me(cookieStore.toString());

  const cards = [
    { label: "Items", href: "/admin/items", description: "Manage watches and colorways." },
    { label: "Categories", href: "/admin/categories", description: "Manage catalog categories." },
    ...(admin.role === "SUPER_ADMIN"
      ? [
          {
            label: "Admin Users",
            href: "/admin/users",
            description: "Manage who can sign in as an admin.",
          },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">
        Welcome, {admin.name ?? admin.email}
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Signed in as {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Editor"}.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-border p-6 transition-colors hover:bg-muted"
          >
            <h2 className="mb-1 text-sm font-medium uppercase tracking-[0.08em]">
              {card.label}
            </h2>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
