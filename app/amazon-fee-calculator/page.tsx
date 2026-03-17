import type { Metadata } from "next";
import Link from "next/link";
import { AMAZON_MARKET_LIST } from "./markets";

export const metadata: Metadata = {
  title: "Amazon Fee Calculator \u2013 All Marketplaces | SellerLab",
  description:
    "Free Amazon fee calculator for 17 global marketplaces. Calculate referral fees, FBA fulfillment costs, storage fees, and net profit across 45+ product categories.",
  keywords: [
    "amazon fee calculator",
    "amazon seller fees",
    "amazon fba calculator",
    "amazon referral fee",
    "amazon profit calculator",
    "fba fee calculator",
    "amazon selling fees 2025",
    "amazon global selling",
  ],
  openGraph: {
    title: "Amazon Fee Calculator \u2013 All Marketplaces | SellerLab",
    description:
      "Calculate Amazon selling fees, FBA costs, and profit across 17 global marketplaces. Covers 45+ categories with referral fee rates, fulfillment fees, and storage costs.",
    type: "website",
    siteName: "SellerLab",
  },
  alternates: {
    canonical: "/amazon-fee-calculator",
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
        name: "Amazon Fee Calculator",
        item: "/amazon-fee-calculator",
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Amazon Fee Calculator",
    url: "/amazon-fee-calculator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free Amazon fee calculator covering referral fees, FBA fulfillment costs, storage fees, and profit analysis for 17 global marketplaces.",
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
  { category: "Most Categories", rate: "15%", minFee: "$0.30", notes: "Default rate" },
  { category: "Clothing & Accessories", rate: "17%", minFee: "$0.30", notes: "\u2014" },
  { category: "Jewelry", rate: "20% / 5%", minFee: "$0.30", notes: "Tiered at $250" },
  { category: "Watches", rate: "16% / 3%", minFee: "$0.30", notes: "Tiered at $1,500" },
  { category: "Computers & Electronics", rate: "8%", minFee: "$0.30", notes: "Lowest standard rate" },
  { category: "Automotive", rate: "12%", minFee: "$0.30", notes: "\u2014" },
  { category: "Baby / Beauty", rate: "8% / 15%", minFee: "$0.30", notes: "Threshold at $10" },
  { category: "Books (Media)", rate: "15%", minFee: "\u2014", notes: "+$1.80 closing fee" },
  { category: "Amazon Device Acc.", rate: "45%", minFee: "$0.30", notes: "Highest rate" },
];

const FAQ_ITEMS = [
  {
    q: "How much does Amazon charge sellers in fees?",
    a: "Amazon charges a referral fee on every sale (typically 15% for most categories), ranging from 7% to 45% depending on the product category and marketplace. Professional sellers pay a monthly subscription, while Individual sellers pay a per-item fee. FBA sellers also pay fulfillment and monthly storage fees.",
  },
  {
    q: "What is Amazon\u2019s referral fee?",
    a: "The referral fee is a percentage of the total sales price (item price + shipping + gift wrap) that Amazon charges on every sale. Most categories charge 15%, but rates vary by category and marketplace. Some categories use tiered rates, like Jewelry (20% up to $250, 5% above).",
  },
  {
    q: "What are FBA fees and how are they calculated?",
    a: "FBA (Fulfilled by Amazon) fees include a per-unit fulfillment fee based on the product\u2019s size tier and weight, plus monthly storage fees. The size tier is determined by the product\u2019s dimensions and weight. Fees vary by marketplace.",
  },
  {
    q: "Are Amazon fees the same across all marketplaces?",
    a: "No. While the fee structure is similar (referral fees, FBA fees, storage), the specific rates, categories, and currencies differ by marketplace. For example, US uses USD with imperial units, while EU marketplaces use EUR with metric units. Use our marketplace-specific calculators for accurate rates.",
  },
  {
    q: "How can I reduce my Amazon selling fees?",
    a: "Choose the Professional plan if selling enough items/month. Optimize packaging to qualify for a smaller FBA size tier. Keep inventory lean to minimize storage fees, especially during Q4. Consider FBM for heavy or oversize items. Ensure your product is in the correct category.",
  },
  {
    q: "Does Amazon charge fees on shipping?",
    a: "Yes. Amazon\u2019s referral fee is calculated on the total sales price, which includes the item price, any shipping charges, and gift wrap charges. FBA sellers don\u2019t set shipping charges \u2014 Amazon handles shipping and charges a fulfillment fee instead.",
  },
];

const MARKET_REGIONS: { label: string; ids: string[] }[] = [
  { label: "Americas", ids: ["us", "ca", "mx", "br"] },
  { label: "Europe", ids: ["uk", "de", "it", "es", "nl", "be", "se", "pl", "tr"] },
  { label: "Asia Pacific & Middle East", ids: ["jp", "au", "sg", "ae"] },
];

export default function AmazonFeeCalculatorHubPage() {
  return (
    <div className="container">
      <StructuredData />

      {/* Breadcrumb */}
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
          Amazon Fee Calculator
        </span>
      </nav>

      {/* Hero */}
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
          Amazon Fee Calculator
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
          Calculate referral fees, FBA fulfillment costs, storage fees, and net
          profit for Amazon sellers. Choose your marketplace below for accurate,
          category-specific fee estimates.
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
            { value: "17", label: "Marketplaces" },
            { value: "45+", label: "Categories" },
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

      {/* Market selector by region */}
      {MARKET_REGIONS.map((region) => (
        <section key={region.label} style={{ padding: "20px 0 8px" }}>
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
            {region.label}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {AMAZON_MARKET_LIST.filter((m) => region.ids.includes(m.id)).map(
              (m) => (
                <Link
                  key={m.id}
                  href={`/amazon-fee-calculator/${m.id}`}
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
                  <div
                    style={{
                      fontSize: 32,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {m.flag}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        marginBottom: 2,
                      }}
                    >
                      Amazon {m.fullName}
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
                        FBA + FBM
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
                        {m.categories.length}+ Categories
                      </span>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </section>
      ))}

      {/* Fee comparison table */}
      <section
        className="card"
        style={{ padding: 24, overflowX: "auto", marginTop: 24 }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
          Amazon US Referral Fee Rates by Category
        </h2>
        <p
          className="muted"
          style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}
        >
          Key referral fee rates for selling on Amazon.com (US). Select a marketplace above for
          market-specific rates.
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
                Min Fee
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
                <td style={{ padding: "10px 12px" }}>{row.minFee}</td>
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
          Rates shown are for Amazon US (Amazon.com). Other marketplaces have different rates.
          Click any marketplace above for detailed calculations.
        </p>
      </section>

      {/* How it works */}
      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
          How to Use the Amazon Fee Calculator
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
              desc: "Select from 17 Amazon marketplaces worldwide. Each has its own fee rates, currency, and FBA pricing.",
            },
            {
              step: "2",
              title: "Enter product details",
              desc: "Input selling price, costs, and for FBA: product weight, dimensions, and storage duration.",
            },
            {
              step: "3",
              title: "Get instant results",
              desc: "See a full breakdown of referral fees, FBA fees, storage costs, net profit, and margin.",
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

      {/* FAQ */}
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

      {/* CTA */}
      <section
        style={{
          background: "linear-gradient(135deg, #FF9900 0%, #e88600 100%)",
          borderRadius: "var(--radius)",
          padding: "40px 24px",
          textAlign: "center",
          color: "#fff",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>
          Ready to calculate your Amazon fees?
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
          Get an instant, detailed breakdown of referral fees, FBA costs, and
          profit analysis for any of 17 Amazon marketplaces.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/amazon-fee-calculator/us"
            className="btn"
            style={{
              background: "#fff",
              color: "#FF9900",
              fontWeight: 700,
              padding: "12px 28px",
              fontSize: 15,
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
            }}
          >
            {"\u{1F1FA}\u{1F1F8}"} US Calculator
          </Link>
          <Link
            href="/amazon-fee-calculator/uk"
            className="btn"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 700,
              padding: "12px 28px",
              fontSize: 15,
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {"\u{1F1EC}\u{1F1E7}"} UK Calculator
          </Link>
          <Link
            href="/amazon-fee-calculator/de"
            className="btn"
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontWeight: 700,
              padding: "12px 28px",
              fontSize: 15,
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {"\u{1F1E9}\u{1F1EA}"} DE Calculator
          </Link>
        </div>
      </section>

      {/* Footer disclaimer */}
      <p
        className="muted"
        style={{
          fontSize: 12,
          textAlign: "center",
          margin: "12px 0 0",
          lineHeight: 1.6,
        }}
      >
        Fee rates are based on official Amazon seller fee schedules. Referral
        fees, FBA fulfillment fees, and storage costs are updated regularly.
        This calculator is for estimation purposes only.
      </p>
    </div>
  );
}
