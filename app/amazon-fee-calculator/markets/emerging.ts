import {
  type AmazonMarketConfig, type AmazonCategory, type SizeTier,
  flat, tiered, threshold, METRIC_UNITS,
} from "../amazon-config";

// ═══════════════════════════════════════════════════════════════
// Shared Category List (simplified for emerging markets)
// ═══════════════════════════════════════════════════════════════

const EM_CATEGORIES: AmazonCategory[] = [
  { label: "Automotive", value: "automotive" },
  { label: "Baby Products", value: "baby" },
  { label: "Beauty & Health", value: "beauty" },
  { label: "Books", value: "books" },
  { label: "Clothing & Accessories", value: "clothing" },
  { label: "Computers", value: "computers" },
  { label: "Consumer Electronics", value: "electronics" },
  { label: "Everything Else", value: "default" },
  { label: "Footwear", value: "footwear" },
  { label: "Furniture", value: "furniture" },
  { label: "Grocery", value: "grocery" },
  { label: "Home & Kitchen", value: "home" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Office Products", value: "office" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Sports & Outdoors", value: "sports" },
  { label: "Tools & Home Improvement", value: "tools" },
  { label: "Toys & Games", value: "toys" },
  { label: "Video Games & Consoles", value: "videogames" },
  { label: "Watches", value: "watches" },
];

function emClassifySizeTier(weightKg: number, length: number, width: number, height: number): SizeTier {
  const dims = [length, width, height].sort((a, b) => b - a);
  const [longest, median, shortest] = dims;
  const lpg = longest + 2 * (median + shortest);

  if (weightKg <= 0.25 && longest <= 23 && median <= 15 && shortest <= 2.5) return "small_standard";
  if (weightKg <= 12 && longest <= 45 && median <= 34 && shortest <= 26) return "large_standard";
  if (weightKg <= 29 && longest <= 61 && median <= 46 && shortest <= 46) return "small_oversize";
  if (weightKg <= 30 && longest <= 120 && lpg <= 260) return "medium_oversize";
  if (weightKg <= 40 && longest <= 175 && lpg <= 360) return "large_oversize";
  return "special_oversize";
}

// ═══════════════════════════════════════════════════════════════
// UAE (amazon.ae)
// ═══════════════════════════════════════════════════════════════

const AE_RULES: Record<string, ReturnType<typeof flat>> = {
  default:      flat(15, 1),
  automotive:   flat(12, 1),
  baby:         threshold([[40, 8], [Infinity, 15]], 1),
  beauty:       threshold([[40, 8], [Infinity, 15]], 1),
  books:        flat(15, 1),
  clothing:     flat(15, 1),
  computers:    flat(7, 1),
  electronics:  flat(7, 1),
  footwear:     flat(15, 1),
  furniture:    tiered([[750, 15], [Infinity, 10]], 1),
  grocery:      threshold([[40, 8], [Infinity, 15]], 0),
  home:         flat(15, 1),
  jewelry:      tiered([[1000, 20], [Infinity, 5]], 1),
  office:       flat(15, 1),
  pets:         flat(15, 1),
  sports:       flat(15, 1),
  tools:        flat(12, 1),
  toys:         flat(15, 1),
  videogames:   flat(15, 0),
  watches:      tiered([[1000, 15], [Infinity, 5]], 1),
};

function aeCalcFbaFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;
  if (sizeTier === "small_standard") {
    if (g <= 100) return 5.20; if (g <= 250) return 5.70; return 6.30;
  }
  if (sizeTier === "large_standard") {
    if (g <= 250) return 7.00; if (g <= 500) return 7.50; if (g <= 1000) return 8.50;
    if (g <= 2000) return 10.00; if (g <= 5000) return 12.50;
    return 12.50 + 1.10 * Math.max(Math.ceil(shippingWeightKg - 5), 0);
  }
  if (sizeTier === "small_oversize") return 20.00 + 1.20 * Math.max(shippingWeightKg - 1, 0);
  if (sizeTier === "medium_oversize") return 35.00 + 1.20 * Math.max(shippingWeightKg - 5, 0);
  if (sizeTier === "large_oversize") return 60.00 + 1.50 * Math.max(shippingWeightKg - 15, 0);
  return 85.00 + 1.50 * Math.max(shippingWeightKg - 15, 0);
}

