import type { ShopifyMarketConfig } from "../shopify-config";
import { withSuiteBrand } from "@/lib/brand";

export const UK_MARKET: ShopifyMarketConfig = {
  id: "uk",
  name: "UK",
  fullName: "United Kingdom",
  flag: "🇬🇧",
  domain: "shopify.com/uk",
  currency: { code: "GBP", symbol: "£", locale: "en-GB", decimals: 2 },
  tax: {
    name: "VAT",
    defaultRate: 20,
    priceIncludesTaxByDefault: true,
    taxOnSubscription: true,
    taxOnShopifyPaymentsFee: true,
    taxOnShopifyTransactionFee: true,
    helpText: "UK pricing is modeled as VAT-inclusive by default. VAT is applied to Shopify fees in this model.",
  },
  plans: [
    {
      value: "basic",
      label: "Basic",
      subscriptionByCycle: { monthly: 25, yearly: 19 },
      shopifyPaymentsRate: 2.0,
      shopifyPaymentsFixedFee: 0.25,
      thirdPartyTransactionRate: 2,
    },
    {
      value: "shopify",
      label: "Shopify (Grow)",
      subscriptionByCycle: { monthly: 65, yearly: 49 },
      shopifyPaymentsRate: 1.7,
      shopifyPaymentsFixedFee: 0.25,
      thirdPartyTransactionRate: 1,
    },
    {
      value: "advanced",
      label: "Advanced",
      subscriptionByCycle: { monthly: 345, yearly: 259 },
      shopifyPaymentsRate: 1.5,
      shopifyPaymentsFixedFee: 0.25,
      thirdPartyTransactionRate: 0.6,
    },
  ],
  defaults: {
    plan: "basic",
    billingCycle: "monthly",
    usesShopifyPayments: true,
    soldPrice: 49.99,
    shippingCharged: 4.99,
    ordersPerMonth: 120,
    itemCost: 18,
    shippingCost: 6,
    marketingCost: 5,
    otherCostsPerOrder: 1.2,
    monthlyAppCost: 35,
    monthlyOperationalCost: 120,
    taxRate: 20,
    priceIncludesTax: true,
    salesTaxPerOrder: 0,
    thirdPartyProcessorRate: 2.9,
    thirdPartyProcessorFixedFee: 0.25,
  },
  seo: {
    title: withSuiteBrand("Shopify Fees UK Calculator (GBP)"),
    description: "Estimate Shopify UK costs in GBP with VAT-inclusive pricing, Shopify Payments fees, third-party transaction fees, and net profit per order.",
    h1: "Shopify Fees UK Calculator",
    subtitle: "Calculate UK Shopify costs with VAT-inclusive pricing and plan-level payment fee assumptions.",
  },
  summary: {
    shortFeeSummary: "Includes plan subscription allocation, Shopify Payments fees, and optional third-party processor + Shopify transaction fees.",
    paymentSummary: "UK Shopify Payments card rates are modeled per plan. If Shopify Payments is disabled, Shopify transaction fees are added by plan tier.",
    subscriptionSummary: "Subscription, app spend, and monthly operations are allocated per order volume for margin analysis.",
    taxSummary: "VAT defaults to 20% and is treated as included in customer price. VAT is also modeled on Shopify fee components.",
    disclaimer: "Rates and tax treatment may differ by merchant profile and agreement. Verify live values in your Shopify Admin invoices.",
  },
  docs: [
    {
      title: "Shopify Pricing (United Kingdom)",
      url: "https://www.shopify.com/uk/pricing",
      scope: "Plan pricing and online card rates",
    },
    {
      title: "Third-party transaction fees",
      url: "https://help.shopify.com/en/manual/your-account/manage-billing/billing-charges/types-of-charges/third-party-charges/third-party-transaction-fees",
      scope: "Plan-based transaction fee behavior without Shopify Payments",
    },
    {
      title: "Taxes on Shopify fees",
      url: "https://help.shopify.com/en/manual/your-account/manage-billing/your-invoice/charges#taxes-on-your-shopify-fees",
      scope: "VAT behavior on Shopify charges and processing fees",
    },
  ],
  notes: [
    "UK prices default to VAT-inclusive mode, then net revenue is derived for margin calculations.",
    "VAT on Shopify fees is modeled on subscription and payment/transaction fee components.",
    "Use your processor contract rates when comparing third-party gateway economics.",
  ],
};


