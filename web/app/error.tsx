"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Eyebrow } from "@/app/components/ui/eyebrow";
import { Button, buttonVariants } from "@/app/components/ui/button";
import { DoxaAvatar } from "@/app/components/ui/doxa-avatar";

/**
 * Root error boundary - catches anything thrown while rendering a route
 * (not the root layout itself; that needs global-error.tsx, which we don't
 * have yet). Must stay a client component per Next.js's contract.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-16 items-center border-b border-border px-6 md:px-12">
        <Link href="/" className="text-xl font-bold tracking-[0.2em] text-foreground">
          DOXA
        </Link>
      </header>
      <main className="mx-auto flex max-w-[640px] flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <DoxaAvatar mood="broken" className="mb-10 size-24 text-muted-foreground" />
        <Eyebrow className="mb-4">Something broke</Eyebrow>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
          The movement stopped.
        </h1>
        <p className="mb-10 text-sm leading-[1.55] text-muted-foreground">
          Something went wrong loading this page. It&rsquo;s been logged - try again, or
          head back home.
          {error.digest && (
            <>
              <br />
              <span className="text-[11px]">Reference: {error.digest}</span>
            </>
          )}
        </p>
        <div className="flex items-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            Back home
          </Link>
        </div>
      </main>
    </div>
  );
}