function aeCalcStorage(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 28.0 : 20.0) : (isQ4 ? 40.0 : 28.0);
  return cubicM * rate * months;
}

export const AE_MARKET: AmazonMarketConfig = {
  id: "ae",
  name: "AE",
  fullName: "UAE",
  flag: "\u{1F1E6}\u{1F1EA}",
  domain: "amazon.ae",
  currency: { code: "AED", symbol: "AED ", locale: "en-AE", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (AED 99/mo)", value: "professional" },
    { label: "Individual (AED 3.67/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: EM_CATEGORIES,
  referralRules: AE_RULES,
  individualFee: 3.67,
  defaults: {
    soldPrice: 109, shippingCharged: 0, itemCost: 40, shippingCost: 15,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: "UAE Amazon Fee Calculator | SellerLab",
    description: "Calculate Amazon.ae referral fees, FBA fulfillment fees, storage costs, and net profit for UAE sellers.",
    h1: "UAE Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.ae (Middle East).",
  },
  notes: [
    "Professional sellers pay AED 99/month. Individual sellers pay AED 3.67 per item.",
    "Most categories charge 15%. Electronics/Computers charge 7%.",
    "Amazon.ae covers the UAE and broader Middle East region.",
  ],
  classifySizeTier: emClassifySizeTier,
  calcFbaFulfillmentFee: aeCalcFbaFee,
  calcFbaStorageFee: aeCalcStorage,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};

// ═══════════════════════════════════════════════════════════════
// Brazil (amazon.com.br)
// ═══════════════════════════════════════════════════════════════

const BR_RULES: Record<string, ReturnType<typeof flat>> = {
  default:      flat(15, 1),
  automotive:   flat(13, 1),
  baby:         threshold([[50, 10], [Infinity, 15]], 1),
  beauty:       threshold([[50, 10], [Infinity, 15]], 1),
  books:        flat(15, 1),
  clothing:     flat(15, 1),
  computers:    flat(10, 1),
  electronics:  flat(13, 1),
  footwear:     flat(15, 1),
  furniture:    flat(15, 1),
  grocery:      threshold([[50, 8], [Infinity, 15]], 0),
  home:         flat(15, 1),
  jewelry:      tiered([[1000, 20], [Infinity, 5]], 1),
  office:       flat(15, 1),
  pets:         flat(15, 1),
  sports:       flat(13, 1),
  tools:        flat(13, 1),
  toys:         flat(15, 1),
  videogames:   flat(15, 0),
  watches:      tiered([[1000, 15], [Infinity, 5]], 1),
};

function brCalcFbaFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;
  if (sizeTier === "small_standard") {
    if (g <= 100) return 7.09; if (g <= 250) return 7.80; return 8.80;
  }
  if (sizeTier === "large_standard") {
    if (g <= 250) return 9.40; if (g <= 500) return 10.30; if (g <= 1000) return 11.90;
    if (g <= 2000) return 14.50; if (g <= 5000) return 18.50;
    return 18.50 + 2.00 * Math.max(Math.ceil(shippingWeightKg - 5), 0);
  }
  if (sizeTier === "small_oversize") return 29.00 + 2.50 * Math.max(shippingWeightKg - 1, 0);
  if (sizeTier === "medium_oversize") return 50.00 + 2.50 * Math.max(shippingWeightKg - 5, 0);
  if (sizeTier === "large_oversize") return 85.00 + 3.00 * Math.max(shippingWeightKg - 15, 0);
  return 120.00 + 3.00 * Math.max(shippingWeightKg - 15, 0);
}

function brCalcStorage(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 80.0 : 55.0) : (isQ4 ? 120.0 : 80.0);
  return cubicM * rate * months;
}

