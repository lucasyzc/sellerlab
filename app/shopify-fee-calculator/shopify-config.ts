import {
  AU_MARKET,
  CA_MARKET,
  CH_MARKET,
  EU_MARKET,
  SG_MARKET,
  SHOPIFY_MARKET_REGISTRY,
  SHOPIFY_REGION_LABELS,
  UK_MARKET,
  US_MARKET,
  type ShopifyMarketRegion,
} from "./markets";

export type ShopifyMarketId = "us" | "ca" | "au" | "sg" | "eu" | "uk" | "ch";
export type ShopifyPlanId = "basic" | "shopify" | "advanced";
export type ShopifyBillingCycle = "monthly" | "yearly";

export type ShopifyCurrency = {
  code: string;
  symbol: string;
  locale: string;
  decimals: number;
};

export type ShopifyPlan = {
  value: ShopifyPlanId;
  label: string;
  subscriptionByCycle: Record<ShopifyBillingCycle, number>;
  shopifyPaymentsRate: number;
  shopifyPaymentsFixedFee: number;
  thirdPartyTransactionRate: number;
};

export type ShopifySourceDoc = {
  title: string;
  url: string;
  scope?: string;
};

export type ShopifyTaxConfig = {
  name: string;
  defaultRate: number;
  priceIncludesTaxByDefault: boolean;
  taxOnSubscription: boolean;
  taxOnShopifyPaymentsFee: boolean;
  taxOnShopifyTransactionFee: boolean;
  helpText: string;
};

export type ShopifyMarketConfig = {
  id: ShopifyMarketId;
  name: string;
  fullName: string;
  flag: string;
  domain: string;
  currency: ShopifyCurrency;
  tax: ShopifyTaxConfig;
  plans: ShopifyPlan[];
  defaults: {
    plan: ShopifyPlanId;
    billingCycle: ShopifyBillingCycle;
    usesShopifyPayments: boolean;
    soldPrice: number;
    shippingCharged: number;
    ordersPerMonth: number;
    itemCost: number;
    shippingCost: number;
    marketingCost: number;
    otherCostsPerOrder: number;
    monthlyAppCost: number;
    monthlyOperationalCost: number;
    taxRate?: number;
    priceIncludesTax?: boolean;
    salesTaxPerOrder: number;
    thirdPartyProcessorRate: number;
    thirdPartyProcessorFixedFee: number;
  };
  seo: {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
  };
  summary: {
    shortFeeSummary: string;
    paymentSummary: string;
    subscriptionSummary: string;
    taxSummary: string;
    disclaimer: string;
  };
  docs: ShopifySourceDoc[];
  notes: string[];
};

export type ShopifyFormState = {
  plan: ShopifyPlanId;
  billingCycle: ShopifyBillingCycle;
  usesShopifyPayments: boolean;
  soldPrice: number;
  shippingCharged: number;
  ordersPerMonth: number;
  itemCost: number;
  shippingCost: number;
  marketingCost: number;
  otherCostsPerOrder: number;
  monthlyAppCost: number;
  monthlyOperationalCost: number;
  taxRate: number;
  priceIncludesTax: boolean;
  salesTaxPerOrder: number;
  thirdPartyProcessorRate: number;
  thirdPartyProcessorFixedFee: number;
};

export type ShopifyCalcResult = {
  grossRevenue: number;
  revenueExcludingTax: number;
  customerTax: number;
  paymentProcessingFee: number;
  thirdPartyProcessorFee: number;
  shopifyTransactionFee: number;
  monthlySubscriptionCost: number;
  subscriptionPerOrder: number;
  appCostPerOrder: number;
  operationalCostPerOrder: number;
  shopifyFeeTax: number;
  platformCosts: number;
  productCosts: number;
  salesTaxRemitted: number;
  totalCosts: number;
  netProfit: number;
  margin: number;
};

export type ShopifyMarketGroup = {
  region: ShopifyMarketRegion;
  label: string;
  markets: ShopifyMarketConfig[];
};

