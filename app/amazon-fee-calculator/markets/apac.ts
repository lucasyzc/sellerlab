import {
  type AmazonMarketConfig, type AmazonCategory, type SizeTier,
  flat, tiered, threshold, METRIC_UNITS,
} from "../amazon-config";

// ═══════════════════════════════════════════════════════════════
// Shared APAC Helpers
// ═══════════════════════════════════════════════════════════════

const APAC_CATEGORIES: AmazonCategory[] = [
  { label: "Automotive", value: "automotive" },
  { label: "Baby Products", value: "baby" },
  { label: "Beauty & Health", value: "beauty" },
  { label: "Books", value: "books" },
  { label: "Clothing & Accessories", value: "clothing" },
  { label: "Computers", value: "computers" },
  { label: "Consumer Electronics", value: "electronics" },
  { label: "Electronics Accessories", value: "elec_accessories" },
  { label: "Everything Else", value: "default" },
  { label: "Footwear", value: "footwear" },
  { label: "Furniture", value: "furniture" },
  { label: "Grocery & Gourmet", value: "grocery" },
  { label: "Home & Kitchen", value: "home" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Kitchen & Dining", value: "kitchen" },
  { label: "Luggage & Bags", value: "bags" },
  { label: "Musical Instruments", value: "instruments" },
  { label: "Office Products", value: "office" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Sports & Outdoors", value: "sports" },
  { label: "Tools & Home Improvement", value: "tools" },
  { label: "Toys & Games", value: "toys" },
  { label: "Video Games & Consoles", value: "videogames" },
  { label: "Watches", value: "watches" },
];

function apacClassifySizeTier(weightKg: number, length: number, width: number, height: number): SizeTier {
  const dims = [length, width, height].sort((a, b) => b - a);
  const [longest, median, shortest] = dims;
  const lpg = longest + 2 * (median + shortest);

  if (weightKg <= 0.25 && longest <= 23 && median <= 15 && shortest <= 2.5) return "small_standard";
  if (weightKg <= 12 && longest <= 45 && median <= 34 && shortest <= 26) return "large_standard";
  if (weightKg <= 30 && longest <= 61 && median <= 46 && shortest <= 46) return "small_oversize";
  if (weightKg <= 30 && longest <= 120 && lpg <= 260) return "medium_oversize";
  if (weightKg <= 40 && longest <= 175 && lpg <= 360) return "large_oversize";
  return "special_oversize";
}

// ═══════════════════════════════════════════════════════════════
// Australia
// ═══════════════════════════════════════════════════════════════

const AU_RULES: Record<string, ReturnType<typeof flat>> = {
  default:          flat(12, 0.50),
  automotive:       flat(12, 0.50),
  baby:             threshold([[15, 8], [Infinity, 12]], 0.50),
  beauty:           threshold([[15, 8], [Infinity, 12]], 0.50),
  books:            flat(15, 0.50),
  clothing:         flat(12, 0.50),
  computers:        flat(7, 0.50),
  electronics:      flat(7, 0.50),
  elec_accessories: tiered([[100, 12], [Infinity, 7]], 0.50),
  footwear:         flat(12, 0.50),
  furniture:        tiered([[300, 15], [Infinity, 10]], 0.50),
  grocery:          threshold([[15, 8], [Infinity, 12]], 0),
  home:             flat(15, 0.50),
  jewelry:          tiered([[250, 20], [Infinity, 5]], 0.50),
  kitchen:          flat(15, 0.50),
  bags:             flat(15, 0.50),
  instruments:      flat(12, 0.50),
  office:           flat(15, 0.50),
  pets:             flat(15, 0.50),
  sports:           flat(12, 0.50),
  tools:            flat(12, 0.50),
  toys:             flat(15, 0.50),
  videogames:       flat(15, 0),
  watches:          tiered([[250, 15], [Infinity, 5]], 0.50),
};

function auCalcFbaFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;

  if (sizeTier === "small_standard") {
    if (g <= 100) return 2.96; if (g <= 200) return 3.19; return 3.48;
  }
  if (sizeTier === "large_standard") {
    if (g <= 250) return 4.02; if (g <= 500) return 4.42; if (g <= 1000) return 4.92;
    if (g <= 2000) return 5.54; if (g <= 5000) return 6.47; if (g <= 9000) return 7.53;
    return 7.53 + 0.38 * Math.max(Math.ceil(shippingWeightKg - 9), 0);
  }
  if (sizeTier === "small_oversize") return 10.92 + 0.45 * Math.max(shippingWeightKg - 1, 0);
  if (sizeTier === "medium_oversize") return 17.55 + 0.45 * Math.max(shippingWeightKg - 5, 0);
  if (sizeTier === "large_oversize") return 31.00 + 0.55 * Math.max(shippingWeightKg - 15, 0);
  return 45.00 + 0.55 * Math.max(shippingWeightKg - 15, 0);
}

function auCalcStorage(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 22.0 : 15.5) : (isQ4 ? 33.0 : 23.0);
  return cubicM * rate * months;
}

