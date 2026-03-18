import type { Metadata } from "next";
import Link from "next/link";
import { TIKTOK_MARKET_LIST } from "./tiktok-config";
import { FlagIcon } from "../components/country-flags";

export const metadata: Metadata = {
  title: "TikTok Shop Fee Calculator \u2013 All Marketplaces | SellerLab",
  description:
    "Free TikTok Shop fee calculator. Calculate referral fees, FBT fulfillment costs, affiliate commissions, ad spend impact, and net profit for TikTok Shop sellers.",
  keywords: [
    "tiktok shop fee calculator",
    "tiktok shop seller fees",
    "tiktok shop profit calculator",
    "tiktok shop referral fee",
    "fbt fee calculator",
    "tiktok shop commission",
    "tiktok shop selling fees 2026",
    "fulfilled by tiktok",
  ],
  openGraph: {
    title: "TikTok Shop Fee Calculator \u2013 All Marketplaces | SellerLab",
    description:
      "Calculate TikTok Shop selling fees, FBT costs, affiliate commissions, and profit. Covers 28 categories with referral fee rates and fulfillment fees.",
    type: "website",
    siteName: "SellerLab",
  },
  alternates: {
    canonical: "/tiktok-shop-fee-calculator",
  },
};

function StructuredData() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "TikTok Shop Fee Calculator",
        item: "/tiktok-shop-fee-calculator",
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TikTok Shop Fee Calculator",
    url: "/tiktok-shop-fee-calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free TikTok Shop fee calculator covering referral fees, FBT fulfillment costs, affiliate commissions, and profit analysis.",
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

const FEE_TABLE_ROWS = [
  { category: "Most Categories", rate: "6%", notes: "Standard rate, incl. payment processing" },
  { category: "Jewelry (Diamond, Gold, Jade, Platinum, Ruby/Sapphire/Emerald)", rate: "5%", notes: "Premium jewelry sub-categories" },
  { category: "Jewelry (Other)", rate: "6%", notes: "Amber, Pearl, Silver, Crystal, etc." },
  { category: "Pre-Owned", rate: "5%", notes: "3% on portion over $10K" },
  { category: "Collectibles", rate: "6%", notes: "3% on portion over $10K" },
  { category: "New Seller Promotion", rate: "3%", notes: "First 30 days after first sale" },
];

const FAQ_ITEMS = [
  {
    q: "How much does TikTok Shop charge sellers in fees?",
    a: "TikTok Shop charges a referral fee of 6% on most US categories (5% for select jewelry). In the US, payment processing is included in the referral fee \u2014 no separate processing charge. If you use FBT (Fulfilled by TikTok), per-unit fulfillment fees start at $3.58. New sellers can get a promotional 3% rate for their first 30 days.",
  },
  {
    q: "What is the difference between FBT and self-fulfillment?",
    a: "FBT (Fulfilled by TikTok) means TikTok handles picking, packing, and shipping from their warehouses. You pay a per-unit fulfillment fee ($3.58+ for single units). Self-fulfillment means you handle shipping yourself, paying your own shipping costs. Both pay the same referral fee.",
  },
  {
    q: "Are TikTok Shop fees lower than Amazon?",
    a: "TikTok Shop's referral fee (6%) is significantly lower than Amazon's typical 15%. FBT fulfillment fees are also competitive with Amazon FBA. However, TikTok Shop typically requires affiliate commissions (5\u201330%) and ad spend to drive traffic, while Amazon has built-in search intent. Total cost depends on your marketing strategy.",
  },
  {
    q: "What are affiliate commissions on TikTok Shop?",
    a: "Sellers can set commission rates for TikTok creators who promote their products. Commissions typically range from 5% to 30% of the sale price, paid from the seller's revenue. This is a key marketing cost on TikTok Shop that should be factored into your pricing strategy.",
  },
  {
    q: "How can I reduce my TikTok Shop selling costs?",
    a: "Optimize packaging to keep FBT weight under 4 lb for the lowest fee tier. Encourage multi-unit orders for volume FBT discounts. Keep sell-through rates high to stay within the 60-day free FBT storage window. Test different affiliate commission rates. Track ad spend ROI on profit, not just revenue.",
  },
  {
    q: "What happens when a customer returns a product?",
    a: "TikTok Shop refunds the referral fee on returned orders, minus a Refund Administration Fee of 20% of the original referral fee (capped at $5 per SKU since May 2025). FBT also charges a $3.00 per-order return handling fee. Factor your return rate into profitability calculations.",
  },
];

