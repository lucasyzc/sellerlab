import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TikTokFeeCalculator from "../tiktok-fee-calculator";
import type { TikTokMarketId } from "../tiktok-config";
import { TIKTOK_MARKET_LIST, getTikTokMarket } from "../tiktok-config";
import {
  MarketBreadcrumb,
  MarketFAQ,
  MarketFeeExplanation,
  MarketFeeTable,
  MarketStructuredData,
} from "../seo-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return TIKTOK_MARKET_LIST.map(m => ({ market: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const config = getTikTokMarket(market);
  if (!config) return {};

  const title = config.seo.title;
  const description = config.seo.description;

  return {
    title,
    description,
    keywords: [
      `tiktok shop ${config.name} fees`,
      `tiktok shop ${config.fullName} fee calculator`,
      "tiktok shop referral fee",
      "tiktok shop profit calculator",
      "tiktok shop selling fees",
      "fbt fulfillment fee",
      "tiktok shop affiliate commission",
      config.fullName,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Data EDE",
      url: `/tiktok-shop-fee-calculator/${config.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/tiktok-shop-fee-calculator/${config.id}`,
    },
  };
}

export default async function TikTokFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getTikTokMarket(market);
  if (!config) notFound();

  return (
    <div className="container">
      <MarketStructuredData config={config} />
      <MarketBreadcrumb config={config} />

      <TikTokFeeCalculator key={config.id} marketId={market as TikTokMarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}

