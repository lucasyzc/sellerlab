import Link from "next/link";
import { type TikTokMarketConfig } from "./tiktok-config";
import { FlagIcon } from "../components/country-flags";
import { absoluteUrl } from "@/lib/site-url";
import { resolveLastReviewed, resolveSeoYear, withSeoYear } from "@/lib/fee-seo";

function feeRateSummary(config: TikTokMarketConfig) {
  const lines = config.feeRules.map(rule => {
    if (rule.type === "percentage") {
      if (rule.sellerInput) return `${rule.label}: manual input`;
      return `${rule.label}: ${rule.defaultRate?.toFixed(2) ?? "0.00"}%`;
    }
    if (rule.sellerInput) return `${rule.label}: manual input`;
    return `${rule.label}: ${config.currency.symbol}${(rule.defaultAmount ?? 0).toFixed(config.currency.decimals)}`;
  });
  return lines;
}

function faqItems(config: TikTokMarketConfig) {
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });

  return [
    {
      q: `What fees are included for TikTok Shop ${config.fullName}?`,
      a: `${config.summary.shortFeeSummary} ${config.summary.fulfillmentSummary}`,
    },
    {
      q: `How does the calculator treat ${config.tax.name}?`,
      a: `${config.summary.taxSummary} ${config.tax.helpText}`,
    },
    {
      q: "Are the results exact for every seller?",
      a: config.summary.disclaimer,
    },
    {
      q: "Where do these rules come from?",
      a: `The calculator is based on official public TikTok Shop documents for ${config.fullName}. Review the source links on this page before using the numbers operationally.`,
    },
    {
      q: `Is this TikTok Shop ${config.fullName} model updated for ${seoYear}?`,
      a: `Yes. This model is reviewed for ${seoYear}. Last reviewed: ${lastReviewed}. For best accuracy, overwrite manual-rate fields with your current Seller Center values.`,
    },
  ];
}

export function MarketStructuredData({ config }: { config: TikTokMarketConfig }) {
  const url = `/tiktok-shop-fee-calculator/${config.id}`;
  const faq = faqItems(config);
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({
    lastReviewed: config.seo.lastReviewed,
    docs: config.docs,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "TikTok Shop Fee Calculator", item: absoluteUrl("/tiktok-shop-fee-calculator") },
              { "@type": "ListItem", position: 3, name: config.seo.h1, item: absoluteUrl(url) },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: withSeoYear(config.seo.h1, seoYear),
            url: absoluteUrl(url),
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: config.currency.code },
            dateModified: lastReviewed,
            description: config.seo.description,
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map(item => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          },
        ]),
      }}
    />
  );
}

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

const TH_STYLE: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

export function MarketFeeTable({ config }: { config: TikTokMarketConfig }) {
  const rates = feeRateSummary(config);
  const platformMethod = config.fulfillmentMethods.find(item => item.value === "platform");

  return (
    <section className="card" style={{ padding: 24, overflowX: "auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <FlagIcon code={config.id} size={22} /> TikTok Shop {config.fullName} Fee Model
        </span>
      </h2>
      <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>
        {config.summary.shortFeeSummary}
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            <th style={TH_STYLE}>Fee Component</th>
            <th style={TH_STYLE}>Default Public Rule</th>
            <th style={TH_STYLE}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {config.feeRules.map((rule, index) => (
            <tr key={rule.id} style={{ borderBottom: index < config.feeRules.length - 1 ? "1px solid var(--color-border)" : "none" }}>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>{rule.label}</td>
              <td style={{ padding: "10px 12px" }}>{rates[index]}</td>
              <td className="muted" style={{ padding: "10px 12px", fontSize: 13 }}>{rule.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {platformMethod?.kind === "weight-tier" && (
        <>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 24, marginBottom: 4 }}>{platformMethod.label}</h3>
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
              {platformMethod.weightTiers.map((tier, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{tier.label}</td>
                  <td style={{ padding: "10px 12px" }}>{config.currency.symbol}{tier.singleUnit.toFixed(config.currency.decimals)}</td>
                  <td style={{ padding: "10px 12px" }}>{config.currency.symbol}{tier.twoUnits.toFixed(config.currency.decimals)}</td>
                  <td style={{ padding: "10px 12px" }}>{config.currency.symbol}{tier.threeUnits.toFixed(config.currency.decimals)}</td>
                  <td style={{ padding: "10px 12px" }}>{config.currency.symbol}{tier.fourPlusUnits.toFixed(config.currency.decimals)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {platformMethod?.kind === "size-tier" && (
        <>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 24, marginBottom: 4 }}>{platformMethod.label}</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                <th style={TH_STYLE}>{platformMethod.sizeTierLabel}</th>
                <th style={TH_STYLE}>Fee</th>
              </tr>
            </thead>
            <tbody>
              {platformMethod.sizeTiers.map((tier) => (
                <tr key={tier.value} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{tier.label}</td>
                  <td style={{ padding: "10px 12px" }}>{config.currency.symbol}{tier.fee.toFixed(config.currency.decimals)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}

export function MarketFeeExplanation({ config }: { config: TikTokMarketConfig }) {
  return (
    <section className="card" style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>
        Understanding TikTok Shop {config.fullName} Fees
      </h2>
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>Fee stack</h3>
          <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            {config.summary.shortFeeSummary} {config.summary.disclaimer}
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>{config.tax.name}</h3>
          <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            {config.summary.taxSummary}
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 0, marginBottom: 8 }}>Fulfillment</h3>
          <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>
            {config.summary.fulfillmentSummary}
          </p>
        </div>
      </div>
      <p className="muted" style={{ fontSize: 12, marginTop: 16, marginBottom: 0 }}>
        Always verify the latest fee rules in the official TikTok Shop documents linked below the calculator.
      </p>
    </section>
  );
}

export function MarketFAQ({ config }: { config: TikTokMarketConfig }) {
  const faqs = faqItems(config);

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
              <span style={{ fontSize: 18, color: "var(--color-text-tertiary)", flexShrink: 0 }}>+</span>
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
