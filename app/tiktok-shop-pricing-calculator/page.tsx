import type { Metadata } from "next";
import Link from "next/link";
import { FAQSection, faqAnswerToText } from "../components/faq-section";
import { FlagIcon } from "../components/country-flags";
import { absoluteUrl } from "@/lib/site-url";
import { withSuiteBrand } from "@/lib/brand";
import {
  buildFeeMetadata,
  FEE_SEO_LAST_REVIEWED,
  FEE_SEO_YEAR,
  lastReviewedLabel,
  withSeoYear,
} from "@/lib/fee-seo";
import { TIKTOK_MARKET_LIST } from "../tiktok-shop-fee-calculator/tiktok-config";
import styles from "./tiktok-pricing.module.css";

const HUB_LAST_REVIEWED = FEE_SEO_LAST_REVIEWED;
const TOOL_TITLE = withSuiteBrand(withSeoYear("TikTok Shop Pricing Calculator", FEE_SEO_YEAR));

export const metadata: Metadata = buildFeeMetadata({
  title: TOOL_TITLE,
  description:
    "Free TikTok Shop pricing calculator that back-solves the minimum listing price needed to reach your profit target. Accounts for marketplace fees, affiliate costs, fulfillment, and local tax treatment.",
  canonicalPath: "/tiktok-shop-pricing-calculator",
  keywords: [
    "tiktok shop pricing calculator",
    "tiktok shop listing price calculator",
    "tiktok shop profit pricing",
    "tiktok shop reverse pricing",
    "tiktok shop minimum price calculator",
  ],
  yearKeywordPhrases: [
    "tiktok shop pricing calculator 2026",
    "tiktok shop listing price calculator 2026",
    "tiktok shop profit calculator 2026",
  ],
  lastReviewed: HUB_LAST_REVIEWED,
  openGraphDescription:
    "Find the minimum TikTok Shop listing price that still meets your profit target after fees, fulfillment, and taxes.",
  twitterDescription: "Back-solve TikTok Shop listing prices from target profit and margin assumptions.",
  twitterCard: "summary",
});

const FAQ_ITEMS = [
  {
    q: "How is this TikTok Shop pricing calculator different from a fee calculator?",
    a: "The fee calculator starts with a known price and breaks down costs, but this pricing calculator solves in reverse. You enter cost structure, fulfillment, tax mode, and target profit, and it returns the minimum listing price that still works after TikTok fees. That makes it better for sourcing and launch decisions because you can test viability before you publish a SKU. Use it when you need a concrete price floor, not just a fee estimate at one guessed price.",
  },
  {
    q: "How does managed fulfillment versus self-ship change the recommended price?",
    a: "Managed fulfillment usually raises the price floor because fulfillment and storage fees are added on top of platform commission. Self-ship removes those platform logistics fees, but you carry your own shipping cost and operations risk. The impact is product-specific: lightweight items can remain competitive under either model, while heavier items may need a higher listing price under managed fulfillment. Run both scenarios in this calculator to compare the minimum viable price for your exact SKU profile.",
  },
  {
    q: "How should I handle markets where commission is only visible in Seller Center?",
    a: "Use your live Seller Center rate in the manual input field whenever public documents do not show your exact commission percentage. This prevents underpricing caused by outdated or generic assumptions. You should also re-check rates after campaign changes because negotiated or category-specific rates can shift your break-even point. The calculator is designed for this workflow, so your output stays aligned with your active account terms instead of a static template.",
  },
  {
    q: "Why does tax mode (tax-inclusive vs tax-exclusive) matter for pricing?",
    a: "Tax mode directly changes the revenue base used to evaluate profitability, so it can materially change your recommended listing price. If your market is tax-inclusive, part of the buyer payment is tax and not retained as seller revenue; in tax-exclusive flows, tax is handled differently and your net base changes. The calculator applies local tax assumptions and lets you toggle inclusion mode to avoid overstating profit. Always keep this setting aligned with how your storefront actually displays prices.",
  },
  {
    q: "Does this model include affiliate commission and ad spend?",
    a: "Yes. You can set affiliate commission as a percentage and ad spend as a per-unit amount, and both are deducted before final profit is calculated. This is important because many TikTok Shop launches appear profitable on platform-fee-only math but lose margin after creator and paid traffic costs are included. Include these inputs when planning campaign-heavy SKUs so the recommended listing price reflects your true blended acquisition cost.",
  },
  {
    q: "What does it mean if the calculator says the target is unreachable?",
    a: "It means your current assumptions cannot hit the selected profit target even at very high pricing bounds under the model. Typical causes are low gross margin, high fulfillment cost, high affiliate/ad costs, or overly aggressive target margin. Reduce costs, lower the target, or revisit fulfillment strategy and run again. The unreachable state is useful because it flags structurally weak listings before inventory or ad budget is committed.",
  },
  {
    q: "Is the TikTok Shop pricing model updated for 2026?",
    a: `Yes. This hub is updated for ${FEE_SEO_YEAR} and last reviewed on ${HUB_LAST_REVIEWED}. Market-level assumptions are maintained with linked source references, but final operational decisions should still be verified in your local Seller Center because platform programs can change. Use this calculator as a planning baseline and re-check fee inputs during major policy updates.`,
  },
];

