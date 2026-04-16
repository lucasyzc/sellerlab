import type { Metadata } from "next";
import Link from "next/link";
import { TIKTOK_MARKET_LIST } from "./tiktok-config";
import { FlagIcon } from "../components/country-flags";
import { FAQSection, faqAnswerToText } from "../components/faq-section";
import { absoluteUrl } from "@/lib/site-url";
import { withSuiteBrand } from "@/lib/brand";
import {
  buildFeeMetadata,
  FEE_SEO_LAST_REVIEWED,
  FEE_SEO_YEAR,
  lastReviewedLabel,
  withSeoYear,
} from "@/lib/fee-seo";

const HUB_LAST_REVIEWED = FEE_SEO_LAST_REVIEWED;
const TOOL_TITLE = withSuiteBrand(
  withSeoYear("TikTok Shop Fee Calculator – Multi-Market", FEE_SEO_YEAR),
);

export const metadata: Metadata = buildFeeMetadata({
  title: TOOL_TITLE,
  description:
    "Free TikTok Shop fee calculator covering UK, US, Vietnam, Thailand, Singapore, Malaysia, Indonesia, and Philippines with market-specific fee models.",
  canonicalPath: "/tiktok-shop-fee-calculator",
  keywords: [
    "tiktok shop fee calculator",
    "tiktok shop seller fees",
    "tiktok shop profit calculator",
    "tiktok shop commission",
    "tiktok shop tax calculator",
    "tiktok shop marketplace fees",
  ],
  yearKeywordPhrases: [
    "tiktok shop fee calculator 2026",
    "tiktok shop seller fees 2026",
    "tiktok shop commission 2026",
  ],
  lastReviewed: HUB_LAST_REVIEWED,
  openGraphDescription:
    "Estimate TikTok Shop marketplace fees, taxes, creator commissions, logistics costs, and profit across supported TikTok Shop markets.",
  twitterDescription:
    "Calculate TikTok Shop fees, tax impact, and net profit for multiple markets.",
  twitterCard: "summary",
});

