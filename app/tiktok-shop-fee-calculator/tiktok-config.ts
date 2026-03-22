export type TikTokMarketId = "us" | "uk" | "id" | "vn" | "ph" | "th" | "my" | "sg";

export type TikTokCategory = { label: string; value: string };
export type TikTokSellerProfile = { label: string; value: string; description?: string };

export type TikTokCurrency = {
  code: string;
  symbol: string;
  locale: string;
  decimals: number;
};

export type TikTokTaxConfig = {
  name: string;
  defaultRate: number;
  priceIncludesTaxByDefault: boolean;
  helpText: string;
};

export type TikTokSourceDoc = {
  title: string;
  url: string;
  effectiveDate?: string;
  scope?: string;
};

export type TikTokFormulaBase =
  | "item_after_seller_discount"
  | "item_after_seller_discount_excl_tax"
  | "buyer_payment_total"
  | "buyer_payment_total_excl_tax"
  | "seller_revenue_total"
  | "seller_revenue_total_excl_tax";

export type TikTokPercentageFeeRule = {
  id: string;
  type: "percentage";
  label: string;
  description: string;
  base: TikTokFormulaBase;
  defaultRate?: number;
  rateByCategory?: Record<string, number>;
  rateByProfile?: Record<string, number>;
  sellerInput?: boolean;
  inputLabel?: string;
  capAmount?: number;
  onlyCategories?: string[];
};

export type TikTokFlatFeeRule = {
  id: string;
  type: "flat";
  label: string;
  description: string;
  defaultAmount?: number;
  sellerInput?: boolean;
  inputLabel?: string;
  onlyCategories?: string[];
};

export type TikTokFeeRule = TikTokPercentageFeeRule | TikTokFlatFeeRule;

export type TikTokWeightTier = {
  maxWeight: number;
  label: string;
  singleUnit: number;
  twoUnits: number;
  threeUnits: number;
  fourPlusUnits: number;
};

export type TikTokStorageTier = {
  maxDays: number;
  dailyRate: number;
};

export type TikTokSizeTier = {
  value: string;
  label: string;
  fee: number;
};

export type TikTokFulfillmentConfig =
  | {
      value: "self";
      label: string;
      description: string;
      kind: "self";
    }
  | {
      value: "platform";
      label: string;
      description: string;
      kind: "weight-tier";
      weightUnitLabel: string;
      dimensionUnitLabel: string;
      chargeableWeightUnitLabel: string;
      maxWeight?: number;
      maxSide?: number;
      dimDivisor: number;
      smallParcelRule?: { maxWeight: number; maxVolume: number };
      weightTiers: TikTokWeightTier[];
      storageTiers?: TikTokStorageTier[];
      freeStorageDaysLabel?: string;
    }
  | {
      value: "platform";
      label: string;
      description: string;
      kind: "size-tier";
      dimensionUnitLabel: string;
      sizeTierLabel: string;
      sizeTiers: TikTokSizeTier[];
      storageTiers?: TikTokStorageTier[];
      storageVolumeUnitLabel: string;
      freeStorageDaysLabel?: string;
    };

export type TikTokMarketConfig = {
  id: TikTokMarketId;
  name: string;
  fullName: string;
  flag: string;
  domain: string;
  currency: TikTokCurrency;
  categories: TikTokCategory[];
  sellerProfiles?: TikTokSellerProfile[];
  tax: TikTokTaxConfig;
  feeRules: TikTokFeeRule[];
  fulfillmentMethods: TikTokFulfillmentConfig[];
  manualRateDisclaimer?: string;
  defaults: {
    category: string;
    sellerProfile?: string;
    fulfillmentMethod: "self" | "platform";
    soldPrice: number;
    sellerDiscount: number;
    platformDiscount: number;
    buyerShippingFee: number;
    itemCost: number;
    shippingCost: number;
    affiliateRate: number;
    adSpendPerUnit: number;
    otherCosts: number;
    taxRate?: number;
    priceIncludesTax?: boolean;
    weight?: number;
    dimensionLength?: number;
    dimensionWidth?: number;
    dimensionHeight?: number;
    unitsPerOrder?: number;
    storageDays?: number;
    packageSizeTier?: string;
    manualInputs?: Record<string, number>;
  };
  seo: {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
  };
  summary: {
    shortFeeSummary: string;
    taxSummary: string;
    fulfillmentSummary: string;
    disclaimer: string;
  };
  docs: TikTokSourceDoc[];
  notes: string[];
};

