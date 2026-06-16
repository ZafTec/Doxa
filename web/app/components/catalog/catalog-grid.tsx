import type { Item } from "@/lib/api";
import { ProductCard } from "./product-card";

export function CatalogGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-sm text-muted-foreground">No watches match this view.</p>
        <p className="text-xs text-muted-foreground">
          The catalog will populate once the backend is seeded.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
