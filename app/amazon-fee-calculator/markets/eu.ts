import {
  type AmazonMarketConfig, type AmazonCategory, type ReferralRule, type SizeTier,
  flat, tiered, threshold, METRIC_UNITS,
} from "../amazon-config";
import { withSuiteBrand } from "@/lib/brand";

// ═══════════════════════════════════════════════════════════════
// Shared EU Categories & Rules
// ═══════════════════════════════════════════════════════════════

const EU_CATEGORIES: AmazonCategory[] = [
  { label: "Automotive & Powersports", value: "automotive" },
  { label: "Baby Products", value: "baby" },
  { label: "Beauty & Health", value: "beauty" },
  { label: "Books", value: "books" },
  { label: "Business & Industrial", value: "business" },
  { label: "Clothing & Accessories", value: "clothing" },
  { label: "Computers", value: "computers" },
  { label: "Consumer Electronics", value: "electronics" },
  { label: "DIY & Tools", value: "diy" },
  { label: "DVDs & Blu-ray", value: "dvd" },
  { label: "Electronics Accessories", value: "elec_accessories" },
  { label: "Everything Else", value: "default" },
  { label: "Footwear", value: "footwear" },
  { label: "Furniture", value: "furniture" },
  { label: "Garden & Outdoors", value: "garden" },
  { label: "Grocery & Gourmet", value: "grocery" },
  { label: "Handmade", value: "handmade" },
  { label: "Home & Kitchen", value: "home" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Kitchen & Dining", value: "kitchen" },
  { label: "Large Appliances", value: "large_appliances" },
  { label: "Lighting", value: "lighting" },
  { label: "Luggage & Bags", value: "bags" },
  { label: "Media \u2013 Music", value: "music" },
  { label: "Media \u2013 Video", value: "video" },
  { label: "Musical Instruments", value: "instruments" },
  { label: "Office Products", value: "office" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Sports & Outdoors", value: "sports" },
  { label: "Toys & Games", value: "toys" },
  { label: "Video Games & Consoles", value: "videogames" },
  { label: "Watches", value: "watches" },
];

const EU_RULES: Record<string, ReferralRule> = {
  default:          flat(15, 0.30),
  automotive:       flat(15, 0.30),
  baby:             threshold([[10, 8], [Infinity, 15]], 0.30),
  beauty:           threshold([[10, 8], [Infinity, 15]], 0.30),
  books:            flat(15, 0.30),
  business:         flat(15, 0.30),
  clothing:         flat(15, 0.30),
  computers:        flat(7, 0.30),
  electronics:      flat(7, 0.30),
  diy:              flat(12, 0.30),
  dvd:              flat(15, 0.30),
  elec_accessories: tiered([[100, 15], [Infinity, 8]], 0.30),
  footwear:         flat(15, 0.30),
  furniture:        tiered([[200, 15], [Infinity, 10]], 0.30),
  garden:           flat(15, 0.30),
  grocery:          threshold([[10, 8], [Infinity, 15]], 0),
  handmade:         flat(12, 0.30),
  home:             flat(15, 0.30),
  jewelry:          tiered([[250, 20], [Infinity, 5]], 0.30),
  kitchen:          flat(15, 0.30),
  large_appliances: flat(7, 0.30),
  lighting:         flat(15, 0.30),
  bags:             flat(15, 0.30),
  music:            flat(15, 0.30),
  video:            flat(15, 0.30),
  instruments:      flat(15, 0.30),
  office:           flat(15, 0.30),
  pets:             flat(15, 0.30),
  sports:           flat(15, 0.30),
  toys:             flat(15, 0.30),
  videogames:       flat(15, 0),
  watches:          tiered([[250, 16], [Infinity, 5]], 0.30),
};

// ═══════════════════════════════════════════════════════════════
// Shared EU FBA Logic (Pan-European)
// ═══════════════════════════════════════════════════════════════

function euClassifySizeTier(weightKg: number, length: number, width: number, height: number): SizeTier {
  const dims = [length, width, height].sort((a, b) => b - a);
  const [longest, median, shortest] = dims;
  const lpg = longest + 2 * (median + shortest);

  if (weightKg <= 0.08 && longest <= 20 && median <= 15 && shortest <= 1) return "envelope";
  if (weightKg <= 0.46 && longest <= 33 && median <= 23 && shortest <= 2.5) return "small_standard";
  if (weightKg <= 12 && longest <= 45 && median <= 34 && shortest <= 26) return "large_standard";
  if (weightKg <= 29 && longest <= 61 && median <= 46 && shortest <= 46) return "small_oversize";
  if (weightKg <= 23.5 && longest <= 120 && lpg <= 260) return "medium_oversize";
  if (weightKg <= 31.5 && longest <= 175 && lpg <= 360) return "large_oversize";
  return "special_oversize";
}

function euCalcFbaFulfillmentFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;

  if (sizeTier === "envelope") return 1.80;
  if (sizeTier === "small_standard") {
    if (g <= 60) return 2.08; if (g <= 210) return 2.23; if (g <= 460) return 2.42; return 2.62;
  }
  if (sizeTier === "large_standard") {
    if (g <= 150) return 2.75; if (g <= 400) return 2.93; if (g <= 900) return 3.33;
    if (g <= 1800) return 3.85; if (g <= 2700) return 4.47; if (g <= 3500) return 4.99;
    if (g <= 5000) return 5.52; if (g <= 7000) return 5.87; if (g <= 9000) return 6.32;
    return 7.06 + 0.29 * Math.max(Math.ceil(shippingWeightKg - 9), 0);
  }
  if (sizeTier === "small_oversize") {
    if (g <= 760) return 6.23; if (g <= 1260) return 6.62; if (g <= 1760) return 7.36;
    if (g <= 7000) return 7.75; return 7.75 + 0.29 * Math.max(Math.ceil(shippingWeightKg - 7), 0);
  }
  if (sizeTier === "medium_oversize") {
    if (g <= 760) return 6.43; if (g <= 1760) return 7.37;
    if (g <= 6000) return 9.72; if (g <= 12000) return 11.93;
    return 11.93 + 0.42 * Math.max(Math.ceil(shippingWeightKg - 12), 0);
  }
  if (sizeTier === "large_oversize") {
    return 22.41 + 0.47 * Math.max(Math.ceil(shippingWeightKg - 15), 0);
  }
  return 26.09 + 0.47 * Math.max(Math.ceil(shippingWeightKg - 15), 0);
}

function euCalcFbaStorageFee(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 25.00 : 18.00) : (isQ4 ? 36.00 : 26.00);
  return cubicM * rate * months;
}

