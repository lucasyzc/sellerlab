import type { Metadata } from "next";
import Link from "next/link";
import { MARKET_LIST } from "./market-config";
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
  withSeoYear("eBay Fee Calculator – All Marketplaces", FEE_SEO_YEAR),
);

export const metadata: Metadata = buildFeeMetadata({
  title: TOOL_TITLE,
  description:
    "Free eBay fee calculator for US, UK, Germany, Australia, Canada, France, and Italy. Compare final value fees, per-order fees, and selling costs across all major eBay marketplaces.",
  canonicalPath: "/ebay-fee-calculator",
  keywords: [
    "ebay fee calculator",
    "ebay fees",
    "ebay seller fees",
    "ebay profit calculator",
    "final value fee calculator",
    "ebay selling fees 2026",
    "ebay fee comparison",
  ],
  yearKeywordPhrases: [
    "ebay fee calculator 2026",
    "ebay final value fee 2026",
    "ebay seller fees 2026",
  ],
  lastReviewed: HUB_LAST_REVIEWED,
  openGraphDescription:
    "Compare eBay selling fees and calculate profit across 7 major eBay marketplaces worldwide.",
  twitterDescription:
    "Compare eBay selling fees and calculate profit across 7 major eBay marketplaces worldwide.",
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
        name: "eBay Fee Calculator",
        item: absoluteUrl("/ebay-fee-calculator"),
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `eBay Fee Calculator ${FEE_SEO_YEAR}`,
    url: absoluteUrl("/ebay-fee-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: HUB_LAST_REVIEWED,
    description:
      "Free eBay fee calculator covering 7 marketplaces. Calculate final value fees, payment processing fees, and net profit for eBay sellers.",
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

const MARKET_HIGHLIGHTS: Record<
  string,
  { defaultFvf: string; perOrder: string; highlight: string }
> = {
  us: {
    defaultFvf: "13.25%",
    perOrder: "$0.30",
    highlight: "Managed Payments",
  },
  uk: {
    defaultFvf: "13.25%",
    perOrder: "£0.40",
    highlight: "Regulatory fee 0.35%",
  },
  de: {
    defaultFvf: "11%",
    perOrder: "€0.35",
    highlight: "Private sellers: 0%",
  },
  au: {
    defaultFvf: "13.4%",
    perOrder: "A$0.30",
    highlight: "Store rate from 10.4%",
  },
  ca: {
    defaultFvf: "13.6%",
    perOrder: "C$0.30",
    highlight: "Managed Payments",
  },
  fr: {
    defaultFvf: "8%",
    perOrder: "€0.35",
    highlight: "Business from 3%",
  },
  it: {
    defaultFvf: "8%",
    perOrder: "€0.35",
    highlight: "Business from 3%",
  },
};

const FEE_TABLE_ROWS = [
  {
    id: "us",
    flag: "us",
    name: "US",
    noStore: "13.25%",
    store: "12.35%",
    perOrder: "$0.30",
    other: "Managed Payments 2.7% + $0.25",
  },
  {
    id: "uk",
    flag: "uk",
    name: "UK",
    noStore: "13.25%",
    store: "12.35%",
    perOrder: "£0.40",
    other: "Regulatory fee 0.35%",
  },
  {
    id: "de",
    flag: "de",
    name: "DE",
    noStore: "11% (business)",
    store: "\u2014",
    perOrder: "€0.35",
    other: "Private sellers: 0% domestic",
  },
  {
    id: "au",
    flag: "au",
    name: "AU",
    noStore: "13.4%",
    store: "10.4%",
    perOrder: "A$0.30",
    other: "\u2014",
  },
  {
    id: "ca",
    flag: "ca",
    name: "CA",
    noStore: "13.6%",
    store: "12.7%",
    perOrder: "C$0.30",
    other: "Managed Payments 2.7% + C$0.25",
  },
  {
    id: "fr",
    flag: "fr",
    name: "FR",
    noStore: "8% (private)",
    store: "6.5% (business)",
    perOrder: "€0.35",
    other: "\u2014",
  },
  {
    id: "it",
    flag: "it",
    name: "IT",
    noStore: "8% (private)",
    store: "6.5% (business)",
    perOrder: "€0.35",
    other: "\u2014",
  },
];

const FAQ_ITEMS = [
  {
    q: "How much does eBay charge in fees?",
    a: {
      intro: "eBay sellers pay several fee components that combine to a total effective rate of roughly 15\u201317% on most US sales.",
      points: [
        "Final value fee (FVF): typically 12\u201313.25% of the total sale amount for most categories, varying by marketplace and store subscription.",
        "Per-order fee: a fixed charge per sale (e.g. $0.30 in the US, \u00a30.30\u2013\u00a30.40 in the UK).",
        "Managed Payments processing: 2.7% + $0.25 per transaction on US sales (included in FVF on some non-US markets).",
        "Optional extras: international selling fees (1\u20133%), promoted listings ad rates, and regulatory operating fees (UK).",
      ],
      conclusion: "Store subscribers and Top Rated Sellers qualify for reduced FVF rates, making these programs worth evaluating for regular sellers.",
    },
  },
  {
    q: "What is eBay\u2019s final value fee?",
    a: "The final value fee (FVF) is a percentage of the total sale amount, including both the item price and buyer-paid shipping. Rates vary by category, seller type, and marketplace. For US sellers without a store, the default rate is 13.25% on the first $7,500 per sale, dropping to 2.35% on amounts above that threshold. Store subscribers pay 12.35% with a $2,500 threshold. Certain categories carry different rates \u2014 Books and Music charge 14.95%, while Guitars and Heavy Equipment are lower. Use the calculator above to model your exact category and store configuration.",
  },
  {
    q: "Do eBay fees differ by country?",
    a: {
      intro: "Yes. Each eBay marketplace operates its own fee schedule with distinct rates and fee types.",
      points: [
        "US: FVF + per-order fee + separate Managed Payments processing charge.",
        "UK: business seller FVF + regulatory operating fee (0.35%); private sellers pay 0% FVF on domestic sales.",
        "Germany: private domestic sellers pay 0% FVF; business sellers face category-based rates from 3\u201311%.",
        "Australia: FVF includes payment processing \u2014 no separate charge.",
        "Canada: structure mirrors US with slightly higher default FVF rates.",
      ],
      conclusion: "Select your marketplace in the cards above to see the exact fee model for each country.",
    },
  },
  {
    q: "How can I reduce my eBay selling fees?",
    a: {
      intro: "There are several proven strategies to lower your eBay fee burden.",
      points: [
        "Subscribe to an eBay Store to unlock lower FVF rates (e.g. 12.35% vs 13.25% on US).",
        "Achieve Top Rated Seller status for a 10% discount on final value fees.",
        "List products in categories with naturally lower fee rates, such as Electronics or Computers.",
        "Sell higher-value items to benefit from tiered rates that drop above the per-item threshold.",
        "Avoid unnecessary promoted listings when organic visibility is sufficient.",
      ],
    },
  },
  {
    q: "Which eBay marketplace has the lowest fees?",
    a: "For private (non-business) sellers, eBay Germany and several EU markets offer 0% final value fees on domestic sales, making them the cheapest option. eBay France and Italy charge around 8% for private sellers. Among English-speaking markets, eBay US and UK have similar default rates around 12\u201313%, with store subscriptions bringing rates closer to 12%. For business sellers, Australia\u2019s all-inclusive FVF (no separate payment fee) can result in competitive total costs. The best market depends on your seller type, sales volume, and whether you sell domestically or cross-border.",
  },
  {
    q: "Does eBay charge fees on shipping?",
    a: "Yes. eBay\u2019s final value fee is calculated on the total sale amount, which includes the shipping charge paid by the buyer. Offering \u201cfree shipping\u201d by building costs into a higher item price does not reduce fees \u2014 the percentage applies to the total either way. The Managed Payments processing fee (US: 2.7% + $0.25) is also calculated on the full transaction amount including any applicable tax. Factor shipping into your margin model to avoid underpricing.",
  },
  {
    q: "Is this eBay fee calculator updated for 2026?",
    a: "Yes. The calculator reflects 2026 eBay fee schedules across all supported marketplaces, including the March 2025 rate increases on eBay Canada and 2026 UK business seller updates. Always verify your specific category and store tier against official eBay seller fee pages before making final pricing decisions, as mid-year adjustments can occur.",
  },
];

export default function EbayFeeCalculatorHubPage() {
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
          eBay Fee Calculator
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
          eBay Fee Calculator ({FEE_SEO_YEAR})
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
          Calculate final value fees, selling costs, and net profit across all
          major eBay marketplaces. Choose your marketplace below to get accurate,
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
            { value: "7", label: "Marketplaces" },
            { value: "25+", label: "Categories" },
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
          2026 eBay Fee Deep Dives
        </h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 10, fontSize: 14, lineHeight: 1.65 }}>
          Use these update briefings for policy context, then model exact category-level economics in the calculator.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="btn" href="/updates/ebay-fee-changes-2026-q2">
            eBay Fee Changes 2026 Q2
          </Link>
          <Link className="btn" href="/updates/ebay-store-subscription-break-even-2026">
            eBay Store Break-even 2026
          </Link>
          <Link className="btn" href="/updates/ebay-promoted-listing-margin-update-2026">
            eBay Promoted Listings 2026
          </Link>
        </div>
      </section>

      {/* Market selector cards */}
      <section style={{ padding: "20px 0 8px" }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            margin: "0 0 16px",
            textAlign: "center",
          }}
        >
          Select Your eBay Marketplace
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {MARKET_LIST.map((m) => {
            const info = MARKET_HIGHLIGHTS[m.id];
            return (
              <Link
                key={m.id}
                href={`/ebay-fee-calculator/${m.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  padding: "22px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  transition: "all 0.2s ease",
                  boxShadow: "var(--shadow-sm)",
                }}
                className="market-card"
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
                  <FlagIcon code={m.id} size={52} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      marginBottom: 3,
                    }}
                  >
                    eBay {m.fullName}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--color-text-tertiary)",
                      marginBottom: 8,
                    }}
                  >
                    {m.siteName} &middot; {m.currency.code}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                      }}
                    >
                      FVF {info.defaultFvf}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background: "#f1f5f9",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {info.perOrder}/order
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Fee comparison table */}
      <section
        className="card"
        style={{ padding: 24, overflowX: "auto", marginTop: 24 }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
          eBay Fee Rates by Marketplace
        </h2>
        <p
          className="muted"
          style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}
        >
          Compare default final value fee rates across all supported eBay
          marketplaces at a glance.
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
                Marketplace
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Default FVF (No Store)
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Default FVF (Store)
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Per-Order Fee
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Additional Fees
              </th>
            </tr>
          </thead>
          <tbody>
            {FEE_TABLE_ROWS.map((row) => (
              <tr
                key={row.id}
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                  <Link
                    href={`/ebay-fee-calculator/${row.id}`}
                    style={{
                      textDecoration: "none",
                      color: "var(--color-primary)",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <FlagIcon code={row.id} size={22} />
                    eBay {row.name}
                  </Link>
                </td>
                <td style={{ padding: "10px 12px" }}>{row.noStore}</td>
                <td style={{ padding: "10px 12px" }}>{row.store}</td>
                <td style={{ padding: "10px 12px" }}>{row.perOrder}</td>
                <td
                  className="muted"
                  style={{ padding: "10px 12px", fontSize: 13 }}
                >
                  {row.other}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p
          className="muted"
          style={{ fontSize: 12, marginBottom: 0, marginTop: 14 }}
        >
          Rates shown are defaults for the &ldquo;Everything Else&rdquo;
          category. Actual rates vary by category, store subscription, and
          seller status. Click any marketplace for detailed, category-specific
          calculations.
        </p>
      </section>

      {/* How it works */}
      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
          How to Use the eBay Fee Calculator
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
              desc: "Select from 7 eBay sites \u2014 US, UK, Germany, Australia, Canada, France, or Italy.",
            },
            {
              step: "2",
              title: "Enter sale details",
              desc: "Input your selling price, shipping, item cost, store type, and category.",
            },
            {
              step: "3",
              title: "Get instant results",
              desc: "See a full breakdown of final value fees, per-order fees, net profit, and margin.",
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
            Total Fees = Final Value Fee + Per-Order Fee + Optional Processing/Regulatory/Ad Fees.
          </li>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Net Profit = Revenue − Item Cost − Shipping Cost − Total Fees.
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
          Recheck category and store-tier details against official eBay documentation before publishing price changes.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn" href="https://www.ebay.com/sellercenter/selling/seller-fees" target="_blank" rel="noopener noreferrer">
            eBay US Fees
          </a>
          <a className="btn" href="https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4364" target="_blank" rel="noopener noreferrer">
            eBay UK Fees
          </a>
          <a className="btn" href="https://www.ebay.de/help/selling/fees-credits-invoices/verkaufsgebuehren?id=4822" target="_blank" rel="noopener noreferrer">
            eBay DE Fees
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
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
          borderRadius: "var(--radius)",
          padding: "40px 24px",
          textAlign: "center",
          color: "#fff",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>
          Ready to calculate your eBay fees?
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
          Pick your marketplace and get an instant, detailed fee breakdown with
          profit analysis.
        </p>
        <Link
          href="/ebay-fee-calculator/us"
          className="btn"
          style={{
            background: "#fff",
            color: "var(--color-primary)",
            fontWeight: 700,
            padding: "12px 28px",
            fontSize: 15,
            borderRadius: "var(--radius-sm)",
            textDecoration: "none",
          }}
        >
          Try eBay US Calculator
        </Link>
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
        Fee rates are updated regularly based on official eBay seller fee
        schedules. Each calculator provides category-specific final value fees,
        payment processing, and profit analysis.
      </p>
    </div>
  );
}
