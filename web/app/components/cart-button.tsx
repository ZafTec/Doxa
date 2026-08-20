"use client";

import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
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
        // key={count} replays the pop on every change, not just on mount - a
        // certain, un-fussy acknowledgment that the add landed.
        <motion.span
          key={count}
          initial={{ scale: 1.35 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.3, bounce: 0.4 }}
          className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground tabular-nums"
        >
          {count}
        </motion.span>
      )}
    </IconButton>
  );
}
