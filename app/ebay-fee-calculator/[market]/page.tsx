import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EbayFeeCalculator from "../ebay-fee-calculator";
import { type MarketId, MARKET_LIST, getMarket } from "../market-config";
import {
  MarketBreadcrumb,
  MarketFAQ,
  MarketFeeExplanation,
  MarketFeeTable,
  MarketStructuredData,
} from "../seo-content";

export function generateStaticParams() {
  return MARKET_LIST.map(m => ({ market: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const config = getMarket(market);
  if (!config) return {};

  const title = config.seo.title;
  const description = config.seo.description;

  return {
    title,
    description,
    keywords: [
      `ebay ${config.name} fees`,
      `ebay ${config.fullName} fee calculator`,
      `${config.siteName} seller fees`,
      "final value fee",
      "ebay profit calculator",
      "ebay selling fees",
      config.fullName,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "SellerLab",
      url: `/ebay-fee-calculator/${config.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/ebay-fee-calculator/${config.id}`,
    },
  };
}

export default async function EbayFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getMarket(market);
  if (!config) notFound();

  return (
    <div className="container">
      <MarketStructuredData config={config} />
      <MarketBreadcrumb config={config} />

      <EbayFeeCalculator marketId={market as MarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}
