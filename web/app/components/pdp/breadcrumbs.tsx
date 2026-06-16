import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 overflow-x-auto pb-12"
    >
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-2">
            {c.href && !isLast ? (
              <Link
                href={c.href}
                className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {c.label}
              </Link>
            ) : (
              <span
                className={
                  "text-xs font-medium uppercase tracking-[0.08em] " +
                  (isLast ? "text-foreground" : "text-muted-foreground")
                }
              >
                {c.label}
              </span>
            )}
            {!isLast && <span className="text-[10px] text-muted-foreground">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
