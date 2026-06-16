import { ProductImage } from "../product-image";

/**
 * Gallery for the PDP. Until backend serves media URLs, we render a single
 * large placeholder and a vertical strip of three smaller placeholders.
 * The strip becomes a real thumbnail switcher when `mediaUrl[]` lands.
 */
export function Gallery({ brand }: { brand: string }) {
  return (
    <section className="flex flex-col gap-6 md:flex-row lg:sticky lg:top-24 lg:h-fit">
      <div className="order-2 flex flex-row gap-3 md:order-1 md:flex-col">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={
              "size-[72px] overflow-hidden bg-muted p-1 " +
              (i === 0 ? "border-2 border-accent" : "border border-border")
            }
            aria-hidden
          >
            <ProductImage brand={brand} className="!aspect-square" />
          </div>
        ))}
      </div>
      <div className="order-1 flex flex-1 items-center justify-center bg-muted md:order-2 md:min-h-[560px]">
        <ProductImage brand={brand} className="w-full max-w-[560px]" />
      </div>
    </section>
  );
}