export const BR_MARKET: AmazonMarketConfig = {
  id: "br",
  name: "BR",
  fullName: "Brazil",
  flag: "\u{1F1E7}\u{1F1F7}",
  domain: "amazon.com.br",
  currency: { code: "BRL", symbol: "R$", locale: "pt-BR", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (R$19/mo)", value: "professional" },
    { label: "Individual (R$2/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: EM_CATEGORIES,
  referralRules: BR_RULES,
  individualFee: 2.00,
  defaults: {
    soldPrice: 149.90, shippingCharged: 0, itemCost: 50, shippingCost: 20,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: "Brazil Amazon Fee Calculator | SellerLab",
    description: "Calculate Amazon.com.br referral fees, FBA fulfillment fees, storage costs, and net profit for Brazilian sellers.",
    h1: "Brazil Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.com.br.",
  },
  notes: [
    "Professional sellers pay R$19/month. Individual sellers pay R$2 per item.",
    "Most categories charge 15%. Electronics charge 13%, Computers charge 10%.",
    "FBA fees are in BRL. Metric dimensions (cm/kg) are used.",
  ],
  classifySizeTier: emClassifySizeTier,
  calcFbaFulfillmentFee: brCalcFbaFee,
  calcFbaStorageFee: brCalcStorage,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};

// ═══════════════════════════════════════════════════════════════
// Mexico (amazon.com.mx)
// ═══════════════════════════════════════════════════════════════

const MX_RULES: Record<string, ReturnType<typeof flat>> = {
  default:      flat(15, 10),
  automotive:   flat(13, 10),
  baby:         threshold([[200, 8], [Infinity, 15]], 10),
  beauty:       threshold([[200, 8], [Infinity, 15]], 10),
  books:        flat(15, 10),
  clothing:     flat(15, 10),
  computers:    flat(10, 10),
  electronics:  flat(13, 10),
  footwear:     flat(15, 10),
  furniture:    tiered([[4000, 15], [Infinity, 10]], 10),
  grocery:      threshold([[200, 8], [Infinity, 15]], 0),
  home:         flat(15, 10),
  jewelry:      tiered([[5000, 20], [Infinity, 5]], 10),
  office:       flat(15, 10),
  pets:         flat(15, 10),
  sports:       flat(13, 10),
  tools:        flat(13, 10),
  toys:         flat(15, 10),
  videogames:   flat(15, 0),
  watches:      tiered([[5000, 15], [Infinity, 5]], 10),
};

function mxCalcFbaFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;
  if (sizeTier === "small_standard") {
    if (g <= 100) return 42; if (g <= 250) return 46; return 52;
  }
  if (sizeTier === "large_standard") {
    if (g <= 250) return 56; if (g <= 500) return 62; if (g <= 1000) return 72;
    if (g <= 2000) return 88; if (g <= 5000) return 110;
    return 110 + 12 * Math.max(Math.ceil(shippingWeightKg - 5), 0);
  }
  if (sizeTier === "small_oversize") return 175 + 15 * Math.max(shippingWeightKg - 1, 0);
  if (sizeTier === "medium_oversize") return 300 + 15 * Math.max(shippingWeightKg - 5, 0);
  if (sizeTier === "large_oversize") return 520 + 18 * Math.max(shippingWeightKg - 15, 0);
  return 750 + 18 * Math.max(shippingWeightKg - 15, 0);
}

function mxCalcStorage(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 500 : 350) : (isQ4 ? 700 : 480);
  return cubicM * rate * months;
}

