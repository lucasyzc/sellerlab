import Link from "next/link";
import {
  type AmazonMarketConfig,
  describeReferralRule,
} from "./amazon-config";
import { FlagIcon } from "../components/country-flags";
import { absoluteUrl } from "@/lib/site-url";
import { resolveLastReviewed, resolveSeoYear, withSeoYear } from "@/lib/fee-seo";
import { FAQSection, faqAnswerToText } from "../components/faq-section";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

type FAQ = { q: string; a: string };

type FeeTableRow = {
  category: string;
  rate: string;
  minFee: string;
  notes?: string;
};

// ═══════════════════════════════════════════════════════════════
// Auto-generation helpers
// ═══════════════════════════════════════════════════════════════

function fmtMinFee(value: number, config: AmazonMarketConfig): string {
  if (value <= 0) return "\u2014";
  const d = config.currency.decimals;
  return `${config.currency.symbol}${value.toFixed(d)}`;
}

function generateFeeTableRows(config: AmazonMarketConfig): FeeTableRow[] {
  const sym = config.currency.symbol;
  const d = config.currency.decimals;
  const defaultRule = config.referralRules["default"];
  const rows: FeeTableRow[] = [];

  rows.push({
    category: "Most Categories",
    rate: describeReferralRule(defaultRule, sym),
    minFee: fmtMinFee(defaultRule.minFee, config),
    notes: "Default rate",
  });

  const seen = new Set<string>();
  seen.add(JSON.stringify(defaultRule));

  for (const cat of config.categories) {
    const rule = config.referralRules[cat.value];
    if (!rule) continue;
    const key = JSON.stringify(rule);
    if (seen.has(key)) continue;
    seen.add(key);

    rows.push({
      category: cat.label,
      rate: describeReferralRule(rule, sym),
      minFee: fmtMinFee(rule.minFee, config),
      notes: rule.closingFee > 0
        ? `+${sym}${rule.closingFee.toFixed(d)} closing fee`
        : undefined,
    });
  }

  return rows;
}

function generateFAQs(config: AmazonMarketConfig): FAQ[] {
  const sym = config.currency.symbol;
  const d = config.currency.decimals;
  const indFee = `${sym}${config.individualFee.toFixed(d)}`;
  const proLabel = config.sellerTypes.find(s => s.value === "professional")?.label ?? "Professional";
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });
  const seoYear = resolveSeoYear(config.seo.effectiveYear);

  return [
    {
      q: `How much does Amazon ${config.fullName} charge in seller fees?`,
      a: `Amazon ${config.fullName} (${config.domain}) charges a referral fee on every sale, typically 15% for most categories. ${proLabel} sellers pay a monthly subscription, while Individual sellers pay an additional ${indFee} per item sold. FBA sellers also pay fulfillment and storage fees.`,
    },
    {
      q: "What is the difference between FBA and FBM fees?",
      a: `FBA (Fulfilled by Amazon) sellers pay Amazon to store, pack, and ship their products, including a per-unit fulfillment fee based on size and weight, plus monthly storage fees. FBM (Fulfilled by Merchant) sellers handle their own shipping and storage. Both pay the same referral fees on ${config.domain}.`,
    },
    {
      q: `How are FBA fulfillment fees calculated on ${config.domain}?`,
      a: `FBA fees depend on the product\u2019s size tier and shipping weight. Size tier is determined by the product\u2019s dimensions (${config.units.dimLabel}) and weight (${config.units.major}). Smaller items have lower fees, while oversize items incur significantly higher rates. Apparel and dangerous goods may have surcharges.`,
    },
    {
      q: `What are Amazon ${config.fullName}\u2019s FBA storage fees?`,
      a: `FBA monthly storage fees are based on the daily average volume of your inventory. Rates are lower from January to September and increase during peak season (October\u2013December). Oversize items generally have different rates than standard-size items.`,
    },
    {
      q: `Which categories have the lowest referral fees on ${config.domain}?`,
      a: `Categories like Electronics and Computers typically have lower referral fees (7\u20138%). Most categories charge 15%. Some categories like Jewelry and Watches use tiered rates that decrease for higher-priced items. Use the calculator above to see exact rates for your category.`,
    },
    {
      q: "How can I reduce my Amazon selling fees?",
      a: `Choose the Professional plan if selling enough items per month to offset the subscription fee. Optimize packaging to qualify for a smaller FBA size tier. Keep inventory lean to reduce storage fees, especially during Q4. Consider FBM for heavy or oversize items where FBA fees are high.`,
    },
    {
      q: `Is this Amazon ${config.fullName} fee model updated for ${seoYear}?`,
      a: `Yes. This market model is reviewed for ${seoYear}. Last reviewed: ${lastReviewed}. Always verify official Amazon Seller Central announcements before finalizing pricing.`,
    },
  ];
}

