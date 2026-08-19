import type { ComponentPropsWithoutRef, ElementType } from "react";

export const eyebrowBaseClassName = "text-[11px] font-medium uppercase tracking-[0.08em]";

export const eyebrowClassName = eyebrowBaseClassName + " text-muted-foreground";

const toneClass = {
  muted: "text-muted-foreground",
  foreground: "text-foreground",
  none: "",
} as const;

/**
 * The wide-tracked uppercase micro-label used throughout the system
 * (brand kicker on product cards, section labels, stock/status text).
 * Defaults to <span>; pass `as` for a <label> or block element. `tone`
 * covers the two colors this treatment actually appears in (most
 * commonly muted, occasionally full-contrast for an active/current state
 * like a breadcrumb) - `none` to inherit color from a Link/button instead.
 */
export function Eyebrow<T extends ElementType = "span">({
  as,
  tone = "muted",
  className = "",
  ...props
}: {
  as?: T;
  tone?: keyof typeof toneClass;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag className={eyebrowBaseClassName + " " + toneClass[tone] + " " + className} {...props} />
  );
}
