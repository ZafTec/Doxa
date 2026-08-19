"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow } from "@/app/components/ui/eyebrow";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import type { NewsletterSubscription } from "@/lib/content/types";

// No /newsletter backend endpoint exists yet - this collects a
// NewsletterSubscription (lib/content/types.ts) and simulates a signup
// locally. Swap handleSubmit's body for a real POST once one exists.

export default function NewsletterPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [pending, setPending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const subscription: NewsletterSubscription = {
      email: String(form.get("email") ?? ""),
    };
    void subscription;
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setSubscribed(true);
    }, 400);
  }

  return (
    <main className="mx-auto flex max-w-[480px] flex-col items-center px-6 py-32 text-center">
      <Eyebrow className="mb-4">Newsletter</Eyebrow>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight">Stay in the loop.</h1>
      <p className="mb-10 text-sm leading-[1.55] text-muted-foreground">
        New releases, limited runs and the occasional field note. No spam, no backend
        yet either - this signs you up locally for now.
      </p>

      {subscribed ? (
        <p className="border border-border bg-muted px-4 py-3 text-sm">
          You&rsquo;re on the list - captured locally until this is wired up for real.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full gap-3">
          <Input name="email" type="email" required placeholder="you@example.com" />
          <Button type="submit" disabled={pending} className="shrink-0">
            {pending ? "Joining…" : "Join"}
          </Button>
        </form>
      )}
    </main>
  );
}
