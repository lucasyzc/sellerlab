import Link from "next/link";
import { type ShopifyMarketConfig } from "./shopify-config";
import { FlagIcon } from "../components/country-flags";
import { absoluteUrl } from "@/lib/site-url";

function faqItems(config: ShopifyMarketConfig) {
  return [
    {
      q: `Which Shopify fees are included for ${config.fullName}?`,
      a: `${config.summary.shortFeeSummary} The calculator also lets you model monthly app and operational overhead per order.`,
    },
    {
      q: "How are subscription fees handled in the calculator?",
      a: "Plan subscription cost is converted to per-order cost using your monthly order volume. You can switch between monthly billing and yearly-billed monthly equivalents.",
    },
    {
      q: "What changes when I do not use Shopify Payments?",
      a: `${config.summary.paymentSummary} You can enter your third-party processor percentage and fixed fee to reflect your real gateway costs.`,
    },
    {
      q: `How does this calculator handle ${config.tax.name} in ${config.fullName}?`,
      a: `${config.summary.taxSummary} ${config.tax.helpText}`,
    },
  ];
}

export function MarketStructuredData({ config }: { config: ShopifyMarketConfig }) {
  const url = `/shopify-fee-calculator/${config.id}`;
  const faq = faqItems(config);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Shopify Cost Calculator", item: absoluteUrl("/shopify-fee-calculator") },
              { "@type": "ListItem", position: 3, name: config.seo.h1, item: absoluteUrl(url) },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: config.seo.h1,
            url: absoluteUrl(url),
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: config.currency.code },
            description: config.seo.description,
            featureList: [
              "Shopify subscription allocation by order volume",
              "Shopify Payments fee calculation by plan",
              "Third-party processor and Shopify transaction fee modeling",
              "App and operational cost allocation",
              "Net profit and margin analysis",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          },
        ]),
      }}
    />
  );
}

export function MarketBreadcrumb({ config }: { config: ShopifyMarketConfig }) {
  return (
    <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 12px" }}>
      <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        Home
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <Link href="/shopify-fee-calculator" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        Shopify Cost Calculator
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <span style={{ color: "var(--color-text-secondary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <FlagIcon code={config.id} size={16} /> Shopify {config.fullName}
      </span>
    </nav>
  );
}

const TH_STYLE: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

export function MarketFeeTable({ config }: { config: ShopifyMarketConfig }) {
  return (
    <section className="card" style={{ padding: 24, overflowX: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <FlagIcon code={config.id} size={22} /> Shopify {config.fullName} Plan Fee Model
        </span>
      </h2>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>
        Compare monthly subscription costs, Shopify Payments online card rates, and third-party transaction fees by plan.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            <th style={TH_STYLE}>Plan</th>
            <th style={TH_STYLE}>Monthly Billing</th>
            <th style={TH_STYLE}>Yearly Billing (per month)</th>
            <th style={TH_STYLE}>Shopify Payments</th>
            <th style={TH_STYLE}>Third-party Transaction Fee</th>
          </tr>
        </thead>
        <tbody>
          {config.plans.map((plan, index) => (
            <tr key={plan.value} style={{ borderBottom: index < config.plans.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{plan.label}</td>
              <td style={{ padding: "10px 12px" }}>
                {config.currency.symbol}
                {plan.subscriptionByCycle.monthly.toFixed(config.currency.decimals)}
              </td>
              <td style={{ padding: "10px 12px" }}>
                {config.currency.symbol}
                {plan.subscriptionByCycle.yearly.toFixed(config.currency.decimals)}
              </td>
              <td style={{ padding: "10px 12px" }}>
                {plan.shopifyPaymentsRate.toFixed(2)}% + {config.currency.symbol}
                {plan.shopifyPaymentsFixedFee.toFixed(config.currency.decimals)}
              </td>
              <td style={{ padding: "10px 12px" }}>{plan.thirdPartyTransactionRate.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function MarketFeeExplanation({ config }: { config: ShopifyMarketConfig }) {
  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
        Understanding Shopify {config.fullName} Cost Structure
      </h2>
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>Subscription + overhead allocation</h3>
          <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            {config.summary.subscriptionSummary}
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>Payment and transaction fees</h3>
          <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            {config.summary.paymentSummary}
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>{config.tax.name} handling</h3>
          <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            {config.summary.taxSummary}
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>Profit model formula</h3>
          <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            Net profit = gross revenue charged - platform fees - direct costs - tax remitted.
            Platform fees include payment processing, Shopify transaction fee (if applicable), subscription allocation,
            app allocation, operational allocation, and market-configured tax on Shopify fees.
          </p>
        </div>
      </div>
      <p className="muted" style={{ fontSize: 12, marginTop: 16, marginBottom: 0 }}>
        {config.summary.disclaimer}
      </p>
    </section>
  );
}

export function MarketFAQ({ config }: { config: ShopifyMarketConfig }) {
  const faqs = faqItems(config);

  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: "grid", gap: 0 }}>
        {faqs.map((item, i) => (
          <details
            key={i}
            style={{
              borderBottom: i < faqs.length - 1 ? "1px solid var(--color-border)" : "none",
              padding: "14px 0",
            }}
          >
            <summary
              style={{
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                padding: "2px 0",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              {item.q}
              <span style={{ fontSize: 18, color: "var(--color-text-tertiary)", flexShrink: 0 }}>+</span>
            </summary>
            <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 14, lineHeight: 1.7 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
