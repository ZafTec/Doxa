import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

// Backend contract for this page: FaqEntry[] filtered to category "service"
// from lib/content/types.ts (servicing, warranty, repairs).

export default function HelpServicePage() {
  return (
    <PlaceholderPage
      eyebrow="Help · Service"
      title="Service info is coming soon."
      body="Servicing intervals, warranty coverage and repair requests will be documented here. For anything urgent, reach us through Contact."
      cta={{ label: "Contact us", href: "/contact" }}
    />
  );
}
