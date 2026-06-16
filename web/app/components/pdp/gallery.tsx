"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "../product-image";

export function Gallery({
  brand,
  assets,
}: {
  brand: string;
  assets: string[];
}) {
  const [active, setActive] = useState(0);
  const hasAssets = assets.length > 0;
  const mainUrl = hasAssets ? assets[active] ?? assets[0] : undefined;

  return (
    <section className="flex flex-col gap-6 md:flex-row lg:sticky lg:top-24 lg:h-fit">
      <div className="order-2 flex flex-row gap-3 md:order-1 md:flex-col">
        {hasAssets
          ? assets.slice(0, 4).map((url, i) => (
              <button
                key={url + i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={
                  "relative size-[72px] overflow-hidden bg-muted p-1 transition-colors " +
                  (i === active
                    ? "border-2 border-accent"
                    : "border border-border hover:border-muted-foreground")
                }
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-contain"
                  unoptimized
                />
              </button>
            ))
          : [0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={
                  "size-[72px] overflow-hidden bg-muted p-1 " +
                  (i === 0 ? "border-2 border-accent" : "border border-border")
                }
                aria-hidden
              >
                <ProductImage brand={brand} className="!aspect-square" />
              </div>
            ))}
      </div>

      <div className="relative order-1 flex flex-1 items-center justify-center overflow-hidden bg-muted md:order-2 md:min-h-[560px]">
        {mainUrl ? (
          <Image
            src={mainUrl}
            alt={`${brand} watch`}
            width={560}
            height={560}
            sizes="(max-width: 768px) 100vw, 560px"
            className="h-auto w-full max-w-[560px] object-contain"
            unoptimized
            priority
          />
        ) : (
          <ProductImage brand={brand} className="w-full max-w-[560px]" />
        )}
      </div>
    </section>
  );
}
