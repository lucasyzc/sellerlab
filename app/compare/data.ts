export type CompareFaq = {
  q: string;
  a: string;
};

export type CompareRow = {
  metric: string;
  left: string;
  right: string;
  impact: string;
};

export type CompareEntry = {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  leftLabel: string;
  rightLabel: string;
  takeaway: string[];
  rows: CompareRow[];
  faq: CompareFaq[];
  sources: Array<{ label: string; url: string }>;
  cta: { label: string; href: string };
};

export const COMPARE_ENTRIES: CompareEntry[] = [
  {
    slug: "ebay-us-vs-uk-fees",
    title: "eBay US vs UK Fee Comparison (2026)",
    description:
      "Compare eBay US and eBay UK fee structures, including final value fees, per-order charges, and international selling impact.",
    updatedAt: "2026-03-22",
    leftLabel: "eBay US",
    rightLabel: "eBay UK",
    takeaway: [
      "For domestic sales, UK private sellers can be significantly cheaper because UK domestic FVF can be 0% for private accounts.",
      "US business sellers have clearer default pricing, but total effective fee often increases with payment processing.",
      "Cross-border sellers should model destination-based international fee before deciding listing market.",
    ],
    rows: [
      {
        metric: "Default Fee Structure",
        left: "Typical FVF around 13.25% plus per-order fee and managed payments.",
        right: "Business sellers: category-based rates; private domestic sellers can be 0% FVF.",
        impact: "Seller type has stronger impact in UK market.",
      },
      {
        metric: "Per-order Fee",
        left: "Generally fixed per order (for example $0.30 in common scenarios).",
        right: "Tiered by order value for business sellers (for example around GBP0.30-0.40 ranges).",
        impact: "Low AOV products are more sensitive to fixed order fees.",
      },
      {
        metric: "International Add-on",
        left: "Additional international percentage applies by destination.",
        right: "International fee varies by destination zone and seller type.",
        impact: "Profit swing can exceed 1-2 points in margin.",
      },
      {
        metric: "Best-fit Seller",
        left: "Sellers needing consistent policy and US demand density.",
        right: "Private/domestic UK sellers or category-specific business sellers.",
        impact: "Pick market by seller profile, not just traffic volume.",
      },
    ],
    faq: [
      {
        q: "Which market is cheaper for new sellers?",
        a: "It depends on seller type. UK private domestic selling can have lower platform fees, while US has more standardized defaults for business modeling.",
      },
      {
        q: "Should I list the same SKU in both US and UK?",
        a: "Usually yes for testing, but validate net margin by destination and payment/FX costs before scaling.",
      },
      {
        q: "Do shipping charges affect fee calculation?",
        a: "Yes, in most cases platform fee bases include buyer-paid shipping, so margin needs full-order modeling.",
      },
    ],
    sources: [
      {
        label: "eBay US Seller Fees",
        url: "https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4364",
      },
      {
        label: "eBay UK Fees Overview",
        url: "https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4822",
      },
    ],
    cta: {
      label: "Run eBay Fee Calculator",
      href: "/ebay-fee-calculator",
    },
  },
  {
    slug: "amazon-us-vs-uk-fba-fees",
    title: "Amazon US vs UK FBA Fee Comparison (2026)",
    description:
      "Compare Amazon FBA economics across the US and UK markets, including referral fee behavior, fulfillment costs, and storage sensitivity.",
    updatedAt: "2026-03-22",
    leftLabel: "Amazon US",
    rightLabel: "Amazon UK",
    takeaway: [
      "Referral fee percentage can look similar by category, but fulfillment and storage economics differ by size, weight, and seasonal factors.",
      "US market often benefits from larger demand depth, while UK can be attractive for compact, high-margin SKUs.",
      "Storage seasonality can materially change Q4 profitability in both markets.",
    ],
    rows: [
      {
        metric: "Referral Fee Behavior",
        left: "Category-specific rates with minimums in selected categories.",
        right: "Category-specific rates with local fee schedules and minimums.",
        impact: "Category selection remains first-order lever in both markets.",
      },
      {
        metric: "FBA Fulfillment",
        left: "Fee tiers tied to size and shipping weight in US units.",
        right: "Fee tiers tied to size/weight in metric/localized structures.",
        impact: "Unit conversion and packaging strategy matter when expanding.",
      },
      {
        metric: "Storage Cost Sensitivity",
        left: "Seasonal surges can erode low-velocity SKU margin in peak months.",
        right: "Seasonality still important, with local storage policies impacting long-tail inventory.",
        impact: "Keep separate forecast for peak and non-peak periods.",
      },
      {
        metric: "Best-fit SKU Profile",
        left: "Higher velocity SKUs that can absorb fulfillment costs.",
        right: "Compact SKUs with predictable replenishment and strong margin.",
        impact: "Same SKU can have very different ROI across regions.",
      },
    ],
    faq: [
      {
        q: "Is US always better because of demand volume?",
        a: "Not always. Higher volume can be offset by fee mix and logistics costs. Evaluate net margin and cash cycle together.",
      },
      {
        q: "Can one calculator model both markets?",
        a: "Use market-specific calculators to avoid unit, fee schedule, and policy mismatch.",
      },
      {
        q: "What should I monitor monthly?",
        a: "Referral fee policy updates, FBA fulfillment tier changes, and storage pricing windows.",
      },
    ],
    sources: [
      {
        label: "Amazon Seller Fees (US)",
        url: "https://sellercentral.amazon.com/help/hub/reference/G200336920",
      },
      {
        label: "Amazon Seller Fees (UK)",
        url: "https://sellercentral.amazon.co.uk/help/hub/reference/G200336920",
      },
    ],
    cta: {
      label: "Run Amazon Fee Calculator",
      href: "/amazon-fee-calculator",
    },
  },
];

export function getCompareEntry(slug: string): CompareEntry | undefined {
  return COMPARE_ENTRIES.find((entry) => entry.slug === slug);
}

