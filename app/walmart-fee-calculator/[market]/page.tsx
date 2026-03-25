import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WalmartFeeCalculator from "../walmart-fee-calculator";
import type { WalmartMarketId } from "../walmart-config";
import { WALMART_MARKET_LIST, getWalmartMarket } from "../markets";
import {
  MarketBreadcrumb,
  MarketFAQ,
  MarketFeeExplanation,
  MarketFeeTable,
  MarketStructuredData,
} from "../seo-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return WALMART_MARKET_LIST.map((market) => ({ market: market.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const config = getWalmartMarket(market);
  if (!config) return {};

  const title = config.seo.title;
  const description = config.seo.description;

  return {
    title,
    description,
    keywords: [
      `walmart fee calculator ${config.id}`,
      "walmart referral fee calculator",
      "walmart wfs fee calculator",
      "walmart seller profit calculator",
      `walmart ${config.fullName.toLowerCase()} marketplace fees`,
      "walmart marketplace fees",
      "walmart vs amazon fees",
      config.fullName,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Data EDE",
      url: `/walmart-fee-calculator/${config.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/walmart-fee-calculator/${config.id}`,
    },
  };
}

export default async function WalmartFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getWalmartMarket(market);
  if (!config) notFound();

  return (
    <div className="container">
      <MarketStructuredData config={config} />
      <MarketBreadcrumb config={config} />

      <WalmartFeeCalculator marketId={market as WalmartMarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}
