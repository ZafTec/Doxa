import Link from "next/link";
import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

/**
 * Root fallback for any URL that matches no route at all - Next.js always
 * renders this inside the root layout only (never a nested one, since
 * routing couldn't tell which segment tree an unmatched path belonged to),
 * so it carries its own minimal header rather than the full site chrome.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-16 items-center border-b border-border px-6 md:px-12">
        <Link href="/" className="text-xl font-bold tracking-[0.2em] text-foreground">
          DOXA
        </Link>
      </header>
      <PlaceholderPage
        eyebrow="404"
        title="This page wandered off the strap."
        body="The page you're looking for doesn't exist, or the link is out of date. Try the watches, or head back home."
        mood="lost"
        cta={{ label: "Back to watches", href: "/" }}
      />
    </div>
  );
}
