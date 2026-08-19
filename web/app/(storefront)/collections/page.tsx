import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

// Backend contract for this page: CollectionSummary[] from lib/content/types.ts.
// Renders as a grid of curated groupings (Diving, Limited Edition, ...) once
// there's an endpoint to fetch them from.

export default function CollectionsPage() {
  return (
    <PlaceholderPage
      eyebrow="Collections"
      title="Curated collections are coming."
      body="We're building out themed groupings of the catalog - diving, dress, limited runs. For now, browse everything in one place."
      cta={{ label: "Browse all watches", href: "/" }}
    />
  );
}
