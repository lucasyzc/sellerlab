import Link from "next/link";
import type { MarketConfig, MarketId } from "./market-config";
import { absoluteUrl } from "@/lib/site-url";
import { resolveLastReviewed, resolveSeoYear, withSeoYear } from "@/lib/fee-seo";
import { FAQSection, faqAnswerToText } from "../components/faq-section";

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

type FAQ = { q: string; a: import("../components/faq-section").FAQAnswer };

type FeeTableRow = {
  category: string;
  col1: string;
  col2: string;
  notes?: string;
};

type FeeTableData = {
  col1Header: string;
  col2Header: string;
  rows: FeeTableRow[];
  perOrderNote: string;
  disclaimer: string;
};

type ExplanationSection = { title: string; text: string };

// ═══════════════════════════════════════════════════════════════
// Structured Data (JSON-LD)
// ═══════════════════════════════════════════════════════════════

export function MarketStructuredData({ config }: { config: MarketConfig }) {
  const url = `/ebay-fee-calculator/${config.id}`;
  const faqs = getMarketFaqs(config);
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "eBay Fee Calculator", item: absoluteUrl("/ebay-fee-calculator") },
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
      "Final value fee calculation",
      "Per-order fee calculation",
      "Category-specific rates",
      "Store vs non-store comparison",
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

  const storeTypeNames = config.storeTypes.map(s => s.label).join(", ");
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Calculate ${config.fullName} eBay Selling Fees`,
    description: `Use the ${config.seo.h1} to calculate final value fees, per-order fees, and net profit when selling on ${config.siteName}.`,
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: `Select your ${config.storeLabel.toLowerCase()}`,
        text: `Choose from: ${storeTypeNames}. Your seller/store type affects the final value fee rate.`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose your product category",
        text: `Select the category that matches your item. ${config.siteName} charges different fee rates depending on the product category.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter sale details",
        text: `Input your selling price in ${config.currency.code} and the shipping amount you charge the buyer. eBay's final value fee applies to the total (price + shipping).`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Enter your costs",
        text: "Add your item cost, actual shipping expense, and any other costs to calculate your true profit.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Review fee breakdown and profit",
        text: "See a detailed breakdown of final value fees, per-order fees, payment processing, and your net profit margin.",
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

