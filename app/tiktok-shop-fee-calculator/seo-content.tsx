import Link from "next/link";
import {
  type TikTokMarketConfig,
  FBT_WEIGHT_TIERS,
} from "./tiktok-config";
import { FlagIcon } from "../components/country-flags";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

type FAQ = { q: string; a: string };

type FeeTableRow = {
  category: string;
  rate: string;
  notes?: string;
};

// ═══════════════════════════════════════════════════════════════
// Auto-generation helpers
// ═══════════════════════════════════════════════════════════════

function generateFeeTableRows(config: TikTokMarketConfig): FeeTableRow[] {
  const rows: FeeTableRow[] = [];
  const seen = new Set<string>();

  for (const cat of config.categories) {
    const rule = config.referralRules[cat.value] ?? config.referralRules["default"];
    const rateKey = JSON.stringify(rule);

    if (seen.has(rateKey)) continue;
    seen.add(rateKey);

    let rate: string;
    let notes: string | undefined;

    if (rule.highValueRate !== undefined && rule.highValueThreshold) {
      rate = `${rule.rate}%`;
      notes = `${rule.highValueRate}% on portion over $${rule.highValueThreshold.toLocaleString()}`;
    } else {
      rate = `${rule.rate}%`;
    }

    const label = rule === config.referralRules["default"]
      ? "Most Categories"
      : cat.label;

    rows.push({ category: label, rate, notes });
  }

  return rows;
}

function generateFAQs(config: TikTokMarketConfig): FAQ[] {
  return [
    {
      q: `What fees does TikTok Shop charge sellers in the ${config.fullName}?`,
      a: `TikTok Shop ${config.fullName} charges a referral fee on every completed order, typically 6% for most categories (5% for select jewelry). In the US, payment processing is included in the referral fee \u2014 there is no separate payment processing charge. If you use FBT (Fulfilled by TikTok), additional fulfillment and storage fees apply.`,
    },
    {
      q: "What is TikTok Shop\u2019s referral fee and how is it calculated?",
      a: `The referral fee is a percentage of the sold price (excluding tax). For most US categories it's 6%. The formula is: Referral Fee Rate \u00d7 (Customer Payment + Platform Discount \u2212 Tax). Some categories like premium jewelry have a lower 5% rate. New sellers can get a promotional 3% rate for their first 30 days.`,
    },
    {
      q: "What is the new seller promotion on TikTok Shop?",
      a: `New sellers who complete onboarding and make their first sale within 60 days receive a discounted 3% referral fee rate (instead of the standard 5\u20136%) for 30 days. After the promotion period ends, the standard category-level referral fee rate applies.`,
    },
    {
      q: "What are FBT (Fulfilled by TikTok) fees?",
      a: `FBT is TikTok\u2019s end-to-end fulfillment service, similar to Amazon FBA. FBT fees cover pick, pack, and shipping. For single-unit orders in the 0\u20134 lb range, fees start at $3.58 per unit. Multi-unit orders get volume discounts (up to 24% lower). All FBT products qualify for free shipping to customers by default. Each unit must not exceed 50 lb and no single side may exceed 26 inches.`,
    },
    {
      q: "How does FBT storage pricing work?",
      a: `FBT storage is free for the first 60 days after inventory is received. After that, daily storage fees apply based on the cubic footage your inventory occupies. Rates increase the longer inventory sits: 61\u201390 days has the lowest rate, while inventory stored beyond 270 days incurs the highest daily rate. Keep your sell-through rate high to avoid storage costs.`,
    },
    {
      q: "How do affiliate commissions work on TikTok Shop?",
      a: `Sellers can set commission rates for TikTok creators and affiliates who promote their products. Commission is calculated as a percentage of the sold price and is paid from the seller\u2019s revenue. Typical rates range from 5\u201330%, set by the seller. Affiliates are paid after orders are delivered and settled.`,
    },
    {
      q: "What is the refund administration fee?",
      a: `When a refund, return, or cancellation occurs, TikTok Shop refunds the referral fee minus a Refund Administration Fee of 20% of the original referral fee. Since May 2025, this fee is capped at $5 per SKU. No fee is charged if the refund is initiated before shipping and meets auto-cancel criteria.`,
    },
    {
      q: "Is TikTok Shop cheaper than Amazon for sellers?",
      a: `TikTok Shop\u2019s base referral fee (6%) is significantly lower than Amazon\u2019s typical 15%. FBT fulfillment fees are also competitive. However, TikTok Shop typically requires affiliate commissions (5\u201330%) and ad spend to drive traffic, whereas Amazon has built-in organic search intent. Total cost depends on your marketing strategy.`,
    },
  ];
}