const RATE_ROWS = [
  {
    category: "US Most Categories",
    rate: "6%",
    minFee: "$0",
    notes: "TikTok Shop US baseline referral rate used in tool defaults.",
  },
  {
    category: "US Premium Jewelry",
    rate: "5%",
    minFee: "$0",
    notes: "Lower US jewelry rate modeled by category.",
  },
  {
    category: "UK General Merchandise",
    rate: "5%",
    minFee: "£0.30",
    notes: "Commission plus minimum fee support in UK logic.",
  },
  {
    category: "TH Marketplace Commission",
    rate: "7.49%",
    minFee: "N/A",
    notes: "Thailand public marketplace commission baseline.",
  },
  {
    category: "VN Processing Fee",
    rate: "₫3,000",
    minFee: "N/A",
    notes: "Vietnam per-order processing fee modeled as flat charge.",
  },
  {
    category: "SEA Manual Commission",
    rate: "Seller Input",
    minFee: "Varies",
    notes: "Use live Seller Center values in manual fields.",
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
        name: "TikTok Shop Pricing Calculator",
        item: absoluteUrl("/tiktok-shop-pricing-calculator"),
      },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `TikTok Shop Pricing Calculator ${FEE_SEO_YEAR}`,
    url: absoluteUrl("/tiktok-shop-pricing-calculator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    dateModified: HUB_LAST_REVIEWED,
    description:
      "TikTok Shop pricing calculator that back-solves listing prices for target profit or margin, including fees, fulfillment, affiliate spend, and tax.",
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

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, webApp, faq]) }} />;
}

function getDefaultCommission(config: (typeof TIKTOK_MARKET_LIST)[number]) {
  const rule = config.feeRules.find((item) => item.type === "percentage");
  if (!rule) return "Varies";
  if (rule.sellerInput) return "Seller input";
  if (typeof rule.defaultRate === "number") return `${rule.defaultRate.toFixed(2)}%`;
  return "Varies";
}

function getPerOrderFee(config: (typeof TIKTOK_MARKET_LIST)[number]) {
  const rule = config.feeRules.find((item) => item.type === "flat");
  if (!rule || typeof rule.defaultAmount !== "number") return "None";
  return `${config.currency.symbol}${rule.defaultAmount.toFixed(config.currency.decimals)}`;
}

function getUnitSystem(config: (typeof TIKTOK_MARKET_LIST)[number]) {
  const fulfillment = config.fulfillmentMethods.find((item) => item.value === "platform");
  if (!fulfillment) return "Local";
  if (fulfillment.kind === "weight-tier") return fulfillment.weightUnitLabel === "lb" ? "Imperial" : "Metric";
  return fulfillment.dimensionUnitLabel === "in" ? "Imperial" : "Metric";
}

