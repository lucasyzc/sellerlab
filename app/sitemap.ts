import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { FEE_SEO_LAST_REVIEWED } from "@/lib/fee-seo";
import { COMPARE_ENTRIES } from "./compare/data";
import { UPDATE_ENTRIES } from "./updates/data";

export const dynamic = "force-static";
const BASE_URL = SITE_URL;

const EBAY_MARKETS = ["us", "uk", "de", "au", "ca", "fr", "it"];
const EBAY_PRICING_MARKETS = ["us", "uk", "de", "au", "ca", "fr", "it"];
const AMAZON_MARKETS = [
  "us", "uk", "de", "jp", "ca", "it", "es", "au",
  "ae", "br", "sg", "mx", "nl", "be", "se", "pl", "tr",
];
const TIKTOK_MARKETS = ["us", "uk", "vn", "th", "sg", "my", "id", "ph"];
const SHOPIFY_MARKETS = ["us", "ca", "au", "sg", "jp", "eu", "uk", "ch"];
const WALMART_MARKETS = ["us", "ca", "mx", "cl"];
const CORE_LAST_MODIFIED = new Date("2026-03-26");
const FEE_LAST_MODIFIED = new Date(FEE_SEO_LAST_REVIEWED);
const CONTENT_LAST_MODIFIED = new Date("2026-03-22");
const LEGAL_LAST_MODIFIED = new Date("2026-03-18");
const GLOSSARY_LAST_MODIFIED = new Date("2026-03-27");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: CORE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/ebay-fee-calculator`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ebay-pricing-calculator`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/amazon-fee-calculator`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tiktok-shop-fee-calculator`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/shopify-fee-calculator`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/walmart-fee-calculator`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ebay-title-optimizer`,
      lastModified: CORE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/updates`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/glossary`,
      lastModified: GLOSSARY_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: CORE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: CORE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: LEGAL_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const ebayMarketPages: MetadataRoute.Sitemap = EBAY_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/ebay-fee-calculator/${market}`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const ebayPricingMarketPages: MetadataRoute.Sitemap = EBAY_PRICING_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/ebay-pricing-calculator/${market}`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const amazonMarketPages: MetadataRoute.Sitemap = AMAZON_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/amazon-fee-calculator/${market}`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const tiktokMarketPages: MetadataRoute.Sitemap = TIKTOK_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/tiktok-shop-fee-calculator/${market}`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const shopifyMarketPages: MetadataRoute.Sitemap = SHOPIFY_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/shopify-fee-calculator/${market}`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const walmartMarketPages: MetadataRoute.Sitemap = WALMART_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/walmart-fee-calculator/${market}`,
      lastModified: FEE_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const comparePages: MetadataRoute.Sitemap = COMPARE_ENTRIES.map((entry) => ({
    url: `${BASE_URL}/compare/${entry.slug}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const updatePages: MetadataRoute.Sitemap = UPDATE_ENTRIES.map((entry) => ({
    url: `${BASE_URL}/updates/${entry.slug}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...ebayMarketPages,
    ...ebayPricingMarketPages,
    ...amazonMarketPages,
    ...tiktokMarketPages,
    ...shopifyMarketPages,
    ...walmartMarketPages,
    ...comparePages,
    ...updatePages,
  ];
}
