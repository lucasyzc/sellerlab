import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EbayPricingCalculator from "../ebay-pricing-calculator";
import { type MarketId, MARKET_LIST, getMarket } from "../../ebay-fee-calculator/market-config";
import {
  buildFeeMetadata,
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
} from "@/lib/fee-seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return MARKET_LIST.map((m) => ({ market: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ market: string }>;
}): Promise<Metadata> {
  const { market } = await params;
  const config = getMarket(market);
  if (!config) return {};

  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  return buildFeeMetadata({
    title: `eBay Pricing Calculator - ${config.fullName}`,
    description:
      `Back-solve eBay listing price for ${config.fullName}. Enter cost, shipping, discount, and target profit to find the minimum profitable listing price.`,
    canonicalPath: `/ebay-pricing-calculator/${config.id}`,
    keywords: [
      `ebay pricing calculator ${config.fullName}`,
      `ebay listing price calculator ${config.fullName}`,
      `${config.siteName} target profit calculator`,
      "ebay target margin calculator",
      "ebay selling price calculator",
    ],
    year: seoYear,
    lastReviewed,
    yearKeywordPhrases: [
      `ebay pricing calculator ${config.fullName} ${seoYear}`,
      `${config.siteName} listing price calculator ${seoYear}`,
    ],
    twitterCard: "summary_large_image",
  });
}

export default async function EbayPricingCalculatorMarketPage({
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
      <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 0" }}>
        <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link
          href="/ebay-pricing-calculator"
          style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}
        >
          eBay Pricing Calculator
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>{config.name}</span>
      </nav>

      <section className="card" style={{ padding: "10px 14px", marginBottom: 12 }}>
        <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.6 }}>
          {lastReviewedLabel(lastReviewed)}. Need fee-side verification?{" "}
          <Link href={`/ebay-fee-calculator/${config.id}`}>Open the matching eBay fee calculator</Link>.
        </p>
      </section>

      <EbayPricingCalculator marketId={market as MarketId} />
    </div>
  );
}
