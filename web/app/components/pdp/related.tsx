import Link from "next/link";
import type { Item } from "@/lib/api";
import { itemTitle, minPrice } from "@/lib/util/item";
import { formatPrice } from "@/lib/util/money";
import { ProductImage } from "../product-image";

export function Related({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-32">
      <h2 className="mb-10 text-2xl font-semibold tracking-tight">You may also like</h2>
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => {
          const price = minPrice(item);
          const heroAsset = item.itemVariants?.[0]?.assets?.[0]?.url;
          return (
            <Link key={item.id} href={`/watches/${item.id}`} className="group block">
              <div className="mb-4 overflow-hidden">
                <ProductImage
                  brand={item.brand}
                  src={heroAsset}
                  placeholderKey={item.id}
                  className="transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {item.brand}
              </span>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <h3 className="line-clamp-1 text-sm font-medium">{itemTitle(item)}</h3>
                {price !== undefined && (
                  <span className="shrink-0 text-sm tabular-nums">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
