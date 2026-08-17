import { AdminUserForm } from "./admin-user-form";

export default function NewAdminUserPage() {
  return (
    <div className="max-w-lg">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Add admin</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        They&apos;ll be able to sign in with this email via Google. No password
        needed.
      </p>
      <AdminUserForm />
    </div>
  );
}
