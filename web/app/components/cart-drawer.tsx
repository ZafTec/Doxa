"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, useUiStore, type CartLine } from "@/lib/store";
import { formatPrice } from "@/lib/util/money";
import { ProductImage } from "./product-image";

export function CartDrawer() {
  const open = useUiStore((s) => s.cartOpen);
  const setOpen = useUiStore((s) => s.setCartOpen);
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={
          "fixed inset-0 z-40 bg-black/40 transition-opacity " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] transform flex-col border-l border-border bg-background transition-transform duration-240 ease-out " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">Bag</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close bag"
            className="rounded p-1 transition-colors hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-border">
              {lines.map((line) => (
                <CartRow key={line.variantId} line={line} />
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Subtotal
              </span>
              <span className="text-base font-medium tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              type="button"
              className="h-12 w-full bg-accent text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Checkout
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

function EmptyCart() {
  const setOpen = useUiStore((s) => s.setCartOpen);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
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

function CartRow({ line }: { line: CartLine }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const lineTotal = line.unitPrice * line.quantity;

  return (
    <li className="flex gap-4 py-4">
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
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {line.brand}
        </span>
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
              <span className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground tabular-nums">
                × {line.quantity} = {formatPrice(lineTotal)}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => remove(line.variantId)}
        aria-label="Remove from bag"
        className="self-start rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}
