import type { TikTokMarketConfig } from "../tiktok-config";

const SHARED_DOC = {
  title: "TikTok Shop Merchant Terms of Service",
  url: "https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-uvpahylwv-z/ljhwZthlaukjlkulzlp/user-agreement/TikTok%20Shop%20Merchant%20Terms%20of%20Service.pdf",
  effectiveDate: "2024-01-03",
};

export const PH_MARKET: TikTokMarketConfig = {
  id: "ph",
  name: "PH",
  fullName: "Philippines",
  flag: "🇵🇭",
  domain: "seller-ph.tiktok.com",
  currency: { code: "PHP", symbol: "₱", locale: "en-PH", decimals: 2 },
  categories: [{ label: "General Merchandise", value: "default" }],
  tax: {
    name: "VAT",
    defaultRate: 12,
    priceIncludesTaxByDefault: true,
    helpText: "Philippines official public pages found here expose shared fee categories, but not a readable current numeric public fee schedule.",
  },
  feeRules: [
    {
      id: "commission_fee",
      type: "percentage",
      label: "Commission Fee",
      description: "Enter the current Philippines commission fee from Seller Center.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Commission fee (%)",
    },
    {
      id: "transaction_fee",
      type: "percentage",
      label: "Transaction Fee",
      description: "Enter the current Philippines transaction fee from Seller Center.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Transaction fee (%)",
    },
  ],
  manualRateDisclaimer: "Public PH pages did not surface a reliable numeric fee table; use Seller Center values for accuracy.",
  fulfillmentMethods: [
    {
      value: "self",
      label: "Seller Fulfillment",
      description: "No public PH logistics or storage rate card was surfaced.",
      kind: "self",
    },
  ],
  defaults: {
    category: "default",
    fulfillmentMethod: "self",
    soldPrice: 499,
    sellerDiscount: 0,
    platformDiscount: 0,
    buyerShippingFee: 49,
    itemCost: 180,
    shippingCost: 40,
    affiliateRate: 10,
    adSpendPerUnit: 25,
    otherCosts: 0,
    taxRate: 12,
    priceIncludesTax: true,
    manualInputs: {
      commission_fee: 0,
      transaction_fee: 0,
    },
  },
  seo: {
    title: "Philippines TikTok Shop Fee Calculator | SellerLab",
    description: "Estimate Philippines TikTok Shop fees, VAT effect, and profit using public official fee categories and manual fee-rate inputs.",
    h1: "Philippines TikTok Shop Fee Calculator",
    subtitle: "Public Philippines pages confirm fee categories, but live numeric rates still need Seller Center values.",
  },
  summary: {
    shortFeeSummary: "Public PH terms indicate Commission Fee and Transaction Fee categories.",
    taxSummary: "Uses configurable VAT modeling with tax-inclusive pricing by default.",
    fulfillmentSummary: "No public storage or platform-fulfillment fee card was found.",
    disclaimer: "Enter Seller Center percentages for accurate PH results.",
  },
  docs: [
    { ...SHARED_DOC, scope: "SEA seller terms including the Philippines" },
    {
      title: "TikTok Shop Academy | Philippines – Policy Center",
      url: "https://seller-ph.tiktok.com/university/home?content_id=7121789894313744&identity=1&role=seller&tab=policy_center",
      scope: "Public policy entry point; body is JS-gated",
    },
  ],
  notes: [
    "Philippines is implemented with manual percentage inputs because public official numeric rate tables were not extractable.",
  ],
};