function generateExplanations(config: TikTokMarketConfig) {
  return [
    {
      title: "Referral Fees",
      text: `TikTok Shop charges a referral fee on every completed order, calculated as a percentage of the sold price (excluding sales tax). For most US categories, the rate is 6%. Select premium jewelry sub-categories (Diamond, Gold, Jade, Platinum, Ruby/Sapphire/Emerald) have a lower 5% rate. Pre-Owned items are also 5%, with a reduced 3% rate on any portion exceeding $10,000. In the US, payment processing is included \u2014 there is no separate payment processing fee.`,
    },
    {
      title: "FBT Fulfillment Fees",
      text: `Fulfilled by TikTok (FBT) handles picking, packing, and shipping to customers. Fees are charged per unit and vary by weight tier. Single-unit orders start at $3.58 for items up to 8 oz. Multi-unit orders from the same seller get volume discounts: 2-unit orders receive ~20% off, and 4+ unit orders can save up to 24%. Chargeable weight is the greater of actual weight or dimensional weight (L\u00d7W\u00d7H\u00f7166), unless the item weighs \u22641 lb and volume \u2264166 in\u00b3.`,
    },
    {
      title: "FBT Storage Fees",
      text: `FBT provides 60 days of free storage after inventory is received at the fulfillment center. After day 60, daily storage fees apply based on the cubic footage of your inventory. Rates are tiered by duration: inventory stored 61\u201390 days has the lowest rate, while storage beyond 270 days has the highest. Products that sell within the 60-day free window incur no storage costs at all.`,
    },
    {
      title: "Affiliate Commissions & Ad Spend",
      text: `Unlike traditional marketplaces with built-in search traffic, TikTok Shop relies heavily on creator-driven content and paid advertising. Sellers set affiliate commission rates (typically 5\u201330%) to incentivize creators to promote their products. TikTok Ads require a minimum $50/day campaign budget or $20/day per ad group. Both costs should be factored into your per-unit profitability calculations.`,
    },
    {
      title: "Reducing Your Selling Costs",
      text: `To maximize profit on TikTok Shop: optimize product packaging to keep weight under 4 lb for the lowest FBT tiers; encourage multi-unit purchases to benefit from volume FBT discounts; maintain high sell-through rates to avoid storage fees; test affiliate commission rates to find the sweet spot between creator engagement and margin; and track your ad spend ROI carefully \u2014 measure profit-based ROAS, not just revenue-based.`,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// Structured Data (JSON-LD)
// ═══════════════════════════════════════════════════════════════

export function MarketStructuredData({ config }: { config: TikTokMarketConfig }) {
  const url = `/tiktok-shop-fee-calculator/${config.id}`;
  const faqs = generateFAQs(config);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://sellerlab.tools/" },
      { "@type": "ListItem", position: 2, name: "TikTok Shop Fee Calculator", item: "https://sellerlab.tools/tiktok-shop-fee-calculator" },
      { "@type": "ListItem", position: 3, name: config.seo.h1, item: `https://sellerlab.tools${url}` },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.seo.h1,
    url: `https://sellerlab.tools${url}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: config.currency.code },
    description: config.seo.description,
    featureList: [
      "Referral fee calculation by category",
      "FBT fulfillment fee estimation",
      "FBT storage cost calculation",
      "Affiliate commission tracking",
      "Ad spend impact analysis",
      "Net profit and margin analysis",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Calculate TikTok Shop ${config.fullName} Selling Fees`,
    description: `Use the ${config.seo.h1} to calculate referral fees, FBT fulfillment costs, affiliate commissions, and net profit when selling on TikTok Shop.`,
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose your category and fulfillment method",
        text: "Select your product category and choose between FBT (Fulfilled by TikTok) or self-fulfillment.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter pricing and costs",
        text: `Input your selling price in ${config.currency.code}, item cost, and other expenses.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Set marketing costs",
        text: "Enter your affiliate commission rate and ad spend per unit to see full cost impact.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Enter product dimensions (FBT)",
        text: "For FBT sellers, enter product weight and dimensions to calculate fulfillment fees.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Review fee breakdown and profit",
        text: "See a detailed breakdown of referral fees, FBT fees, marketing costs, and your net profit margin.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([breadcrumb, webApp, faqSchema, howTo]),
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// Breadcrumb
// ═══════════════════════════════════════════════════════════════

export function MarketBreadcrumb({ config }: { config: TikTokMarketConfig }) {
  return (
    <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 12px" }}>
      <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        Home
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <Link href="/tiktok-shop-fee-calculator" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        TikTok Shop Fee Calculator
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <span style={{ color: "var(--color-text-secondary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <FlagIcon code={config.id} size={16} /> TikTok Shop {config.fullName}
      </span>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════
// Fee Table
// ═══════════════════════════════════════════════════════════════

const TH_STYLE: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

export function MarketFeeTable({ config }: { config: TikTokMarketConfig }) {
  const rows = generateFeeTableRows(config);

  return (
    <section className="card" style={{ padding: 24, overflowX: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <FlagIcon code={config.id} size={22} /> TikTok Shop {config.fullName} Referral Fee Rates
        </span>
      </h2>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>
        Referral fee rates for selling on TikTok Shop {config.fullName}. Payment processing is included in the referral fee.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            <th style={TH_STYLE}>Category</th>
            <th style={TH_STYLE}>Referral Fee</th>
            <th style={TH_STYLE}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.category}</td>
              <td style={{ padding: "10px 12px" }}>{row.rate}</td>
              <td className="muted" style={{ padding: "10px 12px", fontSize: 13 }}>{row.notes || "\u2014"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 24, marginBottom: 4 }}>
        FBT Fulfillment Fee Rate Card
      </h3>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 16 }}>
        Per-unit FBT fulfillment fees by weight tier and units per order (effective January 12, 2026).
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            <th style={TH_STYLE}>Weight Tier</th>
            <th style={TH_STYLE}>1 Unit</th>
            <th style={TH_STYLE}>2 Units</th>
            <th style={TH_STYLE}>3 Units</th>
            <th style={TH_STYLE}>4+ Units</th>
          </tr>
        </thead>
        <tbody>
          {FBT_WEIGHT_TIERS.map((tier, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{tier.label}</td>
              <td style={{ padding: "10px 12px" }}>${tier.singleUnit.toFixed(2)}</td>
              <td style={{ padding: "10px 12px" }}>${tier.twoUnits.toFixed(2)}</td>
              <td style={{ padding: "10px 12px" }}>${tier.threeUnits.toFixed(2)}</td>
              <td style={{ padding: "10px 12px" }}>${tier.fourPlusUnits.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ fontSize: 12, marginBottom: 0, marginTop: 14 }}>
        Rates are based on publicly available TikTok Shop fee schedules. Multi-unit pricing applies when 2+ units from
        the same seller are purchased in one checkout. Use the calculator for exact figures.
      </p>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Fee Explanation
// ═══════════════════════════════════════════════════════════════

export function MarketFeeExplanation({ config }: { config: TikTokMarketConfig }) {
  const sections = generateExplanations(config);

  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
        Understanding TikTok Shop {config.fullName} Selling Fees
      </h2>
      {sections.map((section, i) => (
        <div key={i} style={{ marginBottom: i < sections.length - 1 ? 20 : 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>
            {section.title}
          </h3>
          <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            {section.text}
          </p>
        </div>
      ))}
      <p className="muted" style={{ fontSize: 12, marginTop: 16, marginBottom: 0 }}>
        Fee information is based on the official TikTok Shop seller fee schedule. Always verify current rates on{" "}
        <a
          href="https://seller-us.tiktok.com/university/essay?knowledge_id=5982454398175018"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-primary)" }}
        >
          TikTok Shop Seller Center
        </a>.
      </p>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAQ Accordion
// ═══════════════════════════════════════════════════════════════

export function MarketFAQ({ config }: { config: TikTokMarketConfig }) {
  const faqs = generateFAQs(config);

  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: "grid", gap: 0 }}>
        {faqs.map((item, i) => (
          <details
            key={i}
            style={{
              borderBottom: i < faqs.length - 1 ? "1px solid var(--color-border)" : "none",
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
            <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 14, lineHeight: 1.7 }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
