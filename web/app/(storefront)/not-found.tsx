import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

/**
 * Used when a storefront page explicitly calls notFound() (e.g. the PDP
 * looking up a watch id that doesn't exist) - rendered inside the
 * storefront layout, so it keeps the header, sidebar and cart.
 */
export default function StorefrontNotFound() {
  return (
    <PlaceholderPage
      eyebrow="404"
      title="This page wandered off the strap."
      body="We couldn't find that watch, or the link is out of date. Browse the current collection instead."
      mood="lost"
      cta={{ label: "Back to watches", href: "/" }}
    />
  );
}
