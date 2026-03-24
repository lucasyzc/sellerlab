import type { Metadata } from "next";
import Link from "next/link";
import { MARKET_LIST } from "./market-config";
import { FlagIcon } from "../components/country-flags";
import { absoluteUrl } from "@/lib/site-url";
import { withSuiteBrand } from "@/lib/brand";

const TOOL_TITLE = withSuiteBrand("eBay Fee Calculator – All Marketplaces");

export const metadata: Metadata = {
  title: TOOL_TITLE,
  description:
    "Free eBay fee calculator for US, UK, Germany, Australia, Canada, France, and Italy. Compare final value fees, per-order fees, and selling costs across all major eBay marketplaces.",
  keywords: [
    "ebay fee calculator",
    "ebay fees",
    "ebay seller fees",
    "ebay profit calculator",
    "final value fee calculator",
    "ebay selling fees 2026",
    "ebay fee comparison",
  ],
  openGraph: {
    title: TOOL_TITLE,
    description:
      "Compare eBay selling fees and calculate profit across 7 major eBay marketplaces worldwide.",
    type: "website",
    siteName: "Data EDE",
    url: "/ebay-fee-calculator",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: TOOL_TITLE,
    description:
      "Compare eBay selling fees and calculate profit across 7 major eBay marketplaces worldwide.",
  },
  alternates: {
    canonical: "/ebay-fee-calculator",
  },
};

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
    "@type": "WebApplication",
    name: "eBay Fee Calculator",
    url: absoluteUrl("/ebay-fee-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free eBay fee calculator covering 7 marketplaces. Calculate final value fees, payment processing fees, and net profit for eBay sellers.",
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
    a: "eBay charges a final value fee (typically 12\u201313% for most categories) plus a per-order fee ($0.30 in the US). Store subscribers get lower rates. Additional fees may apply for payment processing, international sales, and promoted listings.",
  },
  {
    q: "What is eBay\u2019s final value fee?",
    a: "The final value fee is a percentage of the total sale amount (item price + shipping). Rates vary by category, seller type, and marketplace. For US sellers without a store, the default rate is 13.25% on the first $7,500 and 2.35% above that.",
  },
  {
    q: "Do eBay fees differ by country?",
    a: "Yes. Each eBay marketplace (US, UK, Germany, Australia, etc.) has its own fee structure with different final value fee rates, per-order fees, and additional charges like regulatory fees (UK) or payment processing fees.",
  },
  {
    q: "How can I reduce my eBay selling fees?",
    a: "You can reduce fees by subscribing to an eBay Store (lower final value fee rates), achieving Top Rated Seller status (10% FVF discount), and listing in categories with lower fee rates. Use our calculator to compare costs across different configurations.",
  },
  {
    q: "Which eBay marketplace has the lowest fees?",
    a: "European marketplaces like eBay.fr and eBay.it generally have lower fees for private sellers (around 8%), while eBay.de offers 0% fees for domestic private sellers. Among English-speaking markets, eBay US and UK have similar rates around 13%, with store subscriptions bringing rates down to ~12%.",
  },
  {
    q: "Does eBay charge fees on shipping?",
    a: "Yes. eBay\u2019s final value fee is calculated on the total sale amount, which includes the shipping amount the buyer pays. This is why offering \u201cfree shipping\u201d by building shipping costs into your item price doesn\u2019t save on fees.",
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
          eBay Fee Calculator
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


