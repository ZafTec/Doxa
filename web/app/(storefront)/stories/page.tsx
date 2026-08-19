import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

// Backend contract for this page: StoryPost[] from lib/content/types.ts.
// Renders as an editorial index (title, excerpt, cover image, date) once
// there's a CMS or endpoint behind it.

export default function StoriesPage() {
  return (
    <PlaceholderPage
      eyebrow="Journal"
      title="The journal hasn't opened yet."
      body="Heritage notes, movement deep-dives and field stories will live here. Nothing published yet - check back soon."
      cta={{ label: "Explore the collection", href: "/" }}
    />
  );
}
