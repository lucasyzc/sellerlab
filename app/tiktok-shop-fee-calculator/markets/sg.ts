import type { TikTokMarketConfig } from "../tiktok-config";
import { withSuiteBrand } from "@/lib/brand";

const SHARED_DOC = {
  title: "TikTok Shop Merchant Terms of Service",
  url: "https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-uvpahylwv-z/ljhwZthlaukjlkulzlp/user-agreement/TikTok%20Shop%20Merchant%20Terms%20of%20Service.pdf",
  effectiveDate: "2024-01-03",
};

export const SG_MARKET: TikTokMarketConfig = {
  id: "sg",
  name: "SG",
  fullName: "Singapore",
  flag: "🇸🇬",
  domain: "seller-sg.tiktok.com",
  currency: { code: "SGD", symbol: "S$", locale: "en-SG", decimals: 2 },
  categories: [{ label: "General Merchandise", value: "default" }],
  tax: {
    name: "GST",
    defaultRate: 9,
    priceIncludesTaxByDefault: true,
    helpText: "Public official docs confirm GST-inclusive fee language, but current live fee percentages are typically shown in Seller Center.",
  },
  feeRules: [
    {
      id: "commission_fee",
      type: "percentage",
      label: "Commission Fee",
      description: "Use the public shared SEA seller-terms baseline or your current Seller Center rate.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Commission fee (%)",
    },
    {
      id: "transaction_fee",
      type: "percentage",
      label: "Transaction Fee",
      description: "Enter the current Seller Center transaction fee if applicable.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Transaction fee (%)",
    },
    {
      id: "shipping_fee_program_service_fee",
      type: "percentage",
      label: "Shipping Fee Program Service Fee",
      description: "Optional Seller Center fee introduced in newer SEA public terms.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Shipping fee program service fee (%)",
    },
  ],
  manualRateDisclaimer: "Singapore public official pages disclose fee categories but do not expose the current live numeric percentages in a reliably machine-readable public page.",
  fulfillmentMethods: [
    {
      value: "self",
      label: "Seller Fulfillment",
      description: "Public SG logistics/storage rate cards were not surfaced in official public pages.",
      kind: "self",
    },
  ],
  defaults: {
    category: "default",
    fulfillmentMethod: "self",
    soldPrice: 39.9,
    sellerDiscount: 0,
    platformDiscount: 0,
    buyerShippingFee: 3.5,
    itemCost: 14,
    shippingCost: 3,
    affiliateRate: 10,
    adSpendPerUnit: 2,
    otherCosts: 0,
    taxRate: 9,
    priceIncludesTax: true,
    manualInputs: {
      commission_fee: 0,
      transaction_fee: 0,
      shipping_fee_program_service_fee: 0,
    },
  },
  seo: {
    title: withSuiteBrand("Singapore TikTok Shop Fee Calculator"),
    description: "Estimate Singapore TikTok Shop commission, transaction fees, GST effect, and profit using official public fee categories.",
    h1: "Singapore TikTok Shop Fee Calculator",
    subtitle: "Public Singapore docs expose fee categories and GST handling, while numeric fee rates often remain in Seller Center.",
  },
  summary: {
    shortFeeSummary: "Public Singapore terms show Commission Fee, Transaction Fee, and Shipping Fee Program Service Fee categories.",
    taxSummary: "GST is modeled at 9% and treated as price-inclusive by default.",
    fulfillmentSummary: "No public storage or platform logistics price card was found.",
    disclaimer: "Enter your current Seller Center percentages for accurate SG results.",
  },
  docs: [
    { ...SHARED_DOC, scope: "SEA seller terms including Singapore" },
    {
      title: "TIKTOK SHOP SELLER TERMS OF SERVICE (2025.7.31~2026.2.9)",
      url: "https://seller-th.tiktok.com/university/essay?knowledge_id=1516860593227521&lang=en",
      effectiveDate: "2025-07-31",
      scope: "Shared SEA seller terms naming fee categories",
    },
  ],
  notes: [
    "Singapore requires manual fee percentage entry because public official docs do not expose a reliable current numeric schedule.",
  ],
};


