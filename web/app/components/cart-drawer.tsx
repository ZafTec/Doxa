"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCartStore, useUiStore, type CartLine } from "@/lib/store";
import { formatPrice } from "@/lib/util/money";
import { useHasMounted } from "@/lib/util/use-has-mounted";
import { ProductImage } from "./product-image";
import { IconButton } from "./ui/icon-button";
import { Eyebrow } from "./ui/eyebrow";
import { Button } from "./ui/button";
import { DoxaAvatar } from "./ui/doxa-avatar";

// Subtle, Apple-style spring: settles like a physical panel, not a bounce toy.
const drawerSpring = { type: "spring", duration: 0.35, bounce: 0.15 } as const;

export function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen);
  const setOpen = useUiStore((s) => s.setCartOpen);
  const rawLines = useCartStore((s) => s.lines);
  const rawSubtotal = useCartStore((s) => s.subtotal());
  const rawTotalItems = useCartStore((s) => s.totalItems());
  const removeLine = useCartStore((s) => s.remove);
  // Server always renders an empty cart; only trust the persisted lines once
  // mounted, or the real count/subtotal would diverge from the SSR markup.
  const mounted = useHasMounted();
  const lines = mounted ? rawLines : [];
  const subtotal = mounted ? rawSubtotal : 0;
  const totalItems = mounted ? rawTotalItems : 0;

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [announcement, setAnnouncement] = useState("");

  // Removing a row's own button would otherwise drop focus to <body> and
  // leave screen-reader users with no spoken confirmation the item is gone.
  // The close button is the one control that's always present, empty cart
  // or not, so it's a safe, predictable place to land the focus; the live
  // region covers users who aren't watching focus move at all.
  function handleRemove(line: CartLine) {
    removeLine(line.variantId);
    setAnnouncement(`Removed ${line.brand} ${line.description} from bag.`);
    closeButtonRef.current?.focus();
  }

  return (
    <>
      <motion.div
        onClick={() => setOpen(false)}
        aria-hidden
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{ pointerEvents: open ? "auto" : "none" }}
        className="fixed inset-0 z-40 bg-black/40"
      />
      <motion.aside
        role="dialog"
        aria-label="Shopping bag"
        initial={false}
        animate={{ transform: open ? "translateX(0%)" : "translateX(100%)" }}
        transition={drawerSpring}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l border-border bg-background"
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Bag</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
          <IconButton
            ref={closeButtonRef}
            size="sm"
            onClick={() => setOpen(false)}
            aria-label="Close bag"
          >
            <X className="size-5" />
          </IconButton>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-border">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <CartRow key={line.variantId} line={line} onRemove={handleRemove} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Screen-reader-only: announces removals for users who won't see
            the row disappear or notice focus land on the close button. */}
        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-baseline justify-between">
              <Eyebrow>Subtotal</Eyebrow>
              <span className="text-base font-medium tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <Button className="w-full">Checkout</Button>
          </footer>
        )}
      </motion.aside>
    </>
  );
}

function EmptyCart() {
  const setOpen = useUiStore((s) => s.setCartOpen);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <DoxaAvatar mood="calm" className="size-14 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Your bag is empty.</p>
      <Link
        href="/"
        onClick={() => setOpen(false)}
        className="text-xs font-medium uppercase tracking-[0.08em] underline-offset-4 hover:underline"
      >
        Browse watches
      </Link>
    </div>
  );
}

function CartRow({
  line,
  onRemove,
}: {
  line: CartLine;
  onRemove: (line: CartLine) => void;
}) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const lineTotal = line.unitPrice * line.quantity;

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 py-4"
    >
      <Link
        href={`/watches/${line.itemId}`}
        aria-label={`Open ${line.brand} ${line.description}`}
        className="block size-20 shrink-0"
      >
        <ProductImage
          brand={line.brand}
          src={line.image}
          placeholderKey={line.itemId}
          alt={`${line.brand} ${line.description}`}
          className="size-20"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <Eyebrow>{line.brand}</Eyebrow>
        <span className="text-sm font-medium leading-tight">{line.description}</span>
        <span className="text-xs text-muted-foreground">{line.color}</span>

        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="flex h-8 items-center border border-border">
            <button
              type="button"
              onClick={() => setQuantity(line.variantId, line.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-full w-7 items-center justify-center transition-colors hover:bg-muted"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-8 text-center text-xs tabular-nums">{line.quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(line.variantId, line.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-full w-7 items-center justify-center transition-colors hover:bg-muted"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <span className="text-sm font-medium tabular-nums">
              {formatPrice(line.unitPrice)}
            </span>
            {line.quantity > 1 && (
              <Eyebrow className="tabular-nums">
                × {line.quantity} = {formatPrice(lineTotal)}
              </Eyebrow>
            )}
          </div>
        </div>
      </div>

      <IconButton
        size="sm"
        onClick={() => onRemove(line)}
        aria-label={`Remove ${line.brand} ${line.description} from bag`}
        className="self-start text-muted-foreground hover:text-foreground"
      >
        <Trash2 className="size-4" />
      </IconButton>
    </motion.li>
  );
}
