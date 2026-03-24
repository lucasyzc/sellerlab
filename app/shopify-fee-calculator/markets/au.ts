import type { ShopifyMarketConfig } from "../shopify-config";
import { withSuiteBrand } from "@/lib/brand";

export const AU_MARKET: ShopifyMarketConfig = {
  id: "au",
  name: "AU",
  fullName: "Australia",
  flag: "🇦🇺",
  domain: "shopify.com/au",
  currency: { code: "AUD", symbol: "A$", locale: "en-AU", decimals: 2 },
  tax: {
    name: "GST",
    defaultRate: 10,
    priceIncludesTaxByDefault: true,
    taxOnSubscription: true,
    taxOnShopifyPaymentsFee: true,
    taxOnShopifyTransactionFee: true,
    helpText: "Australia is modeled as GST-inclusive pricing by default. GST is applied to Shopify fees in this model.",
  },
  plans: [
    {
      value: "basic",
      label: "Basic",
      subscriptionByCycle: { monthly: 56, yearly: 42 },
      shopifyPaymentsRate: 1.75,
      shopifyPaymentsFixedFee: 0.30,
      thirdPartyTransactionRate: 2,
    },
    {
      value: "shopify",
      label: "Shopify (Grow)",
      subscriptionByCycle: { monthly: 149, yearly: 114 },
      shopifyPaymentsRate: 1.60,
      shopifyPaymentsFixedFee: 0.30,
      thirdPartyTransactionRate: 1,
    },
    {
      value: "advanced",
      label: "Advanced",
      subscriptionByCycle: { monthly: 575, yearly: 431 },
      shopifyPaymentsRate: 1.50,
      shopifyPaymentsFixedFee: 0.30,
      thirdPartyTransactionRate: 0.6,
    },
  ],
  defaults: {
    plan: "basic",
    billingCycle: "monthly",
    usesShopifyPayments: true,
    soldPrice: 89.99,
    shippingCharged: 9.99,
    ordersPerMonth: 120,
    itemCost: 30,
    shippingCost: 9,
    marketingCost: 7,
    otherCostsPerOrder: 2,
    monthlyAppCost: 59,
    monthlyOperationalCost: 180,
    taxRate: 10,
    priceIncludesTax: true,
    salesTaxPerOrder: 0,
    thirdPartyProcessorRate: 1.75,
    thirdPartyProcessorFixedFee: 0.30,
  },
  seo: {
    title: withSuiteBrand("Shopify Fees Australia Calculator (AUD)"),
    description: "Calculate Shopify fees Australia stores face, including Shopify Payments rates, transaction fees, GST-inclusive pricing, and per-order margin in AUD.",
    h1: "Shopify Fees Australia Calculator",
    subtitle: "Estimate Shopify Australia costs with GST-inclusive pricing, payment fees, and plan-level overhead allocation.",
  },
  summary: {
    shortFeeSummary: "Includes Shopify plan allocation, Shopify Payments fees, optional third-party processing, and Shopify transaction fees.",
    paymentSummary: "Australia card-processing rates vary by plan. Using a third-party gateway adds Shopify transaction fees by plan tier.",
    subscriptionSummary: "Plan, app, and operating overhead can be converted from monthly totals into per-order cost.",
    taxSummary: "GST defaults to 10% and price-inclusive mode. Shopify fees are modeled with GST applied.",
    disclaimer: "Rates vary by business type, card mix, and negotiated terms. Validate your live Shopify billing profile for production decisions.",
  },
  docs: [
    {
      title: "Shopify Pricing (Australia)",
      url: "https://www.shopify.com/au/pricing",
      scope: "Plan pricing and local payments overview",
    },
    {
      title: "Third-party transaction fees",
      url: "https://help.shopify.com/en/manual/your-account/manage-billing/billing-charges/types-of-charges/third-party-charges/third-party-transaction-fees",
      scope: "How Shopify transaction fees apply without Shopify Payments",
    },
    {
      title: "Taxes on Shopify fees",
      url: "https://help.shopify.com/en/manual/your-account/manage-billing/your-invoice/charges#taxes-on-your-shopify-fees",
      scope: "GST treatment on Shopify invoiced charges",
    },
  ],
  notes: [
    "This market defaults to GST-inclusive selling prices, which are converted to tax-exclusive revenue for margin calculations.",
    "Shopify fee GST is modeled on subscription and Shopify payment/transaction fees.",
    "If your pricing is tax-exclusive, disable the price-includes-tax toggle.",
  ],
};


