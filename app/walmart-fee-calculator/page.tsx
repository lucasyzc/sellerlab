import type { Metadata } from "next";
import Link from "next/link";
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
  withSeoYear("Walmart Fee Calculator - Marketplace Hub", FEE_SEO_YEAR),
);

export const metadata: Metadata = buildFeeMetadata({
  title: TOOL_TITLE,
  description:
    "Walmart fee calculator hub. Choose Walmart marketplace site pages and model referral fees, WFS fulfillment costs, and net profit with source-backed formulas.",
  canonicalPath: "/walmart-fee-calculator",
  keywords: [
    "walmart fee calculator",
    "walmart marketplace fees",
    "walmart referral fee calculator",
    "walmart wfs fee calculator",
    "walmart seller profit calculator",
    "walmart canada seller fees",
    "walmart mexico seller fees",
    "walmart chile seller fees",
  ],
  yearKeywordPhrases: [
    "walmart fee calculator 2026",
    "walmart referral fee 2026",
    "walmart wfs fee calculator 2026",
  ],
  lastReviewed: HUB_LAST_REVIEWED,
  openGraphDescription:
    "Walmart marketplace fee calculator hub with site-level navigation across US, Canada, Mexico, and Chile.",
  twitterDescription:
    "Open Walmart fee calculators by marketplace and model referral fees, WFS costs, and net margin.",
  twitterCard: "summary",
});

type WalmartSiteCard = {
  id: "us" | "ca" | "mx" | "cl";
  code: "US" | "CA" | "MX" | "CL";
  fullName: string;
  domain: string;
  currency: string;
  status: "live" | "coming";
  href?: string;
  highlight: string;
  note: string;
};

const WALMART_SITE_CARDS: WalmartSiteCard[] = [
  {
    id: "us",
    code: "US",
    fullName: "United States",
    domain: "walmart.com",
    currency: "USD",
    status: "live",
    href: "/walmart-fee-calculator/us",
    highlight: "Referral 6%-20%",
    note: "Includes category referral rates, official WFS formulas, and full profit breakdown.",
  },
  {
    id: "ca",
    code: "CA",
    fullName: "Canada",
    domain: "walmart.ca",
    currency: "CAD",
    status: "live",
    href: "/walmart-fee-calculator/ca",
    highlight: "Official WFS card",
    note: "Includes Canada referral rules with WFS fulfillment and storage logic.",
  },
  {
    id: "mx",
    code: "MX",
    fullName: "Mexico",
    domain: "walmart.com.mx",
    currency: "MXN",
    status: "live",
    href: "/walmart-fee-calculator/mx",
    highlight: "Premium MSI mode",
    note: "Includes Mexico category commissions with standard/premium referral toggle and manual WFS inputs.",
  },
  {
    id: "cl",
    code: "CL",
    fullName: "Chile",
    domain: "walmartchile.cl",
    currency: "CLP",
    status: "live",
    href: "/walmart-fee-calculator/cl",
    highlight: "WFS tier model",
    note: "Includes Chile category commissions plus WFS size-tier and storage modeling.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Do I need to go through this Walmart landing page first?",
    a: "This hub page serves as the marketplace selector, aligned with how our other platform calculators (Amazon, eBay, Shopify) work. Select your Walmart site from the cards above to open the dedicated calculator with that market\u2019s fee model, referral rates, WFS fulfillment logic, and tax handling. Each market page also includes source links and last-reviewed dates for the fee data used.",
  },
  {
    q: "Which Walmart sites are currently live?",
    a: {
      intro: "Four Walmart marketplace sites are live with dedicated calculator pages.",
      points: [
        "Walmart US (walmart.com) \u2014 full referral fee schedule, WFS fulfillment model, and US tax handling.",
        "Walmart Canada (walmart.ca) \u2014 category-based referral rates with CAD currency and GST/HST/PST support.",
        "Walmart Mexico (walmart.com.mx) \u2014 referral rates in MXN with IVA tax model and manual WFS inputs.",
        "Walmart Chile (lider.cl) \u2014 referral rates in CLP with IVA and source-based WFS logic.",
      ],
    },
  },
  {
    q: "Are all WFS models fully automated across sites?",
    a: "Not yet. US, Canada, and Chile use source-based WFS (Walmart Fulfillment Services) logic with automated fee calculations based on product dimensions and weight. Mexico uses manual WFS input fields because tariff details and fulfillment tier definitions are not consistently machine-readable from Walmart\u2019s public documentation. For the Mexico market, enter your WFS fees directly from your Walmart Seller Center dashboard to ensure accuracy.",
  },
  {
    q: "Is this Walmart fee calculator hub updated for 2026?",
    a: "Yes. The hub and all market models are reviewed for 2026 fee schedules. Each market calculator page displays source notes, official documentation links, and as-of dates so you can verify the recency of the referral rates and WFS pricing used in calculations. When Walmart publishes fee schedule updates, we update the affected market models promptly.",
  },
];

