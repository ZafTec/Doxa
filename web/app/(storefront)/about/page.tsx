import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

// Backend contract for this page: AboutContent from lib/content/types.ts
// (hero copy + manufacture sections). The hero band already references
// "Since 1889" - this page will carry the full story and #manufacture
// anchor once that content is written.

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="Our story"
      title="Our story is still being written."
      body="The full history of the manufacture - and the #manufacture section the footer already links to - lands here. In the meantime, the watches speak for themselves."
      cta={{ label: "Explore the collection", href: "/" }}
    />
  );
}
