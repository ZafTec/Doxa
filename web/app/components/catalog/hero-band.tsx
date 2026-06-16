import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroBand() {
  return (
    <section className="flex h-[480px] w-full overflow-hidden border-b border-border">
      <div className="flex w-[42%] flex-col justify-center px-12 md:px-24">
        <span className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Heritage
        </span>
        <h1 className="mb-6 text-[56px] font-semibold leading-[1] tracking-[-0.02em]">
          Built for depth,
          <br />
          dressed for daylight.
        </h1>
        <p className="mb-8 max-w-sm text-sm leading-[1.55] text-muted-foreground">
          Since 1889, precision and performance have defined our movement. A legacy of
          exploration meets modern aesthetic restraint.
        </p>
        <Link
          href="/?category=Dive"
          className="inline-flex w-fit items-center gap-2 bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Explore the collection
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="relative w-[58%] bg-muted">
        <div className="absolute inset-0 flex items-center justify-center text-[200px] font-bold tracking-tighter text-foreground/[0.04]">
          D
        </div>
      </div>
    </section>
  );
}
