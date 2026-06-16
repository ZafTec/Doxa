import Image from "next/image";

/**
 * Square product image slot. Renders `next/image` with the supplied URL
 * when present; otherwise falls back to a faint brand initial on the
 * muted ground.
 *
 * TODO(media): once backend asset URLs flow consistently through every
 * endpoint, drop the brand-initial fallback altogether.
 */
export function ProductImage({
  brand,
  src,
  alt,
  priority,
  className = "",
}: {
  brand: string;
  src?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  const initial = brand?.[0]?.toUpperCase() ?? "·";
  const fallbackAlt = alt ?? `${brand} watch`;

  return (
    <div
      className={
        "relative flex aspect-square items-center justify-center overflow-hidden bg-muted " +
        className
      }
    >
      {src ? (
        <Image
          src={src}
          alt={fallbackAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-contain p-6"
          priority={priority}
          unoptimized
        />
      ) : (
        <span
          aria-hidden
          className="select-none text-[120px] font-bold tracking-tighter text-foreground/[0.04]"
        >
          {initial}
        </span>
      )}
    </div>
  );
}
