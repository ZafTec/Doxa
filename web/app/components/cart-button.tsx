"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore, useUiStore } from "@/lib/store";

export function CartButton() {
  const count = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const toggleCart = useUiStore((s) => s.toggleCart);

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label={`Cart (${count} items)`}
      className="relative rounded p-2 text-foreground transition-colors hover:bg-muted"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}
