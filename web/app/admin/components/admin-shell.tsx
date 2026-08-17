import type { CurrentAdmin } from "@/lib/api";
import { AdminNav } from "./admin-nav";
import { LogoutButton } from "./logout-button";

export function AdminShell({
  admin,
  children,
}: {
  admin: CurrentAdmin;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-16 items-center justify-between border-b border-border px-6">
        <span className="text-sm font-bold tracking-[0.2em]">DOXA ADMIN</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            {admin.name ?? admin.email}
            <span className="ml-2 text-muted-foreground/70">
              {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Editor"}
            </span>
          </span>
          <LogoutButton />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-56 shrink-0 border-r border-border py-6">
          <AdminNav role={admin.role} />
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
