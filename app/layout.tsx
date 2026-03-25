import type { Metadata } from "next";
import { Footer } from "./components/footer";
import { CookieConsent } from "./components/cookie-consent";
import { GoogleAnalytics } from "./components/google-analytics";
import { AdSense } from "./components/adsense";
import { SiteHeader } from "./components/site-header";
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
        <SiteHeader />
        <main style={{ padding: "24px 0 40px" }}>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

