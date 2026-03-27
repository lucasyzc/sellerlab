// ═══════════════════════════════════════════════════════════════
// Shared Types
// ═══════════════════════════════════════════════════════════════

export type AmazonMarketId =
  | "us" | "uk" | "de" | "jp" | "ca"
  | "it" | "es" | "au" | "ae" | "br"
  | "sg" | "mx" | "nl" | "be" | "se"
  | "pl" | "tr";

export type AmazonCategory = { label: string; value: string };

export type ReferralRule = {
  calcType: "tiered" | "threshold";
  tiers: Array<{ upTo: number; rate: number }>;
  minFee: number;
  closingFee: number;
};

export type SizeTier =
  | "envelope"
  | "small_standard"
  | "large_standard"
  | "small_oversize"
  | "medium_oversize"
  | "large_oversize"
  | "special_oversize";

export const SIZE_TIER_LABELS: Record<SizeTier, string> = {
  envelope: "Envelope",
  small_standard: "Small Standard",
  large_standard: "Large Standard",
  small_oversize: "Small Oversize",
  medium_oversize: "Medium Oversize",
  large_oversize: "Large Oversize",
  special_oversize: "Special Oversize",
};

export function isStandardSize(tier: SizeTier): boolean {
  return tier === "envelope" || tier === "small_standard" || tier === "large_standard";
}

export type AmazonFormState = {
  sellerType: string;
  category: string;
  fulfillmentMethod: string;
  soldPrice: number;
  shippingCharged: number;
  giftWrapCharge: number;
  itemCost: number;
  actualShippingCost: number;
  otherCosts: number;
  weightMajor: number;
  weightMinor: number;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  isApparel: boolean;
  isDangerousGoods: boolean;
  storageMonths: number;
  storageMonth: number;
};

export type AmazonCalcResult = {
  totalSalesPrice: number;
  referralFee: number;
  referralFeeDesc: string;
  appliedMinReferralFee: boolean;
  closingFee: number;
  perItemFee: number;
  fbaFulfillmentFee: number;
  fbaStorageFee: number;
  sizeTier: SizeTier | null;
  sizeTierLabel: string;
  shippingWeight: number;
  cubicVolume: number;
  totalFees: number;
  revenue: number;
  netProfit: number;
  margin: number;
};

export type WeightUnits = {
  major: string;
  minor: string;
  minorPerMajor: number;
  dimLabel: string;
};

export type AmazonMarketConfig = {
  id: AmazonMarketId;
  name: string;
  fullName: string;
  flag: string;
  domain: string;
  currency: { code: string; symbol: string; locale: string; decimals: number };
  units: WeightUnits;
  sellerTypes: Array<{ label: string; value: string }>;
  fulfillmentMethods: Array<{ label: string; value: string }>;
  categories: AmazonCategory[];
  referralRules: Record<string, ReferralRule>;
  individualFee: number;
  defaults: {
    soldPrice: number;
    shippingCharged: number;
    itemCost: number;
    shippingCost: number;
    weightMajor: number;
    weightMinor: number;
    dimensionLength: number;
    dimensionWidth: number;
    dimensionHeight: number;
  };
  seo: {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
    lastReviewed?: string;
    effectiveYear?: number;
    freshnessNote?: string;
  };
  notes: string[];
  classifySizeTier: (weight: number, length: number, width: number, height: number) => SizeTier;
  calcFbaFulfillmentFee: (sizeTier: SizeTier, shippingWeight: number, isApparel: boolean, isDG: boolean) => number;
  calcFbaStorageFee: (cubicVol: number, months: number, month: number, isOversize: boolean) => number;
  dimWeightDivisor: number;
  cubicDivisor: number;
};

export const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

// ═══════════════════════════════════════════════════════════════
// Rule Helpers
// ═══════════════════════════════════════════════════════════════

export function flat(rate: number, min: number, closing = 0): ReferralRule {
  return { calcType: "tiered", tiers: [{ upTo: Infinity, rate }], minFee: min, closingFee: closing };
}

export function tiered(tiers: Array<[number, number]>, min: number, closing = 0): ReferralRule {
  return {
    calcType: "tiered",
    tiers: tiers.map(([upTo, rate]) => ({ upTo, rate })),
    minFee: min,
    closingFee: closing,
  };
}

export function threshold(tiers: Array<[number, number]>, min: number, closing = 0): ReferralRule {
  return {
    calcType: "threshold",
    tiers: tiers.map(([upTo, rate]) => ({ upTo, rate })),
    minFee: min,
    closingFee: closing,
  };
}

// ═══════════════════════════════════════════════════════════════
// Referral Fee Calculation
// ═══════════════════════════════════════════════════════════════

