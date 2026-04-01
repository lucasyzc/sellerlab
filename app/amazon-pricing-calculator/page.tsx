import type { Metadata } from "next";
import Link from "next/link";
import { FlagIcon } from "../components/country-flags";
import { FAQSection, faqAnswerToText } from "../components/faq-section";
import { AMAZON_MARKETS } from "../amazon-fee-calculator/markets";
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
  withSeoYear("Amazon Pricing Calculator", FEE_SEO_YEAR),
);

export const metadata: Metadata = buildFeeMetadata({
  title: TOOL_TITLE,
  description:
    "Free Amazon pricing calculator that back-solves the minimum listing price needed to reach your profit target. Accounts for referral fees, FBA fulfillment, storage costs, and discounts.",
  canonicalPath: "/amazon-pricing-calculator",
  keywords: [
    "amazon pricing calculator",
    "amazon listing price calculator",
    "amazon profit price calculator",
    "amazon selling price calculator",
    "amazon fba pricing tool",
    "amazon break even price",
    "amazon margin calculator",
  ],
  yearKeywordPhrases: [
    "amazon pricing calculator 2026",
    "amazon listing price calculator 2026",
    "amazon fba pricing calculator 2026",
  ],
  lastReviewed: HUB_LAST_REVIEWED,
  openGraphDescription:
    "Back-solve Amazon listing prices from target profit. Includes referral fees, FBA costs, storage, and discount modeling.",
  twitterDescription:
    "Find the minimum Amazon listing price that meets your target profit after all fees.",
  twitterCard: "summary",
});

const US_CONFIG = AMAZON_MARKETS["us"];

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
    q: "How does the Amazon pricing calculator differ from the fee calculator?",
    a: "The fee calculator takes a known selling price and shows you the fee breakdown. This pricing calculator works in reverse \u2014 you enter your item cost, fulfillment expenses, and target profit, then the solver finds the lowest listing price that meets your goal after all Amazon fees are deducted. This makes it ideal for sourcing decisions: you can determine whether a product is viable before committing to inventory, rather than guessing a price and checking fees afterward.",
  },
  {
    q: "Does FBA vs FBM affect the minimum listing price?",
    a: {
      intro: "Significantly. FBA adds fulfillment and storage costs on top of referral fees, raising the minimum viable listing price compared to FBM.",
      points: [
        "FBA minimum prices are typically 15\u201330% higher because of per-unit fulfillment fees ($3\u201310+ depending on size) and monthly storage charges.",
        "FBM avoids those Amazon-side fees but requires you to factor in your own shipping and handling costs.",
        "FBA products often convert better and qualify for Prime, which can justify the higher price floor through increased sales velocity.",
      ],
      conclusion: "Toggle between FBA and FBM in the calculator to compare the floor price for your specific product.",
    },
  },
  {
    q: "How does the discount rate input work?",
    a: "The discount rate models promotions, coupons, or Best Offer acceptance. For example, a 10% discount rate means the effective price buyers pay is 90% of your listing price. The solver accounts for this when computing the minimum listing price, ensuring you still hit your profit target even at the discounted rate. If you regularly accept Best Offers at 85% of asking, set the discount rate to 15%. This prevents the common mistake of pricing profitably at full price but losing money on every negotiated sale.",
  },
  {
    q: "Why does my category choice change the required listing price?",
    a: {
      intro: "Amazon charges different referral fee percentages depending on the product category, which directly impacts how much you need to list at.",
      points: [
        "Low-fee categories like Electronics (8%) require a much lower listing price to reach the same profit as high-fee categories like Jewelry (20%).",
        "Some categories use tiered rates \u2014 Jewelry charges 20% on the first $250 and only 5% above that threshold.",
        "The calculator models these tiered structures automatically, so the recommended price reflects the actual marginal fee rate at your price point.",
      ],
    },
  },
  {
    q: "Should I include FBA storage costs in my pricing?",
    a: "Yes, especially for slower-moving inventory. Standard storage runs $0.87 per cubic foot per month from January through September and jumps to $2.40 per cubic foot during Q4 (October\u2013December). A product that sits for 3\u20134 months can accumulate $3\u20135 in storage costs before it sells, directly reducing profit. The calculator lets you enter storage duration so the solver sets a floor price that covers the full carrying cost, not just the fulfillment fee at the moment of sale.",
  },
  {
    q: "Is the Individual seller per-item fee included?",
    a: "Yes. When you select the Individual seller type, the $0.99 per-item fee is added to the total alongside referral and any FBA fees. Professional sellers ($39.99/month) do not pay this per-item charge, but their subscription cost is not modeled here because it amortizes across all monthly sales. As a rule of thumb, the Professional plan pays for itself at around 40 orders per month.",
  },
  {
    q: "Is this calculator updated for 2026?",
    a: `Yes. The fee model is aligned to 2026 Amazon seller fee schedules and was last reviewed on ${HUB_LAST_REVIEWED}. Referral rates, FBA fulfillment tiers, and storage pricing reflect the latest published changes. Always cross-check your specific category against Seller Central before making final pricing decisions.`,
  },
];