const EU_FBA_BASE = {
  classifySizeTier: euClassifySizeTier,
  calcFbaFulfillmentFee: euCalcFbaFulfillmentFee,
  calcFbaStorageFee: euCalcFbaStorageFee,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};

const EU_SELLER_TYPES = [
  { label: "Professional (\u20AC39/mo)", value: "professional" },
  { label: "Individual (\u20AC0.99/item)", value: "individual" },
];

const EU_FULFILLMENT = [
  { label: "FBA (Fulfilled by Amazon)", value: "fba" },
  { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
];

function euDefaults(soldPrice = 24.99) {
  return {
    soldPrice, shippingCharged: 0, itemCost: 8, shippingCost: 4,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  };
}

// ═══════════════════════════════════════════════════════════════
// Germany
// ═══════════════════════════════════════════════════════════════

export const DE_MARKET: AmazonMarketConfig = {
  id: "de",
  name: "DE",
  fullName: "Germany",
  flag: "\u{1F1E9}\u{1F1EA}",
  domain: "amazon.de",
  currency: { code: "EUR", symbol: "\u20AC", locale: "de-DE", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: EU_SELLER_TYPES,
  fulfillmentMethods: EU_FULFILLMENT,
  categories: EU_CATEGORIES,
  referralRules: EU_RULES,
  individualFee: 0.99,
  defaults: euDefaults(),
  seo: {
    title: withSuiteBrand("Germany Amazon Fee Calculator"),
    description: "Calculate Amazon.de referral fees, FBA fulfillment fees, storage costs, and net profit for German marketplace sellers.",
    h1: "Germany Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.de.",
  },
  notes: [
    "Professional sellers pay \u20AC39/month. Individual sellers pay \u20AC0.99 per item sold.",
    "FBA fees use Pan-European fulfillment rates. Size tiers are based on metric dimensions (cm/kg).",
    "Most categories charge 15% referral fee. Electronics and Computers charge 7%.",
    "Storage fees: standard \u20AC26/cbm (Jan\u2013Sep), \u20AC36/cbm (Oct\u2013Dec).",
  ],
  ...EU_FBA_BASE,
};

// ═══════════════════════════════════════════════════════════════
// Italy
// ═══════════════════════════════════════════════════════════════

export const IT_MARKET: AmazonMarketConfig = {
  id: "it",
  name: "IT",
  fullName: "Italy",
  flag: "\u{1F1EE}\u{1F1F9}",
  domain: "amazon.it",
  currency: { code: "EUR", symbol: "\u20AC", locale: "it-IT", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: EU_SELLER_TYPES,
  fulfillmentMethods: EU_FULFILLMENT,
  categories: EU_CATEGORIES,
  referralRules: EU_RULES,
  individualFee: 0.99,
  defaults: euDefaults(),
  seo: {
    title: withSuiteBrand("Italy Amazon Fee Calculator"),
    description: "Calculate Amazon.it referral fees, FBA fulfillment fees, storage costs, and net profit for Italian marketplace sellers.",
    h1: "Italy Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.it.",
  },
  notes: [
    "Professional sellers pay \u20AC39/month. Individual sellers pay \u20AC0.99 per item.",
    "Uses Pan-European FBA fulfillment rates (same as Amazon.de).",
    "Most categories charge 15%. Electronics/Computers charge 7%.",
  ],
  ...EU_FBA_BASE,
};

// ═══════════════════════════════════════════════════════════════
// Spain
// ═══════════════════════════════════════════════════════════════

export const ES_MARKET: AmazonMarketConfig = {
  id: "es",
  name: "ES",
  fullName: "Spain",
  flag: "\u{1F1EA}\u{1F1F8}",
  domain: "amazon.es",
  currency: { code: "EUR", symbol: "\u20AC", locale: "es-ES", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: EU_SELLER_TYPES,
  fulfillmentMethods: EU_FULFILLMENT,
  categories: EU_CATEGORIES,
  referralRules: EU_RULES,
  individualFee: 0.99,
  defaults: euDefaults(),
  seo: {
    title: withSuiteBrand("Spain Amazon Fee Calculator"),
    description: "Calculate Amazon.es referral fees, FBA fulfillment fees, storage costs, and net profit for Spanish marketplace sellers.",
    h1: "Spain Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.es.",
  },
  notes: [
    "Professional sellers pay \u20AC39/month. Individual sellers pay \u20AC0.99 per item.",
    "Uses Pan-European FBA fulfillment rates (same as Amazon.de).",
    "Most categories charge 15%. Electronics/Computers charge 7%.",
  ],
  ...EU_FBA_BASE,
};

// ═══════════════════════════════════════════════════════════════
// Netherlands
// ═══════════════════════════════════════════════════════════════

export const NL_MARKET: AmazonMarketConfig = {
  id: "nl",
  name: "NL",
  fullName: "Netherlands",
  flag: "\u{1F1F3}\u{1F1F1}",
  domain: "amazon.nl",
  currency: { code: "EUR", symbol: "\u20AC", locale: "nl-NL", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: EU_SELLER_TYPES,
  fulfillmentMethods: EU_FULFILLMENT,
  categories: EU_CATEGORIES,
  referralRules: EU_RULES,
  individualFee: 0.99,
  defaults: euDefaults(),
  seo: {
    title: withSuiteBrand("Netherlands Amazon Fee Calculator"),
    description: "Calculate Amazon.nl referral fees, FBA fulfillment fees, storage costs, and net profit for Dutch marketplace sellers.",
    h1: "Netherlands Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.nl.",
  },
  notes: [
    "Professional sellers pay \u20AC39/month. Individual sellers pay \u20AC0.99 per item.",
    "Uses Pan-European FBA fulfillment rates (same as Amazon.de).",
    "Most categories charge 15%. Electronics/Computers charge 7%.",
  ],
  ...EU_FBA_BASE,
};

// ═══════════════════════════════════════════════════════════════
// Belgium
// ═══════════════════════════════════════════════════════════════

export const BE_MARKET: AmazonMarketConfig = {
  id: "be",
  name: "BE",
  fullName: "Belgium",
  flag: "\u{1F1E7}\u{1F1EA}",
  domain: "amazon.com.be",
  currency: { code: "EUR", symbol: "\u20AC", locale: "fr-BE", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: EU_SELLER_TYPES,
  fulfillmentMethods: EU_FULFILLMENT,
  categories: EU_CATEGORIES,
  referralRules: EU_RULES,
  individualFee: 0.99,
  defaults: euDefaults(),
  seo: {
    title: withSuiteBrand("Belgium Amazon Fee Calculator"),
    description: "Calculate Amazon.com.be referral fees, FBA fulfillment fees, storage costs, and net profit for Belgian marketplace sellers.",
    h1: "Belgium Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.com.be.",
  },
  notes: [
    "Professional sellers pay \u20AC39/month. Individual sellers pay \u20AC0.99 per item.",
    "Uses Pan-European FBA fulfillment rates (same as Amazon.de).",
    "Most categories charge 15%. Electronics/Computers charge 7%.",
  ],
  ...EU_FBA_BASE,
};

// ═══════════════════════════════════════════════════════════════
// Sweden
// ═══════════════════════════════════════════════════════════════

const SE_RULES: Record<string, ReferralRule> = {
  ...EU_RULES,
};

export const SE_MARKET: AmazonMarketConfig = {
  id: "se",
  name: "SE",
  fullName: "Sweden",
  flag: "\u{1F1F8}\u{1F1EA}",
  domain: "amazon.se",
  currency: { code: "SEK", symbol: "kr", locale: "sv-SE", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (kr 395/mo)", value: "professional" },
    { label: "Individual (kr 9.90/item)", value: "individual" },
  ],
  fulfillmentMethods: EU_FULFILLMENT,
  categories: EU_CATEGORIES,
  referralRules: SE_RULES,
  individualFee: 9.90,
  defaults: {
    soldPrice: 249, shippingCharged: 0, itemCost: 80, shippingCost: 40,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: withSuiteBrand("Sweden Amazon Fee Calculator"),
    description: "Calculate Amazon.se referral fees, FBA fulfillment fees, storage costs, and net profit for Swedish marketplace sellers.",
    h1: "Sweden Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.se.",
  },
  notes: [
    "Professional sellers pay kr 395/month. Individual sellers pay kr 9.90 per item.",
    "Uses Pan-European FBA fulfillment. FBA fees charged in EUR, converted to SEK.",
    "Most categories charge 15%. Electronics/Computers charge 7%.",
  ],
  ...EU_FBA_BASE,
};

// ═══════════════════════════════════════════════════════════════
// Poland
// ═══════════════════════════════════════════════════════════════

const PL_RULES: Record<string, ReferralRule> = {
  ...EU_RULES,
};

export const PL_MARKET: AmazonMarketConfig = {
  id: "pl",
  name: "PL",
  fullName: "Poland",
  flag: "\u{1F1F5}\u{1F1F1}",
  domain: "amazon.pl",
  currency: { code: "PLN", symbol: "z\u0142", locale: "pl-PL", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (z\u0142 165.91/mo)", value: "professional" },
    { label: "Individual (z\u0142 4.18/item)", value: "individual" },
  ],
  fulfillmentMethods: EU_FULFILLMENT,
  categories: EU_CATEGORIES,
  referralRules: PL_RULES,
  individualFee: 4.18,
  defaults: {
    soldPrice: 99.99, shippingCharged: 0, itemCost: 35, shippingCost: 15,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: withSuiteBrand("Poland Amazon Fee Calculator"),
    description: "Calculate Amazon.pl referral fees, FBA fulfillment fees, storage costs, and net profit for Polish marketplace sellers.",
    h1: "Poland Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.pl.",
  },
  notes: [
    "Professional sellers pay z\u0142 165.91/month. Individual sellers pay z\u0142 4.18 per item.",
    "Uses Pan-European FBA fulfillment. FBA fees charged in EUR, converted to PLN.",
    "Most categories charge 15%. Electronics/Computers charge 7%.",
  ],
  ...EU_FBA_BASE,
};



