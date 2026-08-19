import type { ComponentPropsWithoutRef } from "react";

/**
 * Square icon-only affordance (header actions: menu, theme toggle, close).
 * The one place in the system that carries a radius - kept small (Tailwind's
 * default `rounded`) so it still reads as understated, not soft.
 */
export function IconButton({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      className={
        "rounded p-2 text-foreground transition hover:bg-muted active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 " +
        className
      }
      {...props}
    />
  );
}
