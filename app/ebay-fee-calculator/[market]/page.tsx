import type { Metadata } from "next";
import Link from "next/link";
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
import {
  buildFeeMetadata,
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
} from "@/lib/fee-seo";

export const dynamicParams = false;

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
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  return buildFeeMetadata({
    title,
    description,
    canonicalPath: `/ebay-fee-calculator/${config.id}`,
    keywords: [
      `ebay ${config.name} fees`,
      `ebay ${config.fullName} fee calculator`,
      `${config.siteName} seller fees`,
      "final value fee",
      "ebay profit calculator",
      "ebay selling fees",
      config.fullName,
    ],
    year: seoYear,
    lastReviewed,
    yearKeywordPhrases: [
      `ebay ${config.fullName} fees ${seoYear}`,
      `ebay final value fee ${seoYear}`,
      `${config.siteName} fee calculator ${seoYear}`,
    ],
    twitterCard: "summary_large_image",
  });
}

export default async function EbayFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getMarket(market);
  if (!config) notFound();
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  return (
    <div className="container">
      <MarketStructuredData config={config} />
      <MarketBreadcrumb config={config} />

      <section className="card" style={{ padding: "10px 14px", marginBottom: 12 }}>
        <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
          {lastReviewedLabel(lastReviewed)}. Need policy context?{" "}
          <Link href="/updates/ebay-fee-changes-2026-q2">Read the 2026 eBay update deep dive</Link>.
        </p>
      </section>

      <EbayFeeCalculator marketId={market as MarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}

