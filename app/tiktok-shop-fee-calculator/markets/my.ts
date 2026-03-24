import type { TikTokMarketConfig } from "../tiktok-config";
import { withSuiteBrand } from "@/lib/brand";

const SHARED_DOC = {
  title: "TikTok Shop Merchant Terms of Service",
  url: "https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-uvpahylwv-z/ljhwZthlaukjlkulzlp/user-agreement/TikTok%20Shop%20Merchant%20Terms%20of%20Service.pdf",
  effectiveDate: "2024-01-03",
};

export const MY_MARKET: TikTokMarketConfig = {
  id: "my",
  name: "MY",
  fullName: "Malaysia",
  flag: "🇲🇾",
  domain: "seller-my.tiktok.com",
  currency: { code: "MYR", symbol: "RM", locale: "en-MY", decimals: 2 },
  categories: [{ label: "General Merchandise", value: "default" }],
  tax: {
    name: "SST / service tax",
    defaultRate: 8,
    priceIncludesTaxByDefault: true,
    helpText: "Official public pages use generic service-tax wording more often than a detailed SST fee formula, so this calculator uses a configurable SST/service-tax estimate.",
  },
  feeRules: [
    {
      id: "commission_fee",
      type: "percentage",
      label: "Commission Fee",
      description: "Enter your current Seller Center commission rate.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Commission fee (%)",
    },
    {
      id: "transaction_fee",
      type: "percentage",
      label: "Transaction Fee",
      description: "Enter your current Seller Center transaction fee.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Transaction fee (%)",
    },
    {
      id: "shipping_fee_program_service_fee",
      type: "percentage",
      label: "Shipping Fee Program Service Fee",
      description: "Optional newer SEA fee category from public seller terms.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Shipping fee program service fee (%)",
    },
  ],
  manualRateDisclaimer: "Malaysia public official pages do not expose a stable current numeric fee schedule; use Seller Center values for accurate output.",
  fulfillmentMethods: [
    {
      value: "self",
      label: "Seller Fulfillment",
      description: "No public Malaysia TikTok warehouse/storage rate card was surfaced.",
      kind: "self",
    },
  ],
  defaults: {
    category: "default",
    fulfillmentMethod: "self",
    soldPrice: 49.9,
    sellerDiscount: 0,
    platformDiscount: 0,
    buyerShippingFee: 5,
    itemCost: 18,
    shippingCost: 4,
    affiliateRate: 10,
    adSpendPerUnit: 2,
    otherCosts: 0,
    taxRate: 8,
    priceIncludesTax: true,
    manualInputs: {
      commission_fee: 0,
      transaction_fee: 0,
      shipping_fee_program_service_fee: 0,
    },
  },
  seo: {
    title: withSuiteBrand("Malaysia TikTok Shop Fee Calculator"),
    description: "Estimate Malaysia TikTok Shop fees, service-tax effect, and profit using official public fee categories.",
    h1: "Malaysia TikTok Shop Fee Calculator",
    subtitle: "Public Malaysia docs expose fee categories, but live numeric rates generally remain in Seller Center.",
  },
  summary: {
    shortFeeSummary: "Public Malaysia terms show Commission Fee and Transaction Fee, and newer SEA terms add Shipping Fee Program Service Fee.",
    taxSummary: "Uses a configurable SST/service-tax estimate because public official tax detail is limited.",
    fulfillmentSummary: "No public platform-fulfillment storage price card was found.",
    disclaimer: "Enter Seller Center fee percentages for accurate MY results.",
  },
  docs: [
    { ...SHARED_DOC, scope: "SEA seller terms including Malaysia" },
    {
      title: "TIKTOK SHOP SELLER TERMS OF SERVICE (2025.7.31~2026.2.9)",
      url: "https://seller-th.tiktok.com/university/essay?knowledge_id=1516860593227521&lang=en",
      effectiveDate: "2025-07-31",
      scope: "Shared SEA seller terms naming fee categories",
    },
    {
      title: "TikTok supports local SMEs with introduction of TikTok Shop in Malaysia",
      url: "https://newsroom.tiktok.com/tiktok-shop-my?lang=en-MY",
      effectiveDate: "2022-05-13",
      scope: "Historical launch promo context only",
    },
  ],
  notes: [
    "Malaysia public docs are sufficient for category names, but not for guaranteed current numeric seller fee rates.",
  ],
};


