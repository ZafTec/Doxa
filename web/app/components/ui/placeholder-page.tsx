import Link from "next/link";
import { Eyebrow } from "./eyebrow";
import { buttonVariants } from "./button";
import { DoxaAvatar, type DoxaAvatarMood } from "./doxa-avatar";

/**
 * Shared shell for content pages that don't have a backend endpoint yet
 * (collections, stories, retailers, help topics, ...). Honest about being
 * unfinished rather than faking content - see each route's data contract
 * in lib/content/types.ts for what it will render once wired up.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  body,
  mood = "calm",
  cta = { label: "Back to watches", href: "/" },
}: {
  eyebrow: string;
  title: string;
  body: string;
  mood?: DoxaAvatarMood;
  cta?: { label: string; href: string };
}) {
  return (
    <main className="mx-auto flex max-w-[640px] flex-col items-center px-6 py-32 text-center">
      <DoxaAvatar mood={mood} className="mb-10 size-24 text-muted-foreground" />
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      <p className="mb-10 text-sm leading-[1.55] text-muted-foreground">{body}</p>
      <Link href={cta.href} className={buttonVariants({ size: "md" })}>
        {cta.label}
      </Link>
    </main>
  );
}
