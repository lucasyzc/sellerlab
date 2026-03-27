import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";
import { withSuiteBrand } from "@/lib/brand";

const LAST_REVIEWED = "2026-03-27";

type Term = {
  term: string;
  definition: string;
  note: string;
};

const TERMS: Term[] = [
  {
    term: "ROI",
    definition: "Return on Investment. Profit generated relative to total invested cost.",
    note: "Typical formula: ROI = Net Profit / Total Cost.",
  },
  {
    term: "ROAS",
    definition: "Return on Ad Spend. Revenue generated for each unit of ad spend.",
    note: "Typical formula: ROAS = Revenue / Ad Spend.",
  },
  {
    term: "ACOS",
    definition: "Advertising Cost of Sales. Ad spend as a percentage of attributed revenue.",
    note: "Typical formula: ACOS = Ad Spend / Ad Revenue.",
  },
  {
    term: "CTR",
    definition: "Click-Through Rate. Percentage of impressions that generate clicks.",
    note: "Typical formula: CTR = Clicks / Impressions.",
  },
  {
    term: "CVR",
    definition: "Conversion Rate. Percentage of clicks or sessions that convert to orders.",
    note: "Typical formula: CVR = Orders / Clicks.",
  },
  {
    term: "AOV",
    definition: "Average Order Value. Average revenue per completed order.",
    note: "Typical formula: AOV = Revenue / Number of Orders.",
  },
  {
    term: "FBA",
    definition: "Fulfillment by Amazon. Amazon stores, packs, ships, and handles customer service.",
    note: "Usually includes fulfillment and storage fees in unit economics.",
  },
  {
    term: "FBM",
    definition: "Fulfillment by Merchant. Seller handles storage, fulfillment, and shipping workflow.",
    note: "Shipping and operations costs are merchant-side variables.",
  },
  {
    term: "Break-even Price",
    definition: "Minimum selling price where net profit equals zero.",
    note: "Used to set floor pricing before ads and promotions.",
  },
  {
    term: "Contribution Margin",
    definition: "Revenue minus variable costs, expressed as value or percentage.",
    note: "Useful for evaluating campaign and channel viability.",
  },
];

export const metadata: Metadata = {
  title: withSuiteBrand("Ecommerce Glossary (ROI, ROAS, ACOS, FBA, FBM)"),
  description:
    "English glossary of ecommerce metrics and marketplace terms for sellers, including ROI, ROAS, ACOS, CTR, CVR, AOV, FBA, and FBM.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: withSuiteBrand("Ecommerce Glossary (ROI, ROAS, ACOS, FBA, FBM)"),
    description:
      "Definitions and formulas for core ecommerce metrics used in fee, pricing, and profit analysis.",
    type: "website",
    siteName: "Data EDE",
    url: "/glossary",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: withSuiteBrand("Ecommerce Glossary"),
    description: "Definitions and formulas for key seller metrics and marketplace terms.",
  },
};

function StructuredData() {
  const glossary = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "SellerLab Ecommerce Glossary",
    description:
      "Definitions and formulas for ecommerce metrics and marketplace operations terms.",
    url: absoluteUrl("/glossary"),
    hasDefinedTerm: TERMS.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.definition,
      url: absoluteUrl(`/glossary#${item.term.toLowerCase()}`),
      inDefinedTermSet: absoluteUrl("/glossary"),
    })),
    dateModified: LAST_REVIEWED,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(glossary) }}
    />
  );
}

export default function GlossaryPage() {
  return (
    <div className="container">
      <StructuredData />
      <section className="card" style={{ marginBottom: 12 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Ecommerce Glossary</h1>
        <p className="muted" style={{ marginTop: 0, marginBottom: 0, lineHeight: 1.7 }}>
          Canonical definitions for common seller metrics and operations terms used across
          pricing, fee modeling, and profitability analysis.
        </p>
        <p style={{ marginTop: 10, marginBottom: 0, fontSize: 12, color: "var(--color-text-tertiary)" }}>
          Last reviewed: {LAST_REVIEWED}
        </p>
      </section>

      <section className="card">
        <div style={{ display: "grid", gap: 14 }}>
          {TERMS.map((item) => (
            <article key={item.term} id={item.term.toLowerCase()} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 12 }}>
              <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 20 }}>{item.term}</h2>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{item.definition}</p>
              <p className="muted" style={{ margin: "8px 0 0", lineHeight: 1.7 }}>
                {item.note}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
