"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useZodForm } from "@/lib/validation/use-zod-form";
import { createAdminUserSchema } from "@/lib/validation/admin-schemas";
import { adminUsersClientApi } from "@/lib/api/endpoints/admin-users-client";
import { ApiError } from "@/lib/api/errors";
import { FormField, inputClassName, SubmitButton } from "@/app/admin/components/form-field";

export function AdminUserForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(createAdminUserSchema, { defaultValues: { role: "EDITOR" } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await adminUsersClientApi.create(values);
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      setFormError(ApiError.fromUnknown(err).message);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {formError && (
        <p className="border border-border bg-muted px-4 py-3 text-sm">{formError}</p>
      )}

      <FormField label="Email" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          className={inputClassName}
          placeholder="teammate@doxa.com"
        />
      </FormField>

      <FormField label="Name (optional)" error={errors.name?.message}>
        <input {...register("name")} className={inputClassName} placeholder="Jordan Lee" />
      </FormField>

      <FormField label="Role" error={errors.role?.message}>
        <select {...register("role")} className={inputClassName}>
          <option value="EDITOR">Editor</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
      </FormField>

      <SubmitButton pending={isSubmitting}>Add admin</SubmitButton>
    </form>
  );
}
