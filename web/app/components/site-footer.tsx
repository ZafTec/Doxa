import Link from "next/link";

const columns: Array<{ label: string; links: Array<{ label: string; href: string }> }> = [
  {
    label: "Shop",
    links: [
      { label: "All Watches", href: "/" },
      { label: "New Arrivals", href: "/?sort=new" },
      { label: "Diving", href: "/?category=Dive" },
      { label: "Limited Edition", href: "/?collection=limited" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Journal", href: "/stories" },
      { label: "Manufacture", href: "/about#manufacture" },
      { label: "Retailers", href: "/retailers" },
    ],
  },
  {
    label: "Help",
    links: [
      { label: "Service", href: "/help/service" },
      { label: "Shipping", href: "/help/shipping" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/help/faq" },
    ],
  },
  {
    label: "Connect",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
];

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="border-t border-border bg-muted/40 px-6 py-16 md:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-5">
          {columns.map((col) => (
            <div key={col.label}>
              <h4 className="mb-6 text-[11px] font-bold uppercase tracking-[0.12em]">
                {col.label}
              </h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 flex items-start md:col-span-1 md:justify-end">
            <span className="text-3xl font-bold tracking-[0.25em]">DOXA</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-[10px] uppercase tracking-[0.12em] text-muted-foreground md:flex-row">
          <span>© {year} Doxa Editorial. All rights reserved.</span>
          <div className="flex gap-8">
            <Link href="/legal/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
