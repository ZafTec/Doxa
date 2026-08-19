import type { ComponentPropsWithoutRef } from "react";

export type BadgeVariant = "subtle" | "outline" | "solid";

const base =
  "inline-flex shrink-0 items-center gap-1.5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors";

const variantClass: Record<BadgeVariant, string> = {
  subtle: "bg-muted text-foreground hover:bg-muted/70",
  outline: "border border-border text-foreground",
  solid: "bg-accent text-accent-foreground",
};

/**
 * Formalizes the chip pattern already used for active filters
 * (see catalog/filter-bar.tsx). No color coding by design - this system
 * signals state through weight, border and fill, never hue. Works on any
 * element (span, Link, button) - pass className to a Link when the chip
 * needs to navigate.
 */
export function badgeVariants({
  variant = "subtle",
  className = "",
}: { variant?: BadgeVariant; className?: string } = {}) {
  return [base, variantClass[variant], className].filter(Boolean).join(" ");
}

export function Badge({
  variant,
  className,
  ...props
}: ComponentPropsWithoutRef<"span"> & { variant?: BadgeVariant }) {
  return <span className={badgeVariants({ variant, className })} {...props} />;
}
