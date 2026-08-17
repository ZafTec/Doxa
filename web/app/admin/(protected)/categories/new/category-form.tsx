"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useZodForm } from "@/lib/validation/use-zod-form";
import { createCategorySchema } from "@/lib/validation/admin-schemas";
import { categoriesClientApi } from "@/lib/api/endpoints/categories-client";
import { ApiError } from "@/lib/api/errors";
import { FormField, inputClassName, SubmitButton } from "@/app/admin/components/form-field";

export function CategoryForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(createCategorySchema);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await categoriesClientApi.create(values);
      router.push("/admin/categories");
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

      <FormField label="Name" error={errors.name?.message}>
        <input {...register("name")} className={inputClassName} placeholder="Dive" />
      </FormField>

      <SubmitButton pending={isSubmitting}>Create category</SubmitButton>
    </form>
  );
}
