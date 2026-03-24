import type { TikTokMarketConfig } from "../tiktok-config";
import { withSuiteBrand } from "@/lib/brand";

const SHARED_DOC = {
  title: "TikTok Shop Merchant Terms of Service",
  url: "https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-uvpahylwv-z/ljhwZthlaukjlkulzlp/user-agreement/TikTok%20Shop%20Merchant%20Terms%20of%20Service.pdf",
  effectiveDate: "2024-01-03",
};

export const ID_MARKET: TikTokMarketConfig = {
  id: "id",
  name: "ID",
  fullName: "Indonesia",
  flag: "🇮🇩",
  domain: "seller-id.tiktok.com",
  currency: { code: "IDR", symbol: "Rp", locale: "id-ID", decimals: 0 },
  categories: [{ label: "General Merchandise", value: "default" }],
  tax: {
    name: "PPN / VAT",
    defaultRate: 11,
    priceIncludesTaxByDefault: true,
    helpText: "Indonesia official public pages found here do not expose a reliable machine-readable live numeric fee card, so taxes and fee rates are configurable.",
  },
  feeRules: [
    {
      id: "commission_fee",
      type: "percentage",
      label: "Commission Fee",
      description: "Enter the current Indonesia Seller Center commission rate.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Commission fee (%)",
    },
    {
      id: "transaction_fee",
      type: "percentage",
      label: "Transaction / Payment Fee",
      description: "Official public terms indicate transaction or payment fee categories, but not a stable public numeric rate.",
      base: "buyer_payment_total",
      defaultRate: 0,
      sellerInput: true,
      inputLabel: "Transaction or payment fee (%)",
    },
  ],
  manualRateDisclaimer: "Indonesia fee percentages must currently be entered manually unless you have current Seller Center screenshots or exports.",
  fulfillmentMethods: [
    {
      value: "self",
      label: "Ship by Merchant / Platform Shipping",
      description: "Official public terms mention seller and platform shipping models, but no public storage fee card was surfaced.",
      kind: "self",
    },
  ],
  defaults: {
    category: "default",
    fulfillmentMethod: "self",
    soldPrice: 199000,
    sellerDiscount: 0,
    platformDiscount: 0,
    buyerShippingFee: 18000,
    itemCost: 75000,
    shippingCost: 15000,
    affiliateRate: 10,
    adSpendPerUnit: 10000,
    otherCosts: 0,
    taxRate: 11,
    priceIncludesTax: true,
    manualInputs: {
      commission_fee: 0,
      transaction_fee: 0,
    },
  },
  seo: {
    title: withSuiteBrand("Indonesia TikTok Shop Fee Calculator"),
    description: "Estimate Indonesia TikTok Shop fees, PPN effect, and profit using public official fee categories and manual fee-rate inputs.",
    h1: "Indonesia TikTok Shop Fee Calculator",
    subtitle: "Official public Indonesia pages confirm fee categories, but current live numeric rates generally require Seller Center values.",
  },
  summary: {
    shortFeeSummary: "Public Indonesia terms confirm percentage-based seller fees, but not a readable live numeric public table.",
    taxSummary: "Uses configurable PPN/VAT modeling with tax-inclusive pricing by default.",
    fulfillmentSummary: "No public storage or warehouse rate card was surfaced.",
    disclaimer: "Enter current Seller Center fee percentages for accurate ID results.",
  },
  docs: [
    { ...SHARED_DOC, scope: "Indonesia seller terms and fee categories" },
    {
      title: "Tokopedia & TikTok Shop Academy | Indonesia",
      url: "https://seller-id.tiktok.com/university/article/agreement?knowledge_id=10008699",
      scope: "Public academy entry point; body is JS-gated",
    },
  ],
  notes: [
    "Indonesia is implemented as a source-backed shell with manual percentage entry because public numeric rates were not reliably extractable.",
  ],
};


