import type { Item, ItemVariant } from "@/lib/api";

export function SpecList({ item, variant }: { item: Item; variant?: ItemVariant }) {
  const rows: Array<{ label: string; value: string }> = [];

  if (item.category?.name) rows.push({ label: "Category", value: item.category.name });
  rows.push({ label: "Brand", value: item.brand });
  if (variant?.color) rows.push({ label: "Color", value: variant.color });
  if (variant && variant.stockQuantity > 0) {
    rows.push({ label: "Availability", value: `${variant.stockQuantity} in stock` });
  } else if (variant) {
    rows.push({ label: "Availability", value: "Out of stock" });
  }

  if (rows.length === 0) return null;

  return (
    <div className="border-t border-border pt-8">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between border-b border-border py-4"
        >
          <span className="text-sm font-medium text-muted-foreground">{row.label}</span>
          <span className="text-sm font-medium">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
