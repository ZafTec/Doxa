import { SiteHeader } from "@/app/components/site-header";
import { SiteSidebar } from "@/app/components/site-sidebar";
import { SiteFooter } from "@/app/components/site-footer";
import { CartDrawer } from "@/app/components/cart-drawer";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteSidebar />
      <CartDrawer />
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </>
  );
}
