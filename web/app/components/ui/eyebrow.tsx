import type { ComponentPropsWithoutRef, ElementType } from "react";

export const eyebrowClassName =
  "text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground";

/**
 * The wide-tracked uppercase micro-label used throughout the system
 * (brand kicker on product cards, section labels, stock/status text).
 * Defaults to <span>; pass `as` for a <label> or block element.
 */
export function Eyebrow<T extends ElementType = "span">({
  as,
  className = "",
  ...props
}: { as?: T; className?: string } & Omit<
  ComponentPropsWithoutRef<T>,
  "as" | "className"
>) {
  const Tag = (as ?? "span") as ElementType;
  return <Tag className={eyebrowClassName + " " + className} {...props} />;
}