export type TikTokFormState = {
  category: string;
  sellerProfile: string;
  fulfillmentMethod: "self" | "platform";
  soldPrice: number;
  sellerDiscount: number;
  platformDiscount: number;
  buyerShippingFee: number;
  itemCost: number;
  shippingCost: number;
  affiliateRate: number;
  adSpendPerUnit: number;
  otherCosts: number;
  taxRate: number;
  priceIncludesTax: boolean;
  weight: number;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  unitsPerOrder: number;
  storageDays: number;
  packageSizeTier: string;
  manualInputs: Record<string, number>;
};

export type TikTokAppliedFee = {
  id: string;
  label: string;
  amount: number;
  detail: string;
};

export type TikTokCalcResult = {
  customerPayment: number;
  customerTax: number;
  customerPaymentExclTax: number;
  sellerRevenue: number;
  sellerRevenueExclTax: number;
  platformFees: TikTokAppliedFee[];
  affiliateCommission: number;
  fulfillmentFee: number;
  storageFee: number;
  totalPlatformFees: number;
  adSpend: number;
  netProfit: number;
  margin: number;
  roi: number;
  chargeableWeight: number;
  chargeableWeightLabel: string;
  selectedSizeTierLabel: string;
};

function clampMoney(value: number): number {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function stripIncludedTax(value: number, taxRate: number, includesTax: boolean): number {
  if (!includesTax || taxRate <= 0) return value;
  return value / (1 + taxRate / 100);
}

function getFormulaBases(form: TikTokFormState) {
  const itemAfterSellerDiscount = clampMoney(form.soldPrice - form.sellerDiscount);
  const buyerPaymentTotal = clampMoney(itemAfterSellerDiscount - form.platformDiscount + form.buyerShippingFee);
  const sellerRevenueTotal = clampMoney(itemAfterSellerDiscount + form.buyerShippingFee);

  return {
    item_after_seller_discount: itemAfterSellerDiscount,
    item_after_seller_discount_excl_tax: stripIncludedTax(itemAfterSellerDiscount, form.taxRate, form.priceIncludesTax),
    buyer_payment_total: buyerPaymentTotal,
    buyer_payment_total_excl_tax: stripIncludedTax(buyerPaymentTotal, form.taxRate, form.priceIncludesTax),
    seller_revenue_total: sellerRevenueTotal,
    seller_revenue_total_excl_tax: stripIncludedTax(sellerRevenueTotal, form.taxRate, form.priceIncludesTax),
  } as const;
}

function resolvePercentageRate(rule: TikTokPercentageFeeRule, form: TikTokFormState): number {
  if (rule.sellerInput) {
    return clampMoney(form.manualInputs[rule.id] ?? rule.defaultRate ?? 0);
  }

  if (rule.rateByProfile?.[form.sellerProfile] !== undefined) {
    return rule.rateByProfile[form.sellerProfile]!;
  }

  if (rule.rateByCategory?.[form.category] !== undefined) {
    return rule.rateByCategory[form.category]!;
  }

  return clampMoney(rule.defaultRate ?? 0);
}

function ruleApplies(rule: TikTokFeeRule, form: TikTokFormState): boolean {
  if (!rule.onlyCategories?.length) return true;
  return rule.onlyCategories.includes(form.category);
}

function calcChargeableWeight(
  actualWeight: number,
  length: number,
  width: number,
  height: number,
  fulfillment: Extract<TikTokFulfillmentConfig, { kind: "weight-tier" }>,
): number {
  const volume = length * width * height;

  if (
    fulfillment.smallParcelRule
    && actualWeight <= fulfillment.smallParcelRule.maxWeight
    && volume <= fulfillment.smallParcelRule.maxVolume
  ) {
    return actualWeight;
  }

  const dimWeight = volume > 0 ? volume / fulfillment.dimDivisor : 0;
  return Math.max(actualWeight, dimWeight);
}

function lookupWeightTierFee(
  fulfillment: Extract<TikTokFulfillmentConfig, { kind: "weight-tier" }>,
  chargeableWeight: number,
  unitsPerOrder: number,
): { fee: number; label: string } {
  const tier = fulfillment.weightTiers.find(item => chargeableWeight <= item.maxWeight)
    ?? fulfillment.weightTiers[fulfillment.weightTiers.length - 1];

  if (unitsPerOrder >= 4) return { fee: tier.fourPlusUnits, label: tier.label };
  if (unitsPerOrder === 3) return { fee: tier.threeUnits, label: tier.label };
  if (unitsPerOrder === 2) return { fee: tier.twoUnits, label: tier.label };
  return { fee: tier.singleUnit, label: tier.label };
}

function calcStorageFee(storageTiers: TikTokStorageTier[] | undefined, volume: number, totalDays: number): number {
  if (!storageTiers?.length || volume <= 0 || totalDays <= 0) return 0;

  let fee = 0;
  let daysAccounted = 0;

  for (const tier of storageTiers) {
    if (daysAccounted >= totalDays) break;
    const tierEnd = tier.maxDays === Infinity ? totalDays : Math.min(tier.maxDays, totalDays);
    const daysInTier = Math.max(tierEnd - daysAccounted, 0);
    fee += volume * tier.dailyRate * daysInTier;
    daysAccounted = tierEnd;
  }

  return fee;
}

function calcFulfillmentFees(form: TikTokFormState, config: TikTokMarketConfig) {
  const fulfillment = config.fulfillmentMethods.find(item => item.value === form.fulfillmentMethod);

  if (!fulfillment || fulfillment.kind === "self") {
    return {
      feeItems: [] as TikTokAppliedFee[],
      fulfillmentFee: 0,
      storageFee: 0,
      chargeableWeight: 0,
      chargeableWeightLabel: "—",
      selectedSizeTierLabel: "—",
    };
  }

  if (fulfillment.kind === "weight-tier") {
    const actualWeight = clampMoney(form.weight);
    const chargeableWeight = calcChargeableWeight(
      actualWeight,
      clampMoney(form.dimensionLength),
      clampMoney(form.dimensionWidth),
      clampMoney(form.dimensionHeight),
      fulfillment,
    );
    const weightLookup = lookupWeightTierFee(fulfillment, chargeableWeight, Math.max(1, Math.round(form.unitsPerOrder)));
    const cubicFeet = clampMoney(form.dimensionLength) * clampMoney(form.dimensionWidth) * clampMoney(form.dimensionHeight) / 1728;
    const storageFee = calcStorageFee(fulfillment.storageTiers, cubicFeet, Math.round(form.storageDays));

    const feeItems: TikTokAppliedFee[] = [
      {
        id: "platform-fulfillment",
        label: fulfillment.label,
        amount: round2(weightLookup.fee),
        detail: `${weightLookup.label} · ${chargeableWeight.toFixed(2)} ${fulfillment.chargeableWeightUnitLabel}`,
      },
    ];

    if (storageFee > 0) {
      feeItems.push({
        id: "platform-storage",
        label: "Storage Fee",
        amount: round2(storageFee),
        detail: `${Math.round(form.storageDays)} days`,
      });
    }

    return {
      feeItems,
      fulfillmentFee: round2(weightLookup.fee),
      storageFee: round2(storageFee),
      chargeableWeight: round2(chargeableWeight),
      chargeableWeightLabel: weightLookup.label,
      selectedSizeTierLabel: "—",
    };
  }

  const sizeTier = fulfillment.sizeTiers.find(item => item.value === form.packageSizeTier) ?? fulfillment.sizeTiers[0];
  const cubicMeters = clampMoney(form.dimensionLength) * clampMoney(form.dimensionWidth) * clampMoney(form.dimensionHeight) / 1_000_000;
  const storageFee = calcStorageFee(fulfillment.storageTiers, cubicMeters, Math.round(form.storageDays));

  const feeItems: TikTokAppliedFee[] = [
    {
      id: "platform-fulfillment",
      label: fulfillment.label,
      amount: round2(sizeTier.fee),
      detail: sizeTier.label,
    },
  ];

  if (storageFee > 0) {
    feeItems.push({
      id: "platform-storage",
      label: "Storage Fee",
      amount: round2(storageFee),
      detail: `${Math.round(form.storageDays)} days`,
    });
  }

  return {
    feeItems,
    fulfillmentFee: round2(sizeTier.fee),
    storageFee: round2(storageFee),
    chargeableWeight: 0,
    chargeableWeightLabel: "—",
    selectedSizeTierLabel: sizeTier.label,
  };
}

export function calculate(form: TikTokFormState, config: TikTokMarketConfig): TikTokCalcResult {
  const bases = getFormulaBases(form);
  const feeItems: TikTokAppliedFee[] = [];

  for (const rule of config.feeRules) {
    if (!ruleApplies(rule, form)) continue;

    if (rule.type === "percentage") {
      const rate = resolvePercentageRate(rule, form);
      const baseAmount = bases[rule.base];
      let amount = baseAmount * (rate / 100);
      if (rule.capAmount !== undefined) {
        amount = Math.min(amount, rule.capAmount);
      }
      feeItems.push({
        id: rule.id,
        label: rule.label,
        amount: round2(amount),
        detail: `${rate.toFixed(2)}% of ${rule.base.replaceAll("_", " ")}`,
      });
      continue;
    }

    const amount = rule.sellerInput
      ? clampMoney(form.manualInputs[rule.id] ?? rule.defaultAmount ?? 0)
      : clampMoney(rule.defaultAmount ?? 0);

    feeItems.push({
      id: rule.id,
      label: rule.label,
      amount: round2(amount),
      detail: rule.description,
    });
  }

  const fulfillment = calcFulfillmentFees(form, config);
  feeItems.push(...fulfillment.feeItems);

  const customerPayment = bases.buyer_payment_total;
  const customerPaymentExclTax = bases.buyer_payment_total_excl_tax;
  const customerTax = round2(customerPayment - customerPaymentExclTax);
  const sellerRevenue = bases.seller_revenue_total;
  const sellerRevenueExclTax = bases.seller_revenue_total_excl_tax;

  const totalPlatformFees = round2(feeItems.reduce((sum, item) => sum + item.amount, 0));
  const affiliateCommission = round2(clampMoney(form.soldPrice - form.sellerDiscount) * (clampMoney(form.affiliateRate) / 100));
  const adSpend = round2(clampMoney(form.adSpendPerUnit));

  const sellerCosts = round2(
    clampMoney(form.itemCost)
      + (form.fulfillmentMethod === "self" ? clampMoney(form.shippingCost) : 0)
      + clampMoney(form.otherCosts)
      + affiliateCommission
      + adSpend,
  );

  const netProfit = round2(sellerRevenueExclTax - totalPlatformFees - sellerCosts);
  const margin = sellerRevenueExclTax > 0 ? (netProfit / sellerRevenueExclTax) * 100 : 0;
  const investment = clampMoney(form.itemCost) + clampMoney(form.otherCosts) + (form.fulfillmentMethod === "self" ? clampMoney(form.shippingCost) : 0);
  const roi = investment > 0 ? (netProfit / investment) * 100 : 0;

  return {
    customerPayment: round2(customerPayment),
    customerTax,
    customerPaymentExclTax: round2(customerPaymentExclTax),
    sellerRevenue: round2(sellerRevenue),
    sellerRevenueExclTax: round2(sellerRevenueExclTax),
    platformFees: feeItems,
    affiliateCommission,
    fulfillmentFee: fulfillment.fulfillmentFee,
    storageFee: fulfillment.storageFee,
    totalPlatformFees,
    adSpend,
    netProfit,
    margin,
    roi,
    chargeableWeight: fulfillment.chargeableWeight,
    chargeableWeightLabel: fulfillment.chargeableWeightLabel,
    selectedSizeTierLabel: fulfillment.selectedSizeTierLabel,
  };
}

export function formatCurrency(value: number, config: TikTokMarketConfig): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat(config.currency.locale, {
    minimumFractionDigits: config.currency.decimals,
    maximumFractionDigits: config.currency.decimals,
  }).format(abs);
  return `${value < 0 ? "−" : ""}${config.currency.symbol}${formatted}`;
}