function StructuredData() {
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
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Amazon Pricing Calculator ${FEE_SEO_YEAR}`,
    url: absoluteUrl("/amazon-pricing-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: HUB_LAST_REVIEWED,
    description:
      "Amazon listing price calculator that back-solves from target profit, covering referral fees, FBA fulfillment, storage, and discounts.",
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

export default function AmazonPricingCalculatorHubPage() {
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
          Amazon Pricing Calculator
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
          Amazon Pricing Calculator ({FEE_SEO_YEAR})
        </h1>
        <p
          className="muted"
          style={{
            fontSize: 17,
            maxWidth: 700,
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          Stop guessing your listing price. Enter your product costs, choose
          your fulfillment method, set a profit target, and this calculator
          works backward to find the exact minimum price that keeps you
          profitable after every Amazon fee.
        </p>
        <p
          className="muted"
          style={{ marginTop: 10, marginBottom: 0, fontSize: 12 }}
        >
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
            { value: "Reverse", label: "Price Solving" },
            { value: "FBA + FBM", label: "Both Models" },
            { value: "Free", label: "No Sign-up" },
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

      {/* Market selector */}
      <section style={{ padding: "20px 0 8px" }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            margin: "0 0 14px",
            textAlign: "center",
          }}
        >
          Select Your Amazon Marketplace
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <Link
            href="/amazon-pricing-calculator/us"
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              textDecoration: "none",
              border: "1px solid var(--color-border)",
              transition: "all 0.15s ease",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                borderRadius: 6,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                lineHeight: 0,
              }}
            >
              <FlagIcon code="us" size={52} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}
              >
                Amazon {US_CONFIG.fullName}
              </div>
              <div
                className="muted"
                style={{ fontSize: 13, lineHeight: 1.5 }}
              >
                {US_CONFIG.domain} · {US_CONFIG.currency.code}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  marginTop: 6,
                }}
              >
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
                  {US_CONFIG.categories.length}+ Categories
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-primary)",
                }}
              >
                Open Calculator →
              </div>
            </div>
          </Link>
        </div>
        <p
          className="muted"
          style={{
            fontSize: 12,
            textAlign: "center",
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          More marketplaces coming soon. Need fee-only calculations?{" "}
          <Link href="/amazon-fee-calculator">
            Use the Amazon fee calculator
          </Link>{" "}
          for all 17 markets.
        </p>
      </section>

      {/* Why reverse-price */}
      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          Why Reverse-Pricing Matters on Amazon
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}
            >
              Referral fees vary widely
            </div>
            <p
              className="muted"
              style={{ fontSize: 13, margin: 0, lineHeight: 1.65 }}
            >
              A $30 kitchen item pays roughly $4.50 in referral fees at 15%,
              while the same price in Jewelry costs $6.00 at 20%. Starting
              from cost and working forward avoids accidentally listing below
              break-even in high-fee categories.
            </p>
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}
            >
              FBA costs are product-specific
            </div>
            <p
              className="muted"
              style={{ fontSize: 13, margin: 0, lineHeight: 1.65 }}
            >
              Fulfillment fees depend on size tier and shipping weight. A
              compact 12 oz item might cost $3.22 to fulfill, but a 3 lb
              product in the same category jumps to $6.75. Your minimum
              viable price needs to account for these per-unit costs.
            </p>
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}
            >
              Storage eats margins quietly
            </div>
            <p
              className="muted"
              style={{ fontSize: 13, margin: 0, lineHeight: 1.65 }}
            >
              Monthly storage at $0.87/cu ft seems small, but Q4 rates jump
              to $2.40. A product sitting in FBA for four months before
              selling accumulates carrying costs that many sellers forget to
              price in\u2014especially during the holiday surge.
            </p>
          </div>
        </div>
      </section>

      {/* FBA vs FBM pricing */}
      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 8,
          }}
        >
          FBA vs FBM: How Fulfillment Shifts Your Price Floor
        </h2>
        <p
          className="muted"
          style={{
            fontSize: 14,
            marginTop: 0,
            marginBottom: 20,
            lineHeight: 1.65,
          }}
        >
          The fulfillment method you choose changes your cost structure and
          therefore the minimum listing price needed to stay profitable.
          Here is a typical comparison for a standard-size item:
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 16,
          }}
        >
          <div
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 10,
                color: "var(--color-primary)",
              }}
            >
              FBA (Fulfilled by Amazon)
            </div>
            <ul
              className="muted"
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              <li>
                Amazon picks, packs, and ships. Fulfillment fee added per
                unit.
              </li>
              <li>Monthly storage fees based on cubic volume and season.</li>
              <li>
                No seller-side shipping cost, but you pay FBA fulfillment +
                storage instead.
              </li>
              <li>Products qualify for Prime badge and faster delivery.</li>
              <li>
                Typical price floor is <strong>higher</strong> due to
                fulfillment + storage overhead.
              </li>
            </ul>
          </div>
          <div
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 10,
                color: "var(--color-primary)",
              }}
            >
              FBM (Fulfilled by Merchant)
            </div>
            <ul
              className="muted"
              style={{
                margin: 0,
                paddingLeft: 18,
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              <li>You handle storage, packing, and shipping yourself.</li>
              <li>
                Your actual shipping cost is deducted from profit instead of
                FBA fees.
              </li>
              <li>No monthly storage fee to Amazon.</li>
              <li>
                Referral fees are the same as FBA (calculated on total sales
                price).
              </li>
              <li>
                Typical price floor is <strong>lower</strong> if your
                shipping costs are competitive.
              </li>
            </ul>
          </div>
        </div>
        <p
          className="muted"
          style={{
            fontSize: 13,
            marginTop: 14,
            marginBottom: 0,
            lineHeight: 1.6,
          }}
        >
          Use the calculator to model both scenarios with your real product
          dimensions and costs. The difference in minimum listing price can
          be $2\u2013$8 for standard products and even more for oversize
          items.
        </p>
      </section>

      {/* Fee reference table */}
      <section
        className="card"
        style={{ padding: 24, overflowX: "auto", marginTop: 16 }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 4,
          }}
        >
          Amazon US Referral Fee Quick Reference
        </h2>
        <p
          className="muted"
          style={{
            fontSize: 14,
            marginTop: 0,
            marginBottom: 20,
          }}
        >
          These rates directly affect your minimum listing price. Higher-fee
          categories require a proportionally higher listing price for the
          same margin.
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
                style={{
                  borderBottom: "1px solid var(--color-border)",
                }}
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
          Rates shown are for Amazon.com (US). The calculator uses the full
          category list with all tiered and threshold rules.
        </p>
      </section>

      {/* Calculation Logic */}
      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 12,
          }}
        >
          Calculation Logic
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li
            className="muted"
            style={{ marginBottom: 8, lineHeight: 1.7 }}
          >
            Sold Price = Listing Price × (1 − Discount Rate).
          </li>
          <li
            className="muted"
            style={{ marginBottom: 8, lineHeight: 1.7 }}
          >
            Total Sales Price = Sold Price + Shipping Charged + Gift Wrap
            (Amazon calculates referral fees on this total).
          </li>
          <li
            className="muted"
            style={{ marginBottom: 8, lineHeight: 1.7 }}
          >
            Total Fees = Referral Fee + Closing Fee + Per-Item Fee + FBA
            Fulfillment + FBA Storage.
          </li>
          <li
            className="muted"
            style={{ marginBottom: 8, lineHeight: 1.7 }}
          >
            Net Profit = Revenue − Product Cost − Shipping Cost (FBM only)
            − Other Costs − Total Fees.
          </li>
          <li className="muted" style={{ lineHeight: 1.7 }}>
            Solver target: find the minimum Listing Price where your target
            profit amount or margin percentage is reached.
          </li>
        </ul>
      </section>

      {/* Primary Sources */}
      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          Primary Sources
        </h2>
        <p
          className="muted"
          style={{
            marginTop: 0,
            marginBottom: 12,
            lineHeight: 1.7,
          }}
        >
          Always validate your final pricing decisions against official
          Amazon seller fee documentation.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a
            className="btn"
            href="https://sellercentral.amazon.com/help/hub/reference/external/G200336920"
            target="_blank"
            rel="noopener noreferrer"
          >
            Amazon US Selling Fees
          </a>
          <a
            className="btn"
            href="https://sellercentral.amazon.com/help/hub/reference/external/GEZBRJKL5PXEYGEV"
            target="_blank"
            rel="noopener noreferrer"
          >
            FBA Fulfillment Fees
          </a>
          <a
            className="btn"
            href="https://sellercentral.amazon.com/help/hub/reference/external/G3EDYEF6KUCFQTNM"
            target="_blank"
            rel="noopener noreferrer"
          >
            FBA Storage Fees
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
          Ready to find your Amazon price floor?
        </h2>
        <p
          style={{
            fontSize: 15,
            opacity: 0.9,
            margin: "0 auto 24px",
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Enter your product costs and profit target. The calculator handles
          referral fees, FBA fulfillment, storage, and discounts to give you
          the exact minimum listing price.
        </p>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/amazon-pricing-calculator/us"
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
            <FlagIcon code="US" /> US Pricing Calculator
          </Link>
          <Link
            href="/amazon-fee-calculator"
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
            Fee Calculator (17 Markets)
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
        Fee rates are based on official Amazon seller fee schedules. This
        calculator is for estimation purposes only. Professional plan costs
        ($39.99/month) are not included as they are amortized across all
        sales.
      </p>
    </div>
  );
}
