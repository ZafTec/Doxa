import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

// Backend contract for this page: FaqEntry[] (category "general") from
// lib/content/types.ts, rendered as an accordion once populated.

export default function HelpFaqPage() {
  return (
    <PlaceholderPage
      eyebrow="Help · FAQ"
      title="Answers are on the way."
      body="Common questions about sizing, materials and orders will be collected here. Can't wait? Send it through Contact instead."
      cta={{ label: "Contact us", href: "/contact" }}
    />
  );
}
