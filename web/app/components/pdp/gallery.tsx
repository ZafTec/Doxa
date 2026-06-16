"use client";

import { useState } from "react";
import Image from "next/image";
import { fallbackPlaceholder } from "@/lib/placeholders/watches";

export function Gallery({
  brand,
  assets,
  placeholderKey,
}: {
  brand: string;
  assets: string[];
  placeholderKey: string;
}) {
  const [active, setActive] = useState(0);
  const placeholder = fallbackPlaceholder(placeholderKey);
  const slots = assets.length > 0 ? assets : [placeholder];
  const mainUrl = slots[active] ?? slots[0];

  return (
    <section className="flex flex-col gap-6 md:flex-row lg:sticky lg:top-24 lg:h-fit">
      <div className="order-2 flex flex-row gap-3 md:order-1 md:flex-col">
        {Array.from({ length: Math.max(slots.length, 1) }).map((_, i) => {
          const url = slots[i] ?? placeholder;
          const isActive = i === active;
          return (
            <button
              key={url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={isActive}
              className={
                "relative size-[72px] overflow-hidden bg-muted p-1 transition-colors " +
                (isActive
                  ? "border-2 border-accent"
                  : "border border-border hover:border-muted-foreground")
              }
            >
              <Image src={url} alt="" fill sizes="72px" className="object-contain" unoptimized />
            </button>
          );
        })}
      </div>

      <div className="relative order-1 flex flex-1 items-center justify-center overflow-hidden bg-muted md:order-2 md:min-h-[560px]">
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
      </div>
    </section>
  );
}
