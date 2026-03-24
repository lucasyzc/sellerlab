import type { Metadata } from "next";
import Link from "next/link";
import { TIKTOK_MARKET_LIST } from "./tiktok-config";
import { FlagIcon } from "../components/country-flags";
import { absoluteUrl } from "@/lib/site-url";
import { withSuiteBrand } from "@/lib/brand";

const TOOL_TITLE = withSuiteBrand("TikTok Shop Fee Calculator – Multi-Market");

export const metadata: Metadata = {
  title: TOOL_TITLE,
  description:
    "Free TikTok Shop fee calculator covering UK, US, Vietnam, Thailand, Singapore, Malaysia, Indonesia, and Philippines with market-specific fee models.",
  keywords: [
    "tiktok shop fee calculator",
    "tiktok shop seller fees",
    "tiktok shop profit calculator",
    "tiktok shop commission",
    "tiktok shop tax calculator",
    "tiktok shop marketplace fees",
  ],
  openGraph: {
    title: TOOL_TITLE,
    description:
      "Estimate TikTok Shop marketplace fees, taxes, creator commissions, logistics costs, and profit across supported TikTok Shop markets.",
    type: "website",
    siteName: "Data EDE",
    url: "/tiktok-shop-fee-calculator",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: TOOL_TITLE,
    description:
      "Calculate TikTok Shop fees, tax impact, and net profit for multiple markets.",
  },
  alternates: {
    canonical: "/tiktok-shop-fee-calculator",
  },
};

const FAQ_ITEMS = [
  {
    q: "Which TikTok Shop markets are supported?",
    a: "This calculator currently supports United States, United Kingdom, Vietnam, Thailand, Singapore, Malaysia, Indonesia, and Philippines. Some markets have fully public fee schedules, while others require manual entry of Seller Center rates.",
  },
  {
    q: "Are all markets equally precise?",
    a: "No. UK, US, Vietnam, and Thailand have stronger official public documentation. Singapore, Malaysia, Indonesia, and Philippines often expose fee categories publicly but keep live numeric rates inside Seller Center, so those markets use manual fee inputs for accuracy.",
  },
  {
    q: "Does the calculator include tax?",
    a: "Yes. Each market includes a tax model such as VAT, GST, SST, or sales-tax assumptions, and you can change whether your selling price includes tax.",
  },
  {
    q: "Can I override fee rates?",
    a: "Yes. Markets whose official public pages do not expose stable numeric rates let you input your current TikTok Seller Center fee percentages directly.",
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
    "@type": "WebApplication",
    name: "TikTok Shop Fee Calculator",
    url: absoluteUrl("/tiktok-shop-fee-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free TikTok Shop calculator covering marketplace fees, taxes, creator commissions, and profit analysis across multiple markets.",
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
          TikTok Shop Fee Calculator
        </h1>
        <p className="muted" style={{ fontSize: 17, maxWidth: 720, margin: "0 auto", lineHeight: 1.65 }}>
          Calculate TikTok Shop marketplace fees, tax impact, creator commissions, logistics costs,
          and net profit across supported markets. Each market uses its own fee model and source notes.
        </p>
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