export default function TikTokFeeCalculatorHubPage() {
  return (
    <div className="container">
      <StructuredData />

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
        <span style={{ color: "var(--color-text-secondary)" }}>
          TikTok Shop Fee Calculator
        </span>
      </nav>

      <section style={{ textAlign: "center", padding: "40px 0 12px" }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            margin: "0 0 14px",
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
          }}
        >
          TikTok Shop Fee Calculator
        </h1>
        <p
          className="muted"
          style={{
            fontSize: 17,
            maxWidth: 620,
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          Calculate referral fees, FBT fulfillment costs, affiliate commissions,
          ad spend impact, and net profit for TikTok Shop sellers. Choose your
          marketplace below.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            marginTop: 28,
            flexWrap: "wrap",
          }}
        >
          {[
            { value: "28", label: "Categories" },
            { value: "6%", label: "Base Fee" },
            { value: "Free", label: "No sign-up" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "var(--color-primary)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--color-text-tertiary)",
                  marginTop: 2,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "20px 0 8px" }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            margin: "0 0 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Available Markets
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
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
              className="market-card"
            >
              <FlagIcon code={m.id} size={40} style={{ borderRadius: 4 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    marginBottom: 2,
                  }}
                >
                  TikTok Shop {m.fullName}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--color-text-tertiary)",
                    marginBottom: 6,
                  }}
                >
                  {m.domain} &middot; {m.currency.code}
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                    }}
                  >
                    FBT + Self-Fulfilled
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      background: "#f1f5f9",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {m.categories.length} Categories
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="card"
        style={{ padding: 24, overflowX: "auto", marginTop: 24 }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
          TikTok Shop US Referral Fee Rates
        </h2>
        <p
          className="muted"
          style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}
        >
          Key referral fee rates for selling on TikTok Shop US. Payment processing is included in the referral fee.
        </p>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Category
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Referral Fee
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {FEE_TABLE_ROWS.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>
                  {row.category}
                </td>
                <td style={{ padding: "10px 12px" }}>{row.rate}</td>
                <td
                  className="muted"
                  style={{ padding: "10px 12px", fontSize: 13 }}
                >
                  {row.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p
          className="muted"
          style={{ fontSize: 12, marginBottom: 0, marginTop: 14 }}
        >
          Rates are based on the official TikTok Shop fee schedule (effective April 1, 2024).
          Click any marketplace above for detailed calculations.
        </p>
      </section>

      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
          How to Use the TikTok Shop Fee Calculator
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              step: "1",
              title: "Choose your marketplace",
              desc: "Select TikTok Shop US (more markets coming soon). Each has its own fee rates and currency.",
            },
            {
              step: "2",
              title: "Enter product details",
              desc: "Input selling price, item cost, marketing costs (affiliate rate, ad spend), and for FBT: weight and dimensions.",
            },
            {
              step: "3",
              title: "Get instant results",
              desc: "See a full breakdown of referral fees, FBT fees, affiliate commissions, net profit, and margin.",
            },
          ].map((item) => (
            <div key={item.step} style={{ display: "flex", gap: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {item.step}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </div>
                <p
                  className="muted"
                  style={{
                    fontSize: 13,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
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
                borderBottom:
                  i < FAQ_ITEMS.length - 1
                    ? "1px solid var(--color-border)"
                    : "none",
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
                <span
                  style={{
                    fontSize: 18,
                    color: "var(--color-text-tertiary)",
                    flexShrink: 0,
                    transition: "transform 0.2s ease",
                  }}
                  className="faq-chevron"
                >
                  +
                </span>
              </summary>
              <p
                className="muted"
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "linear-gradient(135deg, #010101 0%, #333333 100%)",
          borderRadius: "var(--radius)",
          padding: "40px 24px",
          textAlign: "center",
          color: "#fff",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>
          Ready to calculate your TikTok Shop fees?
        </h2>
        <p
          style={{
            fontSize: 15,
            opacity: 0.9,
            margin: "0 auto 24px",
            maxWidth: 440,
            lineHeight: 1.6,
          }}
        >
          Get an instant, detailed breakdown of referral fees, FBT costs,
          affiliate commissions, and profit analysis.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/tiktok-shop-fee-calculator/us"
            className="btn"
            style={{
              background: "#fff",
              color: "#010101",
              fontWeight: 700,
              padding: "12px 28px",
              fontSize: 15,
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
            }}
          >
            <FlagIcon code="US" /> US Calculator
          </Link>
        </div>
      </section>

      <p
        className="muted"
        style={{
          fontSize: 12,
          textAlign: "center",
          margin: "12px 0 0",
          lineHeight: 1.6,
        }}
      >
        Fee rates are based on official TikTok Shop seller fee schedules. Referral
        fees, FBT fulfillment fees, and storage costs are updated regularly.
        This calculator is for estimation purposes only.
      </p>
    </div>
  );
}
