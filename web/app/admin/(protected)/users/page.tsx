import Link from "next/link";
import { cookies } from "next/headers";
import { adminUsersApi } from "@/lib/api/endpoints/admin-users";
import { authApi } from "@/lib/api/endpoints/auth";
import { ApiError } from "@/lib/api";
import { AdminUserRowActions } from "./admin-user-row-actions";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let admins;
  let currentAdmin;
  try {
    [admins, currentAdmin] = await Promise.all([
      adminUsersApi.list(cookieHeader),
      authApi.me(cookieHeader),
    ]);
  } catch (err) {
    const status = ApiError.fromUnknown(err).status;
    if (status === 403) {
      return (
        <p className="text-sm text-muted-foreground">
          Only Super Admins can manage the admin allowlist.
        </p>
      );
    }
    throw err;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Admin users</h1>
        <Link
          href="/admin/users/new"
          className="bg-accent px-4 py-2 text-xs font-medium uppercase tracking-[0.08em] text-accent-foreground transition-opacity hover:opacity-90"
        >
          Add admin
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            <th className="py-3 pr-4">Email</th>
            <th className="py-3 pr-4">Name</th>
            <th className="py-3 pr-4">Role</th>
            <th className="py-3 pr-4">Last login</th>
            <th className="py-3 pr-4" />
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b border-border">
              <td className="py-3 pr-4 font-medium">{admin.email}</td>
              <td className="py-3 pr-4 text-muted-foreground">{admin.name ?? "—"}</td>
              <td className="py-3 pr-4 text-muted-foreground">
                {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Editor"}
              </td>
              <td className="py-3 pr-4 text-muted-foreground">
                {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : "Never"}
              </td>
              <td className="py-3 pr-4 text-right">
                <AdminUserRowActions admin={admin} isSelf={admin.id === currentAdmin.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
