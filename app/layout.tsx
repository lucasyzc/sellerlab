import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "./components/footer";
import { CookieConsent } from "./components/cookie-consent";
import { GoogleAnalytics } from "./components/google-analytics";
import { AdSense } from "./components/adsense";
import { SITE_URL } from "@/lib/site-url";
import { BRAND, withMasterBrand } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: withMasterBrand("Ecommerce Data Engine for Cross-border Sellers"),
  description:
    "Data EDE is an ecommerce data engine for cross-border sellers. Use the SellerLab Suite to calculate fees, model margin, and improve platform decisions.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: BRAND.masterName,
    title: withMasterBrand("Ecommerce Data Engine for Cross-border Sellers"),
    description:
      "Data EDE powers the SellerLab Suite with calculators and data tools for cross-border ecommerce sellers.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: withMasterBrand("Ecommerce Data Engine for Cross-border Sellers"),
    description:
      "Use SellerLab Suite tools to estimate marketplace fees, profit, and margin across global channels.",
  },
  category: "business",
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
              minHeight: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              padding: "12px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Link href="/" style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>
                {BRAND.masterName}
              </Link>
              <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", lineHeight: 1.2 }}>
                {BRAND.masterTagline}
              </span>
            </div>
            <nav style={{ display: "flex", gap: 18, fontSize: 14, fontWeight: 500, flexWrap: "wrap" }}>
              <Link href="/">Home</Link>
              <Link href="/#tools">{BRAND.suiteLabel}</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/updates">Updates</Link>
              <Link href="/ebay-fee-calculator">eBay Fee Calculator</Link>
              <Link href="/ebay-title-optimizer">eBay Title Optimizer</Link>
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

