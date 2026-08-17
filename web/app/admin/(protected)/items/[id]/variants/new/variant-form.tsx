"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useZodForm } from "@/lib/validation/use-zod-form";
import { createItemVariantSchema } from "@/lib/validation/admin-schemas";
import { itemsClientApi } from "@/lib/api/endpoints/items-client";
import { ApiError } from "@/lib/api/errors";
import { FormField, inputClassName, SubmitButton } from "@/app/admin/components/form-field";

export function VariantForm({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm(createItemVariantSchema);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await itemsClientApi.createVariant({ ...values, itemId });
      router.push("/admin/items");
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

      <FormField label="Color" error={errors.color?.message}>
        <input {...register("color")} className={inputClassName} placeholder="Black" />
      </FormField>

      <FormField label="Price (minor units, e.g. cents)" error={errors.price?.message}>
        <input
          {...register("price")}
          type="number"
          min={0}
          step={1}
          className={inputClassName}
          placeholder="395000"
        />
      </FormField>

      <FormField label="Stock quantity" error={errors.stockQuantity?.message}>
        <input
          {...register("stockQuantity")}
          type="number"
          min={0}
          step={1}
          className={inputClassName}
          placeholder="6"
        />
      </FormField>

      <SubmitButton pending={isSubmitting}>Create variant</SubmitButton>
    </form>
  );
}
