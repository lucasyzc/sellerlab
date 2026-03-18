import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "./components/footer";
import { CookieConsent } from "./components/cookie-consent";
import { GoogleAnalytics } from "./components/google-analytics";
import { AdSense } from "./components/adsense";
import "./globals.css";

export const metadata: Metadata = {
  title: "SellerLab - Tools Hub for Cross-border Sellers",
  description: "All-in-one fee calculators and seller tools for eBay, Amazon, TikTok Shop, Shopify, and more. Supporting 17+ marketplaces across the US, UK, DE, and beyond.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sellerlab.tools"),
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <AdSense />
        <header style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
          <div
            className="container"
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Link href="/" style={{ fontWeight: 700 }}>
              SellerLab
            </Link>
            <nav style={{ display: "flex", gap: 20, fontSize: 14, fontWeight: 500 }}>
              <Link href="/">Home</Link>
              <Link href="/#tools">Tools</Link>
              <Link href="/ebay-fee-calculator">eBay Fee Calculator</Link>
              <Link href="/amazon-fee-calculator">Amazon Fee Calculator</Link>
            </nav>
          </div>
        </header>
        <main style={{ padding: "24px 0 40px" }}>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
