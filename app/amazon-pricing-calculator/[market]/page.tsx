import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AmazonPricingCalculator from "../amazon-pricing-calculator";
import { AMAZON_PRICING_MARKET_IDS } from "../pricing-config";
import {
  type AmazonMarketId,
  type AmazonMarketConfig,
} from "../../amazon-fee-calculator/amazon-config";
import { AMAZON_MARKETS } from "../../amazon-fee-calculator/markets";
import {
  MarketStructuredData,
  MarketFeeTable,
  MarketFAQ,
} from "../../amazon-fee-calculator/seo-content";
import {
  buildFeeMetadata,
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
} from "@/lib/fee-seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return AMAZON_PRICING_MARKET_IDS.map((id) => ({ market: id }));
}

function getConfig(market: string): AmazonMarketConfig | undefined {
  if (!AMAZON_PRICING_MARKET_IDS.includes(market as AmazonMarketId)) {
    return undefined;
  }
  return AMAZON_MARKETS[market as AmazonMarketId];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const config = getConfig(market);
  if (!config) return {};

  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
  });

  return buildFeeMetadata({
    title: `Amazon Pricing Calculator \u2013 ${config.fullName}`,
    description: `Back-solve Amazon listing price for ${config.fullName}. Enter product cost, shipping, FBA dimensions, and target profit to find the minimum profitable listing price after all Amazon fees.`,
    canonicalPath: `/amazon-pricing-calculator/${config.id}`,
    keywords: [
      `amazon pricing calculator ${config.fullName}`,
      `amazon listing price calculator ${config.fullName}`,
      `amazon.com target profit calculator`,
      "amazon selling price calculator",
      "amazon fba pricing tool",
      "amazon break even price",
    ],
    year: seoYear,
    lastReviewed,
    yearKeywordPhrases: [
      `amazon pricing calculator ${config.fullName} ${seoYear}`,
      `amazon listing price calculator ${seoYear}`,
    ],
    twitterCard: "summary_large_image",
  });
}

export default async function AmazonPricingCalculatorMarketPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  const config = getConfig(market);
  if (!config) notFound();

  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
  });

  return (
    <div className="container">
      <MarketStructuredData config={config} />

      <nav
        style={{
          fontSize: 13,
          color: "var(--color-text-tertiary)",
          padding: "8px 0 0",
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--color-text-tertiary)",
            textDecoration: "none",
          }}
        >
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link
          href="/amazon-pricing-calculator"
          style={{
            color: "var(--color-text-tertiary)",
            textDecoration: "none",
          }}
        >
          Amazon Pricing Calculator
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>
          {config.name}
        </span>
      </nav>

      <section
        className="card"
        style={{ padding: "10px 14px", marginBottom: 12 }}
      >
        <p
          className="muted"
          style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}
        >
          {lastReviewedLabel(lastReviewed)}. Need fee-side verification?{" "}
          <Link href={`/amazon-fee-calculator/${config.id}`}>
            Open the matching Amazon fee calculator
          </Link>
          .
        </p>
      </section>

      <AmazonPricingCalculator marketId={market as AmazonMarketId} />

      <div className="grid" style={{ gap: 16, marginTop: 24 }}>
        <MarketFeeTable config={config} />
        <MarketFAQ config={config} />
      </div>
    </div>
  );
}
