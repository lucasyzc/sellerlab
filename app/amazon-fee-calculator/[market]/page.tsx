import type { Metadata } from "next";
import Link from "next/link";
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
import {
  buildFeeMetadata,
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
} from "@/lib/fee-seo";

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
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  return buildFeeMetadata({
    title,
    description,
    canonicalPath: `/amazon-fee-calculator/${config.id}`,
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
    year: seoYear,
    lastReviewed,
    yearKeywordPhrases: [
      `amazon ${config.fullName} fees ${seoYear}`,
      `amazon ${config.name} fee calculator ${seoYear}`,
      `amazon referral fee ${seoYear}`,
    ],
    twitterCard: "summary_large_image",
  });
}

export default async function AmazonFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getAmazonMarket(market);
  if (!config) notFound();
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  return (
    <div className="container">
      <MarketStructuredData config={config} />
      <MarketBreadcrumb config={config} />

      <section className="card" style={{ padding: "10px 14px", marginBottom: 12 }}>
        <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
          {lastReviewedLabel(lastReviewed)}. Need policy context?{" "}
          <Link href="/updates/amazon-fee-changes-2026-q2">Read the 2026 Amazon update deep dive</Link>.
        </p>
      </section>

      <AmazonFeeCalculator marketId={market as AmazonMarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}