export const MX_MARKET: AmazonMarketConfig = {
  id: "mx",
  name: "MX",
  fullName: "Mexico",
  flag: "\u{1F1F2}\u{1F1FD}",
  domain: "amazon.com.mx",
  currency: { code: "MXN", symbol: "MX$", locale: "es-MX", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (MX$600/mo)", value: "professional" },
    { label: "Individual (MX$15/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: EM_CATEGORIES,
  referralRules: MX_RULES,
  individualFee: 15,
  defaults: {
    soldPrice: 499, shippingCharged: 0, itemCost: 170, shippingCost: 80,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: "Mexico Amazon Fee Calculator | SellerLab",
    description: "Calculate Amazon.com.mx referral fees, FBA fulfillment fees, storage costs, and net profit for Mexican marketplace sellers.",
    h1: "Mexico Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.com.mx.",
  },
  notes: [
    "Professional sellers pay MX$600/month. Individual sellers pay MX$15 per item.",
    "Most categories charge 15%. Electronics/Automotive charge 13%, Computers charge 10%.",
    "FBA uses metric dimensions (cm/kg). All fees are in MXN.",
  ],
  classifySizeTier: emClassifySizeTier,
  calcFbaFulfillmentFee: mxCalcFbaFee,
  calcFbaStorageFee: mxCalcStorage,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};

// ═══════════════════════════════════════════════════════════════
// Turkey (amazon.com.tr)
// ═══════════════════════════════════════════════════════════════

const TR_RULES: Record<string, ReturnType<typeof flat>> = {
  default:      flat(15, 5),
  automotive:   flat(12, 5),
  baby:         threshold([[100, 8], [Infinity, 15]], 5),
  beauty:       threshold([[100, 8], [Infinity, 15]], 5),
  books:        flat(15, 5),
  clothing:     flat(15, 5),
  computers:    flat(7, 5),
  electronics:  flat(10, 5),
  footwear:     flat(15, 5),
  furniture:    flat(15, 5),
  grocery:      threshold([[100, 8], [Infinity, 15]], 0),
  home:         flat(15, 5),
  jewelry:      tiered([[2500, 20], [Infinity, 5]], 5),
  office:       flat(15, 5),
  pets:         flat(15, 5),
  sports:       flat(12, 5),
  tools:        flat(12, 5),
  toys:         flat(15, 5),
  videogames:   flat(15, 0),
  watches:      tiered([[2500, 15], [Infinity, 5]], 5),
};

function trCalcFbaFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;
  if (sizeTier === "small_standard") {
    if (g <= 100) return 14; if (g <= 250) return 16; return 18;
  }
  if (sizeTier === "large_standard") {
    if (g <= 250) return 20; if (g <= 500) return 23; if (g <= 1000) return 28;
    if (g <= 2000) return 35; if (g <= 5000) return 45;
    return 45 + 5 * Math.max(Math.ceil(shippingWeightKg - 5), 0);
  }
  if (sizeTier === "small_oversize") return 70 + 7 * Math.max(shippingWeightKg - 1, 0);
  if (sizeTier === "medium_oversize") return 120 + 7 * Math.max(shippingWeightKg - 5, 0);
  if (sizeTier === "large_oversize") return 200 + 9 * Math.max(shippingWeightKg - 15, 0);
  return 280 + 9 * Math.max(shippingWeightKg - 15, 0);
}

function trCalcStorage(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 200 : 130) : (isQ4 ? 280 : 190);
  return cubicM * rate * months;
}

export const TR_MARKET: AmazonMarketConfig = {
  id: "tr",
  name: "TR",
  fullName: "Turkey",
  flag: "\u{1F1F9}\u{1F1F7}",
  domain: "amazon.com.tr",
  currency: { code: "TRY", symbol: "\u20BA", locale: "tr-TR", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (\u20BA99.99/mo)", value: "professional" },
    { label: "Individual (\u20BA4.99/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: EM_CATEGORIES,
  referralRules: TR_RULES,
  individualFee: 4.99,
  defaults: {
    soldPrice: 499, shippingCharged: 0, itemCost: 170, shippingCost: 50,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: "Turkey Amazon Fee Calculator | SellerLab",
    description: "Calculate Amazon.com.tr referral fees, FBA fulfillment fees, storage costs, and net profit for Turkish marketplace sellers.",
    h1: "Turkey Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.com.tr.",
  },
  notes: [
    "Professional sellers pay \u20BA99.99/month. Individual sellers pay \u20BA4.99 per item.",
    "Most categories charge 15%. Electronics charge 10%, Computers charge 7%.",
    "FBA uses metric dimensions (cm/kg). All fees are in TRY.",
  ],
  classifySizeTier: emClassifySizeTier,
  calcFbaFulfillmentFee: trCalcFbaFee,
  calcFbaStorageFee: trCalcStorage,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};
