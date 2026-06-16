/**
 * Square product image slot. Backend doesn't carry media URLs yet, so this
 * renders a faint placeholder with the brand initial centered. When a
 * `mediaUrl` field lands on Item, swap the placeholder body with
 * `<Image>` from `next/image`.
 */
export function ProductImage({
  brand,
  className = "",
}: {
  brand: string;
  className?: string;
}) {
  const initial = brand?.[0]?.toUpperCase() ?? "·";

  return (
    <div
      className={
        "relative flex aspect-square items-center justify-center overflow-hidden bg-muted " +
        className
      }
    >
      <span
        aria-hidden
        className="select-none text-[120px] font-bold tracking-tighter text-foreground/[0.04]"
      >
        {initial}
      </span>
    </div>
  );
}
