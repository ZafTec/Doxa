import type { Metadata } from "next";
import { Mona_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeEffect } from "./components/theme-effect";
import { SiteHeader } from "./components/site-header";
import { SiteSidebar } from "./components/site-sidebar";
import { SiteFooter } from "./components/site-footer";
import { CartDrawer } from "./components/cart-drawer";

const monaSans = Mona_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Doxa — Watches",
  description: "Editorial watches storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${monaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("doxa.ui");var t="system";if(s){var p=JSON.parse(s);t=(p.state&&p.state.theme)||"system";}var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeEffect />
        <SiteSidebar />
        <CartDrawer />
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
