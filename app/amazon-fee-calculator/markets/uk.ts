import {
  type AmazonMarketConfig, type SizeTier,
  flat, tiered, threshold, METRIC_UNITS,
} from "../amazon-config";
import { withSuiteBrand } from "@/lib/brand";

const CATEGORIES = [
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
  { label: "Grocery", value: "grocery" },
  { label: "Handmade", value: "handmade" },
  { label: "Home & Kitchen", value: "home" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Kitchen & Dining", value: "kitchen" },
  { label: "Large Appliances", value: "large_appliances" },
  { label: "Lighting", value: "lighting" },
  { label: "Luggage & Bags", value: "bags" },
  { label: "Media \u2013 Music", value: "music" },
  { label: "Media \u2013 Software", value: "software" },
  { label: "Media \u2013 Video", value: "video" },
  { label: "Musical Instruments", value: "instruments" },
  { label: "Office Products", value: "office" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Sports & Outdoors", value: "sports" },
  { label: "Toys & Games", value: "toys" },
  { label: "Video Games & Consoles", value: "videogames" },
  { label: "Watches", value: "watches" },
];

const RULES: Record<string, ReturnType<typeof flat>> = {
  default:          flat(15, 0.25),
  automotive:       flat(15, 0.25),
  baby:             threshold([[10, 8], [Infinity, 15]], 0.25),
  beauty:           threshold([[10, 8], [Infinity, 15]], 0.25),
  books:            flat(15, 0, 0.50),
  business:         flat(15, 0.25),
  clothing:         flat(15, 0.25),
  computers:        flat(7, 0.25),
  electronics:      flat(7, 0.25),
  diy:              flat(12, 0.25),
  dvd:              flat(15, 0, 0.50),
  elec_accessories: tiered([[100, 15], [Infinity, 8]], 0.25),
  footwear:         flat(15, 0.25),
  furniture:        tiered([[200, 15], [Infinity, 10]], 0.25),
  garden:           flat(15, 0.25),
  grocery:          threshold([[10, 8], [Infinity, 15]], 0),
  handmade:         flat(12, 0.25),
  home:             flat(15, 0.25),
  jewelry:          tiered([[250, 20], [Infinity, 5]], 0.25),
  kitchen:          flat(15, 0.25),
  large_appliances: flat(7, 0.25),
  lighting:         flat(15, 0.25),
  bags:             flat(15, 0.25),
  music:            flat(15, 0, 0.50),
  software:         flat(15, 0, 0.50),
  video:            flat(15, 0, 0.50),
  instruments:      flat(15, 0.25),
  office:           flat(15, 0.25),
  pets:             flat(15, 0.25),
  sports:           flat(15, 0.25),
  toys:             flat(15, 0.25),
  videogames:       flat(15, 0),
  watches:          tiered([[250, 15], [Infinity, 5]], 0.25),
};

function classifySizeTier(weightKg: number, length: number, width: number, height: number): SizeTier {
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

function calcFbaFulfillmentFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;

  if (sizeTier === "envelope") return 1.58;
  if (sizeTier === "small_standard") {
    if (g <= 60) return 1.84; if (g <= 210) return 2.08; if (g <= 460) return 2.35; return 2.62;
  }
  if (sizeTier === "large_standard") {
    if (g <= 150) return 2.75; if (g <= 400) return 2.93; if (g <= 900) return 3.33;
    if (g <= 1800) return 3.85; if (g <= 2700) return 4.47; if (g <= 3500) return 4.99;
    if (g <= 5000) return 5.52; if (g <= 7000) return 5.87; if (g <= 9000) return 6.32;
    return 6.98 + 0.29 * Math.max(Math.ceil(shippingWeightKg - 9), 0);
  }
  if (sizeTier === "small_oversize") {
    if (g <= 760) return 5.62; if (g <= 1260) return 5.91; if (g <= 1760) return 6.64;
    if (g <= 7000) return 7.03; return 7.03 + 0.29 * Math.max(Math.ceil(shippingWeightKg - 7), 0);
  }
  if (sizeTier === "medium_oversize") {
    if (g <= 760) return 6.37; if (g <= 1760) return 7.31;
    if (g <= 6000) return 9.65; if (g <= 12000) return 11.85;
    return 11.85 + 0.38 * Math.max(Math.ceil(shippingWeightKg - 12), 0);
  }
  if (sizeTier === "large_oversize") {
    return 17.99 + 0.47 * Math.max(Math.ceil(shippingWeightKg - 15), 0);
  }
  return 21.98 + 0.47 * Math.max(Math.ceil(shippingWeightKg - 15), 0);
}

function calcFbaStorageFee(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 21.26 : 14.17) : (isQ4 ? 30.36 : 20.24);
  return cubicM * rate * months;
}

export const UK_MARKET: AmazonMarketConfig = {
  id: "uk",
  name: "UK",
  fullName: "United Kingdom",
  flag: "\u{1F1EC}\u{1F1E7}",
  domain: "amazon.co.uk",
  currency: { code: "GBP", symbol: "\u00A3", locale: "en-GB", decimals: 2 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (\u00A325/mo)", value: "professional" },
    { label: "Individual (\u00A30.75/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: CATEGORIES,
  referralRules: RULES,
  individualFee: 0.75,
  defaults: {
    soldPrice: 19.99, shippingCharged: 0, itemCost: 7, shippingCost: 3,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: withSuiteBrand("UK Amazon Fee Calculator"),
    description: "Calculate Amazon.co.uk referral fees, FBA fulfillment fees, storage costs, and net profit for UK sellers.",
    h1: "UK Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.co.uk.",
  },
  notes: [
    "Professional sellers pay \u00A325/month. Individual sellers pay \u00A30.75 per item sold.",
    "FBA fees are based on product size tier and weight. UK uses metric units (cm/kg).",
    "Media categories (Books, DVDs, Music, Software, Video) incur a \u00A30.50 variable closing fee.",
    "Most categories charge 15% referral fee. Electronics and Computers charge 7%.",
  ],
  classifySizeTier,
  calcFbaFulfillmentFee,
  calcFbaStorageFee,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};



