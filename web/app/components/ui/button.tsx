import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "border border-border text-foreground hover:border-muted-foreground",
  ghost: "text-muted-foreground hover:text-foreground",
};

/**
 * Two text registers, not just four sizes: `xs` is the compact,
 * uppercase-tracked toolbar/row-action treatment (admin "New item", "Remove");
 * sm/md/lg are the prominent, normal-case CTA treatment (hero, "Add to bag").
 * They're never mixed - see "Design language" in AGENTS.md.
 */
const sizeClass: Record<ButtonSize, string> = {
  xs: "h-9 px-4 text-xs uppercase tracking-[0.08em]",
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-sm",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return [base, variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return <button className={buttonVariants({ variant, size, className })} {...props} />;
}