export function MarketBreadcrumb({ config }: { config: MarketConfig }) {
  return (
    <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 12px" }}>
      <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        Home
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <Link href="/ebay-fee-calculator" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
        eBay Fee Calculator
      </Link>
      <span style={{ margin: "0 8px" }}>/</span>
      <span style={{ color: "var(--color-text-secondary)" }}>eBay {config.fullName}</span>
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

export function MarketFeeTable({ config }: { config: MarketConfig }) {
  const data = MARKET_FEE_TABLES[config.id];

  return (
    <section className="card" style={{ padding: 24, overflowX: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
        {config.siteName} Fee Rates by Category
      </h2>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>
        Final value fee rates for selling on {config.siteName}. {data.perOrderNote}
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            <th style={TH_STYLE}>Category</th>
            <th style={TH_STYLE}>{data.col1Header}</th>
            <th style={TH_STYLE}>{data.col2Header}</th>
            <th style={TH_STYLE}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.category}</td>
              <td style={{ padding: "10px 12px" }}>{row.col1}</td>
              <td style={{ padding: "10px 12px" }}>{row.col2}</td>
              <td className="muted" style={{ padding: "10px 12px", fontSize: 13 }}>{row.notes || "\u2014"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted" style={{ fontSize: 12, marginBottom: 0, marginTop: 14 }}>
        {data.disclaimer}
      </p>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Fee Explanation
// ═══════════════════════════════════════════════════════════════

export function MarketFeeExplanation({ config }: { config: MarketConfig }) {
  const sections = MARKET_EXPLANATIONS[config.id];

  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
        Understanding {config.siteName} Selling Fees
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
        Fee information is based on official {config.siteName} seller fee schedules. Always verify current rates on{" "}
        <a
          href={`https://www.${config.domain}/help/selling/fees-credits-invoices`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-primary)" }}
        >
          {config.siteName}
        </a>.
      </p>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAQ Accordion
// ═══════════════════════════════════════════════════════════════

export function MarketFAQ({ config }: { config: MarketConfig }) {
  const faqs = getMarketFaqs(config);
  return <FAQSection items={faqs} />;
}

function getMarketFaqs(config: MarketConfig): FAQ[] {
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  return [
    ...MARKET_FAQS[config.id],
    {
      q: `Is this ${config.siteName} fee model updated for ${seoYear}?`,
      a: `Yes. This market model is reviewed for ${seoYear}. Last reviewed: ${lastReviewed}. Always verify your live category and store-tier rates on official eBay seller pages before final pricing decisions.`,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// FAQ Data
// ═══════════════════════════════════════════════════════════════

const MARKET_FAQS: Record<MarketId, FAQ[]> = {
  us: [
    {
      q: "How much does eBay charge US sellers in fees?",
      a: {
        intro: "eBay US sellers face several fee layers that combine to a total effective rate of roughly 15\u201317%.",
        points: [
          "Final value fee (FVF): 13.25% for most categories without a store, or 12.35% with a store subscription.",
          "Per-order fee: $0.30 on every transaction.",
          "Managed Payments processing: 2.7% of the total amount (including tax) plus $0.25 per order.",
        ],
        conclusion: "Store subscribers and Top Rated Sellers qualify for reduced FVF rates that can meaningfully lower total costs.",
      },
    },
    {
      q: "What are eBay Managed Payments fees on eBay.com?",
      a: "eBay Managed Payments charges 2.7% of the total transaction amount plus a $0.25 fixed fee per order. The fee is calculated on the full sale amount including any applicable sales tax collected from the buyer. All US sellers are required to use Managed Payments \u2014 PayPal and other external processors are no longer available for eBay transactions. This processing fee applies on top of the final value fee and per-order charge.",
    },
    {
      q: "How does the final value fee work on eBay US?",
      a: {
        intro: "The final value fee is a percentage of the total sale amount (item price + buyer-paid shipping), charged using a tiered structure.",
        points: [
          "Non-store sellers: 13.25% on the first $7,500 per sale, then 2.35% on amounts above that threshold.",
          "Store subscribers: 12.35% on the first $2,500, then 2.35% above.",
          "Higher-fee categories: Books, Movies & Music at 14.95%; Women\u2019s Bags and Jewelry at 15%.",
          "Lower-fee categories: Guitars & Basses at 6.35%; Heavy Equipment at 3% (non-store) or 2.5% (store).",
        ],
        conclusion: "Use the calculator above to model your exact category and store configuration.",
      },
    },
    {
      q: "How can I reduce my eBay US selling fees?",
      a: {
        intro: "Several strategies can meaningfully lower your eBay US fee burden.",
        points: [
          "Subscribe to an eBay Store to unlock lower FVF rates (12.35% vs 13.25% for most categories) and category-specific discounts.",
          "Achieve Top Rated Seller status for a 10% discount on final value fees.",
          "List in categories with lower rates \u2014 Computers drop from 13.25% to 7% for store sellers.",
          "Sell higher-value items to benefit from tiered rate reductions above the $7,500 or $2,500 threshold.",
        ],
      },
    },
    {
      q: "Does eBay US charge fees on shipping?",
      a: "Yes. eBay\u2019s final value fee is calculated on the total sale amount, which includes the shipping charge paid by the buyer. Offering \u201cfree shipping\u201d by building costs into a higher item price does not reduce fees \u2014 the percentage applies to the total either way. The Managed Payments fee (2.7% + $0.25) is also calculated on the full transaction amount including tax. Factor this into your margin model when deciding between charged shipping and free-shipping strategies.",
    },
  ],
  uk: [
    {
      q: "How much does eBay charge UK sellers in fees?",
      a: {
        intro: "eBay UK fees vary significantly by seller type, making it one of the most seller-type-sensitive marketplaces.",
        points: [
          "Private sellers: 0% FVF on domestic sales, but 3% on all international sales.",
          "Business sellers: 12.9% FVF on most categories, plus a \u00a30.30\u2013\u00a30.40 per-order fee.",
          "Regulatory operating fee: 0.35% on all business seller sales (private sellers exempt).",
          "International fees: 1.05\u20132.0% depending on destination for business sellers.",
        ],
      },
    },
    {
      q: "What is the eBay UK regulatory operating fee?",
      a: "The regulatory operating fee is 0.35% of the total sale amount (excluding VAT), charged on all business seller transactions on eBay.co.uk. This fee covers eBay\u2019s UK regulatory compliance costs and applies in addition to the final value fee and per-order charge. Private sellers are fully exempt from this fee. While 0.35% sounds small, it adds up at scale \u2014 on \u00a310,000 in monthly sales, that\u2019s an extra \u00a335 in fees.",
    },
    {
      q: "Do private sellers pay fees on eBay UK?",
      a: "UK-based private sellers pay no final value fees, no regulatory operating fees, and no per-order fees on domestic sales. This makes eBay UK one of the most cost-effective marketplaces for occasional or casual sellers. The only fee private sellers face is a flat 3% international selling fee on cross-border sales. This zero-domestic-fee policy is a significant advantage over eBay US, where all sellers pay FVF regardless of account type.",
    },
    {
      q: "What are the international selling fees on eBay UK?",
      a: {
        intro: "eBay UK charges international fees that vary by destination and seller type.",
        points: [
          "Business sellers to Eurozone/Northern Europe: 1.05%.",
          "Business sellers to US and Canada: 1.8%.",
          "Business sellers to all other countries: 2.0%.",
          "Private sellers: a flat 3% on all international sales regardless of destination.",
        ],
        conclusion: "These fees apply on top of the standard final value fee, so factor them into margin calculations for cross-border listings.",
      },
    },
    {
      q: "Which categories have the lowest fees on eBay UK?",
      a: {
        intro: "Several categories offer business sellers significantly lower rates than the 12.9% default.",
        points: [
          "Cameras & Photography, Computers, Sound & Vision, Mobile Phones, and DIY Tools: all at 6.9%, dropping to 3% above \u00a31,000.",
          "Video Game Consoles: 6.9%, dropping to 2% above \u00a3400.",
          "Vehicle Parts: 9.5%, dropping to 3% above \u00a3750.",
          "Books & Magazines: 9.9%.",
        ],
        conclusion: "These tiered rates make eBay UK particularly competitive for high-value electronics and computing items.",
      },
    },
  ],
  de: [
    {
      q: "How much does eBay charge sellers in Germany?",
      a: {
        intro: "eBay Germany offers one of Europe\u2019s most competitive fee structures, especially for private sellers.",
        points: [
          "Private sellers in Germany/EEA: 0% FVF on domestic sales.",
          "Business sellers: category-based flat rates from 3% (Electronics, Tires) to 11% (catch-all), plus a \u20ac0.35 per-order fee.",
          "Default business rate for most common categories: 6.5%.",
        ],
        conclusion: "Unlike US/UK markets, most German categories use flat rates rather than tiered pricing, simplifying fee estimation.",
      },
    },
    {
      q: "Do private sellers pay fees on eBay.de?",
      a: "Private sellers based in Germany or the European Economic Area pay zero final value fees on domestic eBay.de sales \u2014 no FVF, no per-order fee, no regulatory charge. This makes eBay Germany one of the most attractive platforms for casual sellers in Europe. The only fee private sellers face is a 1.91% international selling fee on cross-border sales to EU, US, and Canada destinations, or 3.93% to other countries.",
    },
    {
      q: "What are the business seller fee rates on eBay Germany?",
      a: {
        intro: "eBay.de business seller rates are organized by category with flat rates (no tiered thresholds for most).",
        points: [
          "Lowest: Consumer Electronics and Tires at 3%.",
          "Mid-low: Electronic Accessories, Motorcycle Parts, Vehicle Parts at 5.7%.",
          "Standard: Books, Computers, Instruments, Toys, Art at 6.5%.",
          "Mid-high: Home, Baby, and Pet Supplies at 7%.",
          "Higher: Clothing and Beauty at 8%.",
          "Catch-all: 11% up to \u20ac1,990, then 2% above.",
        ],
      },
    },
    {
      q: "What is the per-order fee on eBay.de?",
      a: "The per-order fee on eBay Germany is \u20ac0.35 for orders of \u20ac10 or more, and \u20ac0.05 for orders under \u20ac10. This fee applies to all business seller transactions. Private sellers do not pay a per-order fee on domestic sales. The reduced \u20ac0.05 rate for small orders prevents the fixed charge from disproportionately impacting low-priced items, which is an advantage over markets with a single fixed per-order fee.",
    },
    {
      q: "How do international selling fees work on eBay Germany?",
      a: {
        intro: "eBay.de charges destination-based international fees that apply to both private and business sellers selling to buyers outside Germany.",
        points: [
          "EU, US, and Canada: 1.91%.",
          "UK: 1.43% (slightly lower due to trade agreements).",
          "All other countries: 3.93%.",
        ],
        conclusion: "These fees are in addition to the standard final value fee. Cross-border sellers should model destination-specific margins before scaling international listings.",
      },
    },
  ],
  au: [
    {
      q: "How much does eBay charge in fees for Australian sellers?",
      a: {
        intro: "eBay Australia charges a tiered final value fee with payment processing included \u2014 no separate payment charge.",
        points: [
          "Non-store sellers: 13.4% FVF for most categories, plus A$0.30 per-order fee.",
          "Store subscribers: reduced rate of 10.4%, plus A$0.30 per-order fee.",
          "Payment processing: included in the FVF (unlike eBay US/Canada where Managed Payments is separate).",
        ],
        conclusion: "The all-inclusive FVF structure makes fee estimation simpler on eBay Australia compared to markets with separate payment processing charges.",
      },
    },
    {
      q: "Is there a maximum fee cap on eBay Australia?",
      a: "Yes. eBay Australia caps the final value fee per item: A$440 for sellers without a store and A$400 for store subscribers. Once the calculated FVF reaches this cap, no additional FVF is charged on that sale regardless of the sale price. This makes eBay Australia especially cost-effective for high-value items. For example, on a A$5,000 item, the effective fee rate drops to just 8\u20138.8% instead of the full 10.4\u201313.4%.",
    },
    {
      q: "How does the final value fee work on eBay.com.au?",
      a: {
        intro: "The final value fee on eBay Australia uses a tiered structure based on sale amount.",
        points: [
          "Non-store: 13.4% on the first A$4,000, then 2.5% on amounts above.",
          "Store: 10.4% on the first A$4,000, then 2.5% above.",
          "Per-item FVF cap: A$440 (no store) or A$400 (store).",
        ],
        conclusion: "The fee applies to the total sale amount including buyer-paid shipping. The cap and tiered structure both benefit sellers of higher-priced items.",
      },
    },
    {
      q: "What categories have lower fees on eBay Australia?",
      a: {
        intro: "Store subscribers benefit from significantly reduced rates in several popular categories.",
        points: [
          "Computers & Tablets (core items): 7% store rate vs 13.4% non-store.",
          "Consumer Electronics: 9% store rate.",
          "Video Game Consoles: 7% store rate.",
          "eBay Motors (Parts): 9.5% store rate, dropping to 3% above A$1,000.",
          "Jewelry & Watches: tiered at 12%/4%/3% for store sellers.",
        ],
        conclusion: "These category discounts make an eBay Store subscription especially worthwhile for electronics and computing sellers in Australia.",
      },
    },
    {
      q: "How can I reduce my eBay Australia selling fees?",
      a: {
        intro: "Four key strategies can lower your eBay Australia fees.",
        points: [
          "Subscribe to an eBay Store to drop the default FVF from 13.4% to 10.4% and access category-specific discounts.",
          "Achieve Top Rated Seller status for an additional 10% FVF discount.",
          "List in categories with lower store rates (Computers at 7%, Electronics at 9%).",
          "Leverage the FVF cap (A$400\u2013440) on high-value items to limit maximum fee exposure.",
        ],
      },
    },
  ],
  ca: [
    {
      q: "How much does eBay charge Canadian sellers in fees?",
      a: {
        intro: "eBay Canada charges a final value fee plus separate payment processing, bringing total effective fees to approximately 16\u201317%.",
        points: [
          "Non-store FVF: 13.6% for most categories, plus C$0.30 per-order fee.",
          "Store FVF: 12.7%, plus C$0.30 per-order fee.",
          "Managed Payments: 2.7% of total transaction (including taxes) plus C$0.25 per order.",
        ],
        conclusion: "Following the March 2025 rate increase, Canadian FVF rates are slightly higher than eBay US.",
      },
    },
    {
      q: "What are eBay Canada's Managed Payments fees?",
      a: "eBay Canada\u2019s Managed Payments charges 2.7% of the total transaction amount (including applicable GST, HST, or PST taxes) plus a fixed C$0.25 per order. All Canadian sellers are required to use eBay\u2019s Managed Payments system \u2014 external payment processors are no longer available. This processing fee applies on top of the final value fee and per-order charge, so it must be factored into your margin model.",
    },
    {
      q: "How does the final value fee work on eBay.ca?",
      a: {
        intro: "The final value fee on eBay Canada is tiered, with different rates and thresholds for store vs non-store sellers.",
        points: [
          "Non-store: 13.6% on the first C$7,500, then 2.35% above.",
          "Store: 12.7% on the first C$2,500, then 2.35% above.",
          "Higher-fee categories: Books, Movies & Music at 15.3%.",
          "Lower-fee categories: Computers (core) at 7% for store sellers.",
        ],
        conclusion: "The fee applies to the total sale amount including buyer-paid shipping.",
      },
    },
    {
      q: "How can I reduce my eBay Canada selling fees?",
      a: {
        intro: "Several approaches can reduce your total eBay Canada fee burden.",
        points: [
          "Subscribe to an eBay Store: 12.7% vs 13.6% for most categories.",
          "Qualify for Top Rated Seller status: 10% FVF discount.",
          "List in lower-rate categories: Computers at 7%, Electronics at 9% for store sellers.",
          "Benefit from tiered pricing on high-value items: only 2.35% above C$7,500 (or C$2,500 for stores).",
        ],
      },
    },
    {
      q: "What changed in eBay Canada fees in 2025?",
      a: "Starting March 3, 2025, eBay Canada increased final value fee rates by up to 0.35% across most categories. The default non-store rate rose from approximately 13.25% to 13.6%, and store rates increased to 12.7%. These changes apply to all categories uniformly. Tax handling continues to vary by Canadian province, with different GST, HST, and PST rules affecting the Managed Payments fee base. Sellers should update their pricing models to reflect these higher rates.",
    },
  ],
  fr: [
    {
      q: "How much does eBay charge sellers in France?",
      a: {
        intro: "eBay France uses a two-tier system based on seller type, with a notably seller-friendly cap for private accounts.",
        points: [
          "Private sellers: flat 8% FVF across all categories, capped at \u20ac200 per item.",
          "Business sellers: category-based rates from 3% to 8%, plus a \u20ac0.35 per-order fee.",
          "Payment processing: included in the FVF \u2014 no separate charge.",
        ],
      },
    },
    {
      q: "What is the difference between private and business seller fees on eBay.fr?",
      a: {
        intro: "The two seller types face very different fee structures on eBay France.",
        points: [
          "Private sellers: flat 8% on all categories with a \u20ac200 per-item FVF cap. Simple and predictable.",
          "Business sellers: lower category-specific rates (Electronics at 3%, Motor Parts at 5.7%, most categories at 6.5%, Clothing/Beauty at 8%) but no per-item cap.",
        ],
        conclusion: "For items under ~\u20ac2,500, business sellers often pay less. For high-value items above \u20ac2,500, private sellers benefit significantly from the \u20ac200 cap.",
      },
    },
    {
      q: "Is there a maximum fee cap for private sellers on eBay France?",
      a: "Yes. Private sellers on eBay.fr benefit from a \u20ac200 per-item cap on the final value fee. No matter how high the sale price, the FVF never exceeds \u20ac200. For example, on a \u20ac5,000 item, the effective fee rate drops to just 4% instead of the standard 8%. This makes eBay France particularly attractive for private sellers listing luxury goods, electronics, or collectibles with high unit values.",
    },
    {
      q: "What are the category-based fees for business sellers on eBay.fr?",
      a: {
        intro: "Business seller rates on eBay France vary by category.",
        points: [
          "Lowest: Electronics and Tires at 3%.",
          "Mid-low: Electronic Accessories, Motorcycle Parts, Vehicle Parts at 5.7%.",
          "Standard: Books, Computers, Musical Instruments, Toys, Art at 6.5%.",
          "Mid-high: Baby, Home, Pet Supplies at 7%.",
          "Highest: Clothing and Beauty at 8%.",
        ],
        conclusion: "A \u20ac0.35 per-order fee applies to all business seller transactions in addition to these rates.",
      },
    },
    {
      q: "How can I reduce my eBay France selling fees?",
      a: {
        intro: "Fee reduction strategies depend on your seller type.",
        points: [
          "Private sellers: the 8% flat rate with \u20ac200 cap is already competitive for high-value items. Focus on listing higher-priced goods to maximize the cap advantage.",
          "Business sellers: list in lower-fee categories when possible (Electronics at 3%, Motor Parts at 5.7%).",
          "All sellers: achieve Top Rated Seller status for a 10% FVF discount.",
        ],
      },
    },
  ],
  it: [
    {
      q: "How much does eBay charge sellers in Italy?",
      a: {
        intro: "eBay Italy mirrors eBay France\u2019s fee structure, using the same two-tier system for private and business sellers.",
        points: [
          "Private sellers: flat 8% FVF across all categories, capped at \u20ac200 per item.",
          "Business sellers: category-based rates from 3% to 8%, plus a \u20ac0.35 per-order fee.",
          "Payment processing: included in the FVF \u2014 no separate charge.",
        ],
      },
    },
    {
      q: "What is the difference between private and business seller fees on eBay.it?",
      a: {
        intro: "Private and business sellers face different fee structures on eBay Italy.",
        points: [
          "Private sellers: flat 8% on all categories with a \u20ac200 per-item FVF cap. Straightforward and predictable.",
          "Business sellers: lower category-specific rates (Electronics at 3%, Motor Parts at 5.7%, most at 6.5%, Clothing/Beauty at 8%) with no per-item cap.",
        ],
        conclusion: "The trade-off is the same as eBay France: private sellers win on high-value items (above ~\u20ac2,500), while business sellers pay less on standard-priced goods.",
      },
    },
    {
      q: "Is there a maximum fee cap for private sellers on eBay Italy?",
      a: "Yes. Private sellers on eBay.it benefit from a \u20ac200 per-item cap on the final value fee, identical to eBay France. The FVF never exceeds \u20ac200 regardless of the sale price. On a \u20ac5,000 item, the effective fee rate drops to just 4%. This cap makes eBay Italy cost-effective for private sellers of high-value items such as luxury fashion, electronics, or collectibles.",
    },
    {
      q: "What are the category-based fees for business sellers on eBay.it?",
      a: {
        intro: "Business seller rates on eBay Italy are identical to eBay France and vary by category.",
        points: [
          "Lowest: Consumer Electronics and Tires at 3%.",
          "Mid-low: Electronic Accessories, Motorcycle Parts, Vehicle Parts at 5.7%.",
          "Standard: Books, Computers, Musical Instruments, Toys, Art at 6.5%.",
          "Mid-high: Baby, Home, Pet Supplies at 7%.",
          "Highest: Clothing and Beauty at 8%.",
        ],
        conclusion: "A \u20ac0.35 per-order fee applies to all business seller transactions.",
      },
    },
    {
      q: "How can I reduce my eBay Italy selling fees?",
      a: {
        intro: "Fee reduction strategies depend on your seller type.",
        points: [
          "Private sellers: leverage the \u20ac200 FVF cap by focusing on higher-value items where the effective rate drops well below 8%.",
          "Business sellers: list in lower-fee categories when possible \u2014 Electronics at 3% is the lowest available rate.",
          "All sellers: achieve Top Rated Seller status for a 10% discount on the final value fee.",
        ],
      },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// Fee Table Data
// ═══════════════════════════════════════════════════════════════

const MARKET_FEE_TABLES: Record<MarketId, FeeTableData> = {
  us: {
    col1Header: "No Store FVF",
    col2Header: "Store FVF",
    perOrderNote: "Per-order fee: $0.30 on all transactions.",
    disclaimer:
      "Rates shown are the primary tier. Most categories have a lower rate above a threshold (e.g., 2.35% above $7,500 for no-store, or $2,500 for store sellers). Use the calculator above for exact figures.",
    rows: [
      { category: "Most Categories", col1: "13.25%", col2: "12.35%", notes: "Default rate for unlisted categories" },
      { category: "Books, Movies & Music", col1: "14.95%", col2: "14.95%", notes: "Vinyl Records: 13.25% / 12.35%" },
      { category: "Computers (Core)", col1: "13.25%", col2: "7%", notes: "Laptops, desktops, monitors, CPUs" },
      { category: "Consumer Electronics", col1: "13.25%", col2: "9%", notes: "Accessories remain at default rate" },
      { category: "Clothing & Accessories", col1: "13.25%", col2: "12.35%" },
      { category: "Athletic Shoes", col1: "13.25% / 8%", col2: "12.35% / 7%", notes: "Threshold at $149.99" },
      { category: "Women\u2019s Bags", col1: "15%", col2: "13%", notes: "Lower rate above $2,000" },
      { category: "Jewelry & Watches", col1: "15%", col2: "13%", notes: "Lower rates on higher values" },
      { category: "Watches", col1: "15% \u2192 6.5% \u2192 3%", col2: "12.5% \u2192 4% \u2192 3%", notes: "Tiered at $1,000 / $5\u2013$7.5k" },
      { category: "eBay Motors (Parts)", col1: "13.25%", col2: "11.35%", notes: "Tires: 9.35%, GPS: 9%" },
      { category: "Guitars & Basses", col1: "6.35%", col2: "6.35%" },
      { category: "Heavy Equipment", col1: "3%", col2: "2.5%", notes: "Business & Industrial" },
    ],
  },
  uk: {
    col1Header: "Private Seller",
    col2Header: "Business Seller",
    perOrderNote: "Per-order fee: \u00a30.40 (orders above \u00a310) or \u00a30.30 (orders \u00a310 or less). Private sellers: no per-order fee.",
    disclaimer:
      "Private sellers pay no final value fees on domestic sales. Business seller rates shown are for sellers without a shop subscription; rates are the same across all shop levels. Many categories have tiered rates \u2014 use the calculator for exact figures.",
    rows: [
      { category: "Most Categories", col1: "0%", col2: "12.9%", notes: "Default business rate" },
      { category: "Antiques, Art & Baby", col1: "0%", col2: "10.9%" },
      { category: "Books & Magazines", col1: "0%", col2: "9.9%" },
      { category: "Clothing & Accessories", col1: "0%", col2: "11.9%", notes: "Trainers: 11.9% / 7% at \u00a399.99" },
      { category: "Computers (Core)", col1: "0%", col2: "6.9%", notes: "3% above \u00a31,000" },
      { category: "Cameras (Core)", col1: "0%", col2: "6.9%", notes: "3% above \u00a31,000" },
      { category: "Sound & Vision (Core)", col1: "0%", col2: "6.9%", notes: "3% above \u00a31,000" },
      { category: "Mobile Phones", col1: "0%", col2: "6.9%", notes: "3% above \u00a31,000" },
      { category: "Jewellery", col1: "0%", col2: "14.9%", notes: "4% above \u00a31,000" },
      { category: "Watches", col1: "0%", col2: "12.9%", notes: "3% above \u00a3750" },
      { category: "Home & DIY", col1: "0%", col2: "11.9%", notes: "Lower tiers above \u00a3500" },
      { category: "Vehicle Parts", col1: "0%", col2: "9.5%", notes: "3% above \u00a3750" },
      { category: "Video Game Consoles", col1: "0%", col2: "6.9%", notes: "2% above \u00a3400" },
    ],
  },
  de: {
    col1Header: "Private Seller",
    col2Header: "Business Seller",
    perOrderNote: "Per-order fee: \u20ac0.35 (orders \u20ac10+) or \u20ac0.05 (orders under \u20ac10). Private sellers: no per-order fee on domestic sales.",
    disclaimer:
      "Private sellers within Germany/EEA pay no final value fees on domestic sales. Business seller rates are flat per category (no tiered thresholds). The 11% catch-all rate has a 2% tier above \u20ac1,990.",
    rows: [
      { category: "Consumer Electronics", col1: "0%", col2: "3%", notes: "Lowest business rate" },
      { category: "Tyres, Rims & Hubcaps", col1: "0%", col2: "3%" },
      { category: "Electronic Accessories", col1: "0%", col2: "5.7%" },
      { category: "Motorcycle Parts", col1: "0%", col2: "5.7%" },
      { category: "Vehicle Parts", col1: "0%", col2: "5.7%" },
      { category: "Books & Magazines", col1: "0%", col2: "6.5%" },
      { category: "Computers & Tablets", col1: "0%", col2: "6.5%" },
      { category: "Musical Instruments", col1: "0%", col2: "6.5%" },
      { category: "Toys & Games", col1: "0%", col2: "6.5%" },
      { category: "Baby & Childcare", col1: "0%", col2: "7%" },
      { category: "Home & Garden", col1: "0%", col2: "7%" },
      { category: "Clothing & Accessories", col1: "0%", col2: "8%" },
      { category: "Beauty & Health", col1: "0%", col2: "8%" },
    ],
  },
  au: {
    col1Header: "No Store FVF",
    col2Header: "Store FVF",
    perOrderNote: "Per-order fee: A$0.30 on all transactions. Payment processing is included in the FVF.",
    disclaimer:
      "Rates shown are the primary tier (up to A$4,000). Above A$4,000, both store and non-store sellers pay 2.5%. FVF cap: A$440 (no store) / A$400 (store). Use the calculator for exact figures.",
    rows: [
      { category: "Most Categories", col1: "13.4%", col2: "10.4%", notes: "Default rate" },
      { category: "Books & Magazines", col1: "14.95%", col2: "14.95%" },
      { category: "Computers (Core)", col1: "13.4%", col2: "7%", notes: "Laptops, desktops, monitors" },
      { category: "Consumer Electronics", col1: "13.4%", col2: "9%" },
      { category: "Jewelry", col1: "14%", col2: "12%", notes: "Lower rates on higher values" },
      { category: "Watches", col1: "14% \u2192 6% \u2192 3%", col2: "12% \u2192 4% \u2192 3%", notes: "Tiered at A$1,000 / A$5,000" },
      { category: "eBay Motors (Parts)", col1: "13.4%", col2: "9.5%", notes: "3% above A$1,000" },
      { category: "Video Game Consoles", col1: "13.4%", col2: "7%" },
      { category: "Coins (Bullion)", col1: "13.4% / 7%", col2: "13.4% / 7%", notes: "Threshold at A$7,500" },
    ],
  },
  ca: {
    col1Header: "No Store FVF",
    col2Header: "Store FVF",
    perOrderNote: "Per-order fee: C$0.30 on all transactions. Managed Payments: 2.7% + C$0.25 per order.",
    disclaimer:
      "Rates shown are the primary tier. Non-store sellers get a lower rate above C$7,500; store sellers above C$2,500 (both at 2.35%). Use the calculator for exact figures.",
    rows: [
      { category: "Most Categories", col1: "13.6%", col2: "12.7%", notes: "Default rate" },
      { category: "Books, Movies & Music", col1: "15.3%", col2: "15.3%", notes: "Vinyl Records: 13.6% / 12.7%" },
      { category: "Computers (Core)", col1: "13.6%", col2: "7%", notes: "Laptops, desktops, monitors" },
      { category: "Consumer Electronics", col1: "13.6%", col2: "9%", notes: "Accessories at default rate" },
      { category: "Athletic Shoes", col1: "13.6% / 8%", col2: "12.7% / 7%", notes: "Threshold at C$149.99" },
      { category: "Women\u2019s Bags", col1: "15%", col2: "13%", notes: "Lower rate above C$2,000" },
      { category: "Jewelry & Watches", col1: "15%", col2: "13%", notes: "Lower rates on higher values" },
      { category: "Watches", col1: "15% \u2192 6.5% \u2192 3%", col2: "12.5% \u2192 4% \u2192 3%", notes: "Tiered at C$1k / C$5\u20137.5k" },
      { category: "eBay Motors (Parts)", col1: "13.6%", col2: "11.35%" },
      { category: "Guitars & Basses", col1: "6.35%", col2: "6.35%" },
      { category: "Heavy Equipment", col1: "3%", col2: "2.5%", notes: "Business & Industrial" },
    ],
  },
  fr: {
    col1Header: "Private Seller",
    col2Header: "Business Seller",
    perOrderNote: "Per-order fee: \u20ac0.35 on all transactions.",
    disclaimer:
      "Private sellers pay a flat 8% across all categories, capped at \u20ac200 per item. Business sellers pay category-specific rates with no per-item cap.",
    rows: [
      { category: "Consumer Electronics", col1: "8%", col2: "3%", notes: "Lowest business rate" },
      { category: "Tyres, Rims & Hubcaps", col1: "8%", col2: "3%" },
      { category: "Electronic Accessories", col1: "8%", col2: "5.7%" },
      { category: "Motorcycle Parts", col1: "8%", col2: "5.7%" },
      { category: "Vehicle Parts", col1: "8%", col2: "5.7%" },
      { category: "Books & Magazines", col1: "8%", col2: "6.5%" },
      { category: "Computers & Tablets", col1: "8%", col2: "6.5%" },
      { category: "Musical Instruments", col1: "8%", col2: "6.5%" },
      { category: "Toys & Games", col1: "8%", col2: "6.5%" },
      { category: "Baby & Childcare", col1: "8%", col2: "7%" },
      { category: "Home & Garden", col1: "8%", col2: "7%" },
      { category: "Clothing & Accessories", col1: "8%", col2: "8%" },
      { category: "Beauty & Health", col1: "8%", col2: "8%" },
    ],
  },
  it: {
    col1Header: "Private Seller",
    col2Header: "Business Seller",
    perOrderNote: "Per-order fee: \u20ac0.35 on all transactions.",
    disclaimer:
      "Private sellers pay a flat 8% across all categories, capped at \u20ac200 per item. Business sellers pay category-specific rates with no per-item cap.",
    rows: [
      { category: "Consumer Electronics", col1: "8%", col2: "3%", notes: "Lowest business rate" },
      { category: "Tyres, Rims & Hubcaps", col1: "8%", col2: "3%" },
      { category: "Electronic Accessories", col1: "8%", col2: "5.7%" },
      { category: "Motorcycle Parts", col1: "8%", col2: "5.7%" },
      { category: "Vehicle Parts", col1: "8%", col2: "5.7%" },
      { category: "Books & Magazines", col1: "8%", col2: "6.5%" },
      { category: "Computers & Tablets", col1: "8%", col2: "6.5%" },
      { category: "Musical Instruments", col1: "8%", col2: "6.5%" },
      { category: "Toys & Games", col1: "8%", col2: "6.5%" },
      { category: "Baby & Childcare", col1: "8%", col2: "7%" },
      { category: "Home & Garden", col1: "8%", col2: "7%" },
      { category: "Clothing & Accessories", col1: "8%", col2: "8%" },
      { category: "Beauty & Health", col1: "8%", col2: "8%" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// Fee Explanation Data
// ═══════════════════════════════════════════════════════════════

const MARKET_EXPLANATIONS: Record<MarketId, ExplanationSection[]> = {
  us: [
    {
      title: "Final Value Fee",
      text: "eBay US charges a final value fee (FVF) on every sale, calculated as a percentage of the total amount \u2014 item price plus shipping charged to the buyer. For most categories, the rate is 13.25% on the first $7,500 for non-store sellers, dropping to 2.35% above that threshold. Store subscribers enjoy a lower primary rate of 12.35% with the threshold at $2,500. Categories like Computers, Electronics, and Musical Instruments have significantly lower store rates.",
    },
    {
      title: "Managed Payments & Additional Fees",
      text: "All eBay US sales are processed through Managed Payments, which charges 2.7% of the total transaction amount (including sales tax) plus a $0.25 fixed fee per order. A $0.30 per-order fee is charged on every transaction. International sales incur an additional 1.65% fee. Promoted Listings fees apply if you use eBay's advertising tools.",
    },
    {
      title: "Reducing Your Fees",
      text: "The most impactful way to reduce fees is subscribing to an eBay Store \u2014 this lowers the FVF rate and unlocks category-specific discounts (e.g., Computers drop from 13.25% to 7%). Achieving Top Rated Seller status gives a 10% discount on the final value fee. For high-value items, the tiered rate structure means the portion above the threshold is charged at only 2.35%.",
    },
  ],
  uk: [
    {
      title: "Final Value Fee",
      text: "eBay UK\u2019s fee structure distinguishes between private and business sellers. UK-based private sellers pay no final value fees on domestic sales, making it one of the most seller-friendly marketplaces for casual sellers. Business sellers pay category-based FVF rates, typically 12.9% for most categories, with lower rates for electronics (6.9%), books (9.9%), and sporting goods (10.9%). Many categories feature tiered pricing with lower rates above a threshold.",
    },
    {
      title: "Regulatory Fee & Per-Order Charges",
      text: "Business sellers are subject to a 0.35% regulatory operating fee on all sales (private sellers are exempt). The per-order fee is \u00a30.40 for orders above \u00a310 and \u00a30.30 for orders of \u00a310 or less. International selling fees vary by destination: 1.05% for Eurozone/Northern Europe, 1.8% for US/Canada, and 2.0% for other countries. Private sellers pay a flat 3% international fee.",
    },
    {
      title: "Reducing Your Fees",
      text: "Business sellers can reduce costs by listing in lower-fee categories (core electronics and computing items at 6.9% are among the lowest). Achieving Top Rated Seller status earns a 10% FVF discount. For high-value items, many categories have tiered rates that drop to 2\u20133% above category-specific thresholds (\u00a3400\u2013\u00a31,000).",
    },
  ],
  de: [
    {
      title: "Final Value Fee",
      text: "eBay Germany offers one of the most competitive fee structures in Europe. Private sellers within Germany or the EEA pay zero final value fees on domestic sales. Business (commercial) sellers pay category-based flat rates ranging from 3% (Consumer Electronics, Tires) to 8% (Clothing, Beauty). The default rate for most common categories is 6.5%. Unlike US/UK markets, most German categories use flat rates rather than tiered pricing.",
    },
    {
      title: "Per-Order Fee & International Charges",
      text: "Business sellers pay a per-order fee of \u20ac0.35 on orders of \u20ac10 or more, reduced to \u20ac0.05 for smaller orders. International selling fees vary by destination: 1.91% for EU, US, and Canada; 1.43% for UK; and 3.93% for all other countries. No separate payment processing fee is charged \u2014 it is included in the final value fee.",
    },
    {
      title: "Reducing Your Fees",
      text: "If you\u2019re selling domestically as a private seller, you already benefit from 0% fees. Business sellers can minimize costs by listing in lower-fee categories (Electronics at 3%, Motor Parts at 5.7%). Top Rated Seller status provides a 10% FVF discount. For items priced above \u20ac1,990 in the catch-all category, only 2% is charged on the excess amount.",
    },
  ],
  au: [
    {
      title: "Final Value Fee",
      text: "eBay Australia charges a tiered final value fee on the total sale amount (item price + shipping). Non-store sellers pay 13.4% on the first A$4,000 and 2.5% above. Store subscribers get a reduced rate of 10.4% on the first A$4,000. A unique feature of eBay Australia is the per-item FVF cap: A$440 for non-store sellers and A$400 for store subscribers, making it attractive for high-value items.",
    },
    {
      title: "Per-Order Fee & Payment Processing",
      text: "A A$0.30 per-order fee applies to all transactions. Unlike eBay US and Canada, there is no separate Managed Payments processing fee on eBay Australia \u2014 payment processing costs are included in the final value fee. International sales incur an additional 1.0% fee. A currency conversion charge of 3.0\u20133.3% applies to international payments received in foreign currencies.",
    },
    {
      title: "Reducing Your Fees",
      text: "Subscribing to an eBay Store reduces the default FVF from 13.4% to 10.4% \u2014 one of the largest store discounts across eBay markets. Store subscribers also benefit from much lower rates in categories like Computers (7%) and Electronics (9%). Top Rated Seller status provides a 10% FVF discount. For expensive items, the per-item cap (A$400\u2013440) significantly limits fee exposure.",
    },
  ],
  ca: [
    {
      title: "Final Value Fee",
      text: "eBay Canada charges a tiered final value fee calculated on the total sale amount (item price + shipping). Non-store sellers pay 13.6% on the first C$7,500, then 2.35% above. Store subscribers pay 12.7% on the first C$2,500, then 2.35% above. Following the March 2025 increase, Canadian rates are slightly higher than eBay US, with similar category-based variations.",
    },
    {
      title: "Managed Payments & Additional Fees",
      text: "All eBay Canada sales use Managed Payments, which charges 2.7% of the total transaction (including taxes) plus C$0.25 per order. A C$0.30 per-order fee also applies. International sales incur a 1.65% additional fee. The combination of FVF, per-order fee, and Managed Payments brings the total effective fee to approximately 16\u201317% for most transactions.",
    },
    {
      title: "Reducing Your Fees",
      text: "Subscribe to an eBay Store to lower the FVF from 13.6% to 12.7% and access reduced rates in key categories (Computers at 7%, Electronics at 9%). Top Rated Seller status gives a 10% FVF discount. For high-value sales, the tiered structure caps the rate at 2.35% above C$7,500 (or C$2,500 for stores), significantly reducing fees on expensive items.",
    },
  ],
  fr: [
    {
      title: "Final Value Fee",
      text: "eBay France uses a two-tier fee system based on seller type. Private sellers pay a simple flat rate of 8% across all categories, with a generous \u20ac200 per-item cap that benefits sellers of high-value goods. Business (professional) sellers pay category-specific rates that range from 3% for Electronics to 8% for Clothing and Beauty, with most categories falling at 6.5%.",
    },
    {
      title: "Per-Order Fee & International Charges",
      text: "A \u20ac0.35 per-order fee applies to all transactions for both seller types. International sales incur a 1.91% additional fee. No separate payment processing fee is charged \u2014 it is included in the final value fee. This makes the fee structure on eBay France straightforward compared to markets with separate Managed Payments fees.",
    },
    {
      title: "Reducing Your Fees",
      text: "Private sellers already enjoy competitive rates, especially with the \u20ac200 FVF cap on high-value items. Business sellers can minimize costs by listing in lower-fee categories (Electronics at 3%, Motor Parts at 5.7%). Achieving Top Rated Seller status provides a 10% FVF discount for all sellers.",
    },
  ],
  it: [
    {
      title: "Final Value Fee",
      text: "eBay Italy uses the same two-tier fee system as eBay France. Private sellers pay a flat 8% across all categories with a \u20ac200 per-item FVF cap. Business (professional) sellers pay category-specific rates ranging from 3% for Electronics to 8% for Clothing and Beauty, with most categories at 6.5%. The fee structure is identical to eBay.fr.",
    },
    {
      title: "Per-Order Fee & International Charges",
      text: "A \u20ac0.35 per-order fee applies to all transactions. International sales incur a 1.91% additional fee. Payment processing costs are included in the final value fee \u2014 there is no separate processing charge. This straightforward structure makes fee calculation simple for Italian sellers.",
    },
    {
      title: "Reducing Your Fees",
      text: "Private sellers benefit from the \u20ac200 per-item FVF cap, making eBay Italy attractive for high-value goods. Business sellers should list in lower-fee categories when possible (Electronics at 3%, Motor Parts at 5.7%). Top Rated Seller status provides a 10% FVF discount across all categories.",
    },
  ],
};
