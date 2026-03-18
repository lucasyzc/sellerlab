// ═══════════════════════════════════════════════════════════════
// Shared Types
// ═══════════════════════════════════════════════════════════════

export type TikTokMarketId = "us";

export type TikTokCategory = { label: string; value: string };

export type TikTokReferralRule = {
  rate: number;
  highValueRate?: number;
  highValueThreshold?: number;
};

export type TikTokFormState = {
  category: string;
  fulfillmentMethod: string;
  isNewSeller: boolean;
  soldPrice: number;
  itemCost: number;
  shippingCost: number;
  affiliateRate: number;
  adSpendPerUnit: number;
  otherCosts: number;
  weightLb: number;
  weightOz: number;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  unitsPerOrder: number;
  storageDays: number;
};

export type TikTokCalcResult = {
  referralFeeBase: number;
  referralFeeRate: number;
  referralFee: number;
  referralFeeDesc: string;
  affiliateCommission: number;
  fbtFulfillmentFee: number;
  fbtFulfillmentFeePerUnit: number;
  fbtStorageFee: number;
  totalPlatformFees: number;
  adSpend: number;
  totalRevenue: number;
  netProfit: number;
  margin: number;
  chargeableWeight: number;
  weightTierLabel: string;
  roi: number;
};

export type TikTokMarketConfig = {
  id: TikTokMarketId;
  name: string;
  fullName: string;
  flag: string;
  domain: string;
  currency: { code: string; symbol: string; locale: string; decimals: number };
  categories: TikTokCategory[];
  referralRules: Record<string, TikTokReferralRule>;
  newSellerRate: number;
  defaults: {
    soldPrice: number;
    itemCost: number;
    shippingCost: number;
    affiliateRate: number;
    adSpendPerUnit: number;
    weightLb: number;
    weightOz: number;
    dimensionLength: number;
    dimensionWidth: number;
    dimensionHeight: number;
    unitsPerOrder: number;
    storageDays: number;
  };
  seo: { title: string; description: string; h1: string; subtitle: string };
  notes: string[];
};

// ═══════════════════════════════════════════════════════════════
// FBT Fulfillment Fee Rate Card (effective Jan 12, 2026)
// ═══════════════════════════════════════════════════════════════

type FbtWeightTier = {
  maxWeight: number;
  label: string;
  singleUnit: number;
  twoUnits: number;
  threeUnits: number;
  fourPlusUnits: number;
};

const FBT_WEIGHT_TIERS: FbtWeightTier[] = [
  { maxWeight: 0.5, label: "0\u20138 oz", singleUnit: 3.58, twoUnits: 2.86, threeUnits: 2.72, fourPlusUnits: 2.58 },
  { maxWeight: 1, label: "8 oz\u20131 lb", singleUnit: 3.78, twoUnits: 3.06, threeUnits: 2.92, fourPlusUnits: 2.78 },
  { maxWeight: 2, label: "1\u20132 lb", singleUnit: 4.15, twoUnits: 3.43, threeUnits: 3.29, fourPlusUnits: 3.15 },
  { maxWeight: 3, label: "2\u20133 lb", singleUnit: 4.58, twoUnits: 3.86, threeUnits: 3.72, fourPlusUnits: 3.58 },
  { maxWeight: 4, label: "3\u20134 lb", singleUnit: 5.15, twoUnits: 4.43, threeUnits: 4.29, fourPlusUnits: 4.15 },
  { maxWeight: 8, label: "4\u20138 lb", singleUnit: 5.75, twoUnits: 5.03, threeUnits: 4.89, fourPlusUnits: 4.75 },
  { maxWeight: 16, label: "8\u201316 lb", singleUnit: 7.15, twoUnits: 6.43, threeUnits: 6.29, fourPlusUnits: 6.15 },
  { maxWeight: 30, label: "16\u201330 lb", singleUnit: 9.75, twoUnits: 8.78, threeUnits: 8.64, fourPlusUnits: 8.50 },
  { maxWeight: 50, label: "30\u201350 lb", singleUnit: 15.25, twoUnits: 13.78, threeUnits: 13.64, fourPlusUnits: 13.50 },
];

