"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ItemDetailsVariant } from "@/lib/api";
import { useCartStore, useUiStore } from "@/lib/store";
import { formatPriceWithCurrencyLabel } from "@/lib/util/money";
import { Eyebrow } from "../ui/eyebrow";
import { Button } from "../ui/button";

export type PurchasePanelProps = {
  itemId: string;
  brand: string;
  description: string;
  variants: ItemDetailsVariant[];
  selectedVariantId: string | undefined;
  onVariantSelect: (id: string) => void;
};

export function PurchasePanel({
  itemId,
  brand,
  description,
  variants,
  selectedVariantId,
  onVariantSelect,
}: PurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const add = useCartStore((s) => s.add);
  const openCart = useUiStore((s) => s.setCartOpen);

  const selected = variants.find((variant) => variant.id === selectedVariantId);
  const canBuy = selected !== undefined && selected.stockQuantity > 0;
  const maxQty = Math.min(99, selected?.stockQuantity ?? 1);
  const displayName = selected?.name ?? brand;
  const displayDescription = selected?.description || description;

  function handleVariantSelect(id: string) {
    setQuantity(1);
    onVariantSelect(id);
  }

  function handleAdd() {
    if (!selected || !canBuy) return;
    add(
      {
        variantId: selected.id,
        itemId,
        brand,
        description: selected.name,
        color: selected.color,
        unitPrice: selected.price,
        image: selected.assets[0],
      },
      Math.min(quantity, maxQty),
    );
    openCart(true);
  }

  return (
    <section className="flex flex-col space-y-8">
      <div>
        <Eyebrow as="span" className="mb-2 block">
          {brand}
        </Eyebrow>
        <h1 className="mb-2 text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
          {displayName}
        </h1>
        <p className="text-base text-muted-foreground">{displayDescription}</p>
      </div>

      <div className="text-2xl font-medium tabular-nums">
        {selected ? formatPriceWithCurrencyLabel(selected.price) : "Unavailable"}
      </div>

      {variants.length > 0 && (
        <VariantPicker
          variants={variants}
          selectedId={selected?.id}
          onSelect={handleVariantSelect}
        />
      )}

      {selected && (
        <Eyebrow as="p">
          {selected.stockQuantity > 0
            ? `${selected.stockQuantity} in stock`
            : "Out of stock"}
        </Eyebrow>
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

        <Button size="lg" onClick={handleAdd} disabled={!canBuy} className="w-full">
          {canBuy ? "Add to bag" : "Out of stock"}
        </Button>

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
  variants: ItemDetailsVariant[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}) {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="space-y-4">
      <Eyebrow as="label">Color - {selected?.color ?? "Select"}</Eyebrow>
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
