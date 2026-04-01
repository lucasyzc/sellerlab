import type { Metadata } from "next";
import Link from "next/link";
import { AMAZON_MARKET_LIST } from "./markets";
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
  withSeoYear("Amazon Fee Calculator – All Marketplaces", FEE_SEO_YEAR),
);

export const metadata: Metadata = buildFeeMetadata({
  title: TOOL_TITLE,
  description:
    "Free Amazon fee calculator for 17 global marketplaces. Calculate referral fees, FBA fulfillment costs, storage fees, and net profit across 45+ product categories.",
  canonicalPath: "/amazon-fee-calculator",
  keywords: [
    "amazon fee calculator",
    "amazon seller fees",
    "amazon fba calculator",
    "amazon referral fee",
    "amazon profit calculator",
    "fba fee calculator",
    "amazon selling fees",
    "amazon global selling",
  ],
  yearKeywordPhrases: [
    "amazon fee calculator 2026",
    "amazon seller fees 2026",
    "amazon fba fees 2026",
  ],
  lastReviewed: HUB_LAST_REVIEWED,
  openGraphDescription:
    "Calculate Amazon selling fees, FBA costs, and profit across 17 global marketplaces. Covers 45+ categories with referral fee rates, fulfillment fees, and storage costs.",
  twitterDescription:
    "Calculate Amazon selling fees, FBA costs, and profit across 17 global marketplaces.",
  twitterCard: "summary",
});

