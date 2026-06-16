import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Page param `?page=` is 1-indexed for clean URLs; the backend wants
 * 0-indexed `pageNumber`. The catalog page does that mapping.
 */
export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: {
  /** 1-indexed. */
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = paginationWindow(currentPage, totalPages);
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pb-24 text-sm font-medium"
    >
      {prevDisabled ? (
        <span className="flex cursor-not-allowed items-center gap-1 px-4 py-2 text-muted-foreground opacity-40">
          <ArrowLeft className="size-4" />
          Previous
        </span>
      ) : (
        <Link
          href={hrefForPage(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
          Previous
        </Link>
      )}

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={hrefForPage(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={
                "flex size-10 items-center justify-center transition-colors " +
                (p === currentPage ? "bg-muted" : "hover:bg-muted")
              }
            >
              {p}
            </Link>
          ),
        )}
      </div>

      {nextDisabled ? (
        <span className="flex cursor-not-allowed items-center gap-1 px-4 py-2 text-muted-foreground opacity-40">
          Next
          <ArrowRight className="size-4" />
        </span>
      ) : (
        <Link
          href={hrefForPage(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 transition-colors hover:bg-muted"
        >
          Next
          <ArrowRight className="size-4" />
        </Link>
      )}
    </nav>
  );
}

function paginationWindow(current: number, total: number): Array<number | "…"> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: Array<number | "…"> = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
