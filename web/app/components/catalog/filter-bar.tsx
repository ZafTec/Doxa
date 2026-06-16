import Link from "next/link";
import { X } from "lucide-react";

export type ActiveFilter = {
  key: string;
  label: string;
  /** URL the chip links to when removed (i.e. the same page minus this filter). */
  removeHref: string;
};

export function FilterBar({
  filters,
  resultLabel,
}: {
  filters: ActiveFilter[];
  resultLabel: string;
}) {
  return (
    <section className="flex items-center justify-between border-y border-border px-6 py-2 text-[11px] uppercase tracking-wider md:px-12">
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {filters.length === 0 ? (
          <span className="text-muted-foreground">All watches</span>
        ) : (
          filters.map((f) => (
            <Link
              key={f.key}
              href={f.removeHref}
              className="flex shrink-0 items-center gap-2 bg-muted px-3 py-1 transition-colors hover:bg-muted/70"
            >
              <span>{f.label}</span>
              <X className="size-3" />
            </Link>
          ))
        )}
      </div>
      <span className="shrink-0 text-muted-foreground">{resultLabel}</span>
    </section>
  );
}
