import Link from "next/link";
import type { MarketConfig, MarketId } from "../ebay-fee-calculator/market-config";
import { MarketFeeTable } from "../ebay-fee-calculator/seo-content";
import { absoluteUrl } from "@/lib/site-url";
import { resolveLastReviewed, resolveSeoYear, withSeoYear } from "@/lib/fee-seo";
import { FAQSection, faqAnswerToText } from "../components/faq-section";

type FAQ = { q: string; a: import("../components/faq-section").FAQAnswer };

// ═══════════════════════════════════════════════════════════════
// Structured Data (JSON-LD)
// ═══════════════════════════════════════════════════════════════

export function PricingMarketStructuredData({ config }: { config: MarketConfig }) {
  const url = `/ebay-pricing-calculator/${config.id}`;
  const faqs = getPricingMarketFaqs(config);
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

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
      { "@type": "ListItem", position: 3, name: `eBay Pricing Calculator - ${config.fullName}`, item: absoluteUrl(url) },
    ],
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: withSeoYear(`eBay Pricing Calculator - ${config.fullName}`, seoYear),
    url: absoluteUrl(url),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: config.currency.code },
    dateModified: lastReviewed,
    description: `Back-solve the minimum eBay listing price for ${config.fullName} to hit your target profit after fees.`,
    featureList: [
      "Target profit back-solve",
      "Discount rate modeling",
      "Category-specific fee integration",
      "Net profit and margin verification",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerToText(item.a) },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([breadcrumb, webApp, faqSchema]),
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// Re-export Fee Table
// ═══════════════════════════════════════════════════════════════

export { MarketFeeTable };

// ═══════════════════════════════════════════════════════════════
// FAQ Accordion
// ═══════════════════════════════════════════════════════════════

export function PricingMarketFAQ({ config }: { config: MarketConfig }) {
  const faqs = getPricingMarketFaqs(config);
  return <FAQSection items={faqs} />;
}