function clampMoney(value: number): number {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getSelectedPlan(config: ShopifyMarketConfig, planId: ShopifyPlanId): ShopifyPlan {
  return config.plans.find((plan) => plan.value === planId) ?? config.plans[0];
}

export function calculate(form: ShopifyFormState, config: ShopifyMarketConfig): ShopifyCalcResult {
  const plan = getSelectedPlan(config, form.plan);
  const ordersPerMonth = Math.max(1, Math.round(clampMoney(form.ordersPerMonth)));
  const grossRevenue = round2(clampMoney(form.soldPrice) + clampMoney(form.shippingCharged));
  const taxRate = clampMoney(form.taxRate);
  const priceIncludesTax = Boolean(form.priceIncludesTax);
  const revenueExcludingTax = priceIncludesTax && taxRate > 0
    ? round2(grossRevenue / (1 + taxRate / 100))
    : grossRevenue;
  const customerTax = round2(Math.max(grossRevenue - revenueExcludingTax, 0));

  const paymentProcessingFee = form.usesShopifyPayments
    ? round2(grossRevenue * (plan.shopifyPaymentsRate / 100) + plan.shopifyPaymentsFixedFee)
    : 0;

  const thirdPartyProcessorFee = form.usesShopifyPayments
    ? 0
    : round2(
        grossRevenue * (clampMoney(form.thirdPartyProcessorRate) / 100)
        + clampMoney(form.thirdPartyProcessorFixedFee),
      );

  const shopifyTransactionFee = form.usesShopifyPayments
    ? 0
    : round2(grossRevenue * (plan.thirdPartyTransactionRate / 100));

  const monthlySubscriptionCost = plan.subscriptionByCycle[form.billingCycle];
  const subscriptionPerOrder = round2(monthlySubscriptionCost / ordersPerMonth);
  const appCostPerOrder = round2(clampMoney(form.monthlyAppCost) / ordersPerMonth);
  const operationalCostPerOrder = round2(clampMoney(form.monthlyOperationalCost) / ordersPerMonth);
  const shopifyFeeTaxBase = (
    (config.tax.taxOnSubscription ? subscriptionPerOrder : 0)
    + (config.tax.taxOnShopifyPaymentsFee ? paymentProcessingFee : 0)
    + (config.tax.taxOnShopifyTransactionFee ? shopifyTransactionFee : 0)
  );
  const shopifyFeeTax = taxRate > 0 ? round2(shopifyFeeTaxBase * (taxRate / 100)) : 0;

  const platformCosts = round2(
    paymentProcessingFee
    + thirdPartyProcessorFee
    + shopifyTransactionFee
    + subscriptionPerOrder
    + appCostPerOrder
    + operationalCostPerOrder
    + shopifyFeeTax,
  );

  const productCosts = round2(
    clampMoney(form.itemCost)
    + clampMoney(form.shippingCost)
    + clampMoney(form.marketingCost)
    + clampMoney(form.otherCostsPerOrder),
  );

  const salesTaxRemitted = round2((priceIncludesTax ? customerTax : 0) + clampMoney(form.salesTaxPerOrder));
  const totalCosts = round2(platformCosts + productCosts + salesTaxRemitted);
  const netProfit = round2(grossRevenue - totalCosts);
  const marginBase = revenueExcludingTax > 0 ? revenueExcludingTax : grossRevenue;
  const margin = marginBase > 0 ? (netProfit / marginBase) * 100 : 0;

  return {
    grossRevenue,
    revenueExcludingTax,
    customerTax,
    paymentProcessingFee,
    thirdPartyProcessorFee,
    shopifyTransactionFee,
    monthlySubscriptionCost,
    subscriptionPerOrder,
    appCostPerOrder,
    operationalCostPerOrder,
    shopifyFeeTax,
    platformCosts,
    productCosts,
    salesTaxRemitted,
    totalCosts,
    netProfit,
    margin,
  };
}

export function formatCurrency(value: number, config: ShopifyMarketConfig): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat(config.currency.locale, {
    minimumFractionDigits: config.currency.decimals,
    maximumFractionDigits: config.currency.decimals,
  }).format(abs);
  return `${value < 0 ? "−" : ""}${config.currency.symbol}${formatted}`;
}

export function makeDefaultForm(config: ShopifyMarketConfig): ShopifyFormState {
  return {
    plan: config.defaults.plan,
    billingCycle: config.defaults.billingCycle,
    usesShopifyPayments: config.defaults.usesShopifyPayments,
    soldPrice: config.defaults.soldPrice,
    shippingCharged: config.defaults.shippingCharged,
    ordersPerMonth: config.defaults.ordersPerMonth,
    itemCost: config.defaults.itemCost,
    shippingCost: config.defaults.shippingCost,
    marketingCost: config.defaults.marketingCost,
    otherCostsPerOrder: config.defaults.otherCostsPerOrder,
    monthlyAppCost: config.defaults.monthlyAppCost,
    monthlyOperationalCost: config.defaults.monthlyOperationalCost,
    taxRate: config.defaults.taxRate ?? config.tax.defaultRate,
    priceIncludesTax: config.defaults.priceIncludesTax ?? config.tax.priceIncludesTaxByDefault,
    salesTaxPerOrder: config.defaults.salesTaxPerOrder,
    thirdPartyProcessorRate: config.defaults.thirdPartyProcessorRate,
    thirdPartyProcessorFixedFee: config.defaults.thirdPartyProcessorFixedFee,
  };
}

export const SHOPIFY_MARKETS: Record<ShopifyMarketId, ShopifyMarketConfig> = {
  us: US_MARKET,
  ca: CA_MARKET,
  au: AU_MARKET,
  sg: SG_MARKET,
  eu: EU_MARKET,
  uk: UK_MARKET,
  ch: CH_MARKET,
};

export const SHOPIFY_MARKET_LIST: ShopifyMarketConfig[] = SHOPIFY_MARKET_REGISTRY
  .map((item) => SHOPIFY_MARKETS[item.code]);

export const SHOPIFY_MARKET_GROUPS: ShopifyMarketGroup[] = (Object.keys(SHOPIFY_REGION_LABELS) as ShopifyMarketRegion[])
  .map((region) => ({
    region,
    label: SHOPIFY_REGION_LABELS[region],
    markets: SHOPIFY_MARKET_REGISTRY
      .filter((item) => item.region === region)
      .map((item) => SHOPIFY_MARKETS[item.code]),
  }))
  .filter((group) => group.markets.length > 0);

export function getShopifyMarket(id: string): ShopifyMarketConfig | undefined {
  return SHOPIFY_MARKETS[id as ShopifyMarketId];
}