export default function TikTokPricingCalculatorHub() {
  return (
    <div className={`container ${styles.tiktokPage}`}>
      <StructuredData />

      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--color-text-secondary)" }}>TikTok Shop Pricing Calculator</span>
      </nav>

      <section className={`card ${styles.heroCard}`}>
        <h1 className={styles.heroTitle}>TikTok Shop Pricing Calculator ({FEE_SEO_YEAR})</h1>
        <p className={styles.heroSubtitle}>
          Stop guessing your listing price. Enter your product costs, choose fulfillment mode, set a target profit, and this calculator works backward to find the exact minimum price that keeps you profitable after every TikTok Shop fee.
        </p>
        <p className="muted" style={{ marginTop: 8, marginBottom: 0, fontSize: 12 }}>
          {lastReviewedLabel(HUB_LAST_REVIEWED)}
        </p>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>Reverse</p>
            <p className={styles.statLabel}>Price Solving</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{TIKTOK_MARKET_LIST.length}</p>
            <p className={styles.statLabel}>Markets Supported</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>Free</p>
            <p className={styles.statLabel}>No Login Needed</p>
          </div>
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 22 }}>Select Your TikTok Shop Market</h2>
        <div className={styles.marketGrid}>
          {TIKTOK_MARKET_LIST.map((market) => (
            <Link key={market.id} href={`/tiktok-shop-pricing-calculator/${market.id}`} className={styles.marketCard}>
              <FlagIcon code={market.id} size={44} />
              <div>
                <p className={styles.marketName}>TikTok Shop {market.fullName}</p>
                <p className={styles.marketMeta}>{market.domain} · {market.currency.code}</p>
                <p className={styles.marketHint}>{market.summary.shortFeeSummary}</p>
                <p className={styles.marketOpen}>Open Calculator →</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 12, marginBottom: 0, fontSize: 12 }}>
          Need fee-side verification? <Link href="/tiktok-shop-fee-calculator">Use the TikTok Shop fee calculator</Link>.
        </p>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 22 }}>Cross-Market Fee Snapshot</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 14, fontSize: 14, lineHeight: 1.65 }}>
          The same product can require a very different listing price across markets because commission rates, fixed fees, and unit systems vary.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>Market</th>
                <th>Currency</th>
                <th>Default Commission</th>
                <th>Per-Order Fee</th>
                <th>Categories</th>
                <th>Unit System</th>
              </tr>
            </thead>
            <tbody>
              {TIKTOK_MARKET_LIST.map((market) => (
                <tr key={market.id}>
                  <td>
                    <Link href={`/tiktok-shop-pricing-calculator/${market.id}`} style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>
                      <FlagIcon code={market.id} size={16} /> {market.name}
                    </Link>
                  </td>
                  <td>{market.currency.code}</td>
                  <td>{getDefaultCommission(market)}</td>
                  <td>{getPerOrderFee(market)}</td>
                  <td>{market.categories.length}</td>
                  <td>{getUnitSystem(market)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 22 }}>Why Reverse Pricing Matters on TikTok Shop</h2>
        <div className="grid" style={{ gap: 16 }}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Commission rate differences shift your floor</h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              A 1% to 2% commission difference can erase margin quickly on fast-moving SKUs. Reverse pricing lets you start from target profit and compute a safer floor price before listing.
            </p>
          </div>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Fulfillment and size profile drive per-order cost</h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              Managed fulfillment fees rise with weight or size tiers. Products that look profitable under self-ship assumptions can become unprofitable after platform logistics and storage are included.
            </p>
          </div>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>Hidden costs are often the real margin leak</h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              Affiliate commission, per-unit ads, and local tax treatment can remove a large share of apparent margin. Modeling all of them together helps avoid false-positive pricing decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 22 }}>Managed Fulfillment vs Self-Ship</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12, lineHeight: 1.65 }}>
          Your fulfillment path changes both operational burden and minimum viable listing price.
        </p>
        <div className={styles.dualGrid}>
          <div className={styles.dualCard}>
            <h3 className={styles.dualCardTitle}>Managed Fulfillment (FBT)</h3>
            <ul className={styles.dualCardList}>
              <li>Platform fulfillment fee added per order.</li>
              <li>Storage may apply for longer holding periods.</li>
              <li>Lower logistics overhead for seller operations.</li>
              <li>Usually requires a higher listing price floor.</li>
            </ul>
          </div>
          <div className={styles.dualCard}>
            <h3 className={styles.dualCardTitle}>Self-Ship</h3>
            <ul className={styles.dualCardList}>
              <li>No platform fulfillment fee in fee engine.</li>
              <li>Seller shipping cost is direct expense.</li>
              <li>More control over packaging and service model.</li>
              <li>Can enable a lower floor if shipping is efficient.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8, fontSize: 22 }}>TikTok Shop Fee Quick Reference</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 14, lineHeight: 1.65 }}>
          These baseline values are useful for first-pass pricing assumptions before entering your exact account-specific rates.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th>Category / Market</th>
                <th>Rate</th>
                <th>Min Fee</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {RATE_ROWS.map((row) => (
                <tr key={row.category}>
                  <td style={{ fontWeight: 600 }}>{row.category}</td>
                  <td>{row.rate}</td>
                  <td>{row.minFee}</td>
                  <td>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 22 }}>Calculation Logic</h2>
        <ul className={styles.logicList}>
          <li>Sold Price = Listing Price − Seller Discount.</li>
          <li>Buyer Payment = Sold Price − Platform Discount + Buyer Shipping Fee.</li>
          <li>Total Fees = Platform Commission + Flat Processing Fees + Fulfillment + Storage.</li>
          <li>Net Profit = Seller Revenue (ex-tax) − Total Fees − COGS − Shipping − Affiliate − Ads − Other Costs.</li>
          <li>Solver target: find the minimum listing price where target profit amount or margin is reached.</li>
        </ul>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 22 }}>Primary Sources</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 12, lineHeight: 1.65 }}>
          Verify final decisions with official TikTok Shop policy and fee documentation.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn" href="https://seller-us.tiktok.com/university/essay?identity=1&role=1&knowledge_id=10002377" target="_blank" rel="noopener noreferrer">
            TikTok Shop US Academy
          </a>
          <a className="btn" href="https://lf16-statics.oecsccdn.com/obj/oec-sc-static-sg/fe-asset/static/merchant/pdf/uk_fulfillment_center_landing_one_page.pdf" target="_blank" rel="noopener noreferrer">
            UK FBT Rate Card
          </a>
          <a className="btn" href="https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-uvpahylwv-z/ljhwZthlaukjlkulzlp/user-agreement/TikTok%20Shop%20Merchant%20Terms%20of%20Service.pdf" target="_blank" rel="noopener noreferrer">
            Merchant Terms
          </a>
        </div>
      </section>

      <section className="card" style={{ padding: 24 }}>
        <FAQSection items={FAQ_ITEMS} />
      </section>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to set your TikTok Shop price floor?</h2>
        <p className={styles.ctaText}>
          Open your market calculator, plug in your true cost stack, and get the minimum listing price that still protects margin.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/tiktok-shop-pricing-calculator/us" className="btn" style={{ background: "#fff", color: "#0b4ea2", fontWeight: 700 }}>
            <FlagIcon code="US" /> US Calculator
          </Link>
          <Link href="/tiktok-shop-pricing-calculator/uk" className="btn" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderColor: "rgba(255,255,255,0.45)", fontWeight: 700 }}>
            <FlagIcon code="UK" /> UK Calculator
          </Link>
          <Link href="/tiktok-shop-pricing-calculator/th" className="btn" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderColor: "rgba(255,255,255,0.45)", fontWeight: 700 }}>
            <FlagIcon code="TH" /> TH Calculator
          </Link>
        </div>
      </section>
    </div>
  );
}
