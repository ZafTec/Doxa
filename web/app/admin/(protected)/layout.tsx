import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authApi } from "@/lib/api/endpoints/auth";
import { AdminShell } from "@/app/admin/components/admin-shell";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  let admin;
  try {
    admin = await authApi.me(cookieHeader);
  } catch {
    redirect("/admin/login");
  }

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
