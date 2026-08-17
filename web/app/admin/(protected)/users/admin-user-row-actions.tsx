"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminUsersClientApi } from "@/lib/api/endpoints/admin-users-client";
import { ApiError } from "@/lib/api/errors";
import type { AdminRole, AdminUser } from "@/lib/api/endpoints/types";

export function AdminUserRowActions({
  admin,
  isSelf,
}: {
  admin: AdminUser;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRoleChange(role: AdminRole) {
    setPending(true);
    setError(null);
    try {
      await adminUsersClientApi.updateRole(admin.id, { role });
      router.refresh();
    } catch (err) {
      setError(ApiError.fromUnknown(err).message);
    } finally {
      setPending(false);
    }
  }

  async function handleRemove() {
    setPending(true);
    setError(null);
    try {
      await adminUsersClientApi.remove(admin.id);
      router.refresh();
    } catch (err) {
      setError(ApiError.fromUnknown(err).message);
      setPending(false);
    }
  }

  if (isSelf) {
    return <span className="text-xs text-muted-foreground">You</span>;
  }

  if (admin.isProtected) {
    return <span className="text-xs text-muted-foreground">Protected</span>;
  }

  return (
    <div className="flex items-center justify-end gap-3">
      {error && (
        <span className="text-xs text-foreground underline decoration-2 underline-offset-2">
          {error}
        </span>
      )}
      <select
        value={admin.role}
        disabled={pending}
        onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
        className="border border-border bg-background px-2 py-1 text-xs disabled:opacity-40"
      >
        <option value="EDITOR">Editor</option>
        <option value="SUPER_ADMIN">Super Admin</option>
      </select>
      <button
        type="button"
        onClick={handleRemove}
        disabled={pending}
        className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      >
        Remove
      </button>
    </div>
  );
}
