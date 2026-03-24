import {
  type AmazonMarketConfig, type SizeTier,
  flat, tiered, threshold, METRIC_UNITS,
} from "../amazon-config";
import { withSuiteBrand } from "@/lib/brand";

const CATEGORIES = [
  { label: "Books", value: "books" },
  { label: "CD/Record", value: "cd" },
  { label: "DVD", value: "dvd" },
  { label: "Video (VHS)", value: "video" },
  { label: "Electronics/Cameras/PCs", value: "electronics" },
  { label: "Home & Kitchen", value: "home" },
  { label: "Home Appliances", value: "appliances" },
  { label: "Food & Beverages", value: "food" },
  { label: "Health & Beauty", value: "beauty" },
  { label: "Hobby", value: "hobby" },
  { label: "Toys", value: "toys" },
  { label: "Sporting Goods", value: "sports" },
  { label: "Clothing & Accessories", value: "clothing" },
  { label: "Shoes & Bags", value: "shoes" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Watches", value: "watches" },
  { label: "Automotive", value: "automotive" },
  { label: "Baby & Maternity", value: "baby" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Office Products", value: "office" },
  { label: "DIY & Tools", value: "diy" },
  { label: "Garden & Outdoors", value: "garden" },
  { label: "Musical Instruments", value: "instruments" },
  { label: "Software", value: "software" },
  { label: "Video Games", value: "videogames" },
  { label: "Everything Else", value: "default" },
];

const RULES: Record<string, ReturnType<typeof flat>> = {
  default:      flat(15, 30),
  books:        flat(15, 0, 80),
  cd:           flat(15, 0, 140),
  dvd:          flat(15, 0, 140),
  video:        flat(15, 0, 140),
  electronics:  flat(8, 30),
  home:         flat(15, 30),
  appliances:   flat(10, 30),
  food:         threshold([[1500, 8], [Infinity, 10]], 0),
  beauty:       threshold([[1500, 8], [Infinity, 10]], 30),
  hobby:        flat(10, 30),
  toys:         flat(10, 30),
  sports:       flat(10, 30),
  clothing:     threshold([[3000, 12], [Infinity, 8]], 30),
  shoes:        threshold([[7500, 12], [Infinity, 6]], 30),
  jewelry:      threshold([[10000, 10], [Infinity, 6]], 30),
  watches:      tiered([[10000, 15], [Infinity, 5]], 30),
  automotive:   flat(10, 30),
  baby:         threshold([[1500, 8], [Infinity, 15]], 30),
  pets:         flat(15, 30),
  office:       flat(15, 30),
  diy:          flat(15, 30),
  garden:       flat(15, 30),
  instruments:  flat(10, 30),
  software:     flat(15, 0, 80),
  videogames:   flat(15, 0),
};

function classifySizeTier(weightKg: number, length: number, width: number, height: number): SizeTier {
  const dims = [length, width, height].sort((a, b) => b - a);
  const [longest, median, shortest] = dims;

  if (weightKg <= 0.25 && longest <= 25 && median <= 18 && shortest <= 2.0) return "small_standard";
  if (weightKg <= 9 && longest <= 45 && median <= 35 && shortest <= 20) return "large_standard";
  if (weightKg <= 40 && longest <= 100 && (longest + 2 * (median + shortest)) <= 200) return "small_oversize";
  if (weightKg <= 50 && longest <= 200 && (longest + 2 * (median + shortest)) <= 360) return "medium_oversize";
  return "large_oversize";
}

function calcFbaFulfillmentFee(sizeTier: SizeTier, shippingWeightKg: number, _isApparel: boolean, _isDG: boolean): number {
  const g = shippingWeightKg * 1000;

  if (sizeTier === "small_standard") {
    if (g <= 100) return 288; if (g <= 200) return 318; return 350;
  }
  if (sizeTier === "large_standard") {
    if (g <= 250) return 381; if (g <= 500) return 434; if (g <= 1000) return 514;
    if (g <= 2000) return 603; if (g <= 5000) return 712; return 712 + 40 * Math.ceil((shippingWeightKg - 5));
  }
  if (sizeTier === "small_oversize") {
    return 589 + 52 * Math.max(Math.ceil(shippingWeightKg - 2), 0);
  }
  if (sizeTier === "medium_oversize") {
    return 589 + 52 * Math.max(Math.ceil(shippingWeightKg - 2), 0);
  }
  return 589 + 52 * Math.max(Math.ceil(shippingWeightKg - 2), 0);
}

function calcFbaStorageFee(cubicM: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize
    ? (isQ4 ? 7800 : 3900)
    : (isQ4 ? 9170 : 5160);
  return cubicM * rate * months;
}

export const JP_MARKET: AmazonMarketConfig = {
  id: "jp",
  name: "JP",
  fullName: "Japan",
  flag: "\u{1F1EF}\u{1F1F5}",
  domain: "amazon.co.jp",
  currency: { code: "JPY", symbol: "\u00A5", locale: "ja-JP", decimals: 0 },
  units: METRIC_UNITS,
  sellerTypes: [
    { label: "Professional (\u00A54,900/mo)", value: "professional" },
    { label: "Individual (\u00A5100/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: CATEGORIES,
  referralRules: RULES,
  individualFee: 100,
  defaults: {
    soldPrice: 2980, shippingCharged: 0, itemCost: 1000, shippingCost: 500,
    weightMajor: 0, weightMinor: 500, dimensionLength: 25, dimensionWidth: 20, dimensionHeight: 5,
  },
  seo: {
    title: withSuiteBrand("Japan Amazon Fee Calculator"),
    description: "Calculate Amazon.co.jp referral fees, FBA fulfillment fees, storage costs, and net profit for Japan marketplace sellers.",
    h1: "Japan Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.co.jp.",
  },
  notes: [
    "Professional sellers pay \u00A54,900/month. Individual sellers pay \u00A5100 per item.",
    "Media categories (Books, CD, DVD, Video, Software) incur a variable closing fee (\u00A580\u2013\u00A5140).",
    "Electronics and Cameras charge 8%. Most categories charge 10\u201315%.",
    "FBA storage: standard \u00A55,160/cbm (Jan\u2013Sep), \u00A59,170/cbm (Oct\u2013Dec).",
  ],
  classifySizeTier,
  calcFbaFulfillmentFee,
  calcFbaStorageFee,
  dimWeightDivisor: 5000,
  cubicDivisor: 1000000,
};



