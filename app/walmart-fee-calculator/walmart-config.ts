// Shared types and calculator engine for Walmart Marketplace.

export type WalmartMarketId = "us" | "ca" | "mx" | "cl";

export type WalmartCategory = {
  label: string;
  value: string;
};

export type WalmartSourceDoc = {
  title: string;
  url: string;
  asOf?: string;
  scope?: string;
};

export type ReferralRule = {
  calcType: "flat" | "tiered";
  tiers: Array<{ upTo: number; rate: number }>;
};

export type WalmartWfsMode = "us_official" | "ca_official" | "cl_official" | "manual";

export type WalmartFormState = {
  category: string;
  fulfillmentMethod: "seller" | "wfs";
  soldPrice: number;
  shippingCharged: number;
  itemCost: number;
  shippingCost: number;
  otherCosts: number;
  paymentProcessingRate: number;
  usePremiumReferralRate: boolean;
  unitWeight: number;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  isApparel: boolean;
  isHazmat: boolean;
  storageMonths: number;
  storageSeason: "jan_sep" | "oct_dec";
  manualWfsFulfillmentFee: number;
  manualWfsShippingRecoveryFee: number;
  manualWfsStorageFee: number;
};

export type WalmartCalcResult = {
  totalSalesPrice: number;
  referralFee: number;
  referralRuleDesc: string;
  referralRateModeLabel: string;
  wfsFulfillmentFee: number;
  wfsShippingRecoveryFee: number;
  wfsStorageFee: number;
  wfsTierLabel: string;
  wfsDetail: string;
  paymentProcessingFee: number;
  totalFees: number;
  revenue: number;
  totalCosts: number;
  netProfit: number;
  margin: number;
  chargeableWeight: number;
  shippingWeight: number;
  dimensionalWeight: number;
};

export type WalmartMarketConfig = {
  id: WalmartMarketId;
  name: string;
  fullName: string;
  flag: string;
  domain: string;
  currency: { code: string; symbol: string; locale: string; decimals: number };
  units: {
    weightLabel: string;
    dimensionLabel: string;
    cubicDivisor: number;
    cubicUnitLabel: string;
  };
  wfs: {
    mode: WalmartWfsMode;
    label: string;
    helpText: string;
  };
  categories: WalmartCategory[];
  referralRules: Record<string, ReferralRule>;
  premiumReferralRules?: Record<string, ReferralRule>;
  premiumReferralLabel?: string;
  defaults: {
    category: string;
    fulfillmentMethod: "seller" | "wfs";
    soldPrice: number;
    shippingCharged: number;
    itemCost: number;
    shippingCost: number;
    otherCosts: number;
    paymentProcessingRate: number;
    usePremiumReferralRate: boolean;
    unitWeight: number;
    dimensionLength: number;
    dimensionWidth: number;
    dimensionHeight: number;
    isApparel: boolean;
    isHazmat: boolean;
    storageMonths: number;
    storageSeason: "jan_sep" | "oct_dec";
    manualWfsFulfillmentFee: number;
    manualWfsShippingRecoveryFee: number;
    manualWfsStorageFee: number;
  };
  seo: {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
  };
  summary: {
    shortFeeSummary: string;
    referralSummary: string;
    wfsSummary: string;
    paymentSummary: string;
    disclaimer: string;
  };
  docs: WalmartSourceDoc[];
  notes: string[];
};

type WfsCalcResult = {
  fulfillmentFee: number;
  shippingRecoveryFee: number;
  storageFee: number;
  tierLabel: string;
  detail: string;
  chargeableWeight: number;
  shippingWeight: number;
  dimensionalWeight: number;
};

