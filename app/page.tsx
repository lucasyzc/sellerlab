import type { Metadata } from "next";
import HomePageClient from "./home-page-client";
import { absoluteUrl } from "@/lib/site-url";
import { BRAND, withMasterBrand } from "@/lib/brand";
import { getFeaturedBlogEntry, getLatestBlogEntries } from "@/lib/blog";

export const metadata: Metadata = {
  title: withMasterBrand("Ecommerce Data Engine and Seller Tool Suite"),
  description:
    "Data EDE delivers ecommerce intelligence for cross-border sellers, with the SellerLab Suite for fee, profit, and margin modeling across marketplaces.",
  keywords: [
    "seller tools",
    "cross-border ecommerce tools",
    "ebay fee calculator",
    "ebay pricing calculator",
    "amazon fee calculator",
    "tiktok shop fee calculator",
    "tiktok shop pricing calculator",
    "shopify fee calculator",
    "ebay title optimizer",
    "ecommerce profit calculator",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: withMasterBrand("Ecommerce Data Engine and Seller Tool Suite"),
    description:
      "Use Data EDE and the SellerLab Suite to model fees and improve pricing decisions across major marketplaces.",
    url: "/",
    type: "website",
    siteName: BRAND.masterName,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: withMasterBrand("Ecommerce Data Engine and Seller Tool Suite"),
    description:
      "Free market-specific calculators in SellerLab Suite, powered by Data EDE.",
  },
};

function HomeStructuredData() {
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.masterName,
    url: absoluteUrl("/"),
    description:
      "Data EDE provides ecommerce data infrastructure and decision tools for cross-border marketplaces.",
    inLanguage: "en",
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.masterName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.svg"),
    hasPart: {
      "@type": "Product",
      name: BRAND.suiteName,
      alternateName: BRAND.suiteDisplay,
      description:
        "SellerLab is the tool suite by Data EDE with fee calculators and operational utilities for ecommerce sellers.",
    },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${BRAND.suiteName} Tools`,
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
        name: "eBay Pricing Calculator",
        url: absoluteUrl("/ebay-pricing-calculator"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Amazon Fee Calculator",
        url: absoluteUrl("/amazon-fee-calculator"),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Amazon Pricing Calculator",
        url: absoluteUrl("/amazon-pricing-calculator"),
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "TikTok Shop Fee Calculator",
        url: absoluteUrl("/tiktok-shop-fee-calculator"),
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "TikTok Shop Pricing Calculator",
        url: absoluteUrl("/tiktok-shop-pricing-calculator"),
      },
      {
        "@type": "ListItem",
        position: 7,
        name: "Shopify Cost Calculator",
        url: absoluteUrl("/shopify-fee-calculator"),
      },
      {
        "@type": "ListItem",
        position: 8,
        name: "eBay Title Optimizer",
        url: absoluteUrl("/ebay-title-optimizer"),
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
  const featuredBlogEntry = getFeaturedBlogEntry();
  const latestBlogEntries = getLatestBlogEntries(4).filter(
    (entry) => entry.slug !== featuredBlogEntry?.slug,
  ).slice(0, 3);

  return (
    <>
      <HomeStructuredData />
      <HomePageClient
        featuredBlogEntry={featuredBlogEntry}
        latestBlogEntries={latestBlogEntries}
      />
    </>
  );
}