function StructuredData() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Amazon Fee Calculator",
        item: absoluteUrl("/amazon-fee-calculator"),
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Amazon Fee Calculator ${FEE_SEO_YEAR}`,
    url: absoluteUrl("/amazon-fee-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: HUB_LAST_REVIEWED,
    description:
      "Free Amazon fee calculator covering referral fees, FBA fulfillment costs, storage fees, and profit analysis for 17 global marketplaces.",
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
    a: {
      intro: "Amazon sellers face several fee layers that vary by selling plan, fulfillment method, and product category.",
      points: [
        "Referral fee: a percentage of the total sale price, typically 15% for most categories but ranging from 7% to 45%.",
        "Selling plan fee: Professional sellers pay $39.99/month, while Individual sellers pay $0.99 per item sold.",
        "FBA fees: if using Fulfilled by Amazon, you pay per-unit fulfillment fees (based on size and weight) plus monthly and long-term storage fees.",
        "Payment processing is included in the referral fee \u2014 no separate charge.",
      ],
      conclusion: "Total effective fees usually fall between 20\u201335% of the sale price for FBA sellers, depending on category and product dimensions.",
    },
  },
  {
    q: "What is Amazon\u2019s referral fee?",
    a: {
      intro: "The referral fee is a percentage of the total sales price (item price + shipping + gift wrap) charged on every sale. Most categories default to 15%, but rates vary significantly.",
      points: [
        "Low-fee categories: Consumer Electronics and Computers at 8%.",
        "Standard categories: Home, Kitchen, Toys, and most others at 15%.",
        "High-fee categories: Jewelry at 20% on the first $250 and 5% above; Amazon Device Accessories at 45%.",
      ],
      conclusion: "Rates also differ between marketplaces. Always verify your specific category rate using a marketplace-specific calculator.",
    },
  },
  {
    q: "What are FBA fees and how are they calculated?",
    a: {
      intro: "FBA (Fulfilled by Amazon) fees cover the cost of Amazon storing, picking, packing, and shipping your products. The two main components are fulfillment fees and storage fees.",
      points: [
        "Fulfillment fee: a per-unit charge based on the product\u2019s size tier (standard vs oversize) and shipping weight. Small standard items start around $3.22; large oversize items can exceed $10.",
        "Monthly storage fee: $0.87/cubic ft from January\u2013September, rising to $2.40/cubic ft during Q4 (October\u2013December).",
        "Long-term storage surcharges apply to inventory stored over 181 days.",
      ],
      conclusion: "Optimize packaging dimensions and maintain lean inventory to keep FBA costs manageable.",
    },
  },
  {
    q: "Are Amazon fees the same across all marketplaces?",
    a: "No. While the fee structure follows a similar pattern (referral fees, FBA fees, storage), the specific rates, category definitions, currencies, and size tier thresholds differ by marketplace. For example, US uses USD with imperial weight units, while EU marketplaces use EUR with metric units. Japan has unique category splits, and some smaller marketplaces have fewer categories. Use our marketplace-specific calculators linked above to model fees with accurate local rates.",
  },
  {
    q: "How can I reduce my Amazon selling fees?",
    a: {
      intro: "Several strategies can meaningfully lower your Amazon selling costs.",
      points: [
        "Use the Professional selling plan ($39.99/month) \u2014 it eliminates the $0.99 per-item fee and pays for itself at around 40 sales per month.",
        "Optimize product packaging to fit a smaller FBA size tier. Even a small dimensional reduction can drop your fulfillment fee by $1\u20132 per unit.",
        "Keep inventory lean to avoid long-term storage surcharges, especially during Q4 when monthly rates nearly triple.",
        "Consider FBM (Fulfilled by Merchant) for heavy, oversize, or slow-moving items where FBA costs erode margin.",
        "Verify your product is listed in the correct category \u2014 miscategorization can result in a higher referral fee rate.",
      ],
    },
  },
  {
    q: "Does Amazon charge fees on shipping?",
    a: "Yes. Amazon\u2019s referral fee is calculated on the total sales price, which includes the item price, shipping charges, and gift wrap charges. For FBA sellers, you don\u2019t set shipping charges directly \u2014 Amazon handles delivery and charges a per-unit fulfillment fee instead. For FBM sellers, the buyer-paid shipping amount is included in the referral fee base. This means offering \u201cfree shipping\u201d by increasing the item price does not reduce your referral fee \u2014 the total charged to the buyer remains the same either way.",
  },
  {
    q: "Is this Amazon fee calculator updated for 2026?",
    a: "Yes. This fee model is aligned to the 2026 Amazon seller fee schedules. Fee rates, FBA fulfillment tiers, and storage pricing reflect the latest published changes. Always cross-check your specific market and product category against the official Amazon Seller Central pricing pages before making final listing decisions, as category-level adjustments can occur mid-year.",
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
          Amazon Fee Calculator ({FEE_SEO_YEAR})
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
        <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 12 }}>
          {lastReviewedLabel(HUB_LAST_REVIEWED)}
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

      <section className="card" style={{ padding: 20, marginTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
          2026 Amazon Fee Deep Dives
        </h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 10, fontSize: 14, lineHeight: 1.65 }}>
          Review policy changes and margin impact playbooks, then return to this calculator for SKU-level modeling.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="btn" href="/updates/amazon-fee-changes-2026-q2">
            Amazon Fee Changes 2026 Q2
          </Link>
          <Link className="btn" href="/updates/amazon-break-even-price-playbook-2026">
            Amazon Break-even Playbook 2026
          </Link>
          <Link className="btn" href="/updates/amazon-fba-vs-fbm-margin-update-2026">
            Amazon FBA vs FBM 2026
          </Link>
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
                  <FlagIcon code={m.id} size={40} style={{ borderRadius: 4 }} />
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

      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>
          Calculation Logic
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Total Fees = Referral Fee + Fulfillment Fee + Storage Fee + Optional Ad Fee.
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
          Validate category-level decisions against official Amazon seller fee documentation for your target marketplace.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn" href="https://sellercentral.amazon.com/help/hub/reference/external/G200336920" target="_blank" rel="noopener noreferrer">
            Amazon US Selling Fees
          </a>
          <a className="btn" href="https://sell.amazon.co.uk/pricing" target="_blank" rel="noopener noreferrer">
            Amazon UK Selling Fees
          </a>
          <a className="btn" href="https://sell.amazon.de/preise" target="_blank" rel="noopener noreferrer">
            Amazon DE Selling Fees
          </a>
        </div>
      </section>

      {/* FAQ */}
      <div style={{ marginTop: 16 }}>
        <FAQSection items={FAQ_ITEMS} />
      </div>

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
            <FlagIcon code="US" /> US Calculator
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
            <FlagIcon code="UK" /> UK Calculator
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
            <FlagIcon code="DE" /> DE Calculator
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
