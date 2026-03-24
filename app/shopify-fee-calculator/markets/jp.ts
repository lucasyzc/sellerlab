import type { ShopifyMarketConfig } from "../shopify-config";
import { withSuiteBrand } from "@/lib/brand";

const USD_TO_JPY = 150;

export const JP_MARKET: ShopifyMarketConfig = {
  id: "jp",
  name: "JP",
  fullName: "Japan",
  flag: "🇯🇵",
  domain: "shopify.com/jp",
  currency: { code: "JPY", symbol: "¥", locale: "ja-JP", decimals: 0 },
  tax: {
    name: "Consumption Tax",
    defaultRate: 10,
    priceIncludesTaxByDefault: true,
    taxOnSubscription: true,
    taxOnShopifyPaymentsFee: false,
    taxOnShopifyTransactionFee: false,
    helpText: "Japan pricing is modeled as tax-inclusive (総額表示). Profit basis is pre-tax revenue, and monthly Shopify subscription tax can be reflected via the tax rate setting.",
  },
  plans: [
    {
      value: "basic",
      label: "Basic",
      subscriptionByCycle: {
        monthly: Math.round(39 * USD_TO_JPY),
        yearly: Math.round(29 * USD_TO_JPY),
      },
      shopifyPaymentsRate: 3.4,
      shopifyPaymentsFixedFee: 0,
      thirdPartyTransactionRate: 2,
    },
    {
      value: "shopify",
      label: "Shopify (Grow)",
      subscriptionByCycle: {
        monthly: Math.round(105 * USD_TO_JPY),
        yearly: Math.round(79 * USD_TO_JPY),
      },
      shopifyPaymentsRate: 3.4,
      shopifyPaymentsFixedFee: 0,
      thirdPartyTransactionRate: 1,
    },
    {
      value: "advanced",
      label: "Advanced",
      subscriptionByCycle: {
        monthly: Math.round(399 * USD_TO_JPY),
        yearly: Math.round(299 * USD_TO_JPY),
      },
      shopifyPaymentsRate: 3.3,
      shopifyPaymentsFixedFee: 0,
      thirdPartyTransactionRate: 0.5,
    },
  ],
  defaults: {
    plan: "basic",
    billingCycle: "monthly",
    usesShopifyPayments: true,
    soldPrice: 1100,
    shippingCharged: 0,
    ordersPerMonth: 120,
    itemCost: 450,
    shippingCost: 120,
    marketingCost: 80,
    otherCostsPerOrder: 50,
    monthlyAppCost: 6000,
    monthlyOperationalCost: 20000,
    taxRate: 10,
    priceIncludesTax: true,
    salesTaxPerOrder: 0,
    thirdPartyProcessorRate: 3.4,
    thirdPartyProcessorFixedFee: 0,
  },
  seo: {
    title: withSuiteBrand("Shopify Fees Japan Calculator (JPY)"),
    description: "Calculate Shopify Japan fees in JPY with tax-inclusive pricing, payment processing costs, third-party transaction fees, and net profit on a pre-tax revenue basis.",
    h1: "Shopify Fees Japan Calculator",
    subtitle: "Model Shopify Japan costs with 10% consumption tax-inclusive pricing and integer JPY outputs.",
  },
  summary: {
    shortFeeSummary: "Includes Shopify plan allocation, Shopify Payments fees, and optional third-party gateway plus Shopify transaction fees.",
    paymentSummary: "Japan is modeled with a 3.4% + ¥0 Shopify Payments baseline for Basic/Shopify plans (JCB/Amex card mix may be higher in practice).",
    subscriptionSummary: "Monthly fixed costs are allocated by order volume. Subscription values are modeled in JPY using a USD-to-JPY conversion baseline.",
    taxSummary: "Consumption Tax defaults to 10% and price-inclusive mode. Profit is derived from pre-tax revenue (revenue ÷ 1.1) before cost deductions.",
    disclaimer: "Actual billing can vary by card mix, settlement terms, and account tax treatment. Confirm live values in Shopify Admin before final decisions.",
  },
  docs: [
    {
      title: "Shopify Pricing (Japan)",
      url: "https://www.shopify.com/jp/pricing",
      scope: "Plan pricing and local payments overview",
    },
    {
      title: "Third-party transaction fees",
      url: "https://help.shopify.com/en/manual/your-account/manage-billing/billing-charges/types-of-charges/third-party-charges/third-party-transaction-fees",
      scope: "Additional Shopify transaction fee when not using Shopify Payments",
    },
    {
      title: "Taxes on Shopify fees",
      url: "https://help.shopify.com/en/manual/your-account/manage-billing/your-invoice/charges#taxes-on-your-shopify-fees",
      scope: "Tax treatment for Shopify invoiced charges",
    },
  ],
  notes: [
    "Japan prices are modeled as tax-inclusive by default (総額表示), so net revenue basis is derived from revenue excluding 10% Consumption Tax.",
    "Shopify Payments fee is applied to total captured amount (tax-inclusive charged revenue).",
    "All JPY monetary outputs in this calculator are rounded to integers (no decimal yen units).",
  ],
};


