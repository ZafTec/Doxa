"use client";

import { useState } from "react";
import type { ItemDetails } from "@/lib/api";
import { Gallery } from "./gallery";
import { PurchasePanel } from "./purchase-panel";
import { SpecList } from "./spec-list";

export function ProductDetails({ details }: { details: ItemDetails }) {
  const initialVariant =
    details.variants.find((variant) => variant.stockQuantity > 0) ?? details.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    initialVariant?.id,
  );
  const selectedVariant =
    details.variants.find((variant) => variant.id === selectedVariantId) ?? initialVariant;

  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-[60%_40%] lg:gap-24">
      <Gallery
        key={selectedVariant?.id ?? details.id}
        brand={details.brand}
        assets={selectedVariant?.assets ?? []}
        placeholderKey={details.id}
      />
      <div className="space-y-12">
        <PurchasePanel
          itemId={details.id}
          brand={details.brand}
          description={details.description}
          variants={details.variants}
          selectedVariantId={selectedVariant?.id}
          onVariantSelect={setSelectedVariantId}
        />
        <SpecList
          brand={details.brand}
          variants={details.variants}
          selectedVariantId={selectedVariant?.id}
        />
      </div>
    </div>
  );
}