function getPricingMarketFaqs(config: MarketConfig): FAQ[] {
  const seoYear = resolveSeoYear(config.seo.effectiveYear);
  const lastReviewed = resolveLastReviewed({ lastReviewed: config.seo.lastReviewed });

  return [
    ...PRICING_MARKET_FAQS[config.id],
    {
      q: `Is this ${config.siteName} pricing calculator updated for ${seoYear}?`,
      a: `Yes. This pricing calculator for ${config.fullName} is aligned to ${seoYear} fee structures and was last reviewed on ${lastReviewed}. The tool uses the same underlying fee model as our dedicated eBay fee calculator, which is maintained against official ${config.siteName} seller fee schedules. We recommend verifying your specific category and store-tier rates on official eBay seller pages before committing to a final listing price, especially around fee update windows that eBay typically announces quarterly.`,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// FAQ Data
// ═══════════════════════════════════════════════════════════════

const PRICING_MARKET_FAQS: Record<MarketId, FAQ[]> = {
  us: [
    {
      q: "How does the eBay US pricing calculator determine the minimum listing price?",
      a: {
        intro: "The calculator back-solves from your target profit through the full eBay US fee model in reverse.",
        points: [
          "Enter your item cost, shipping expenses, discount rate, and desired net profit or margin.",
          "The solver finds the lowest listing price where your target is met after deducting FVF (13.25% non-store / 12.35% store), the $0.30 per-order fee, and Managed Payments (2.7% + $0.25).",
          "Optional inputs for promoted listings, sales tax, and Top Rated Seller discounts are also factored in.",
        ],
        conclusion: "The result is a practical floor price you can use before publishing your listing.",
      },
    },
    {
      q: "Should I use target profit amount or target profit margin mode?",
      a: "Both modes solve for the minimum listing price but frame the goal differently. Target profit amount lets you specify an exact dollar figure to clear after all fees \u2014 useful when you know the per-item return needed to justify sourcing. Target profit margin sets a percentage floor (net profit divided by revenue), which maintains consistent margins across items with different cost bases. For high-volume resellers managing diverse inventory, margin mode is more scalable because it automatically adjusts the required listing price proportionally to each item\u2019s cost structure.",
    },
    {
      q: "How does the discount rate input affect the pricing result on eBay US?",
      a: "The discount rate models markdowns, coupons, or Best Offer acceptance. A 10% rate means the solver assumes the item sells at 90% of the listing price and pushes the price higher to compensate. All eBay US fees are then calculated on the discounted sold price. Leave this at 0% if you never discount. If you regularly negotiate through Best Offer or run promotions, setting a realistic rate ensures the calculated listing price still meets your profit target at the expected sale price.",
    },
    {
      q: "What eBay US fees are included in this pricing calculation?",
      a: {
        intro: "The calculator integrates the complete eBay US fee stack.",
        points: [
          "Category-specific final value fees with tiered thresholds (e.g. 13.25% on the first $7,500, then 2.35% above).",
          "$0.30 per-order fee on every transaction.",
          "Managed Payments processing: 2.7% + $0.25 per order.",
          "Optional: Promoted Listing ad fees, sales tax impact, Top Rated Seller 10% FVF discount, and 1.65% international surcharge.",
        ],
        conclusion: "The solver accounts for all these simultaneously when computing the required listing price.",
      },
    },
    {
      q: "Can I compare pricing across different eBay US store tiers?",
      a: "Yes. Use the store type selector to switch between No Store, Starter, Basic, Premium, Anchor, and Enterprise tiers. The calculator instantly recalculates the minimum listing price based on each tier\u2019s fee rules. Store subscribers enjoy lower FVF rates \u2014 most categories drop from 13.25% to 12.35%, and specialized categories like Computers fall to 7%. Toggling tiers with the same cost inputs shows exactly how much lower your listing price can be, helping you decide whether the monthly store fee is justified by per-item savings.",
    },
  ],
  uk: [
    {
      q: "How does the eBay UK pricing calculator work for private and business sellers?",
      a: {
        intro: "The calculator adapts its fee model based on your selected seller type, revealing significant pricing differences.",
        points: [
          "Private sellers pay 0% FVF on domestic sales, so the solver only factors in international fees (3% on cross-border) and promoted listing costs.",
          "Business sellers face category-dependent FVF rates (typically 12.9%), plus a \u00a30.40 per-order fee and 0.35% regulatory operating fee.",
        ],
        conclusion: "Switching between Private and Business seller immediately recalculates the minimum listing price. Private sellers often see a substantially lower floor price for domestic transactions.",
      },
    },
    {
      q: "How do international fees affect eBay UK listing prices?",
      a: {
        intro: "International selling fees vary by destination and seller type, adding meaningful cost to cross-border sales.",
        points: [
          "Business sellers: 1.05% to Eurozone/Northern Europe, 1.8% to US/Canada, 2.0% to other countries.",
          "Private sellers: flat 3% on all international sales regardless of destination.",
        ],
        conclusion: "Toggle the international sale option and select a destination to see how the fee impacts your required listing price. For frequent cross-border sellers, these fees can add 1\u20133% to total costs.",
      },
    },
    {
      q: "What is the regulatory operating fee and how does it impact my eBay UK pricing?",
      a: "The regulatory operating fee is 0.35% of the total sale amount (excluding VAT), charged on all business seller transactions. Private sellers are exempt. While 0.35% sounds small, it compounds with FVF and per-order charges \u2014 on a \u00a3200 sale, it adds \u00a30.70. The pricing calculator automatically includes this fee when you select a business seller type, ensuring the recommended listing price accounts for this charge and still hits your target profit.",
    },
    {
      q: "Which eBay UK categories have the lowest fees for pricing purposes?",
      a: {
        intro: "Several categories offer business sellers significantly lower FVF rates than the 12.9% default.",
        points: [
          "Computers, Cameras, Sound & Vision, Mobile Phones: 6.9% up to \u00a31,000, then 3% above.",
          "Video Game Consoles: 6.9% up to \u00a3400, then 2% above.",
          "Vehicle Parts: 9.5%, dropping to 3% above \u00a3750.",
        ],
        conclusion: "Listing in the correct lower-fee category can nearly halve your total fees compared to the default rate. The pricing calculator uses these precise rates per category.",
      },
    },
    {
      q: "How does the Top Rated Seller discount affect my eBay UK listing price?",
      a: "Top Rated Seller status earns a 10% discount on the final value fee. This discount is applied before other fees like the regulatory operating fee and per-order charge are calculated. For a business seller in a category with 12.9% FVF, the effective rate drops to roughly 11.61%. Check the Top Rated Seller box in the calculator to see the impact on your minimum listing price \u2014 over many listings, this discount translates into meaningful savings or allows more competitive pricing.",
    },
  ],
  de: [
    {
      q: "How does the eBay Germany pricing calculator handle private versus business sellers?",
      a: {
        intro: "The calculator dynamically adjusts fees based on seller type, often revealing a substantial pricing difference.",
        points: [
          "Private sellers in Germany/EEA pay 0% FVF on domestic sales \u2014 the solver only covers item cost, shipping, and optional charges like promoted listings.",
          "Business sellers face category-specific rates (3% for Electronics, 6.5% for most categories, up to 8% for Clothing) plus a \u20ac0.35 per-order fee.",
        ],
        conclusion: "Switch between seller types to see how the minimum listing price changes. Private sellers typically see a substantially lower floor price.",
      },
    },
    {
      q: "What categories offer the lowest required listing price on eBay.de?",
      a: {
        intro: "Business seller rates on eBay Germany vary significantly by category, directly affecting the minimum viable listing price.",
        points: [
          "Lowest (3%): Consumer Electronics and Tyres.",
          "Mid-low (5.7%): Electronic Accessories, Motorcycle Parts, Vehicle Parts.",
          "Standard (6.5%): Books, Computers, Instruments, Toys, Art.",
          "Mid-high (7%): Baby, Home, Pet Supplies.",
          "Highest (8%): Clothing and Beauty.",
        ],
        conclusion: "eBay.de uses flat rates (no tiered thresholds), so the fee rate remains constant regardless of item price. Listing in a lower-fee category directly reduces the minimum listing price.",
      },
    },
    {
      q: "How do international selling fees work in the eBay Germany pricing calculator?",
      a: {
        intro: "Toggle the international sale option to factor in destination-specific surcharges.",
        points: [
          "EU, US, and Canada: 1.91%.",
          "UK: 1.43%.",
          "All other countries: 3.93%.",
        ],
        conclusion: "These fees apply to the total sale amount and push the recommended listing price higher. For a \u20ac55 sale, an international fee to Asia adds roughly \u20ac2.16 to your cost stack.",
      },
    },
    {
      q: "Why is the per-order fee different for small orders on eBay.de?",
      a: "eBay Germany applies a tiered per-order fee: \u20ac0.35 for orders of \u20ac10 or more, and \u20ac0.05 for orders under \u20ac10. This structure protects margins on low-value items where a full per-order fee would be disproportionate. The pricing calculator automatically selects the correct fee based on the expected sold price. If the solved listing price (after any discount) falls below \u20ac10, the lower \u20ac0.05 fee is used, which can slightly reduce the required listing price.",
    },
    {
      q: "Can I use the discount rate feature to model Best Offer pricing on eBay.de?",
      a: "Yes. If you accept Best Offers and historically sell at about 15% below asking, enter 15 as the discount rate. The solver assumes a sold price of 85% of your listing price and finds a floor that still meets your profit target at that discounted level. This is especially useful on eBay.de where negotiation is common in categories like Art, Collectables, and Professional Equipment. Modeling the expected discount upfront prevents setting a price that looks profitable at full price but loses money on negotiated sales.",
    },
  ],
  au: [
    {
      q: "How does the eBay Australia pricing calculator account for the FVF cap?",
      a: "eBay Australia caps the final value fee per item: A$440 (no store) or A$400 (store). The pricing calculator integrates this cap into its solver. When the calculated FVF exceeds the cap, the capped amount is used instead, which can dramatically lower the required listing price for high-value items. For example, on a A$5,000 sale, the non-store FVF would normally be A$670 at 13.4%, but the cap limits it to A$440. The recommended listing price for expensive items is therefore often lower than the percentage rate alone would suggest.",
    },
    {
      q: "What fees are included when calculating eBay Australia listing prices?",
      a: {
        intro: "The calculator models the complete eBay Australia fee structure.",
        points: [
          "Category-specific FVF: 13.4% (non-store) or 10.4% (store) on the first A$4,000, then 2.5% above.",
          "Per-order fee: A$0.30 per transaction.",
          "Payment processing: included in the FVF (no separate Managed Payments charge).",
          "FVF cap: A$440 (no store) or A$400 (store) per item.",
          "Optional: promoted listing ad rate, GST, and 1.0% international surcharge.",
        ],
      },
    },
    {
      q: "Should I get an eBay Store to reduce my required listing price in Australia?",
      a: {
        intro: "Store subscribers on eBay Australia benefit from one of the largest FVF reductions across eBay markets.",
        points: [
          "Default rate drops from 13.4% to 10.4% \u2014 a 3 percentage point reduction.",
          "Computers: 13.4% to 7%. Electronics: 13.4% to 9%. Video Game Consoles: 13.4% to 7%.",
          "FVF cap lowers slightly from A$440 to A$400.",
        ],
        conclusion: "Switch between No Store and store tiers in the calculator to quantify the per-item savings. For regular sellers, the store fee often pays for itself within a few sales.",
      },
    },
    {
      q: "How does the discount rate work with eBay Australia's tiered fee structure?",
      a: "The discount rate lowers the expected sold price before fees are calculated through the tiered schedule. For example, listing at A$5,000 with a 10% discount means the sold price is A$4,500. Fees are then 10.4% on the first A$4,000 (A$416) plus 2.5% on the remaining A$500 (A$12.50) for store sellers. The discount can push sold prices below tier thresholds, changing which rates apply. The solver accounts for this interaction precisely when computing your minimum listing price.",
    },
    {
      q: "Can I factor in currency conversion costs for international sales on eBay Australia?",
      a: "The calculator includes the 1.0% international sale fee when you toggle the international option. eBay Australia also charges a separate 3.0\u20133.3% currency conversion fee on foreign-currency payments, which is not modeled directly since it depends on the buyer\u2019s payment currency. For a conservative estimate, add 3% to the Other Costs field to approximate worst-case conversion impact. This ensures your listing price covers scenarios where every international buyer pays in a non-AUD currency.",
    },
  ],
  ca: [
    {
      q: "How does the eBay Canada pricing calculator determine the minimum listing price?",
      a: {
        intro: "The calculator back-solves from your target profit using the complete eBay Canada fee model.",
        points: [
          "FVF: 13.6% (non-store) or 12.7% (store) on most categories, with 2.35% above C$7,500 or C$2,500.",
          "Per-order fee: C$0.30.",
          "Managed Payments: 2.7% of the total transaction (including taxes) plus C$0.25.",
        ],
        conclusion: "Total effective fees typically range from 16\u201317%, making the pricing calculator essential for setting prices that actually deliver your target profit.",
      },
    },
    {
      q: "How do eBay Canada fees compare to eBay US, and how does this affect pricing?",
      a: "eBay Canada\u2019s fees are slightly higher than eBay US following the March 2025 increase. The default non-store FVF rose to 13.6% (vs 13.25% in the US), and store rates went to 12.7% (vs 12.35%). Both markets share the same Managed Payments rate (2.7% + fixed fee) and per-order charge. For the same item cost and profit target, the required listing price on eBay Canada will typically be a few percent higher. Use the market switcher to compare side by side if you sell on both platforms.",
    },
    {
      q: "What impact does the Managed Payments fee have on my eBay Canada listing price?",
      a: "Managed Payments charges 2.7% of the total transaction amount (including applicable sales tax) plus C$0.25 per order. This fee is separate from the FVF and applies to every sale. On a C$50 item with C$10 shipping and 13% HST, the total transaction is C$67.80, making the Managed Payments fee approximately C$2.08. For high-tax provinces like Ontario (13% HST), this fee is noticeably larger because it applies to the tax-inclusive total. The calculator includes this charge, which is why the recommended listing price may seem higher than FVF alone suggests.",
    },
    {
      q: "How does the store tier affect pricing on eBay Canada?",
      a: {
        intro: "Switching to any store tier reduces fees through two mechanisms.",
        points: [
          "Default FVF drops from 13.6% to 12.7%.",
          "Tiered threshold lowers from C$7,500 to C$2,500, so the 2.35% above-threshold rate kicks in sooner.",
          "Category benefits: Computers drop to 7%, Electronics to 9%, Guitars to 6.35%.",
        ],
        conclusion: "The calculator recalculates instantly when you change store tier. For sellers listing more than a few items per month, the FVF savings typically offset the monthly subscription cost within the first few sales.",
      },
    },
    {
      q: "Can I account for Canadian provincial sales tax in the pricing calculation?",
      a: "Yes. Enter your applicable provincial tax rate \u2014 13% for Ontario HST, 5% for Alberta GST, or the combined GST+PST rate for BC. The calculator uses this rate to determine the tax-inclusive total, which serves as the base for the Managed Payments fee and Promoted Listing ad rate. While eBay collects and remits tax automatically, the tax-inclusive total increases the Managed Payments fee, indirectly affecting your net profit. Entering the correct rate ensures the listing price recommendation accounts for this cost.",
    },
  ],
  fr: [
    {
      q: "How does the eBay France pricing calculator work for private sellers?",
      a: "The calculator uses a flat 8% FVF across all categories plus a \u20ac0.35 per-order fee for private sellers. The key advantage is the \u20ac200 per-item FVF cap \u2014 on items where 8% would exceed \u20ac200 (above roughly \u20ac2,500 in sale value), the fee is capped. The solver integrates this cap, so the recommended listing price for high-value items is disproportionately lower. This makes eBay France particularly attractive for private sellers listing electronics, furniture, or luxury goods.",
    },
    {
      q: "What categories offer the best pricing for business sellers on eBay.fr?",
      a: {
        intro: "Business sellers benefit from category-specific rates, many lower than the private seller flat 8%.",
        points: [
          "Lowest (3%): Consumer Electronics and Tyres.",
          "Mid-low (5.7%): Electronic Accessories, Motorcycle Parts, Vehicle Parts.",
          "Standard (6.5%): Books, Computers, Musical Instruments, Toys, Art.",
          "Mid-high (7%): Baby, Home, Pet Supplies.",
          "Highest (8%): Clothing and Beauty.",
        ],
        conclusion: "Switching categories in the calculator immediately shows how the required listing price changes for your profit target.",
      },
    },
    {
      q: "How does the \u20ac200 FVF cap affect listing prices for expensive items on eBay France?",
      a: "The \u20ac200 cap applies exclusively to private sellers. Without it, a \u20ac5,000 sale would incur a \u20ac400 FVF at 8%. With the cap, the fee stops at \u20ac200, effectively halving the cost. The calculator applies this cap automatically when Private Seller is selected. Above ~\u20ac2,500, each additional euro carries zero marginal FVF, so the recommended listing price for expensive items grows at a decreasing rate. Business sellers do not benefit from this cap, so high-value item sellers should compare both seller types in the calculator.",
    },
    {
      q: "How do international selling fees impact my eBay France listing price?",
      a: "International sales incur a 1.91% surcharge on the total sale amount for both seller types. Toggle the international sale option to see how it affects your floor price. For a \u20ac110 sale, the international fee adds approximately \u20ac2.10. While modest compared to FVF, it compounds with other charges. The calculator handles this automatically, so you can toggle international on and off to compare domestic versus cross-border pricing.",
    },
    {
      q: "Can I model promoted listings in my eBay France pricing strategy?",
      a: "Yes. Enter a Promoted Listing ad rate (0\u201320%) and the calculator adds this cost to the fee stack before solving. For example, a 5% ad rate on a \u20ac50 sale adds \u20ac2.50 in advertising costs on top of FVF and per-order fee. The solver pushes the recommended listing price higher to maintain your profit target. Experiment with different ad rates to find where increased visibility justifies the higher required price.",
    },
  ],
  it: [
    {
      q: "How does the eBay Italy pricing calculator work for private sellers?",
      a: "The calculator uses a flat 8% FVF plus a \u20ac0.35 per-order fee for private sellers, identical to eBay France. Private sellers also benefit from the \u20ac200 per-item FVF cap, meaning the fee never exceeds \u20ac200 regardless of sale price. For items above approximately \u20ac2,500, the effective fee rate drops below 8%. The solver integrates this cap to recommend the lowest listing price that achieves your target profit, making eBay Italy cost-effective for private sellers of high-value items.",
    },
    {
      q: "What are the best categories for business sellers to minimize listing prices on eBay.it?",
      a: {
        intro: "Business sellers can reduce required listing prices by choosing lower-fee categories.",
        points: [
          "Lowest (3%): Consumer Electronics and Tyres.",
          "Mid-low (5.7%): Electronic Accessories, Motorcycle Parts, Vehicle Parts.",
          "Standard (6.5%): Books, Computers, Musical Instruments, Toys, Art.",
          "Mid-high (7%): Baby, Home, Pet Supplies.",
          "Highest (8%): Clothing and Beauty.",
        ],
        conclusion: "eBay Italy uses flat rates without tiered thresholds, so the fee percentage stays constant regardless of item price. Switching categories in the calculator shows the pricing impact instantly.",
      },
    },
    {
      q: "How does the eBay Italy fee structure compare to eBay France for pricing?",
      a: "eBay Italy and France share an identical fee structure \u2014 same category rates, per-order fee (\u20ac0.35), private seller flat rate (8%), FVF cap (\u20ac200), and international fee (1.91%). Both use EUR. The pricing calculator produces identical minimum listing prices for the same inputs on either market. The practical difference lies in market dynamics \u2014 buyer demand, competition, and typical selling prices differ between Italian and French buyers. Use the market switcher to confirm fee parity, then base pricing decisions on competitive factors.",
    },
    {
      q: "How does the \u20ac200 FVF cap benefit high-value sellers on eBay Italy?",
      a: "The \u20ac200 cap (private sellers only) provides significant savings on expensive items. A \u20ac3,000 sale would normally incur \u20ac240 at 8%, but the cap limits it to \u20ac200. For a \u20ac10,000 sale, the savings are dramatic: \u20ac800 in uncapped FVF reduced to \u20ac200. The calculator applies this cap automatically when Private Seller is selected. Above the ~\u20ac2,500 threshold, the effective fee rate drops progressively. Business sellers do not benefit from this cap, so private sellers listing high-value goods often face a lower total fee burden despite the higher headline rate.",
    },
    {
      q: "Can I use the pricing calculator to plan eBay Italy promotions and offers?",
      a: "Yes. Enter your expected average discount in the discount rate field \u2014 for example, 20 if you plan a 20% off promotion. The solver computes the sold price at 80% of the listing price and finds a floor that still achieves your target profit at the discounted level. The Promoted Listing ad rate field lets you add advertising costs on top. Together, these inputs model the combined impact of promotional discounts and advertising spend on your required listing price.",
    },
  ],
};