function calcReferralFee(amount: number, rule: ReferralRule): number {
  let fee: number;

  if (rule.calcType === "tiered") {
    fee = 0;
    let prev = 0;
    for (const { upTo, rate } of rule.tiers) {
      const portion = Math.min(
        Math.max(amount - prev, 0),
        upTo === Infinity ? Infinity : upTo - prev,
      );
      fee += portion * (rate / 100);
      prev = upTo;
      if (prev >= amount) break;
    }
  } else {
    const tier = rule.tiers.find(t => amount <= t.upTo) ?? rule.tiers[rule.tiers.length - 1];
    fee = amount * (tier.rate / 100);
  }

  return Math.max(fee, rule.minFee);
}

// ═══════════════════════════════════════════════════════════════
// Main Calculation
// ═══════════════════════════════════════════════════════════════

export function calculate(f: AmazonFormState, config: AmazonMarketConfig): AmazonCalcResult {
  const rule = config.referralRules[f.category] ?? config.referralRules["default"];
  const totalSalesPrice = f.soldPrice + f.shippingCharged + f.giftWrapCharge;

  const rawReferralFee = calcReferralFee(totalSalesPrice, rule);
  const appliedMinReferralFee = rawReferralFee <= rule.minFee && rule.minFee > 0;
  const referralFee = rawReferralFee;
  const closingFee = rule.closingFee;
  const perItemFee = f.sellerType === "individual" ? config.individualFee : 0;

  const unitWeight = f.weightMajor + f.weightMinor / config.units.minorPerMajor;
  const isFba = f.fulfillmentMethod === "fba";

  let fbaFulfillmentFee = 0;
  let fbaStorageFee = 0;
  let sizeTier: SizeTier | null = null;
  let shippingWeight = unitWeight;
  let cubicVolume = 0;

  if (isFba && f.dimensionLength > 0 && f.dimensionWidth > 0 && f.dimensionHeight > 0) {
    sizeTier = config.classifySizeTier(unitWeight, f.dimensionLength, f.dimensionWidth, f.dimensionHeight);

    const dimWeight = (f.dimensionLength * f.dimensionWidth * f.dimensionHeight) / config.dimWeightDivisor;
    if (sizeTier === "envelope" || sizeTier === "small_standard") {
      shippingWeight = unitWeight;
    } else {
      shippingWeight = Math.max(unitWeight, dimWeight);
    }

    fbaFulfillmentFee = config.calcFbaFulfillmentFee(sizeTier, shippingWeight, f.isApparel, f.isDangerousGoods);

    cubicVolume = (f.dimensionLength * f.dimensionWidth * f.dimensionHeight) / config.cubicDivisor;
    if (f.storageMonths > 0) {
      fbaStorageFee = config.calcFbaStorageFee(cubicVolume, f.storageMonths, f.storageMonth, !isStandardSize(sizeTier));
    }
  }

  const totalFees = referralFee + closingFee + perItemFee + fbaFulfillmentFee + fbaStorageFee;
  const revenue = totalSalesPrice;
  const costs = f.itemCost + (isFba ? 0 : f.actualShippingCost) + f.otherCosts;
  const netProfit = revenue - costs - totalFees;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return {
    totalSalesPrice,
    referralFee,
    referralFeeDesc: describeReferralRule(rule, config.currency.symbol),
    appliedMinReferralFee,
    closingFee,
    perItemFee,
    fbaFulfillmentFee,
    fbaStorageFee,
    sizeTier,
    sizeTierLabel: sizeTier ? SIZE_TIER_LABELS[sizeTier] : "\u2014",
    shippingWeight,
    cubicVolume,
    totalFees,
    revenue,
    netProfit,
    margin,
  };
}

// ═══════════════════════════════════════════════════════════════
// Formatters
// ═══════════════════════════════════════════════════════════════

export function formatCurrency(value: number, config: AmazonMarketConfig): string {
  const abs = Math.abs(value);
  const d = config.currency.decimals;
  const formatted = new Intl.NumberFormat(config.currency.locale, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(abs);
  const sign = value < 0 ? "\u2212" : "";
  return `${sign}${config.currency.symbol}${formatted}`;
}

export function describeReferralRule(rule: ReferralRule, symbol: string): string {
  if (rule.tiers.length === 1) {
    return `${rule.tiers[0].rate}%`;
  }
  if (rule.calcType === "threshold") {
    return rule.tiers
      .map(t => t.upTo === Infinity ? `${t.rate}% above` : `${t.rate}% \u2264 ${symbol}${t.upTo}`)
      .join(", ");
  }
  return rule.tiers
    .map(t => t.upTo === Infinity ? `${t.rate}% above` : `${t.rate}% up to ${symbol}${t.upTo.toLocaleString()}`)
    .join(" + ");
}

// ═══════════════════════════════════════════════════════════════
// Unit Presets
// ═══════════════════════════════════════════════════════════════

export const IMPERIAL_UNITS: WeightUnits = { major: "lb", minor: "oz", minorPerMajor: 16, dimLabel: "in" };
export const METRIC_UNITS: WeightUnits = { major: "kg", minor: "g", minorPerMajor: 1000, dimLabel: "cm" };

// Registry is in ./markets/index.ts to avoid circular dependencies.
// Import AMAZON_MARKETS, AMAZON_MARKET_LIST, getAmazonMarket from "./markets".
