import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

// Backend contract for this page: RetailerLocation[] from lib/content/types.ts.
// Renders as a searchable/filterable store locator once there's an endpoint
// for it (city, country, address, phone, map link).

export default function RetailersPage() {
  return (
    <PlaceholderPage
      eyebrow="Retailers"
      title="The store locator is on its way."
      body="A searchable list of authorized retailers will live here. Buying online in the meantime is the fastest way to get a Doxa on your wrist."
      cta={{ label: "Shop online", href: "/" }}
    />
  );
}
