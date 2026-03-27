import type { Metadata } from "next";
import Link from "next/link";
import { FlagIcon } from "../components/country-flags";
import { MARKET_LIST } from "../ebay-fee-calculator/market-config";
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
  withSeoYear("eBay Pricing Calculator - All Marketplaces", FEE_SEO_YEAR),
);

export const metadata: Metadata = buildFeeMetadata({
  title: TOOL_TITLE,
  description:
    "Free eBay pricing calculator for US, UK, Germany, Australia, Canada, France, and Italy. Back-solve listing price from costs, discount rate, and profit targets.",
  canonicalPath: "/ebay-pricing-calculator",
  keywords: [
    "ebay pricing calculator",
    "ebay listing price calculator",
    "ebay target profit calculator",
    "ebay selling price calculator",
    "ebay margin calculator",
    "ebay break even price",
  ],
  yearKeywordPhrases: [
    "ebay pricing calculator 2026",
    "ebay listing price calculator 2026",
    "ebay target profit price calculator",
  ],
  lastReviewed: HUB_LAST_REVIEWED,
  openGraphDescription:
    "Back-solve listing prices for eBay across 7 major marketplaces using target profit amount or margin.",
  twitterDescription:
    "Find the minimum eBay listing price that meets your target profit.",
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
        name: "eBay Pricing Calculator",
        item: absoluteUrl("/ebay-pricing-calculator"),
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `eBay Pricing Calculator ${FEE_SEO_YEAR}`,
    url: absoluteUrl("/ebay-pricing-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: HUB_LAST_REVIEWED,
    description:
      "eBay listing price calculator to back-solve target profit and margin with market-specific fee models.",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is the required listing price calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The calculator back-solves listing price from your target profit rule, discount rate, shipping, and market-specific eBay fee model.",
        },
      },
      {
        "@type": "Question",
        name: "Does this include promoted listing and tax inputs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can include ad rate and tax assumptions to model practical profitability before publishing a listing.",
        },
      },
      {
        "@type": "Question",
        name: "Is this updated for 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. This pricing hub is aligned to 2026 fee-search intent and last reviewed on ${HUB_LAST_REVIEWED}.`,
        },
      },
    ],
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

export default function EbayPricingCalculatorHubPage() {
  return (
    <div className="container">
      <StructuredData />

      <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 0" }}>
        <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>eBay Pricing Calculator</span>
      </nav>

      <section style={{ textAlign: "center", padding: "40px 0 12px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
          eBay Pricing Calculator ({FEE_SEO_YEAR})
        </h1>
        <p className="muted" style={{ fontSize: 17, maxWidth: 760, margin: "0 auto", lineHeight: 1.65 }}>
          Choose your marketplace, enter your costs and target profit, and get the minimum listing
          price needed to stay profitable after eBay fees.
        </p>
        <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 12 }}>
          {lastReviewedLabel(HUB_LAST_REVIEWED)}
        </p>
      </section>

      <section style={{ padding: "20px 0 8px", marginTop: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px", textAlign: "center" }}>
          Select Your eBay Market
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {MARKET_LIST.map((market) => (
            <Link
              key={market.id}
              href={`/ebay-pricing-calculator/${market.id}`}
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
              <div style={{ flexShrink: 0, borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", lineHeight: 0 }}>
                <FlagIcon code={market.id} size={52} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>
                  {market.fullName}
                </div>
                <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {market.siteName} · {market.currency.code}
                </div>
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>
                  Open Calculator →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 20, marginTop: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
          Calculation Logic
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Sold Price = Listing Price × (1 − Discount Rate).
          </li>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Net Profit = Revenue − Item Cost − Shipping Cost − Other Costs − Total eBay Fees.
          </li>
          <li className="muted" style={{ lineHeight: 1.7 }}>
            Solver target: find the minimum Listing Price where target profit amount or margin is reached.
          </li>
        </ul>
      </section>

      <section className="card" style={{ padding: 20, marginTop: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
          Primary Sources
        </h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 10, lineHeight: 1.7 }}>
          Always validate final category-level decisions against official eBay fee documentation for your target market.
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

      <section className="card" style={{ padding: 20, marginTop: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
          FAQ
        </h2>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            {
              q: "How do I set a safe floor listing price?",
              a: "Use target profit mode with conservative ad and discount assumptions, then add a buffer before live listing.",
            },
            {
              q: "Can I compare markets with the same product cost?",
              a: "Yes. Keep costs fixed and switch marketplace cards to compare required listing prices and margin pressure.",
            },
            {
              q: "Is this calculator updated for 2026 market conditions?",
              a: `Yes. Updated for 2026, last reviewed on ${HUB_LAST_REVIEWED}.`,
            },
          ].map((item, i, list) => (
            <details key={item.q} style={{ borderBottom: i < list.length - 1 ? "1px solid var(--color-border)" : "none", paddingBottom: 10 }}>
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{item.q}</summary>
              <p className="muted" style={{ marginBottom: 0, lineHeight: 1.7 }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}