function clampMoney(value: number): number {
  return Number.isFinite(value) ? Math.max(value, 0) : 0;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calcReferralFee(baseAmount: number, rule: ReferralRule): number {
  if (rule.calcType === "flat") {
    return baseAmount * (rule.tiers[0]?.rate ?? 0) / 100;
  }

  let fee = 0;
  let previous = 0;

  for (const tier of rule.tiers) {
    const cap = tier.upTo;
    const tierAmount = Math.min(
      Math.max(baseAmount - previous, 0),
      cap === Infinity ? Infinity : cap - previous,
    );
    fee += tierAmount * (tier.rate / 100);
    previous = cap;
    if (previous >= baseAmount) break;
  }

  return fee;
}

function calcDimensionalWeight(length: number, width: number, height: number, divisor: number): number {
  if (length <= 0 || width <= 0 || height <= 0 || divisor <= 0) return 0;
  return (length * width * height) / divisor;
}

function cubicVolume(length: number, width: number, height: number, divisor: number): number {
  if (length <= 0 || width <= 0 || height <= 0 || divisor <= 0) return 0;
  return (length * width * height) / divisor;
}

function calcUsWfs(form: WalmartFormState): WfsCalcResult {
  const unitWeight = clampMoney(form.unitWeight);
  const dimWeight = calcDimensionalWeight(
    clampMoney(form.dimensionLength),
    clampMoney(form.dimensionWidth),
    clampMoney(form.dimensionHeight),
    139,
  );

  const dims = [form.dimensionLength, form.dimensionWidth, form.dimensionHeight]
    .map(clampMoney)
    .sort((a, b) => b - a);
  const longest = dims[0] ?? 0;
  const median = dims[1] ?? 0;
  const shortest = dims[2] ?? 0;
  const lpg = longest + 2 * (median + shortest);

  const isStandard = unitWeight <= 150 && longest <= 108 && lpg <= 165;
  const isBigBulky = !isStandard && (unitWeight <= 500 || longest <= 120);

  if (!isStandard && !isBigBulky) {
    return {
      fulfillmentFee: 0,
      shippingRecoveryFee: 0,
      storageFee: 0,
      tierLabel: "Outside Public WFS Card",
      detail: "Dimensions/weight exceed public WFS card scope.",
      chargeableWeight: 0,
      shippingWeight: 0,
      dimensionalWeight: round2(dimWeight),
    };
  }

  let chargeableWeight = 0;
  let shippingWeight = 0;
  let fulfillmentFee = 0;

  if (isStandard) {
    const baseWeight = unitWeight < 1 ? unitWeight : Math.max(unitWeight, dimWeight);
    chargeableWeight = baseWeight;
    shippingWeight = Math.ceil(baseWeight + 0.25);

    if (shippingWeight <= 1) fulfillmentFee = 3.45;
    else if (shippingWeight <= 2) fulfillmentFee = 4.95;
    else if (shippingWeight <= 3) fulfillmentFee = 5.45;
    else if (shippingWeight <= 20) fulfillmentFee = 5.75 + 0.40 * (shippingWeight - 4);
    else if (shippingWeight <= 30) fulfillmentFee = 15.55 + 0.40 * (shippingWeight - 21);
    else if (shippingWeight <= 50) fulfillmentFee = 14.55 + 0.40 * (shippingWeight - 31);
    else fulfillmentFee = 17.55 + 0.40 * (shippingWeight - 51);

    if (form.soldPrice < 10) fulfillmentFee += 1;
    if (form.isApparel) fulfillmentFee += 0.50;
    if (form.isHazmat) fulfillmentFee += 0.75;
  }

  if (isBigBulky) {
    chargeableWeight = unitWeight;
    shippingWeight = Math.ceil(unitWeight);

    if (shippingWeight <= 90) fulfillmentFee = 9.95;
    else if (shippingWeight <= 100) fulfillmentFee = 10.40 + 0.50 * (shippingWeight - 91);
    else if (shippingWeight <= 150) fulfillmentFee = 17.40 + 0.55 * (shippingWeight - 101);
    else fulfillmentFee = 42.40 + 0.55 * (shippingWeight - 151);
  }

  const storageMonths = Math.max(0, Math.min(12, Math.round(clampMoney(form.storageMonths))));
  const volume = cubicVolume(
    clampMoney(form.dimensionLength),
    clampMoney(form.dimensionWidth),
    clampMoney(form.dimensionHeight),
    1728,
  );

  let storageFee = 0;
  if (storageMonths > 0 && volume > 0) {
    const isPeak = form.storageSeason === "oct_dec";
    const monthlyRate = isStandard
      ? (isPeak ? 1.50 : 0.75)
      : (isPeak ? 0.75 : 0.50);
    storageFee = volume * monthlyRate * storageMonths;
  }

  return {
    fulfillmentFee: round2(fulfillmentFee),
    shippingRecoveryFee: 0,
    storageFee: round2(storageFee),
    tierLabel: isStandard ? "Standard" : "Big & Bulky",
    detail: isStandard
      ? `Standard WFS formula with shipping weight ${shippingWeight.toFixed(0)} lb`
      : `Big & Bulky WFS formula with shipping weight ${shippingWeight.toFixed(0)} lb`,
    chargeableWeight: round2(chargeableWeight),
    shippingWeight,
    dimensionalWeight: round2(dimWeight),
  };
}

function calcCaWfs(form: WalmartFormState): WfsCalcResult {
  const unitWeight = clampMoney(form.unitWeight);
  const dimWeight = calcDimensionalWeight(
    clampMoney(form.dimensionLength),
    clampMoney(form.dimensionWidth),
    clampMoney(form.dimensionHeight),
    300,
  );

  const baseWeight = unitWeight < 1 || unitWeight > 150
    ? unitWeight
    : Math.max(unitWeight, dimWeight);
  const shippingWeight = Math.ceil(baseWeight + 0.25);

  let fee = 0;
  if (shippingWeight < 1) fee = 5.50;
  else if (shippingWeight <= 3) fee = 6.50;
  else if (shippingWeight <= 6) fee = 8.50;
  else if (shippingWeight <= 11) fee = 10.10;
  else if (shippingWeight <= 20) fee = 10.10 + 0.40 * (shippingWeight - 11);
  else if (shippingWeight <= 30) fee = 18.00 + 0.40 * (shippingWeight - 21);
  else if (shippingWeight <= 50) fee = 24.00 + 0.20 * (shippingWeight - 31);
  else if (shippingWeight <= 70) fee = 28.00 + 0.20 * (shippingWeight - 51);
  else if (shippingWeight <= 150) fee = 32.00 + 0.40 * (shippingWeight - 71);
  else if (shippingWeight <= 350) fee = 150.00 + 0.40 * (shippingWeight - 151);
  else if (shippingWeight <= 500) fee = 350.00 + 0.40 * (shippingWeight - 351);

  const dims = [form.dimensionLength, form.dimensionWidth, form.dimensionHeight]
    .map(clampMoney)
    .sort((a, b) => b - a);
  const longest = dims[0] ?? 0;
  const median = dims[1] ?? 0;
  const shortest = dims[2] ?? 0;
  const lpg = longest + 2 * (median + shortest);

  if (shippingWeight <= 150) {
    if (longest > 87 || lpg > 118) fee += 35;
    else if (longest > 48 || median > 30 || lpg > 105) fee += 4;
  }

  const months = Math.max(0, Math.round(clampMoney(form.storageMonths)));
  const volume = cubicVolume(
    clampMoney(form.dimensionLength),
    clampMoney(form.dimensionWidth),
    clampMoney(form.dimensionHeight),
    1728,
  );

  let storageFee = 0;
  if (months > 0 && volume > 0) {
    if (form.storageSeason === "jan_sep") {
      const normalMonths = Math.min(months, 12);
      const longTermMonths = Math.max(months - 12, 0);
      storageFee = volume * (normalMonths * 0.80 + longTermMonths * 7.0);
    } else {
      const peakMonths = Math.min(months, 12);
      const firstMonth = peakMonths > 0 ? 1 : 0;
      const afterFirst = Math.max(peakMonths - 1, 0);
      const longTermMonths = Math.max(months - 12, 0);
      storageFee = volume * (firstMonth * 0.80 + afterFirst * 2.50 + longTermMonths * 7.0);
    }
  }

  return {
    fulfillmentFee: round2(fee),
    shippingRecoveryFee: 0,
    storageFee: round2(storageFee),
    tierLabel: "WFS Canada",
    detail: `Shipping weight ${shippingWeight.toFixed(0)} lb (volumetric divisor 300)`,
    chargeableWeight: round2(baseWeight),
    shippingWeight,
    dimensionalWeight: round2(dimWeight),
  };
}

function calcClWfs(form: WalmartFormState): WfsCalcResult {
  const chargeableWeight = clampMoney(form.unitWeight);
  let tierLabel = "XS";
  let fee = 2000;

  if (chargeableWeight >= 400) {
    tierLabel = "XL";
    fee = 18990;
  } else if (chargeableWeight >= 50) {
    tierLabel = "L";
    fee = 6990;
  } else if (chargeableWeight >= 25) {
    tierLabel = "M2";
    fee = 6290;
  } else if (chargeableWeight >= 15) {
    tierLabel = "M1";
    fee = 5590;
  } else if (chargeableWeight >= 6) {
    tierLabel = "S3";
    fee = 4250;
  } else if (chargeableWeight >= 4) {
    tierLabel = "S2";
    fee = 3990;
  } else if (chargeableWeight >= 2) {
    tierLabel = "S1";
    fee = 2500;
  }

  const months = Math.max(0, Math.round(clampMoney(form.storageMonths)));
  const volumeM3 = cubicVolume(
    clampMoney(form.dimensionLength),
    clampMoney(form.dimensionWidth),
    clampMoney(form.dimensionHeight),
    1_000_000,
  );

  let storageFee = 0;
  if (months > 0 && volumeM3 > 0) {
    const freeMonths = Math.min(months, 3);
    const standardMonths = Math.min(Math.max(months - freeMonths, 0), 9);
    const longTermMonths = Math.max(months - 12, 0);
    storageFee = volumeM3 * (standardMonths * 300 * 30 + longTermMonths * 3000 * 30);
  }

  return {
    fulfillmentFee: round2(fee),
    shippingRecoveryFee: 0,
    storageFee: round2(storageFee),
    tierLabel: `WFS ${tierLabel}`,
    detail: `Chargeable weight tier ${tierLabel}`,
    chargeableWeight: round2(chargeableWeight),
    shippingWeight: round2(chargeableWeight),
    dimensionalWeight: 0,
  };
}

function calcManualWfs(form: WalmartFormState): WfsCalcResult {
  return {
    fulfillmentFee: round2(clampMoney(form.manualWfsFulfillmentFee)),
    shippingRecoveryFee: round2(clampMoney(form.manualWfsShippingRecoveryFee)),
    storageFee: round2(clampMoney(form.manualWfsStorageFee)),
    tierLabel: "Manual WFS Inputs",
    detail: "Manual fulfillment + shipping recovery + storage inputs",
    chargeableWeight: 0,
    shippingWeight: 0,
    dimensionalWeight: 0,
  };
}

function calcWfsFees(form: WalmartFormState, config: WalmartMarketConfig): WfsCalcResult {
  if (form.fulfillmentMethod !== "wfs") {
    return {
      fulfillmentFee: 0,
      shippingRecoveryFee: 0,
      storageFee: 0,
      tierLabel: "Seller Fulfilled",
      detail: "No WFS fee applied.",
      chargeableWeight: 0,
      shippingWeight: 0,
      dimensionalWeight: 0,
    };
  }

  switch (config.wfs.mode) {
    case "us_official":
      return calcUsWfs(form);
    case "ca_official":
      return calcCaWfs(form);
    case "cl_official":
      return calcClWfs(form);
    case "manual":
      return calcManualWfs(form);
    default:
      return calcManualWfs(form);
  }
}

export function calculate(form: WalmartFormState, config: WalmartMarketConfig): WalmartCalcResult {
  const soldPrice = clampMoney(form.soldPrice);
  const shippingCharged = clampMoney(form.shippingCharged);
  const totalSalesPrice = round2(soldPrice + shippingCharged);

  const selectedRules = form.usePremiumReferralRate && config.premiumReferralRules
    ? config.premiumReferralRules
    : config.referralRules;
  const referralModeLabel = form.usePremiumReferralRate && config.premiumReferralRules
    ? (config.premiumReferralLabel ?? "Premium referral mode")
    : "Standard referral mode";

  const referralRule = selectedRules[form.category] ?? selectedRules.default;
  const referralFee = round2(calcReferralFee(totalSalesPrice, referralRule));

  const paymentProcessingFee = round2(totalSalesPrice * (clampMoney(form.paymentProcessingRate) / 100));

  const wfs = calcWfsFees(form, config);

  const totalFees = round2(
    referralFee
    + wfs.fulfillmentFee
    + wfs.shippingRecoveryFee
    + wfs.storageFee
    + paymentProcessingFee,
  );

  const totalCosts = round2(
    clampMoney(form.itemCost)
    + (form.fulfillmentMethod === "seller" ? clampMoney(form.shippingCost) : 0)
    + clampMoney(form.otherCosts),
  );

  const revenue = totalSalesPrice;
  const netProfit = round2(revenue - totalFees - totalCosts);
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return {
    totalSalesPrice: revenue,
    referralFee,
    referralRuleDesc: describeReferralRule(referralRule),
    referralRateModeLabel: referralModeLabel,
    wfsFulfillmentFee: wfs.fulfillmentFee,
    wfsShippingRecoveryFee: wfs.shippingRecoveryFee,
    wfsStorageFee: wfs.storageFee,
    wfsTierLabel: wfs.tierLabel,
    wfsDetail: wfs.detail,
    paymentProcessingFee,
    totalFees,
    revenue,
    totalCosts,
    netProfit,
    margin,
    chargeableWeight: wfs.chargeableWeight,
    shippingWeight: wfs.shippingWeight,
    dimensionalWeight: wfs.dimensionalWeight,
  };
}

export function formatCurrency(value: number, config: WalmartMarketConfig): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat(config.currency.locale, {
    minimumFractionDigits: config.currency.decimals,
    maximumFractionDigits: config.currency.decimals,
  }).format(abs);
  return `${value < 0 ? "−" : ""}${config.currency.symbol}${formatted}`;
}

