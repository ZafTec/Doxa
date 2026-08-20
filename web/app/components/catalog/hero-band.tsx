"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "../ui/eyebrow";

export function HeroBand() {
  return (
    <section className="w-full border-b border-border">
      <div className="mx-auto flex max-w-[1440px] flex-col overflow-hidden md:h-120 md:flex-row">
        <div className="flex flex-col justify-center px-6 py-16 md:w-[42%] md:px-12 md:py-0 lg:px-20">
          <Eyebrow className="mb-4">Heritage</Eyebrow>
          <h1 className="mb-6 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-[56px] md:leading-none">
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
        {/* Decorative only - hidden below md rather than squeezed, so the
            fixed 42/58 split never forces the text pane (and the display
            headline within it) to overflow a narrow viewport. */}
        <div className="relative hidden bg-muted md:block md:w-[58%]">
          <div className="absolute inset-0 flex items-center justify-center text-[200px] font-bold tracking-tighter text-foreground/4">
            D
          </div>
        </div>
      </div>
    </section>
  );
}
