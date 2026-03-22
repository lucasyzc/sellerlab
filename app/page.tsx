import type { Metadata } from "next";
import HomePageClient from "./home-page-client";
import { absoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "SellerLab - Free Cross-border Seller Tools & Fee Calculators",
  description:
    "Use free fee calculators and profit tools for eBay, Amazon, TikTok Shop, and Shopify across global marketplaces.",
  keywords: [
    "seller tools",
    "cross-border ecommerce tools",
    "ebay fee calculator",
    "amazon fee calculator",
    "tiktok shop fee calculator",
    "shopify fee calculator",
    "ecommerce profit calculator",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SellerLab - Free Cross-border Seller Tools & Fee Calculators",
    description:
      "Free calculators and operational tools for eBay, Amazon, TikTok Shop, and Shopify sellers.",
    url: "/",
    type: "website",
    siteName: "SellerLab",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "SellerLab - Free Cross-border Seller Tools & Fee Calculators",
    description:
      "Calculate fees and profit for major ecommerce marketplaces with free, market-specific tools.",
  },
};

function HomeStructuredData() {
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SellerLab",
    url: absoluteUrl("/"),
    description:
      "SellerLab provides free fee calculators and seller tools for cross-border ecommerce marketplaces.",
    inLanguage: "en",
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SellerLab",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.svg"),
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Seller Tools",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "eBay Fee Calculator",
        url: absoluteUrl("/ebay-fee-calculator"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Amazon Fee Calculator",
        url: absoluteUrl("/amazon-fee-calculator"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "TikTok Shop Fee Calculator",
        url: absoluteUrl("/tiktok-shop-fee-calculator"),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Shopify Cost Calculator",
        url: absoluteUrl("/shopify-fee-calculator"),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([webSite, organization, itemList]),
      }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <HomePageClient />
    </>
  );
}
