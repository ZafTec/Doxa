"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow, eyebrowBaseClassName } from "@/app/components/ui/eyebrow";
import { Input, Textarea } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import type { ContactSubmission } from "@/lib/content/types";

// No /contact backend endpoint exists yet - this collects a ContactSubmission
// (lib/content/types.ts) and simulates a send locally. Swap handleSubmit's
// body for a real POST once one exists; the shape below is the contract.

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const submission: ContactSubmission = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    void submission;
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setSent(true);
    }, 400);
  }

  return (
    <main className="mx-auto max-w-[560px] px-6 py-20 md:px-12">
      <Eyebrow className="mb-3">Contact</Eyebrow>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight">Get in touch.</h1>
      <p className="mb-10 text-sm leading-[1.55] text-muted-foreground">
        There&rsquo;s no support team wired up yet, but the form below is ready - it
        collects your message locally today and will send for real once it&rsquo;s
        connected.
      </p>

      {sent ? (
        <p className="border border-border bg-muted px-4 py-3 text-sm">
          Thanks - this was captured locally. We&rsquo;ll be able to actually reply once
          this form is connected to a real inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block space-y-2">
            <span className={eyebrowBaseClassName + " block text-muted-foreground"}>
              Name
            </span>
            <Input name="name" required placeholder="Jordan Lee" />
          </label>
          <label className="block space-y-2">
            <span className={eyebrowBaseClassName + " block text-muted-foreground"}>
              Email
            </span>
            <Input name="email" type="email" required placeholder="you@example.com" />
          </label>
          <label className="block space-y-2">
            <span className={eyebrowBaseClassName + " block text-muted-foreground"}>
              Subject
            </span>
            <Input name="subject" required placeholder="Question about the Sub 300" />
          </label>
          <label className="block space-y-2">
            <span className={eyebrowBaseClassName + " block text-muted-foreground"}>
              Message
            </span>
            <Textarea name="message" required rows={5} className="min-h-32" />
          </label>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Sending…" : "Send message"}
          </Button>
        </form>
      )}
    </main>
  );
}