export const AU_MARKET: AmazonMarketConfig = {
  id: "au",
  name: "AU",
  fullName: "Australia",
  flag: "\u{1F1E6}\u{1F1FA}",
  domain: "amazon.com.au",
  currency: { code: "AUD", symbol: "A$", locale: "en-AU", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (A$49.95/mo)", value: "professional" },
    { label: "Individual (A$0.99/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: APAC_CATEGORIES,
  referralRules: AU_RULES,
  individualFee: 0.99,
  defaults: {
    soldPrice: 39.99, shippingCharged: 0, itemCost: 14, shippingCost: 6,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: "Australia Amazon Fee Calculator | SellerLab",
    description: "Calculate Amazon.com.au referral fees, FBA fulfillment fees, storage costs, and net profit for Australian sellers.",
    h1: "Australia Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.com.au.",
  },
  notes: [
    "Professional sellers pay A$49.95/month. Individual sellers pay A$0.99 per item.",
    "Most categories charge 12\u201315%. Electronics and Computers charge 7%.",
    "FBA uses metric dimensions (cm/kg). Size tiers are similar to EU classification.",
  ],
  classifySizeTier: apacClassifySizeTier,
  calcFbaFulfillmentFee: auCalcFbaFee,
  calcFbaStorageFee: auCalcStorage,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};

// ═══════════════════════════════════════════════════════════════
// Singapore
// ═══════════════════════════════════════════════════════════════

const SG_RULES: Record<string, ReturnType<typeof flat>> = {
  default:          flat(12, 0.50),
  automotive:       flat(12, 0.50),
  baby:             threshold([[15, 8], [Infinity, 12]], 0.50),
  beauty:           threshold([[15, 8], [Infinity, 12]], 0.50),
  books:            flat(15, 0.50),
  clothing:         flat(12, 0.50),
  computers:        flat(7, 0.50),
  electronics:      flat(7, 0.50),
  elec_accessories: tiered([[100, 12], [Infinity, 7]], 0.50),
  footwear:         flat(12, 0.50),
  furniture:        flat(15, 0.50),
  grocery:          threshold([[15, 8], [Infinity, 12]], 0),
  home:             flat(15, 0.50),
  jewelry:          tiered([[250, 20], [Infinity, 5]], 0.50),
  kitchen:          flat(15, 0.50),
  bags:             flat(12, 0.50),
  instruments:      flat(12, 0.50),
  office:           flat(15, 0.50),
  pets:             flat(15, 0.50),
  sports:           flat(12, 0.50),
  tools:            flat(12, 0.50),
  toys:             flat(15, 0.50),
  videogames:       flat(15, 0),
  watches:          tiered([[250, 15], [Infinity, 5]], 0.50),
};

function sgCalcFbaFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;
  if (sizeTier === "small_standard") {
    if (g <= 100) return 2.50; if (g <= 250) return 2.75; return 3.10;
  }
  if (sizeTier === "large_standard") {
    if (g <= 250) return 3.35; if (g <= 500) return 3.70; if (g <= 1000) return 4.25;
    if (g <= 2000) return 4.90; if (g <= 5000) return 5.85; if (g <= 9000) return 6.90;
    return 6.90 + 0.35 * Math.max(Math.ceil(shippingWeightKg - 9), 0);
  }
  if (sizeTier === "small_oversize") return 9.50 + 0.40 * Math.max(shippingWeightKg - 1, 0);
  if (sizeTier === "medium_oversize") return 15.00 + 0.45 * Math.max(shippingWeightKg - 5, 0);
  if (sizeTier === "large_oversize") return 28.00 + 0.50 * Math.max(shippingWeightKg - 15, 0);
  return 40.00 + 0.50 * Math.max(shippingWeightKg - 15, 0);
}

function sgCalcStorage(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 20.0 : 14.0) : (isQ4 ? 30.0 : 21.0);
  return cubicM * rate * months;
}

export const SG_MARKET: AmazonMarketConfig = {
  id: "sg",
  name: "SG",
  fullName: "Singapore",
  flag: "\u{1F1F8}\u{1F1EC}",
  domain: "amazon.sg",
  currency: { code: "SGD", symbol: "S$", locale: "en-SG", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (S$29.95/mo)", value: "professional" },
    { label: "Individual (S$0.99/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: APAC_CATEGORIES,
  referralRules: SG_RULES,
  individualFee: 0.99,
  defaults: {
    soldPrice: 39.99, shippingCharged: 0, itemCost: 14, shippingCost: 5,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: "Singapore Amazon Fee Calculator | SellerLab",
    description: "Calculate Amazon.sg referral fees, FBA fulfillment fees, storage costs, and net profit for Singapore sellers.",
    h1: "Singapore Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.sg.",
  },
  notes: [
    "Professional sellers pay S$29.95/month. Individual sellers pay S$0.99 per item.",
    "Most categories charge 12\u201315%. Electronics/Computers charge 7%.",
    "FBA uses metric dimensions (cm/kg).",
  ],
  classifySizeTier: apacClassifySizeTier,
  calcFbaFulfillmentFee: sgCalcFbaFee,
  calcFbaStorageFee: sgCalcStorage,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};