export function makeDefaultForm(config: TikTokMarketConfig): TikTokFormState {
  return {
    category: config.defaults.category,
    sellerProfile: config.defaults.sellerProfile ?? config.sellerProfiles?.[0]?.value ?? "standard",
    fulfillmentMethod: config.defaults.fulfillmentMethod,
    soldPrice: config.defaults.soldPrice,
    sellerDiscount: config.defaults.sellerDiscount,
    platformDiscount: config.defaults.platformDiscount,
    buyerShippingFee: config.defaults.buyerShippingFee,
    itemCost: config.defaults.itemCost,
    shippingCost: config.defaults.shippingCost,
    affiliateRate: config.defaults.affiliateRate,
    adSpendPerUnit: config.defaults.adSpendPerUnit,
    otherCosts: config.defaults.otherCosts,
    taxRate: config.defaults.taxRate ?? config.tax.defaultRate,
    priceIncludesTax: config.defaults.priceIncludesTax ?? config.tax.priceIncludesTaxByDefault,
    weight: config.defaults.weight ?? 0,
    dimensionLength: config.defaults.dimensionLength ?? 0,
    dimensionWidth: config.defaults.dimensionWidth ?? 0,
    dimensionHeight: config.defaults.dimensionHeight ?? 0,
    unitsPerOrder: config.defaults.unitsPerOrder ?? 1,
    storageDays: config.defaults.storageDays ?? 0,
    packageSizeTier: config.defaults.packageSizeTier ?? "",
    manualInputs: config.defaults.manualInputs ?? {},
  };
}

export function getDefaultSizeTier(config: TikTokMarketConfig): string {
  const platform = config.fulfillmentMethods.find(item => item.value === "platform");
  return platform?.kind === "size-tier" ? platform.sizeTiers[0]?.value ?? "" : "";
}

import {
  ID_MARKET,
  MY_MARKET,
  PH_MARKET,
  SG_MARKET,
  TH_MARKET,
  UK_MARKET,
  US_MARKET,
  VN_MARKET,
} from "./markets";

export const TIKTOK_MARKETS: Record<TikTokMarketId, TikTokMarketConfig> = {
  us: US_MARKET,
  uk: UK_MARKET,
  id: ID_MARKET,
  vn: VN_MARKET,
  ph: PH_MARKET,
  th: TH_MARKET,
  my: MY_MARKET,
  sg: SG_MARKET,
};

export const TIKTOK_MARKET_LIST: TikTokMarketConfig[] = [
  US_MARKET,
  UK_MARKET,
  VN_MARKET,
  TH_MARKET,
  SG_MARKET,
  MY_MARKET,
  ID_MARKET,
  PH_MARKET,
];

export function getTikTokMarket(id: string): TikTokMarketConfig | undefined {
  return TIKTOK_MARKETS[id as TikTokMarketId];
}
