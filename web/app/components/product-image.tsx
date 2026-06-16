import Image from "next/image";
import { fallbackPlaceholder } from "@/lib/placeholders/watches";

/**
 * Square product image slot. Prefers a real asset URL; otherwise renders
 * a Stitch-generated placeholder image so the catalog/PDP stay visually
 * complete in dev. Brand initial only renders as a last-resort tint over
 * the placeholder.
 *
 * TODO(media): drop the Stitch placeholder once every Asset row carries
 * a Cloudinary URL.
 */
export function ProductImage({
  brand,
  src,
  alt,
  priority,
  className = "",
  placeholderKey,
}: {
  brand: string;
  src?: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  /** Stable id used to pick a deterministic placeholder when `src` is missing. */
  placeholderKey?: string;
}) {
  const resolved = src ?? fallbackPlaceholder(placeholderKey ?? brand);
  const fallbackAlt = alt ?? `${brand} watch`;

  return (
    <div
      className={
        "relative flex aspect-square items-center justify-center overflow-hidden bg-muted " +
        className
      }
    >
      <Image
        src={resolved}
        alt={fallbackAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className="object-contain p-6"
        priority={priority}
        unoptimized
      />
    </div>
  );
}
