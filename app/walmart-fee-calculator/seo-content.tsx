import Link from "next/link";
import { type CSSProperties } from "react";
import {
  type WalmartFormState,
  type WalmartMarketConfig,
  calculate,
  describeReferralRule,
  formatCurrency,
  makeDefaultForm,
} from "./walmart-config";
import { FlagIcon } from "../components/country-flags";
import { absoluteUrl } from "@/lib/site-url";
import { resolveLastReviewed, resolveSeoYear, withSeoYear } from "@/lib/fee-seo";

type FAQ = { q: string; a: string };

type ComparisonRow = {
  platform: string;
  referralModel: string;
  baselineRange: string;
  fulfillmentLayer: string;
  notes: string;
};

type WfsTableRow = {
  tier: string;
  fee: string;
};

const US_WFS_FEE_ROWS: WfsTableRow[] = [
  { tier: "<= 1 lb", fee: "$3.45" },
  { tier: "<= 2 lb", fee: "$4.95" },
  { tier: "<= 3 lb", fee: "$5.45" },
  { tier: "4-20 lb", fee: "$5.75 + $0.40 per lb above 4" },
  { tier: "21-30 lb", fee: "$15.55 + $0.40 per lb above 21" },
  { tier: "31-50 lb", fee: "$14.55 + $0.40 per lb above 31" },
  { tier: "51+ lb", fee: "$17.55 + $0.40 per lb above 51" },
];

const CA_WFS_FEE_ROWS: WfsTableRow[] = [
  { tier: "< 1 lb", fee: "C$5.50" },
  { tier: "1-3 lb", fee: "C$6.50" },
  { tier: "4-6 lb", fee: "C$8.50" },
  { tier: "7-11 lb", fee: "C$10.10" },
  { tier: "12-20 lb", fee: "C$10.10 + C$0.40 per lb above 11" },
  { tier: "21-30 lb", fee: "C$18.00 + C$0.40 per lb above 21" },
  { tier: "31-50 lb", fee: "C$24.00 + C$0.20 per lb above 31" },
  { tier: "51-70 lb", fee: "C$28.00 + C$0.20 per lb above 51" },
  { tier: "71-150 lb", fee: "C$32.00 + C$0.40 per lb above 71" },
  { tier: "151-350 lb", fee: "C$150.00 + C$0.40 per lb above 151" },
  { tier: "351-500 lb", fee: "C$350.00 + C$0.40 per lb above 351" },
];

const CL_WFS_FEE_ROWS: WfsTableRow[] = [
  { tier: "XS (< 2 kg)", fee: "$2,000" },
  { tier: "S1 (2 to < 4 kg)", fee: "$2,500" },
  { tier: "S2 (4 to < 6 kg)", fee: "$3,990" },
  { tier: "S3 (6 to < 15 kg)", fee: "$4,250" },
  { tier: "M1 (15 to < 25 kg)", fee: "$5,590" },
  { tier: "M2 (25 to < 50 kg)", fee: "$6,290" },
  { tier: "L (50 to < 400 kg)", fee: "$6,990" },
  { tier: "XL (>= 400 kg)", fee: "$18,990" },
];

function latestAsOf(config: WalmartMarketConfig): string | undefined {
  return config.docs
    .map((doc) => doc.asOf)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);
}

function faqItems(config: WalmartMarketConfig): FAQ[] {
  const wfsAnswer = config.wfs.mode === "manual"
    ? "This market uses manual WFS inputs in the calculator. Copy fulfillment, shipping recovery, and storage amounts from your active seller tariff card."
    : "WFS calculations use this market's published public formulas for fulfillment and optional storage. Enter weight and dimensions to estimate chargeable logistics fees.";
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });

  return [
    {
      q: `How is Walmart ${config.fullName} referral fee calculated?`,
      a: config.summary.referralSummary,
    },
    {
      q: "Does Walmart charge a separate payment processing fee?",
      a: config.summary.paymentSummary,
    },
    {
      q: "How does the WFS model work in this calculator?",
      a: wfsAnswer,
    },
    {
      q: "Is this calculator suitable for real pricing decisions?",
      a: config.summary.disclaimer,
    },
    {
      q: `Is this Walmart ${config.fullName} fee model updated for ${seoYear}?`,
      a: `Yes. This market model is reviewed for ${seoYear}. Last reviewed: ${lastReviewed}. Confirm live rates in Walmart Seller Center before publishing final prices.`,
    },
  ];
}

function referralRows(config: WalmartMarketConfig) {
  return config.categories.map((category) => {
    const rule = config.referralRules[category.value] ?? config.referralRules.default;
    return {
      category: category.label,
      referral: describeReferralRule(rule),
    };
  });
}