export function flat(rate: number): ReferralRule {
  return {
    calcType: "flat",
    tiers: [{ upTo: Infinity, rate }],
  };
}

export function tiered(tiers: Array<[number, number]>): ReferralRule {
  return {
    calcType: "tiered",
    tiers: tiers.map(([upTo, rate]) => ({ upTo, rate })),
  };
}

export function describeReferralRule(rule: ReferralRule): string {
  if (rule.calcType === "flat") {
    return `${rule.tiers[0]?.rate ?? 0}%`;
  }

  return rule.tiers
    .map((tier) => {
      if (tier.upTo === Infinity) {
        return `${tier.rate}% above breakpoint`;
      }
      return `${tier.rate}% up to ${tier.upTo.toLocaleString()}`;
    })
    .join(" + ");
}

export function makeDefaultForm(config: WalmartMarketConfig): WalmartFormState {
  return {
    category: config.defaults.category,
    fulfillmentMethod: config.defaults.fulfillmentMethod,
    soldPrice: config.defaults.soldPrice,
    shippingCharged: config.defaults.shippingCharged,
    itemCost: config.defaults.itemCost,
    shippingCost: config.defaults.shippingCost,
    otherCosts: config.defaults.otherCosts,
    paymentProcessingRate: config.defaults.paymentProcessingRate,
    usePremiumReferralRate: config.defaults.usePremiumReferralRate,
    unitWeight: config.defaults.unitWeight,
    dimensionLength: config.defaults.dimensionLength,
    dimensionWidth: config.defaults.dimensionWidth,
    dimensionHeight: config.defaults.dimensionHeight,
    isApparel: config.defaults.isApparel,
    isHazmat: config.defaults.isHazmat,
    storageMonths: config.defaults.storageMonths,
    storageSeason: config.defaults.storageSeason,
    manualWfsFulfillmentFee: config.defaults.manualWfsFulfillmentFee,
    manualWfsShippingRecoveryFee: config.defaults.manualWfsShippingRecoveryFee,
    manualWfsStorageFee: config.defaults.manualWfsStorageFee,
  };
}

// Market registry is in ./markets/index.ts to avoid circular dependencies.
