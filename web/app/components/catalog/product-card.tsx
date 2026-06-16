import Link from "next/link";
import type { Item } from "@/lib/api";
import { itemTitle, minPrice } from "@/lib/util/item";
import { formatPrice } from "@/lib/util/money";
import { ProductImage } from "../product-image";

export function ProductCard({ item }: { item: Item }) {
  const title = itemTitle(item);
  const price = minPrice(item);
  const variants = item.itemVariants ?? [];
  const heroAsset = variants[0]?.assets?.[0]?.url;

  return (
    <Link href={`/watches/${item.id}`} className="group block">
      <ProductImage
        brand={item.brand}
        src={heroAsset}
        alt={`${item.brand} ${title}`}
        className="transition-transform duration-500 group-hover:scale-[1.02]"
      />

      <div className="mt-3 flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {item.brand}
        </span>
        {variants.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {variants.slice(0, 3).map((v) => (
              <div
                key={v.id}
                title={v.color}
                className="size-2.5 rounded-full border border-border"
                style={{ backgroundColor: cssColor(v.color) }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-2">
        <h3 className="line-clamp-1 text-base font-semibold">{title}</h3>
        {price !== undefined ? (
          <span className="shrink-0 text-sm font-medium tabular-nums">
            {formatPrice(price)}
          </span>
        ) : (
          <span className="shrink-0 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            Coming soon
          </span>
        )}
      </div>
    </Link>
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
