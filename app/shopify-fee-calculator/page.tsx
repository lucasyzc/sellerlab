import type { Metadata } from "next";
import Link from "next/link";
import { SHOPIFY_MARKET_GROUPS } from "./shopify-config";
import { FlagIcon } from "../components/country-flags";
import { absoluteUrl } from "@/lib/site-url";
import { withSuiteBrand } from "@/lib/brand";
import { FEE_SEO_LAST_REVIEWED, lastReviewedLabel } from "@/lib/fee-seo";

const TOOL_TITLE = withSuiteBrand("Shopify Cost Calculator – Multi-Market");
const HUB_LAST_REVIEWED = FEE_SEO_LAST_REVIEWED;

export const metadata: Metadata = {
  title: TOOL_TITLE,
  description:
    "Free Shopify cost calculator with plan subscription, payment processing, third-party transaction fees, and profit analysis.",
  keywords: [
    "shopify cost calculator",
    "shopify fee calculator",
    "shopify payments fee",
    "shopify transaction fee",
    "shopify profit calculator",
    "shopify subscription cost",
  ],
  openGraph: {
    title: TOOL_TITLE,
    description:
      "Estimate Shopify plan costs, payment processing fees, third-party transaction fees, and net profit with market-specific defaults.",
    type: "website",
    siteName: "Data EDE",
    url: "/shopify-fee-calculator",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: TOOL_TITLE,
    description:
      "Estimate Shopify plan costs, payment processing fees, and per-order profit with market defaults.",
  },
  alternates: {
    canonical: "/shopify-fee-calculator",
  },
};

const FAQ_ITEMS = [
  {
    q: "What costs does this Shopify calculator include?",
    a: "It includes Shopify subscription allocation, Shopify Payments card fees, third-party transaction fees when applicable, optional app costs, operational overhead, product costs, and profit margin.",
  },
  {
    q: "Does the calculator include third-party payment gateways?",
    a: "Yes. If you disable Shopify Payments, you can enter your third-party gateway processing rate and fixed fee, and Shopify's plan-based transaction fee is added automatically.",
  },
  {
    q: "Can I model tax-inclusive and tax-exclusive pricing?",
    a: "Yes. Each market includes default tax settings and lets you switch between price-includes-tax and tax-exclusive modes, with manual tax remittance adjustment if needed.",
  },
];

function StructuredData() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shopify Cost Calculator",
        item: absoluteUrl("/shopify-fee-calculator"),
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Shopify Cost Calculator",
    url: absoluteUrl("/shopify-fee-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: HUB_LAST_REVIEWED,
    description:
      "Free Shopify calculator for subscription costs, payment fees, transaction fees, and net profit analysis.",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([breadcrumb, webApp, faq]),
      }}
    />
  );
}

export default function ShopifyFeeCalculatorHubPage() {
  return (
    <div className="container">
      <StructuredData />

      <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 0" }}>
        <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>Shopify Cost Calculator</span>
      </nav>

      <section style={{ textAlign: "center", padding: "40px 0 12px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
          Shopify Cost Calculator
        </h1>
        <p className="muted" style={{ fontSize: 17, maxWidth: 700, margin: "0 auto", lineHeight: 1.65 }}>
          Calculate Shopify plan costs, payment processing fees, third-party transaction fees,
          and per-order profitability with a detailed fee and cost breakdown.
        </p>
        <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 12 }}>
          {lastReviewedLabel(HUB_LAST_REVIEWED)}
        </p>
      </section>

      <section style={{ padding: "20px 0 8px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
          Available Markets
        </h2>
        <div style={{ display: "grid", gap: 16 }}>
          {SHOPIFY_MARKET_GROUPS.map((group) => (
            <div key={group.region}>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-tertiary)" }}>
                {group.label}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {group.markets.map((market) => (
                  <Link
                    key={market.id}
                    href={`/shopify-fee-calculator/${market.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                      padding: "18px 16px",
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      transition: "all 0.2s ease",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <FlagIcon code={market.id} size={40} style={{ borderRadius: 4 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                        Shopify {market.fullName}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 6 }}>
                        {market.domain} · {market.currency.code}
                      </div>
                      <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
                        {market.summary.shortFeeSummary}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 24, marginTop: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>
          How this calculator models Shopify economics
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            {
              title: "Plan-aware fee model",
              desc: "Basic, Shopify (Grow), and Advanced plans include their own card rates and third-party transaction fee percentages.",
            },
            {
              title: "Order-volume allocation",
              desc: "Monthly fixed costs are allocated to each order using your expected monthly order count.",
            },
            {
              title: "Market tax handling",
              desc: "Model market-level tax defaults, switch price-includes-tax on or off, and include tax remitted in net profit output.",
            },
          ].map((item) => (
            <div key={item.title}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
              <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>
          Calculation Logic
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Total Fees = Subscription Allocation + Payment Processing + Transaction Fees + App/Operating Costs.
          </li>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Net Profit = Revenue − Product Cost − Shipping Cost − Total Fees.
          </li>
          <li className="muted" style={{ lineHeight: 1.7 }}>
            Margin = Net Profit / Revenue.
          </li>
        </ul>
      </section>

      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 10 }}>
          Primary Sources
        </h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12, lineHeight: 1.7 }}>
          Confirm plan and payment assumptions with official Shopify pricing documentation for the market you sell in.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn" href="https://www.shopify.com/pricing" target="_blank" rel="noopener noreferrer">
            Shopify Pricing
          </a>
          <a className="btn" href="https://www.shopify.com/payments" target="_blank" rel="noopener noreferrer">
            Shopify Payments
          </a>
          <a className="btn" href="https://help.shopify.com/en/manual/payments/third-party-providers" target="_blank" rel="noopener noreferrer">
            Third-Party Payments
          </a>
        </div>
      </section>

      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "grid", gap: 0 }}>
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={i}
              style={{
                borderBottom: i < FAQ_ITEMS.length - 1 ? "1px solid var(--color-border)" : "none",
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

      <section style={{ background: "linear-gradient(135deg, #95BF47 0%, #5E8E3E 100%)", borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center", color: "#fff", marginTop: 16, marginBottom: 8 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>
          Calculate your real Shopify per-order margin
        </h2>
        <p style={{ fontSize: 15, opacity: 0.9, margin: "0 auto 24px", maxWidth: 520, lineHeight: 1.6 }}>
          Open a market calculator to model plan-level costs, payment fees, tax handling, and operating expenses in one profit view.
        </p>
        <Link
          href="/shopify-fee-calculator/us"
          className="btn"
          style={{
            background: "#fff",
            color: "#5E8E3E",
            fontWeight: 700,
            padding: "12px 28px",
            fontSize: 15,
            borderRadius: "var(--radius-sm)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FlagIcon code="US" /> US Calculator
        </Link>
      </section>
    </div>
  );
}