function wfsRows(config: WalmartMarketConfig): WfsTableRow[] {
  switch (config.wfs.mode) {
    case "us_official":
      return US_WFS_FEE_ROWS;
    case "ca_official":
      return CA_WFS_FEE_ROWS;
    case "cl_official":
      return CL_WFS_FEE_ROWS;
    default:
      return [];
  }
}

function wfsFootnote(config: WalmartMarketConfig): string {
  switch (config.wfs.mode) {
    case "us_official":
      return "US shipping weight in this model = rounded-up (max(unit weight, dimensional weight for items over 1 lb) + 0.25 lb packaging).";
    case "ca_official":
      return "Canada WFS model uses divisor 300 volumetric weight and applies oversize surcharges (+C$4 / +C$35) where public conditions apply.";
    case "cl_official":
      return "Chile WFS model uses chargeable-weight tiers and optional storage by daily m3 rates after free-month thresholds.";
    default:
      return "WFS amounts are entered manually based on your active marketplace tariff card.";
  }
}

function ExampleBreakdown({ config }: { config: WalmartMarketConfig }) {
  const defaultForm = makeDefaultForm(config);

  const sampleForm: WalmartFormState = {
    ...defaultForm,
    soldPrice: Math.max(defaultForm.soldPrice, config.currency.decimals === 0 ? 1000 : 10),
    shippingCharged: 0,
    paymentProcessingRate: 0,
    otherCosts: 0,
    manualWfsFulfillmentFee: config.wfs.mode === "manual"
      ? Math.max(defaultForm.manualWfsFulfillmentFee, defaultForm.soldPrice * 0.1)
      : defaultForm.manualWfsFulfillmentFee,
  };

  const result = calculate(sampleForm, config);
  const fmt = (value: number) => formatCurrency(value, config);
  const isWfs = sampleForm.fulfillmentMethod === "wfs";

  const rows: Array<{ label: string; value: string; strong?: boolean }> = [
    { label: "Revenue (selling price)", value: fmt(result.totalSalesPrice) },
    { label: "Referral fee", value: fmt(result.referralFee) },
  ];

  if (isWfs) {
    rows.push({ label: "WFS fulfillment fee", value: fmt(result.wfsFulfillmentFee) });
    if (result.wfsShippingRecoveryFee > 0) {
      rows.push({ label: "WFS shipping recovery fee", value: fmt(result.wfsShippingRecoveryFee) });
    }
    if (result.wfsStorageFee > 0) {
      rows.push({ label: "WFS storage fee", value: fmt(result.wfsStorageFee) });
    }
  }

  if (result.paymentProcessingFee > 0) {
    rows.push({ label: "Payment processing fee", value: fmt(result.paymentProcessingFee) });
  }

  rows.push({ label: "Product cost", value: fmt(sampleForm.itemCost) });

  if (!isWfs && sampleForm.shippingCost > 0) {
    rows.push({ label: "Seller shipping cost", value: fmt(sampleForm.shippingCost) });
  }

  rows.push({ label: "Net profit", value: fmt(result.netProfit), strong: true });
  rows.push({ label: "Net margin", value: `${result.margin.toFixed(2)}%`, strong: true });

  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 10 }}>
        Example Profit Breakdown
      </h2>
      <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 14, lineHeight: 1.7 }}>
        Sample scenario based on the current market defaults. This is an illustrative estimate for Walmart {config.fullName}.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.label} style={{ borderBottom: index < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.label}</td>
              <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: row.strong ? 700 : 500 }}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ marginTop: 14, marginBottom: 0, fontSize: 12 }}>
        Formula used: Profit = Revenue - Platform Fees - Product Cost - Seller Shipping (if self-fulfilled) - Other Costs.
      </p>
    </section>
  );
}

