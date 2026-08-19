import { PlaceholderPage } from "@/app/components/ui/placeholder-page";

/** Unmatched routes under /admin/* - not wrapped in AdminShell, since that requires an authenticated admin. */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-16 items-center border-b border-border px-6">
        <span className="text-sm font-bold tracking-[0.2em]">DOXA ADMIN</span>
      </header>
      <PlaceholderPage
        eyebrow="404"
        title="No such admin page."
        body="That route doesn't exist. Check the URL, or head back to the dashboard."
        mood="lost"
        cta={{ label: "Back to dashboard", href: "/admin" }}
      />
    </div>
  );
}
