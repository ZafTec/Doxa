"use client";

import { useForm, type UseFormProps, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

export function useZodForm<TOut extends FieldValues, TIn extends FieldValues>(
  schema: ZodType<TOut, TIn>,
  options?: Omit<UseFormProps<TIn, unknown, TOut>, "resolver">,
) {
  return useForm<TIn, unknown, TOut>({
    ...options,
    resolver: zodResolver(schema),
    mode: options?.mode ?? "onTouched",
  });
}
