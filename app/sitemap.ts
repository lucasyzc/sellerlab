import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";
const BASE_URL = SITE_URL;

const EBAY_MARKETS = ["us", "uk", "de", "au", "ca", "fr", "it"];
const AMAZON_MARKETS = [
  "us", "uk", "de", "jp", "ca", "it", "es", "au",
  "ae", "br", "sg", "mx", "nl", "be", "se", "pl", "tr",
];
const TIKTOK_MARKETS = ["us", "uk", "vn", "th", "sg", "my", "id", "ph"];
const SHOPIFY_MARKETS = ["us", "ca", "au", "sg", "jp", "eu", "uk", "ch"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/ebay-fee-calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/amazon-fee-calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tiktok-shop-fee-calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/shopify-fee-calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const ebayMarketPages: MetadataRoute.Sitemap = EBAY_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/ebay-fee-calculator/${market}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const amazonMarketPages: MetadataRoute.Sitemap = AMAZON_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/amazon-fee-calculator/${market}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const tiktokMarketPages: MetadataRoute.Sitemap = TIKTOK_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/tiktok-shop-fee-calculator/${market}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  const shopifyMarketPages: MetadataRoute.Sitemap = SHOPIFY_MARKETS.map(
    (market) => ({
      url: `${BASE_URL}/shopify-fee-calculator/${market}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...ebayMarketPages, ...amazonMarketPages, ...tiktokMarketPages, ...shopifyMarketPages];
}