// ═══════════════════════════════════════════════════════════════
// FBT Storage Fee Tiers (effective Dec 15, 2025)
// First 60 days free, then tiered daily rates per cu ft
// ═══════════════════════════════════════════════════════════════

type FbtStorageTier = {
  maxDays: number;
  dailyRate: number;
};

const FBT_STORAGE_TIERS: FbtStorageTier[] = [
  { maxDays: 60, dailyRate: 0 },
  { maxDays: 90, dailyRate: 0.023 },
  { maxDays: 180, dailyRate: 0.05 },
  { maxDays: 270, dailyRate: 0.08 },
  { maxDays: Infinity, dailyRate: 0.12 },
];

// ═══════════════════════════════════════════════════════════════
// FBT Fee Helpers
// ═══════════════════════════════════════════════════════════════

function calcChargeableWeight(
  actualWeightLb: number,
  length: number,
  width: number,
  height: number,
): number {
  const volume = length * width * height;
  if (actualWeightLb <= 1 && volume <= 166) {
    return actualWeightLb;
  }
  const dimWeight = volume / 166;
  return Math.max(actualWeightLb, dimWeight);
}

function lookupFbtFulfillmentFee(chargeableWeight: number, unitsPerOrder: number): { fee: number; tierLabel: string } {
  const tier = FBT_WEIGHT_TIERS.find(t => chargeableWeight <= t.maxWeight)
    ?? FBT_WEIGHT_TIERS[FBT_WEIGHT_TIERS.length - 1];

  let fee: number;
  if (unitsPerOrder >= 4) fee = tier.fourPlusUnits;
  else if (unitsPerOrder === 3) fee = tier.threeUnits;
  else if (unitsPerOrder === 2) fee = tier.twoUnits;
  else fee = tier.singleUnit;

  return { fee, tierLabel: tier.label };
}

function calcFbtStorageFee(cubicFeet: number, totalDays: number): number {
  if (totalDays <= 0 || cubicFeet <= 0) return 0;

  let fee = 0;
  let daysAccounted = 0;

  for (const tier of FBT_STORAGE_TIERS) {
    if (daysAccounted >= totalDays) break;
    const tierEnd = tier.maxDays === Infinity ? totalDays : Math.min(tier.maxDays, totalDays);
    const daysInTier = Math.max(tierEnd - daysAccounted, 0);
    fee += cubicFeet * tier.dailyRate * daysInTier;
    daysAccounted = tierEnd;
  }

  return fee;
}

// ═══════════════════════════════════════════════════════════════
// Referral Fee Calculation
// ═══════════════════════════════════════════════════════════════

function calcReferralFee(soldPrice: number, rule: TikTokReferralRule, isNewSeller: boolean, newSellerRate: number): {
  fee: number;
  effectiveRate: number;
  desc: string;
} {
  if (isNewSeller) {
    return {
      fee: soldPrice * (newSellerRate / 100),
      effectiveRate: newSellerRate,
      desc: `${newSellerRate}% (new seller promotion)`,
    };
  }

  if (rule.highValueThreshold && rule.highValueRate !== undefined && soldPrice > rule.highValueThreshold) {
    const basePortion = rule.highValueThreshold * (rule.rate / 100);
    const highPortion = (soldPrice - rule.highValueThreshold) * (rule.highValueRate / 100);
    const fee = basePortion + highPortion;
    const effectiveRate = soldPrice > 0 ? (fee / soldPrice) * 100 : rule.rate;
    return {
      fee,
      effectiveRate,
      desc: `${rule.rate}% up to $${rule.highValueThreshold.toLocaleString()} + ${rule.highValueRate}% above`,
    };
  }

  return {
    fee: soldPrice * (rule.rate / 100),
    effectiveRate: rule.rate,
    desc: `${rule.rate}%`,
  };
}

// ═══════════════════════════════════════════════════════════════
// Main Calculation
// ═══════════════════════════════════════════════════════════════

