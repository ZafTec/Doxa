import type { ComponentPropsWithoutRef } from "react";

export type IconButtonSize = "sm" | "md";

const sizeClass: Record<IconButtonSize, string> = {
  sm: "p-1", // close/remove affordances inside a denser surface (drawer header, cart row)
  md: "p-2", // header-level actions (menu, theme toggle, cart)
};

/**
 * Square icon-only affordance. The one place in the system that carries a
 * radius - kept small (Tailwind's default `rounded`) so it still reads as
 * understated, not soft.
 */
export function IconButton({
  size = "md",
  className = "",
  ...props
}: ComponentPropsWithoutRef<"button"> & { size?: IconButtonSize }) {
  return (
    <button
      type="button"
      className={
        "rounded text-foreground transition hover:bg-muted active:scale-[0.94] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 " +
        sizeClass[size] +
        " " +
        className
      }
      {...props}
    />
  );
}
