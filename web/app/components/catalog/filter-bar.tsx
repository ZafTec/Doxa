import Link from "next/link";
import { X } from "lucide-react";
import { badgeVariants } from "@/app/components/ui/badge";

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
    <section className="border-y border-border text-[11px] uppercase tracking-wider">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2 md:px-12 lg:px-20">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {filters.length === 0 ? (
            <span className="text-muted-foreground">All watches</span>
          ) : (
            filters.map((f) => (
              <Link
                key={f.key}
                href={f.removeHref}
                className={badgeVariants({ className: "normal-case" })}
              >
                <span>{f.label}</span>
                <X className="size-3" />
              </Link>
            ))
          )}
        </div>
        <span className="shrink-0 text-muted-foreground">{resultLabel}</span>
      </div>
    </section>
  );
}
