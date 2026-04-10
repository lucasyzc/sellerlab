import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TikTokPricingCalculator from "../tiktok-pricing-calculator";
import { FAQSection, faqAnswerToText } from "@/app/components/faq-section";
import { ExpandableText } from "@/app/components/expandable-text";
import { FlagIcon } from "@/app/components/country-flags";
import { absoluteUrl } from "@/lib/site-url";
import { buildFeeMetadata } from "@/lib/fee-seo";
import {
  lastReviewedLabel,
  resolveLastReviewed,
  resolveSeoYear,
  withSeoYear,
} from "@/lib/fee-seo";
import {
  getTikTokMarket,
  TIKTOK_MARKET_LIST,
  type TikTokMarketConfig,
  type TikTokMarketId,
} from "@/app/tiktok-shop-fee-calculator/tiktok-config";
import styles from "../tiktok-pricing.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return TIKTOK_MARKET_LIST.map((market) => ({ market: market.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ market: string }> }): Promise<Metadata> {
  const { market } = await params;
  const config = getTikTokMarket(market);
  if (!config) return {};

  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed, docs: config.docs });

  return buildFeeMetadata({
    title: withSeoYear(`TikTok Shop Pricing Calculator – ${config.fullName}`, seoYear),
    description: `Back-solve TikTok Shop listing price for ${config.fullName}. Enter product cost, fulfillment assumptions, and target profit to find the minimum profitable listing price after fees, affiliate costs, and ${config.tax.name}.`,
    canonicalPath: `/tiktok-shop-pricing-calculator/${config.id}`,
    keywords: [
      `tiktok shop ${config.fullName} pricing calculator`,
      `tiktok shop ${config.fullName} listing price calculator`,
      `${config.fullName} tiktok pricing`,
      `tiktok shop ${config.fullName} fees`,
      `tiktok shop ${seoYear}`,
    ],
    year: seoYear,
    lastReviewed,
    yearKeywordPhrases: [
      `tiktok shop ${config.fullName} pricing calculator ${seoYear}`,
      `${config.fullName} tiktok shop calculator ${seoYear}`,
    ],
    twitterCard: "summary_large_image",
  });
}

function buildMarketFaqItems(config: TikTokMarketConfig) {
  return [
    {
      q: `How does TikTok Shop ${config.fullName} commission impact minimum listing price?`,
      a: `${config.summary.shortFeeSummary} Even small commission changes can shift break-even materially when product margin is thin. This calculator applies market-specific fee logic so you can see the true price floor before launch.`,
    },
    {
      q: `Should sellers in ${config.fullName} choose managed fulfillment or self-ship for better margin?`,
      a: `${config.summary.fulfillmentSummary} Managed fulfillment usually improves operational consistency but can raise the required listing price; self-ship can lower platform-side fees but adds your shipping burden. Run both modes in this calculator to compare outcomes on the same SKU assumptions.`,
    },
    {
      q: `How should ${config.tax.name} be configured in TikTok Shop ${config.fullName} pricing decisions?`,
      a: `${config.summary.taxSummary} ${config.tax.helpText} This calculator lets you set tax inclusion and rate directly so your margin output reflects local storefront behavior.`,
    },
    {
      q: `Can I use this ${config.fullName} calculator if my live commission is only visible in Seller Center?`,
      a: `Yes. If your rate is contract-specific or not fully public, enter the live percentage in manual fields. That keeps your pricing model aligned with your real account terms and helps prevent underpricing caused by stale defaults.`,
    },
  ];
}

function MarketStructuredData({ config }: { config: TikTokMarketConfig }) {
  const faqItems = buildMarketFaqItems(config);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "TikTok Shop Pricing Calculator", item: absoluteUrl("/tiktok-shop-pricing-calculator") },
      { "@type": "ListItem", position: 3, name: `TikTok Shop ${config.fullName}`, item: absoluteUrl(`/tiktok-shop-pricing-calculator/${config.id}`) },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: withSeoYear(`TikTok Shop ${config.fullName} Pricing Calculator`, resolveSeoYear(config.seo.effectiveYear)),
    url: absoluteUrl(`/tiktok-shop-pricing-calculator/${config.id}`),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: config.currency.code },
    dateModified: resolveLastReviewed({ lastReviewed: config.seo.lastReviewed, docs: config.docs }),
    description: `Back-solve TikTok Shop ${config.fullName} listing price for target profit or margin using local fees and tax rules.`,
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerToText(item.a) },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, webApp, faq]) }} />;
}

