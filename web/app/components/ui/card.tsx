import type { ComponentPropsWithoutRef } from "react";

export const cardClassName = "border border-border bg-background p-6";

/**
 * A bordered panel - the system has no shadows, so containment is always a
 * 1px border. Use `cardClassName` directly when the panel needs to be a
 * `Link` or another non-div element.
 */
export function Card({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={cardClassName + " " + className} {...props} />;
}
