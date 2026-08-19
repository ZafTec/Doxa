"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClientApi } from "@/lib/api/endpoints/auth-client";
import { eyebrowBaseClassName } from "@/app/components/ui/eyebrow";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await authClientApi.logout();
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={
        "flex items-center gap-2 " +
        eyebrowBaseClassName +
        " text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
      }
    >
      <LogOut className="size-3.5" />
      Log out
    </button>
  );
}