const FAQ_ITEMS = [
  {
    q: "Which TikTok Shop markets are supported?",
    a: {
      intro: "This calculator supports eight TikTok Shop markets, each with its own fee model and tax treatment.",
      points: [
        "Full public fee data: United States, United Kingdom, Vietnam, and Thailand \u2014 rates are sourced directly from official TikTok Shop documentation.",
        "Manual-input markets: Singapore, Malaysia, Indonesia, and Philippines \u2014 fee categories are known but live numeric rates are only visible inside Seller Center, so you enter your current rates directly.",
      ],
      conclusion: "Select any market from the cards above to open its dedicated calculator with localized fee rules and tax handling.",
    },
  },
  {
    q: "Are all markets equally precise?",
    a: "No. US, UK, Vietnam, and Thailand have the strongest official public documentation, so the calculator uses source-backed rate tables for these markets. Singapore, Malaysia, Indonesia, and Philippines publish fee category structures publicly but keep live numeric rates inside Seller Center dashboards. For those markets, the calculator provides manual fee input fields so you can enter your actual Seller Center rates and get an accurate profit breakdown rather than relying on potentially outdated published numbers.",
  },
  {
    q: "Does the calculator include tax?",
    a: "Yes. Each market includes a tax model matched to its jurisdiction \u2014 VAT for the UK, state sales tax assumptions for the US, GST for Singapore, SST for Malaysia, VAT for Thailand and Vietnam, PPN for Indonesia, and VAT for Philippines. You can toggle whether your selling price includes or excludes tax, and the calculator adjusts the fee base accordingly. This prevents the common error of overlooking how tax treatment affects your net margin.",
  },
  {
    q: "Can I override fee rates?",
    a: "Yes. Markets where official public pages do not expose stable numeric rates (such as Southeast Asian markets) provide manual fee input fields. You can enter your current TikTok Seller Center fee percentages directly, ensuring the profit calculation reflects your actual rates rather than generic estimates. This is also useful if you have negotiated custom fee rates with TikTok Shop for high-volume accounts.",
  },
  {
    q: "Is this TikTok Shop calculator updated for 2026?",
    a: "Yes. This hub is reviewed for 2026 fee schedules and market-level freshness signals. Each market page displays source-linked policy dates and last-reviewed timestamps so you can verify the recency of the fee data. When TikTok Shop announces fee changes, we update the affected market models and note the effective date.",
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
        name: "TikTok Shop Fee Calculator",
        item: absoluteUrl("/tiktok-shop-fee-calculator"),
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `TikTok Shop Fee Calculator ${FEE_SEO_YEAR}`,
    url: absoluteUrl("/tiktok-shop-fee-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: HUB_LAST_REVIEWED,
    description:
      "Free TikTok Shop calculator covering marketplace fees, taxes, creator commissions, and profit analysis across multiple markets.",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerToText(item.a) },
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

export default function TikTokFeeCalculatorHubPage() {
  return (
    <div className="container">
      <StructuredData />

      <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 0" }}>
        <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>TikTok Shop Fee Calculator</span>
      </nav>

      <section style={{ textAlign: "center", padding: "40px 0 12px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
          TikTok Shop Fee Calculator ({FEE_SEO_YEAR})
        </h1>
        <p className="muted" style={{ fontSize: 17, maxWidth: 720, margin: "0 auto", lineHeight: 1.65 }}>
          Calculate TikTok Shop marketplace fees, tax impact, creator commissions, logistics costs,
          and net profit across supported markets. Each market uses its own fee model and source notes.
        </p>
        <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 12 }}>
          {lastReviewedLabel(HUB_LAST_REVIEWED)}
        </p>
      </section>

      <section className="card" style={{ padding: 20, marginTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
          Seller Blog
        </h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 10, fontSize: 14, lineHeight: 1.65 }}>
          Use the blog library for cross-platform policy tracking, then apply your current Seller Center rates in this calculator.
        </p>
        <Link href="/updates" className="btn">
          Open the Blog
        </Link>
      </section>

      <section style={{ padding: "20px 0 8px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
          Available Markets
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {TIKTOK_MARKET_LIST.map((m) => (
            <Link
              key={m.id}
              href={`/tiktok-shop-fee-calculator/${m.id}`}
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
              <FlagIcon code={m.id} size={40} style={{ borderRadius: 4 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                  TikTok Shop {m.fullName}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 6 }}>
                  {m.domain} · {m.currency.code}
                </div>
                <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
                  {m.summary.shortFeeSummary}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 24, marginTop: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>
          How this calculator handles accuracy
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            {
              title: "Market-specific rules",
              desc: "Each market has its own currency, tax model, fee stack, and official source links.",
            },
            {
              title: "Tax-aware profit model",
              desc: "The calculator separates customer payment, tax, revenue excluding tax, TikTok fees, and seller costs.",
            },
            {
              title: "Manual fee entry when needed",
              desc: "For markets where official public docs do not expose current live percentages, you can enter your Seller Center fee rates directly.",
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
            Total Fees = Marketplace Commission + Payment/Service Fees + Affiliate Commission + Logistics Cost.
          </li>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Net Profit = Revenue − Product Cost − Tax Remitted − Total Fees.
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
          Use official TikTok Shop documentation and your Seller Center fee cards for final fee validation in each market.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn" href="https://seller-us.tiktok.com/university/essay?identity=1&role=1&knowledge_id=10002377" target="_blank" rel="noopener noreferrer">
            TikTok Shop US Seller Academy
          </a>
          <a className="btn" href="https://seller-uk.tiktok.com/university" target="_blank" rel="noopener noreferrer">
            TikTok Shop UK Seller Academy
          </a>
          <a className="btn" href="https://seller-vn.tiktok.com/university" target="_blank" rel="noopener noreferrer">
            TikTok Shop Vietnam Seller Academy
          </a>
        </div>
      </section>

      <div style={{ marginTop: 16 }}>
        <FAQSection items={FAQ_ITEMS} />
      </div>

      <section style={{ background: "linear-gradient(135deg, #010101 0%, #333333 100%)", borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center", color: "#fff", marginTop: 16, marginBottom: 8 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>
          Choose a market and calculate your margin
        </h2>
        <p style={{ fontSize: 15, opacity: 0.9, margin: "0 auto 24px", maxWidth: 520, lineHeight: 1.6 }}>
          Open any supported market to review the fee model, tax handling, official source links, and profit breakdown.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {TIKTOK_MARKET_LIST.slice(0, 4).map((market) => (
            <Link
              key={market.id}
              href={`/tiktok-shop-fee-calculator/${market.id}`}
              className="btn"
              style={{
                background: "#fff",
                color: "#010101",
                fontWeight: 700,
                padding: "12px 20px",
                fontSize: 15,
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FlagIcon code={market.id} /> {market.name}
            </Link>
          ))}
        </div>
      </section>

      <p className="muted" style={{ fontSize: 12, textAlign: "center", margin: "12px 0 0", lineHeight: 1.6 }}>
        Fee logic is based on official public TikTok Shop materials where available. For markets whose numeric rates are not public,
        use your Seller Center values for the most accurate results.
      </p>
    </div>
  );
}