function getMarketplaceOverview(config: TikTokMarketConfig) {
  const priceNote = config.tax.priceIncludesTaxByDefault ? "tax-inclusive" : "tax-exclusive";
  const docNames = config.docs.slice(0, 2).map((doc) => doc.title).join(" and ");

  return `TikTok Shop ${config.fullName} is modeled in ${config.currency.code} and assumes ${priceNote} pricing behavior by default, which directly affects margin math and fee bases. This market includes its own commission profile, fulfillment behavior, and ${config.tax.name} treatment, so reusing another country model can understate your real price floor. We combine marketplace fees, creator costs, shipping assumptions, and tax handling in one reverse-pricing workflow so you can find a defensible minimum listing price before launch. Seller-side rates can evolve by category, campaign, and account type, so this page is designed as a planning baseline anchored to ${docNames}. Use the calculator first, then confirm your live values in Seller Center before final pricing decisions.`;
}

export default async function TikTokPricingCalculatorMarketPage({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  const config = getTikTokMarket(market);
  if (!config) notFound();

  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed, docs: config.docs });
  const faqItems = buildMarketFaqItems(config);

  return (
    <div className={`container ${styles.tiktokPage}`}>
      <MarketStructuredData config={config} />

      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link href="/tiktok-shop-pricing-calculator" className={styles.breadcrumbLink}>
          TikTok Shop Pricing Calculator
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>TikTok Shop {config.fullName}</span>
      </nav>

      <section className={`card ${styles.heroCard}`}>
        <h1 className={styles.heroTitle}>{`TikTok Shop ${config.fullName} Pricing Calculator`}</h1>
        <ExpandableText lines={2}>
          <p className={styles.heroSubtitle}>{getMarketplaceOverview(config)}</p>
          <p className="muted" style={{ marginTop: 8, marginBottom: 0, fontSize: 12 }}>
            {lastReviewedLabel(lastReviewed)}
          </p>
        </ExpandableText>
      </section>

      <section className={styles.spotlight}>
        <h2 className={styles.spotlightTitle}>Start Here: Calculate Your Minimum Profitable Price</h2>
        <p className={styles.spotlightText}>
          This is the core tool on this page. Enter your costs and target margin, then compare fulfillment paths to get a practical listing-price floor for {config.fullName}.
        </p>
      </section>

      <section className={styles.calculatorStage}>
        <TikTokPricingCalculator marketId={market as TikTokMarketId} />
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 22 }}>Market Insights</h2>
        <div className="grid" style={{ gap: 14 }}>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Tax and compliance setup</h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              {config.tax.name} is prefilled at {config.tax.defaultRate.toFixed(2)}% and can be changed for your account scenario. Tax inclusion mode changes how much of buyer payment is true seller revenue, so leaving this wrong can distort margin.
            </p>
          </div>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Commission and fee profile</h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              {config.summary.shortFeeSummary} {config.summary.disclaimer}
            </p>
          </div>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Fulfillment cost behavior</h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              {config.summary.fulfillmentSummary} Always test managed and self-ship in the calculator because each SKU responds differently to weight, size, and storage duration.
            </p>
          </div>
          <div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>Traffic and creator economics</h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              Include affiliate commission and ad spend together when planning pricing, especially for creator-led launches. High conversion does not protect margin if blended acquisition cost is omitted.
            </p>
          </div>
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 22 }}>Market FAQ</h2>
        <FAQSection items={faqItems} />
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 20 }}>Compare With Other TikTok Shop Markets</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12, lineHeight: 1.65 }}>
          Compare your SKU economics across markets to avoid applying one region&apos;s assumptions to another.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TIKTOK_MARKET_LIST.filter((item) => item.id !== config.id)
            .slice(0, 7)
            .map((item) => (
              <Link
                key={item.id}
                href={`/tiktok-shop-pricing-calculator/${item.id}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid var(--color-border)",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "var(--color-text-secondary)",
                }}
              >
                <FlagIcon code={item.id} size={16} />
                {item.name} ({item.currency.code})
              </Link>
            ))}
          <Link
            href="/tiktok-shop-pricing-calculator"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid var(--color-primary)",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              color: "var(--color-primary)",
            }}
          >
            All Markets →
          </Link>
        </div>
        <p className="muted" style={{ marginTop: 12, marginBottom: 0, fontSize: 12 }}>
          Need fee-side detail? <Link href={`/tiktok-shop-fee-calculator/${config.id}`}>Open the matching TikTok Shop fee calculator</Link>.
        </p>
      </section>
    </div>
  );
}
