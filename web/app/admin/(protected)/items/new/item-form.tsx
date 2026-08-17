"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useZodForm } from "@/lib/validation/use-zod-form";
import { createItemSchema } from "@/lib/validation/admin-schemas";
import { itemsClientApi } from "@/lib/api/endpoints/items-client";
import { ApiError } from "@/lib/api/errors";
import type { Category } from "@/lib/api/endpoints/types";
import { FormField, inputClassName, SubmitButton } from "@/app/admin/components/form-field";

export function ItemForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(createItemSchema);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const item = await itemsClientApi.create(values);
      router.push(`/admin/items/${item.id}/variants/new`);
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

      <FormField label="Brand" error={errors.brand?.message}>
        <input {...register("brand")} className={inputClassName} placeholder="Tudor" />
      </FormField>

      <FormField label="Category" error={errors.categoryId?.message}>
        <select {...register("categoryId")} className={inputClassName} defaultValue="">
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <textarea
          {...register("description")}
          className={`${inputClassName} min-h-24`}
          placeholder="Heritage diver inspired by 1950s archive references."
        />
      </FormField>

      <SubmitButton pending={isSubmitting}>Create item</SubmitButton>
    </form>
  );
}
