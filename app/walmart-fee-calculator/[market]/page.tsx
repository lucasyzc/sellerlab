import type { Metadata } from "next";
import Link from "next/link";
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
import {
  buildFeeMetadata,
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
} from "@/lib/fee-seo";

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
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });

  return buildFeeMetadata({
    title,
    description,
    canonicalPath: `/walmart-fee-calculator/${config.id}`,
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
    year: seoYear,
    lastReviewed,
    yearKeywordPhrases: [
      `walmart ${config.fullName} fees ${seoYear}`,
      `walmart referral fee ${seoYear}`,
      `walmart wfs fee ${seoYear}`,
    ],
    twitterCard: "summary_large_image",
  });
}

export default async function WalmartFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getWalmartMarket(market);
  if (!config) notFound();

  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });

  return (
    <div className="container">
      <MarketStructuredData config={config} />
      <MarketBreadcrumb config={config} />

      <section className="card" style={{ padding: "10px 14px", marginBottom: 12 }}>
        <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
          {lastReviewedLabel(lastReviewed)}. For cross-platform policy tracking{" "}
          <Link href="/updates">browse the Seller blog</Link>.
        </p>
      </section>

      <WalmartFeeCalculator marketId={market as WalmartMarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}