function generateExplanations(config: AmazonMarketConfig) {
  const sym = config.currency.symbol;
  const d = config.currency.decimals;
  const indFee = `${sym}${config.individualFee.toFixed(d)}`;
  const proLabel = config.sellerTypes.find(s => s.value === "professional")?.label ?? "Professional";

  return [
    {
      title: "Referral Fees",
      text: `Amazon charges a referral fee on every sale, calculated as a percentage of the total sales price (item price + shipping + gift wrap). The rate varies by category on ${config.domain} \u2014 most categories charge 15%, but rates can range from 7% to 20%+. Some categories like Jewelry and Watches use tiered rates where different percentages apply to different portions of the price.`,
    },
    {
      title: "Per-Item Fee & Seller Plans",
      text: `Amazon offers two selling plans: ${proLabel} and Individual (${indFee} per item sold). Professional sellers also get access to additional selling tools, bulk listing, and API access. For sellers moving enough items per month, the Professional plan is more cost-effective.`,
    },
    {
      title: "FBA Fulfillment Fees",
      text: `FBA (Fulfilled by Amazon) sellers pay a per-unit fulfillment fee based on the product\u2019s size tier and shipping weight. Products are classified into size tiers based on their dimensions (${config.units.dimLabel}) and weight (${config.units.major}). Shipping weight is typically the greater of unit weight or dimensional weight for larger items.`,
    },
    {
      title: "FBA Storage Fees",
      text: `Amazon charges monthly storage fees based on the daily average volume of inventory stored in fulfillment centers. Rates increase during Q4 peak season (October\u2013December). Oversize items have different rates from standard-size items. Long-term storage surcharges may apply for inventory stored over 365 days.`,
    },
    {
      title: "Reducing Your Amazon Fees",
      text: `To minimize fees: choose the Professional plan if selling enough items/month; optimize product packaging to qualify for a smaller size tier; keep inventory lean to reduce storage fees, especially during Q4; consider FBM for heavy or oversize items where FBA fees are high; and verify your product is listed in the correct category.`,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// Structured Data (JSON-LD)
// ═══════════════════════════════════════════════════════════════

export function MarketStructuredData({ config }: { config: AmazonMarketConfig }) {
  const url = `/amazon-fee-calculator/${config.id}`;
  const faqs = generateFAQs(config);
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Amazon Fee Calculator", item: absoluteUrl("/amazon-fee-calculator") },
      { "@type": "ListItem", position: 3, name: config.seo.h1, item: absoluteUrl(url) },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: withSeoYear(config.seo.h1, seoYear),
    url: absoluteUrl(url),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: config.currency.code },
    dateModified: lastReviewed,
    description: config.seo.description,
    featureList: [
      "Referral fee calculation by category",
      "FBA fulfillment fee estimation",
      "FBA storage cost calculation",
      "Size tier auto-classification",
      "Net profit and margin analysis",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerToText(item.a) },
    })),
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Calculate Amazon ${config.fullName} Selling Fees`,
    description: `Use the ${config.seo.h1} to calculate referral fees, FBA fulfillment costs, storage fees, and net profit when selling on ${config.domain}.`,
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose your seller type and category",
        text: "Select Professional or Individual seller type, then pick the product category that matches your item.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select fulfillment method",
        text: "Choose FBA (Fulfilled by Amazon) or FBM (Fulfilled by Merchant).",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter sale details and costs",
        text: `Input your selling price in ${config.currency.code}, shipping charges, item cost, and other expenses.`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Enter product dimensions (FBA)",
        text: "For FBA sellers, enter product weight and dimensions. The calculator automatically determines the size tier.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Review fee breakdown and profit",
        text: "See a detailed breakdown of referral fees, FBA fees, storage costs, and your net profit margin.",
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

export function MarketBreadcrumb({ config }: { config: AmazonMarketConfig }) {
  return (
    <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 12px" }}>
      <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        Home
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <Link href="/amazon-fee-calculator" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        Amazon Fee Calculator
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <span style={{ color: "var(--color-text-secondary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <FlagIcon code={config.id} size={16} /> Amazon {config.fullName}
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

export function MarketFeeTable({ config }: { config: AmazonMarketConfig }) {
  const rows = generateFeeTableRows(config);

  return (
    <section className="card" style={{ padding: 24, overflowX: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <FlagIcon code={config.id} size={22} /> Amazon {config.fullName} Referral Fee Rates by Category
        </span>
      </h2>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>
        Referral fee rates for selling on {config.domain}. Rates apply to the total sales price (item price + shipping + gift wrap).
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            <th style={TH_STYLE}>Category</th>
            <th style={TH_STYLE}>Referral Fee Rate</th>
            <th style={TH_STYLE}>Min Fee</th>
            <th style={TH_STYLE}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.category}</td>
              <td style={{ padding: "10px 12px" }}>{row.rate}</td>
              <td style={{ padding: "10px 12px" }}>{row.minFee}</td>
              <td className="muted" style={{ padding: "10px 12px", fontSize: 13 }}>{row.notes || "\u2014"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ fontSize: 12, marginBottom: 0, marginTop: 14 }}>
        Rates shown are representative. Some categories use tiered or threshold-based rates.
        Individual sellers may pay an additional per-item fee. Use the calculator for exact figures.
      </p>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Fee Explanation
// ═══════════════════════════════════════════════════════════════

export function MarketFeeExplanation({ config }: { config: AmazonMarketConfig }) {
  const sections = generateExplanations(config);

  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
        Understanding Amazon {config.fullName} Selling Fees
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
        Fee information is based on the official Amazon seller fee schedule. Always verify current rates on{" "}
        <a
          href={`https://sellercentral.${config.domain.replace("amazon.", "")}/help/hub/reference/G200336920`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-primary)" }}
        >
          Amazon Seller Central
        </a>.
      </p>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAQ Accordion
// ═══════════════════════════════════════════════════════════════

export function MarketFAQ({ config }: { config: AmazonMarketConfig }) {
  const faqs = generateFAQs(config);
  return <FAQSection items={faqs} />;
}
