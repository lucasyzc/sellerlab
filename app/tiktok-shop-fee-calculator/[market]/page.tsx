import type { Metadata } from "next";
import Link from "next/link";
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
import {
  buildFeeMetadata,
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
} from "@/lib/fee-seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return TIKTOK_MARKET_LIST.map((m) => ({ market: m.id }));
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
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });

  return buildFeeMetadata({
    title,
    description,
    canonicalPath: `/tiktok-shop-fee-calculator/${config.id}`,
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
    year: seoYear,
    lastReviewed,
    yearKeywordPhrases: [
      `tiktok shop ${config.fullName} fees ${seoYear}`,
      `tiktok shop commission ${seoYear}`,
      `tiktok shop profit calculator ${seoYear}`,
    ],
    twitterCard: "summary_large_image",
  });
}

export default async function TikTokFeeCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getTikTokMarket(market);
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
          {lastReviewedLabel(lastReviewed)}. For broader fee policy context, <Link href="/updates">browse the blog</Link>.
        </p>
      </section>

      <TikTokFeeCalculator key={config.id} marketId={market as TikTokMarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFeeExplanation config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}
