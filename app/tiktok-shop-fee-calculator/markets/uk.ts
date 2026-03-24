import type { TikTokMarketConfig } from "../tiktok-config";
import { withSuiteBrand } from "@/lib/brand";

export const UK_MARKET: TikTokMarketConfig = {
  id: "uk",
  name: "UK",
  fullName: "United Kingdom",
  flag: "🇬🇧",
  domain: "shop.tiktok.com/uk",
  currency: { code: "GBP", symbol: "£", locale: "en-GB", decimals: 2 },
  categories: [
    { label: "General Merchandise", value: "default" },
  ],
  tax: {
    name: "VAT",
    defaultRate: 20,
    priceIncludesTaxByDefault: true,
    helpText: "UK TikTok Shop listings and FBT rate cards are generally presented VAT-inclusive.",
  },
  feeRules: [
    {
      id: "commission_fee",
      type: "percentage",
      label: "Commission Fee",
      description: "Public UK merchant terms indicate a 5% commission on buyer-paid amount for UK orders.",
      base: "buyer_payment_total",
      defaultRate: 5,
    },
  ],
  fulfillmentMethods: [
    {
      value: "self",
      label: "Self-Fulfilled",
      description: "Seller ships directly.",
      kind: "self",
    },
    {
      value: "platform",
      label: "FBT Fulfillment Fee",
      description: "UK FBT size-tier rate card (VAT included).",
      kind: "size-tier",
      dimensionUnitLabel: "cm",
      sizeTierLabel: "Package size tier",
      storageVolumeUnitLabel: "CBM",
      freeStorageDaysLabel: "0–30 days public base tier",
      sizeTiers: [
        { value: "xs", label: "XS", fee: 0.78 },
        { value: "s", label: "S", fee: 1.08 },
        { value: "m", label: "M", fee: 1.8 },
        { value: "l", label: "L", fee: 3.0 },
        { value: "xl", label: "XL", fee: 4.2 },
      ],
      storageTiers: [
        { maxDays: 30, dailyRate: 0.12 },
        { maxDays: 90, dailyRate: 0.3 },
        { maxDays: Infinity, dailyRate: 0.72 },
      ],
    },
  ],
  defaults: {
    category: "default",
    fulfillmentMethod: "platform",
    soldPrice: 24.99,
    sellerDiscount: 0,
    platformDiscount: 0,
    buyerShippingFee: 0,
    itemCost: 7,
    shippingCost: 4,
    affiliateRate: 12,
    adSpendPerUnit: 2,
    otherCosts: 0,
    taxRate: 20,
    priceIncludesTax: true,
    dimensionLength: 30,
    dimensionWidth: 20,
    dimensionHeight: 10,
    packageSizeTier: "s",
    storageDays: 20,
  },
  seo: {
    title: withSuiteBrand("UK TikTok Shop Fee Calculator"),
    description: "Calculate TikTok Shop UK commission, VAT impact, FBT costs, and profit.",
    h1: "UK TikTok Shop Fee Calculator",
    subtitle: "Use public UK merchant terms and FBT rate cards to estimate fees, VAT effect, and profit.",
  },
  summary: {
    shortFeeSummary: "Public UK terms expose a 5% commission baseline on buyer-paid amount.",
    taxSummary: "UK prices are modeled VAT-inclusive by default at 20%.",
    fulfillmentSummary: "Includes public UK FBT size-tier fulfillment fees and storage rates.",
    disclaimer: "UK commission evidence is public, but current category-level variations may still live inside Seller Center.",
  },
  docs: [
    {
      title: "TikTok Shop Merchant Terms of Service",
      url: "https://lf3-static.bytednsdoc.com/obj/eden-cn/lm-uvpahylwv-z/ljhwZthlaukjlkulzlp/user-agreement/TikTok%20Shop%20Merchant%20Terms%20of%20Service.pdf",
      effectiveDate: "2024-01-03",
      scope: "UK seller commission and VAT responsibilities",
    },
    {
      title: "Rate Card - Fulfillment by TikTok Shop (UK)",
      url: "https://lf16-statics.oecsccdn.com/obj/oec-sc-static-sg/fe-asset/static/merchant/pdf/uk_fulfillment_center_landing_one_page.pdf",
      effectiveDate: "2024-07-07",
      scope: "UK FBT fulfillment and storage fee card",
    },
  ],
  notes: [
    "UK FBT prices are VAT-inclusive in the public rate card.",
    "Use the marketplace fee as an estimate if TikTok later changes category-specific commission inside Seller Center.",
  ],
};


