import { Eyebrow } from "@/app/components/ui/eyebrow";

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-20 md:px-12">
      <Eyebrow className="mb-3">Legal</Eyebrow>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mb-12 text-xs text-muted-foreground">Draft - not yet in effect.</p>

      <div className="space-y-8 text-sm leading-[1.6] text-muted-foreground">
        <p>
          This page is a placeholder. Doxa hasn&rsquo;t published final terms yet - it
          exists so the link in the footer doesn&rsquo;t 404, not as a binding agreement.
        </p>
        <section>
          <h2 className="mb-2 text-sm font-medium text-foreground">What we&rsquo;ll cover</h2>
          <p>
            The published version will set out order acceptance, pricing and payment,
            shipping and returns (the purchase panel already notes free shipping over
            $500 and 30-day returns), and warranty terms.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm font-medium text-foreground">Today</h2>
          <p>
            There is no checkout yet - the cart is a local draft only, and no order has
            been placed or paid for until that ships.
          </p>
        </section>
      </div>
    </main>
  );
}
