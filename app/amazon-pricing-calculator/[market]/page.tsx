import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AmazonPricingCalculator from "../amazon-pricing-calculator";
import {
  AMAZON_PRICING_MARKET_IDS,
  shouldIndexPricingMarket,
} from "../pricing-config";
import { getPricingMarketContent } from "../market-content";
import {
  type AmazonMarketId,
  type AmazonMarketConfig,
} from "../../amazon-fee-calculator/amazon-config";
import {
  AMAZON_MARKETS,
  AMAZON_MARKET_LIST,
} from "../../amazon-fee-calculator/markets";
import { FlagIcon } from "../../components/country-flags";
import {
  MarketStructuredData,
  MarketFeeTable,
  MarketFAQ,
} from "../../amazon-fee-calculator/seo-content";
import { FAQSection, faqAnswerToText } from "../../components/faq-section";
import { ExpandableText } from "../../components/expandable-text";
import { absoluteUrl } from "@/lib/site-url";
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

  const meta = buildFeeMetadata({
    title: `Amazon Pricing Calculator \u2013 ${config.fullName}`,
    description: `Back-solve Amazon listing price for ${config.fullName}. Enter product cost, shipping, FBA dimensions, and target profit to find the minimum profitable listing price after all Amazon fees.`,
    canonicalPath: `/amazon-pricing-calculator/${config.id}`,
    keywords: [
      `amazon pricing calculator ${config.fullName}`,
      `amazon listing price calculator ${config.fullName}`,
      `${config.domain} target profit calculator`,
      `amazon selling price calculator ${config.fullName}`,
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

  if (!shouldIndexPricingMarket(config.id)) {
    meta.robots = { index: false, follow: true };
  }

  return meta;
}

function PricingStructuredData({
  config,
}: {
  config: AmazonMarketConfig;
}) {
  const content = getPricingMarketContent(config.id);
  if (!content?.faqs.length) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerToText(item.a),
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Amazon Pricing Calculator",
        item: absoluteUrl("/amazon-pricing-calculator"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Amazon ${config.fullName}`,
        item: absoluteUrl(`/amazon-pricing-calculator/${config.id}`),
      },
    ],
  };

  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
  });

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Amazon ${config.fullName} Pricing Calculator (${seoYear})`,
    url: absoluteUrl(`/amazon-pricing-calculator/${config.id}`),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: config.currency.code,
    },
    dateModified: lastReviewed,
    description: `Back-solve Amazon listing price for ${config.fullName}. Enter costs, FBA dimensions, and target profit to find the minimum profitable listing price.`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([breadcrumb, webApp, faqSchema]),
      }}
    />
  );
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
  const content = getPricingMarketContent(config.id);

  return (
    <div className="container">
      <PricingStructuredData config={config} />

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

      {content && (
        <section
          className="card"
          style={{ padding: 24, marginBottom: 16 }}
        >
          <ExpandableText lines={2}>
            <p
              className="muted"
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {content.overview}
            </p>
          </ExpandableText>
        </section>
      )}

      <AmazonPricingCalculator marketId={market as AmazonMarketId} />

      {content && content.insights.length > 0 && (
        <section className="card" style={{ padding: 24, marginTop: 16 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            Pricing Insights for Amazon {config.fullName}
          </h2>
          {content.insights.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom:
                  i < content.insights.length - 1 ? 20 : 0,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginTop: 0,
                  marginBottom: 8,
                }}
              >
                {item.title}
              </h3>
              <p
                className="muted"
                style={{
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <a
              className="btn"
              href={content.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.sourceLabel}
            </a>
          </div>
        </section>
      )}

      <div className="grid" style={{ gap: 16, marginTop: 16 }}>
        <MarketFeeTable config={config} />
      </div>

      {content && content.faqs.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <FAQSection items={content.faqs} />
        </div>
      )}

      {(!content || content.faqs.length === 0) && (
        <div style={{ marginTop: 16 }}>
          <MarketFAQ config={config} />
        </div>
      )}

      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 12,
          }}
        >
          Compare With Other Amazon Markets
        </h2>
        <p
          className="muted"
          style={{
            fontSize: 13,
            marginTop: 0,
            marginBottom: 14,
            lineHeight: 1.6,
          }}
        >
          The same product can require a very different listing price
          across Amazon marketplaces due to currency, referral rates, FBA
          costs, and tax structures. Compare your results:
        </p>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {AMAZON_MARKET_LIST.filter((m) => m.id !== config.id)
            .slice(0, 8)
            .map((m) => (
              <Link
                key={m.id}
                href={`/amazon-pricing-calculator/${m.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <FlagIcon code={m.id} size={16} />
                {m.name} ({m.currency.code})
              </Link>
            ))}
          <Link
            href="/amazon-pricing-calculator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid var(--color-primary)",
              color: "var(--color-primary)",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
          >
            All 17 Markets →
          </Link>
        </div>
      </section>
    </div>
  );
}
