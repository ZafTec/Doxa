import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

// Backend contract for this page: FaqEntry[] filtered to category "shipping"
// from lib/content/types.ts (rates, timelines, returns).

export default function HelpShippingPage() {
  return (
    <PlaceholderPage
      eyebrow="Help · Shipping"
      title="Shipping details are coming soon."
      body="Rates, delivery timelines and the return window will be documented here. The purchase panel already notes free shipping over $500 and 30-day returns."
      cta={{ label: "Back to watches", href: "/" }}
    />
  );
}
