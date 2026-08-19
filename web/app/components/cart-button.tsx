"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore, useUiStore } from "@/lib/store";
import { useHasMounted } from "@/lib/util/use-has-mounted";
import { IconButton } from "./ui/icon-button";

export function CartButton() {
  const rawCount = useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const toggleCart = useUiStore((s) => s.toggleCart);
  // Server always renders an empty cart; only trust the persisted count once mounted.
  const count = useHasMounted() ? rawCount : 0;

  return (
    <IconButton onClick={toggleCart} aria-label={`Cart (${count} items)`} className="relative">
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground tabular-nums">
          {count}
        </span>
      )}
    </IconButton>
  );
}
