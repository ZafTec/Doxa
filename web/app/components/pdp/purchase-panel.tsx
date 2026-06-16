"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ItemVariantSummary } from "@/lib/api";
import { useCartStore, useUiStore } from "@/lib/store";
import { formatPriceWithCurrencyLabel } from "@/lib/util/money";

export type PurchasePanelProps = {
  itemId: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  variants: ItemVariantSummary[];
  /**
   * Image URL snapshotted into the cart line. Today the backend's
   * `ItemDetails.assets` only carries the first variant's images, so we
   * use the same URL for any selected variant. TODO(media): fetch
   * per-variant assets when the picker changes.
   */
  imageSrc?: string;
};

export function PurchasePanel({
  itemId,
  brand,
  name,
  description,
  price,
  variants,
  imageSrc,
}: PurchasePanelProps) {
  const sorted = useMemo(
    () => [...variants].sort((a, b) => a.price - b.price),
    [variants],
  );
  const initial = sorted.find((v) => v.stockQuantity > 0) ?? sorted[0];
  const [selectedId, setSelectedId] = useState<string | undefined>(initial?.id);
  const [quantity, setQuantity] = useState(1);
  const add = useCartStore((s) => s.add);
  const openCart = useUiStore((s) => s.setCartOpen);

  const selected = sorted.find((v) => v.id === selectedId) ?? initial;
  const canBuy = selected !== undefined && selected.stockQuantity > 0;
  const displayPrice = selected?.price ?? price;
  const maxQty = Math.min(99, selected?.stockQuantity ?? 99);

  function handleAdd() {
    if (!selected || !canBuy) return;
    add(
      {
        variantId: selected.id,
        itemId,
        brand,
        description: name,
        color: selected.color,
        unitPrice: selected.price,
        image: imageSrc,
      },
      Math.min(quantity, maxQty),
    );
    openCart(true);
  }

  return (
    <section className="flex flex-col space-y-8">
      <div>
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {brand}
        </span>
        <h1 className="mb-2 text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
          {name}
        </h1>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>

      <div className="text-2xl font-medium tabular-nums">
        {formatPriceWithCurrencyLabel(displayPrice)}
      </div>

      {sorted.length > 0 && (
        <VariantPicker
          variants={sorted}
          selectedId={selected?.id}
          onSelect={setSelectedId}
        />
      )}

      {selected && (
        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
          {selected.stockQuantity > 0
            ? `${selected.stockQuantity} in stock`
            : "Out of stock"}
        </p>
      )}

      <div className="flex flex-col space-y-4">
        <div className="flex h-14 w-fit items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            disabled={!canBuy}
            className="flex h-full w-12 items-center justify-center border-r border-border transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-16 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            aria-label="Increase quantity"
            disabled={!canBuy || quantity >= maxQty}
            className="flex h-full w-12 items-center justify-center border-l border-border transition-colors hover:bg-muted disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!canBuy}
          className="h-14 w-full bg-accent text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {canBuy ? "Add to bag" : "Out of stock"}
        </button>

        <p className="pt-2 text-center text-xs text-muted-foreground">
          Free shipping over $500 · Returns within 30 days.
        </p>
      </div>
    </section>
  );
}

function VariantPicker({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ItemVariantSummary[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}) {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="space-y-4">
      <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        Color — {selected?.color ?? "Select"}
      </label>
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => {
          const isSelected = v.id === selectedId;
          const out = v.stockQuantity <= 0;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              disabled={out}
              className={
                "flex items-center gap-2 border px-4 py-2 text-sm transition-colors " +
                (isSelected
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-foreground hover:border-muted-foreground") +
                (out ? " cursor-not-allowed line-through opacity-50" : "")
              }
            >
              <span
                className="size-3 rounded-full border border-white/20"
                style={{ backgroundColor: cssColor(v.color) }}
              />
              {v.color}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function cssColor(name: string): string {
  if (/^#[0-9a-f]{3,8}$/i.test(name)) return name;
  const map: Record<string, string> = {
    black: "#171717",
    blue: "#1d4ed8",
    burgundy: "#7D1128",
    red: "#b91c1c",
    green: "#15803d",
    orange: "#ea580c",
    white: "#ffffff",
    silver: "#d4d4d8",
    gold: "#ca8a04",
    brown: "#78350f",
  };
  return map[name.toLowerCase()] ?? "#a1a1aa";
}
