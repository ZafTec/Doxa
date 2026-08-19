import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

export const inputClassName =
  "w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-40";

/** Compact variant for inline controls (table-row selects, filter fields). */
export const inputClassNameCompact =
  "border border-border bg-background px-2 py-1 text-xs text-foreground outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-40";

export const Input = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input"> & { compact?: boolean }
>(function Input({ compact, className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={(compact ? inputClassNameCompact : inputClassName) + " " + className}
      {...props}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<"textarea"> & { compact?: boolean }
>(function Textarea({ compact, className = "", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={(compact ? inputClassNameCompact : inputClassName) + " " + className}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  ComponentPropsWithoutRef<"select"> & { compact?: boolean }
>(function Select({ compact, className = "", ...props }, ref) {
  return (
    <select
      ref={ref}
      className={(compact ? inputClassNameCompact : inputClassName) + " " + className}
      {...props}
    />
  );
});
