import { Eyebrow } from "@/app/components/ui/eyebrow";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-20 md:px-12">
      <Eyebrow className="mb-3">Legal</Eyebrow>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mb-12 text-xs text-muted-foreground">Draft - not yet in effect.</p>

      <div className="space-y-8 text-sm leading-[1.6] text-muted-foreground">
        <p>
          This policy is a placeholder. Doxa hasn&rsquo;t published a final privacy policy
          yet - this page exists so the link in the footer doesn&rsquo;t 404, not as a
          binding statement of how data is handled.
        </p>
        <section>
          <h2 className="mb-2 text-sm font-medium text-foreground">What we&rsquo;ll cover</h2>
          <p>
            The published version will describe what&rsquo;s collected (account and order
            data, cart contents stored locally in your browser), how it&rsquo;s used, and
            how to request access or deletion.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm font-medium text-foreground">Today</h2>
          <p>
            The storefront cart lives entirely in your browser&rsquo;s local storage and is
            never sent to us until checkout exists. Admin accounts are authenticated via
            Google OAuth; we store only the email, name and role needed to grant access.
          </p>
        </section>
      </div>
    </main>
  );
}
