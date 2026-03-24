import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AmazonFeeCalculator from "../amazon-fee-calculator";
import type { AmazonMarketId } from "../amazon-config";
import { AMAZON_MARKET_LIST, getAmazonMarket } from "../markets";
import {
  MarketBreadcrumb,
  MarketFAQ,
  MarketFeeExplanation,
  MarketFeeTable,
  MarketStructuredData,
} from "../seo-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return AMAZON_MARKET_LIST.map(m => ({ market: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const config = getAmazonMarket(market);
  if (!config) return {};

  const title = config.seo.title;
  const description = config.seo.description;

  return {
    title,
    description,
    keywords: [
      `amazon ${config.name} fees`,
      `amazon ${config.fullName} fee calculator`,
      "amazon referral fee",
      "fba fee calculator",
      "amazon profit calculator",
      "amazon selling fees",
      "fba fulfillment fee",
      config.fullName,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Data EDE",
      url: `/amazon-fee-calculator/${config.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/amazon-fee-calculator/${config.id}`,
    },
  };
}

export default async function AmazonFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getAmazonMarket(market);
  if (!config) notFound();

  return (
    <div className="container">
      <MarketStructuredData config={config} />
      <MarketBreadcrumb config={config} />

      <AmazonFeeCalculator marketId={market as AmazonMarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}