function StructuredData() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Walmart Fee Calculator",
        item: absoluteUrl("/walmart-fee-calculator"),
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Walmart Fee Calculator ${FEE_SEO_YEAR}`,
    url: absoluteUrl("/walmart-fee-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: HUB_LAST_REVIEWED,
    description:
      "Walmart marketplace fee calculator hub with site navigation and source-backed market models.",
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

export default function WalmartFeeCalculatorHubPage() {
  const liveCount = WALMART_SITE_CARDS.filter((site) => site.status === "live").length;

  return (
    <div className="container">
      <StructuredData />

      <nav style={{ fontSize: 13, color: "var(--color-text-tertiary)", padding: "8px 0 0" }}>
        <Link href="/" style={{ color: "var(--color-text-tertiary)", textDecoration: "none" }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>Walmart Fee Calculator</span>
      </nav>

      <section style={{ textAlign: "center", padding: "40px 0 12px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
          Walmart Fee Calculator ({FEE_SEO_YEAR})
        </h1>
        <p className="muted" style={{ fontSize: 17, maxWidth: 700, margin: "0 auto", lineHeight: 1.65 }}>
          Choose your Walmart marketplace first, then run site-specific fee and profit calculations.
          This hub now includes US, Canada, Mexico, and Chile calculators.
        </p>
        <p className="muted" style={{ marginTop: 10, marginBottom: 0, fontSize: 12 }}>
          {lastReviewedLabel(HUB_LAST_REVIEWED)}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 28, flexWrap: "wrap" }}>
          {[
            { value: String(WALMART_SITE_CARDS.length), label: "Listed Sites" },
            { value: String(liveCount), label: "Live Calculators" },
            { value: "Source-backed", label: "Fee Models" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--color-primary)" }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 20, marginTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
          Fee Policy Updates
        </h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 10, fontSize: 14, lineHeight: 1.65 }}>
          For year-based policy context and margin playbooks, review the updates library and map insights back to this calculator.
        </p>
        <Link href="/updates" className="btn">
          Open Fee Policy Updates
        </Link>
      </section>

      <section style={{ padding: "20px 0 8px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px", textAlign: "center" }}>
          Select Your Walmart Marketplace
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {WALMART_SITE_CARDS.map((site) => {
            const card = (
              <>
                <div style={{ flexShrink: 0, borderRadius: 6, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", lineHeight: 0 }}>
                  <FlagIcon code={site.code} size={52} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>
                    Walmart {site.fullName}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 8 }}>
                    {site.domain} · {site.currency}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                      {site.highlight}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: "var(--radius-full)", background: site.status === "live" ? "#ecfdf3" : "#f1f5f9", color: site.status === "live" ? "#15803d" : "var(--color-text-secondary)" }}>
                      {site.status === "live" ? "Live" : "Coming Soon"}
                    </span>
                  </div>
                  <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.55 }}>
                    {site.note}
                  </p>
                </div>
              </>
            );

            const sharedStyle = {
              textDecoration: "none",
              color: "inherit",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              padding: "22px 20px",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              boxShadow: "var(--shadow-sm)",
              opacity: site.status === "live" ? 1 : 0.8,
            };

            if (site.status === "live" && site.href) {
              return (
                <Link key={site.id} href={site.href} style={sharedStyle} className="market-card">
                  {card}
                </Link>
              );
            }

            return (
              <div key={site.id} style={sharedStyle}>
                {card}
              </div>
            );
          })}
        </div>
      </section>

      <section className="card" style={{ padding: 24, marginTop: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
          Walmart Marketplace Coverage Status
        </h2>
        <p className="muted" style={{ fontSize: 14, marginTop: 0, marginBottom: 20 }}>
          Current release includes live calculators for US, Canada, Mexico, and Chile.
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Marketplace</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Status</th>
              <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {WALMART_SITE_CARDS.map((site, index) => (
              <tr key={site.id} style={{ borderBottom: index < WALMART_SITE_CARDS.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <FlagIcon code={site.code} size={20} /> Walmart {site.fullName}
                  </span>
                </td>
                <td style={{ padding: "10px 12px" }}>{site.status === "live" ? "Live" : "Planned"}</td>
                <td className="muted" style={{ padding: "10px 12px", fontSize: 13 }}>{site.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ padding: 24, marginTop: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>
          Calculation Logic
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Total Fees = Referral Fee + Fulfillment Cost (WFS/manual) + Storage Cost + Optional Ads.
          </li>
          <li className="muted" style={{ marginBottom: 8, lineHeight: 1.7 }}>
            Net Profit = Revenue − Product Cost − Shipping/Operations Cost − Total Fees.
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
          Validate category fees and fulfillment assumptions against the official Walmart Marketplace documentation for each country.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn" href="https://marketplace.walmart.com/pricing/" target="_blank" rel="noopener noreferrer">
            Walmart US Pricing
          </a>
          <a className="btn" href="https://marketplace.walmart.ca/s/pricing" target="_blank" rel="noopener noreferrer">
            Walmart Canada Pricing
          </a>
          <a className="btn" href="https://marketplace.walmart.com.mx/" target="_blank" rel="noopener noreferrer">
            Walmart Mexico Marketplace
          </a>
        </div>
      </section>

      <section style={{ background: "linear-gradient(135deg, #0071CE 0%, #005ca8 100%)", borderRadius: "var(--radius)", padding: "40px 24px", textAlign: "center", color: "#fff", marginTop: 16, marginBottom: 8 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>
          Open Walmart Calculators
        </h2>
        <p style={{ fontSize: 15, opacity: 0.92, margin: "0 auto 24px", maxWidth: 620, lineHeight: 1.6 }}>
          Jump directly into each marketplace calculator to model referral fees, WFS costs, and net margin.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {WALMART_SITE_CARDS.map((site) => (
            <Link
              key={site.id}
              href={site.href ?? "/walmart-fee-calculator"}
              className="btn"
              style={{
                background: "#fff",
                color: "#005ca8",
                fontWeight: 700,
                padding: "10px 18px",
                fontSize: 14,
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FlagIcon code={site.code} size={16} /> {site.code}
            </Link>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 16 }}>
        <FAQSection items={FAQ_ITEMS} />
      </div>

      <p className="muted" style={{ fontSize: 12, textAlign: "center", margin: "12px 0 0", lineHeight: 1.6 }}>
        Fee models are based on public Walmart documentation and should be revalidated before final pricing decisions.
      </p>
    </div>
  );
}