export function calculate(f: TikTokFormState, config: TikTokMarketConfig): TikTokCalcResult {
  const rule = config.referralRules[f.category] ?? config.referralRules["default"];

  const { fee: referralFee, effectiveRate, desc: referralFeeDesc } = calcReferralFee(
    f.soldPrice, rule, f.isNewSeller, config.newSellerRate,
  );

  const affiliateCommission = f.soldPrice * (f.affiliateRate / 100);
  const isFbt = f.fulfillmentMethod === "fbt";

  let fbtFulfillmentFee = 0;
  let fbtFulfillmentFeePerUnit = 0;
  let fbtStorageFee = 0;
  let chargeableWeight = 0;
  let weightTierLabel = "\u2014";

  if (isFbt) {
    const actualWeight = f.weightLb + f.weightOz / 16;

    if (f.dimensionLength > 0 && f.dimensionWidth > 0 && f.dimensionHeight > 0) {
      chargeableWeight = calcChargeableWeight(actualWeight, f.dimensionLength, f.dimensionWidth, f.dimensionHeight);
    } else {
      chargeableWeight = actualWeight;
    }

    const lookup = lookupFbtFulfillmentFee(chargeableWeight, f.unitsPerOrder);
    fbtFulfillmentFeePerUnit = lookup.fee;
    fbtFulfillmentFee = lookup.fee;
    weightTierLabel = lookup.tierLabel;

    if (f.storageDays > 0 && f.dimensionLength > 0 && f.dimensionWidth > 0 && f.dimensionHeight > 0) {
      const cubicFeet = (f.dimensionLength * f.dimensionWidth * f.dimensionHeight) / 1728;
      fbtStorageFee = calcFbtStorageFee(cubicFeet, f.storageDays);
    }
  }

  const totalPlatformFees = referralFee + fbtFulfillmentFee + fbtStorageFee;
  const adSpend = f.adSpendPerUnit;
  const sellerCosts = f.itemCost + (isFbt ? 0 : f.shippingCost) + f.otherCosts + affiliateCommission + adSpend;
  const totalRevenue = f.soldPrice;
  const netProfit = totalRevenue - totalPlatformFees - sellerCosts;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const totalInvestment = f.itemCost + f.otherCosts + (isFbt ? 0 : f.shippingCost);
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  return {
    referralFeeBase: f.soldPrice,
    referralFeeRate: effectiveRate,
    referralFee,
    referralFeeDesc,
    affiliateCommission,
    fbtFulfillmentFee,
    fbtFulfillmentFeePerUnit,
    fbtStorageFee,
    totalPlatformFees,
    adSpend,
    totalRevenue,
    netProfit,
    margin,
    chargeableWeight,
    weightTierLabel,
    roi,
  };
}

// ═══════════════════════════════════════════════════════════════
// Formatter
// ═══════════════════════════════════════════════════════════════

