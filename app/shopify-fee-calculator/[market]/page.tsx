import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopifyFeeCalculator from "../shopify-fee-calculator";
import type { ShopifyMarketId } from "../shopify-config";
import { getShopifyMarket, SHOPIFY_MARKET_LIST } from "../shopify-config";
import {
  MarketBreadcrumb,
  MarketFAQ,
  MarketFeeExplanation,
  MarketFeeTable,
  MarketStructuredData,
} from "../seo-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return SHOPIFY_MARKET_LIST.map((market) => ({ market: market.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const config = getShopifyMarket(market);
  if (!config) return {};

  const title = config.seo.title;
  const description = config.seo.description;

  return {
    title,
    description,
    keywords: [
      `shopify ${config.name} cost calculator`,
      `shopify ${config.fullName} fees`,
      `shopify fees ${config.fullName}`,
      `${config.fullName} shopify fees`,
      "shopify payments fee calculator",
      "shopify transaction fee calculator",
      "shopify profit calculator",
      "shopify subscription cost",
      "shopify third-party transaction fee",
      config.fullName,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Data EDE",
      url: `/shopify-fee-calculator/${config.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/shopify-fee-calculator/${config.id}`,
    },
  };
}

export default async function ShopifyFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getShopifyMarket(market);
  if (!config) notFound();

  return (
    <div className="container">
      <MarketStructuredData config={config} />
      <MarketBreadcrumb config={config} />

      <ShopifyFeeCalculator key={config.id} marketId={market as ShopifyMarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}