export function MarketStructuredData({ config }: { config: WalmartMarketConfig }) {
  const url = `/walmart-fee-calculator/${config.id}`;
  const faqs = faqItems(config);
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Walmart Fee Calculator", item: absoluteUrl("/walmart-fee-calculator") },
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
      `Walmart ${config.fullName} referral fee by category`,
      config.wfs.mode === "manual" ? "Manual WFS fee input mode" : `${config.wfs.label} automated fee model`,
      "Optional payment processing override",
      "Net profit and margin breakdown",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Calculate Walmart ${config.fullName} Seller Fees`,
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Select category and fulfillment method",
        text: "Choose the referral fee category and whether the order is seller-fulfilled or WFS.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter revenue and cost inputs",
        text: "Input selling price, optional shipping charged, product cost, and other costs.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter WFS inputs when applicable",
        text: config.wfs.mode === "manual"
          ? "Enter fulfillment, shipping recovery, and storage fees from your active WFS tariff card."
          : "Add weight, dimensions, and optional storage details to estimate WFS fulfillment and storage costs.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Review totals and margin",
        text: "Validate total fees, net profit, and profit margin before setting your price.",
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

export function MarketBreadcrumb({ config }: { config: WalmartMarketConfig }) {
  return (
    <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 12px" }}>
      <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        Home
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <Link href="/walmart-fee-calculator" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        Walmart Fee Calculator
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <span style={{ color: "var(--color-text-secondary)", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <FlagIcon code={config.id} size={16} /> Walmart {config.fullName}
      </span>
    </nav>
  );
}

const TH_STYLE: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

export function MarketFeeTable({ config }: { config: WalmartMarketConfig }) {
  const rows = referralRows(config);
  const asOf = latestAsOf(config);
  const rowsWfs = wfsRows(config);

  return (
    <section className="card" style={{ padding: 24, overflowX: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <FlagIcon code={config.id} size={22} /> Walmart {config.fullName} Referral Fees by Category
        </span>
      </h2>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>
        Data based on Walmart Marketplace documentation{asOf ? ` (as of ${asOf})` : ""}.
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            <th style={TH_STYLE}>Category</th>
            <th style={TH_STYLE}>Referral Rule</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.category} style={{ borderBottom: index < rows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.category}</td>
              <td style={{ padding: "10px 12px" }}>{row.referral}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 22, marginBottom: 8 }}>WFS Fulfillment Reference</h3>
      {config.wfs.mode === "manual" ? (
        <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 0, lineHeight: 1.7 }}>
          This market currently uses manual WFS inputs. Copy fulfillment, shipping recovery, and storage fees from your active Walmart fee card.
        </p>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                <th style={TH_STYLE}>Chargeable Tier</th>
                <th style={TH_STYLE}>Published Fee Formula</th>
              </tr>
            </thead>
            <tbody>
              {rowsWfs.map((row, index) => (
                <tr key={row.tier} style={{ borderBottom: index < rowsWfs.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.tier}</td>
                  <td style={{ padding: "10px 12px" }}>{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ fontSize: 12, marginBottom: 0, marginTop: 14 }}>
            {wfsFootnote(config)}
          </p>
        </>
      )}
    </section>
  );
}

export function MarketFeeExplanation({ config }: { config: WalmartMarketConfig }) {
  const comparisonRows: ComparisonRow[] = [
    {
      platform: `Walmart ${config.fullName}`,
      referralModel: config.summary.referralSummary,
      baselineRange: config.summary.shortFeeSummary,
      fulfillmentLayer: config.summary.wfsSummary,
      notes: config.summary.paymentSummary,
    },
    {
      platform: "Amazon US",
      referralModel: "Category-specific referral fees",
      baselineRange: "Typically 8% to 15%",
      fulfillmentLayer: "FBA/FBM with additional fulfillment and storage when FBA is used",
      notes: "Professional and Individual plan structures",
    },
    {
      platform: "TikTok Shop US",
      referralModel: "Category-based commission + optional program fees",
      baselineRange: "Varies by market and category",
      fulfillmentLayer: "Self-fulfilled or platform fulfillment programs",
      notes: "Promotional rates can vary by seller status",
    },
  ];

  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
        Understanding Walmart {config.fullName} Fees
      </h2>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 14, lineHeight: 1.75 }}>
        {config.summary.shortFeeSummary}
      </p>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 14, lineHeight: 1.75 }}>
        {config.summary.referralSummary} {config.summary.wfsSummary}
      </p>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>Platform Comparison Snapshot</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            <th style={TH_STYLE}>Platform</th>
            <th style={TH_STYLE}>Referral Model</th>
            <th style={TH_STYLE}>Public Baseline</th>
            <th style={TH_STYLE}>Fulfillment Layer</th>
            <th style={TH_STYLE}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row, index) => (
            <tr key={row.platform} style={{ borderBottom: index < comparisonRows.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.platform}</td>
              <td style={{ padding: "10px 12px" }}>{row.referralModel}</td>
              <td style={{ padding: "10px 12px" }}>{row.baselineRange}</td>
              <td style={{ padding: "10px 12px" }}>{row.fulfillmentLayer}</td>
              <td className="muted" style={{ padding: "10px 12px", fontSize: 13 }}>{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 20, marginBottom: 8 }}>Source Attribution</h3>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {config.docs.map((doc) => (
          <li key={doc.url} style={{ marginBottom: 6, fontSize: 13, lineHeight: 1.6 }}>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)" }}>
              {doc.title}
            </a>
            {doc.scope ? ` - ${doc.scope}` : ""}
            {doc.asOf ? ` (as of ${doc.asOf})` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MarketFAQ({ config }: { config: WalmartMarketConfig }) {
  const faqs = faqItems(config);

  return (
    <>
      <ExampleBreakdown config={config} />
      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "grid", gap: 0 }}>
          {faqs.map((item, index) => (
            <details
              key={item.q}
              style={{
                borderBottom: index < faqs.length - 1 ? "1px solid var(--color-border)" : "none",
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
    </>
  );
}