export function formatCurrency(value: number, config: TikTokMarketConfig): string {
  const abs = Math.abs(value);
  const d = config.currency.decimals;
  const formatted = new Intl.NumberFormat(config.currency.locale, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(abs);
  const sign = value < 0 ? "\u2212" : "";
  return `${sign}${config.currency.symbol}${formatted}`;
}

// ═══════════════════════════════════════════════════════════════
// US Market Configuration
// ═══════════════════════════════════════════════════════════════

const US_CATEGORIES: TikTokCategory[] = [
  { label: "Automotive & Motorcycle", value: "automotive" },
  { label: "Baby & Maternity", value: "baby" },
  { label: "Beauty & Personal Care", value: "beauty" },
  { label: "Books, Magazines & Audio", value: "books" },
  { label: "Collectibles", value: "collectibles" },
  { label: "Computers & Office Equipment", value: "computers" },
  { label: "Fashion Accessories", value: "fashion_accessories" },
  { label: "Food & Beverages", value: "food" },
  { label: "Furniture", value: "furniture" },
  { label: "Health", value: "health" },
  { label: "Home Improvement", value: "home_improvement" },
  { label: "Home Supplies", value: "home_supplies" },
  { label: "Household Appliances", value: "appliances" },
  { label: "Jewelry \u2013 Diamond, Gold, Jade, Platinum, Ruby/Sapphire/Emerald", value: "jewelry_premium" },
  { label: "Jewelry \u2013 Other (Amber, Pearl, Silver, Crystal, etc.)", value: "jewelry_other" },
  { label: "Kids' Fashion", value: "kids_fashion" },
  { label: "Kitchenware", value: "kitchenware" },
  { label: "Luggage & Bags", value: "luggage" },
  { label: "Menswear & Underwear", value: "menswear" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Phones & Electronics", value: "electronics" },
  { label: "Pre-Owned", value: "preowned" },
  { label: "Shoes", value: "shoes" },
  { label: "Sports & Outdoor", value: "sports" },
  { label: "Textiles & Soft Furnishings", value: "textiles" },
  { label: "Tools & Hardware", value: "tools" },
  { label: "Toys & Hobbies", value: "toys" },
  { label: "Womenswear & Underwear", value: "womenswear" },
];

const US_REFERRAL_RULES: Record<string, TikTokReferralRule> = {
  default: { rate: 6 },
  jewelry_premium: { rate: 5 },
  jewelry_other: { rate: 6 },
  preowned: { rate: 5, highValueRate: 3, highValueThreshold: 10000 },
  collectibles: { rate: 6, highValueRate: 3, highValueThreshold: 10000 },
};

export const US_MARKET: TikTokMarketConfig = {
  id: "us",
  name: "US",
  fullName: "United States",
  flag: "\u{1F1FA}\u{1F1F8}",
  domain: "shop.tiktok.com",
  currency: { code: "USD", symbol: "$", locale: "en-US", decimals: 2 },
  categories: US_CATEGORIES,
  referralRules: US_REFERRAL_RULES,
  newSellerRate: 3,
  defaults: {
    soldPrice: 29.99,
    itemCost: 8,
    shippingCost: 5,
    affiliateRate: 15,
    adSpendPerUnit: 3,
    weightLb: 1,
    weightOz: 0,
    dimensionLength: 10,
    dimensionWidth: 8,
    dimensionHeight: 4,
    unitsPerOrder: 1,
    storageDays: 30,
  },
  seo: {
    title: "US TikTok Shop Fee Calculator | SellerLab",
    description: "Calculate TikTok Shop referral fees, FBT fulfillment fees, storage costs, affiliate commissions, and net profit for US sellers. Accurate rates for 28 product categories.",
    h1: "US TikTok Shop Fee Calculator",
    subtitle: "Calculate referral fees, FBT costs, affiliate commissions & profit when selling on TikTok Shop US. Rates updated as of 2026.",
  },
  notes: [
    "TikTok Shop charges a referral fee on all completed orders. In the US, payment processing is included \u2014 no separate processing fee.",
    "Standard referral fee is 6% for most categories. Select jewelry sub-categories (Diamond, Gold, Jade, Platinum, Ruby/Sapphire/Emerald) are 5%.",
    "New sellers who achieve their first sale within 60 days of onboarding receive a 3% referral fee rate for 30 days.",
    "FBT (Fulfilled by TikTok) fees cover pick, pack, and shipping. Fees vary by weight and number of units per order. Max weight: 50 lb, max single side: 26 in.",
    "FBT storage is free for the first 60 days. After that, daily fees apply based on cubic footage and storage duration.",
    "Pre-Owned and Collectibles categories have a reduced rate on any portion of a sale exceeding $10,000.",
    "Refund administration fee: 20% of the referral fee on refunded orders, capped at $5 per SKU.",
  ],
};

// ═══════════════════════════════════════════════════════════════
// Market Registry
// ═══════════════════════════════════════════════════════════════

export const TIKTOK_MARKETS: Record<TikTokMarketId, TikTokMarketConfig> = {
  us: US_MARKET,
};

export const TIKTOK_MARKET_LIST: TikTokMarketConfig[] = [US_MARKET];

export function getTikTokMarket(id: string): TikTokMarketConfig | undefined {
  return TIKTOK_MARKETS[id as TikTokMarketId];
}

export { FBT_WEIGHT_TIERS };
