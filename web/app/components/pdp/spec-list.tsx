import type { ItemVariantSummary } from "@/lib/api";

export function SpecList({
  brand,
  variants,
  selectedVariantId,
}: {
  brand: string;
  variants: ItemVariantSummary[];
  selectedVariantId?: string;
}) {
  const selected = variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const rows: Array<{ label: string; value: string }> = [];
  rows.push({ label: "Brand", value: brand });
  if (selected?.color) rows.push({ label: "Color", value: selected.color });
  if (variants.length > 1) {
    rows.push({ label: "Variants", value: `${variants.length} colorways` });
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
