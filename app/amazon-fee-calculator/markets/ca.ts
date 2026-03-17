import {
  type AmazonMarketConfig, type SizeTier,
  flat, tiered, threshold, IMPERIAL_UNITS,
} from "../amazon-config";

const CATEGORIES = [
  { label: "Automotive & Powersports", value: "automotive" },
  { label: "Baby Products", value: "baby" },
  { label: "Beauty & Health", value: "beauty" },
  { label: "Books", value: "books" },
  { label: "Business & Industrial", value: "business" },
  { label: "Clothing & Accessories", value: "clothing" },
  { label: "Computers", value: "computers" },
  { label: "Consumer Electronics", value: "electronics" },
  { label: "Electronics Accessories", value: "elec_accessories" },
  { label: "Everything Else", value: "default" },
  { label: "Footwear", value: "footwear" },
  { label: "Furniture", value: "furniture" },
  { label: "Gift Cards", value: "gift_cards" },
  { label: "Grocery & Gourmet", value: "grocery" },
  { label: "Handmade", value: "handmade" },
  { label: "Home & Kitchen", value: "home" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Luggage & Bags", value: "bags" },
  { label: "Media \u2013 Books", value: "media_books" },
  { label: "Media \u2013 DVD", value: "dvd" },
  { label: "Media \u2013 Music", value: "music" },
  { label: "Media \u2013 Video", value: "video" },
  { label: "Musical Instruments", value: "instruments" },
  { label: "Office Products", value: "office" },
  { label: "Outdoors", value: "outdoors" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Sports & Outdoors", value: "sports" },
  { label: "Tools & Home Improvement", value: "tools" },
  { label: "Toys & Games", value: "toys" },
  { label: "Video Games & Consoles", value: "videogames" },
  { label: "Watches", value: "watches" },
];

const RULES: Record<string, ReturnType<typeof flat>> = {
  default:          flat(15, 0.30),
  automotive:       flat(12, 0.30),
  baby:             threshold([[10, 8], [Infinity, 15]], 0.30),
  beauty:           threshold([[10, 8], [Infinity, 15]], 0.30),
  books:            flat(15, 0, 1.80),
  business:         flat(12, 0.30),
  clothing:         flat(15, 0.30),
  computers:        flat(8, 0.30),
  electronics:      flat(8, 0.30),
  elec_accessories: tiered([[100, 15], [Infinity, 8]], 0.30),
  footwear:         flat(15, 0.30),
  furniture:        tiered([[200, 15], [Infinity, 10]], 0.30),
  gift_cards:       flat(20, 0),
  grocery:          threshold([[15, 8], [Infinity, 15]], 0),
  handmade:         flat(12, 0.30),
  home:             flat(15, 0.30),
  jewelry:          tiered([[250, 20], [Infinity, 5]], 0.30),
  kitchen:          flat(15, 0.30),
  bags:             flat(15, 0.30),
  media_books:      flat(15, 0, 1.80),
  dvd:              flat(15, 0, 1.80),
  music:            flat(15, 0, 1.80),
  video:            flat(15, 0, 1.80),
  instruments:      flat(15, 0.30),
  office:           flat(15, 0.30),
  outdoors:         flat(15, 0.30),
  pets:             flat(15, 0.30),
  sports:           flat(15, 0.30),
  tools:            flat(15, 0.30),
  toys:             flat(15, 0.30),
  videogames:       flat(15, 0),
  watches:          tiered([[1500, 16], [Infinity, 3]], 0.30),
};

function classifySizeTier(weightLb: number, length: number, width: number, height: number): SizeTier {
  const dims = [length, width, height].sort((a, b) => b - a);
  const [longest, median, shortest] = dims;
  const girth = 2 * (median + shortest);
  const lpg = longest + girth;

  if (weightLb <= 0.75 && longest <= 15 && median <= 12 && shortest <= 0.75) return "small_standard";
  if (weightLb <= 20 && longest <= 18 && median <= 14 && shortest <= 8) return "large_standard";
  if (weightLb <= 70 && longest <= 60 && median <= 30 && lpg <= 130) return "small_oversize";
  if (weightLb <= 150 && longest <= 108 && lpg <= 130) return "medium_oversize";
  if (weightLb <= 150 && longest <= 108 && lpg <= 165) return "large_oversize";
  return "special_oversize";
}

function calcFbaFulfillmentFee(sizeTier: SizeTier, shippingWeightLb: number, isApparel: boolean, _isDG: boolean): number {
  const oz = shippingWeightLb * 16;

  if (sizeTier === "small_standard") {
    if (isApparel) {
      if (oz <= 4) return 3.98; if (oz <= 8) return 4.11; if (oz <= 12) return 4.40; return 4.68;
    }
    if (oz <= 4) return 3.70; if (oz <= 8) return 3.86; if (oz <= 12) return 4.04; return 4.23;
  }

  if (sizeTier === "large_standard") {
    const w = shippingWeightLb;
    if (isApparel) {
      if (oz <= 4) return 4.98; if (oz <= 8) return 5.18; if (oz <= 12) return 5.43; if (oz <= 16) return 5.87;
      if (w <= 1.5) return 6.65; if (w <= 2) return 6.92; if (w <= 2.5) return 7.40; if (w <= 3) return 7.65;
      return 8.51 + 0.16 * Math.ceil((w - 3) * 2);
    }
    if (oz <= 4) return 4.41; if (oz <= 8) return 4.63; if (oz <= 12) return 4.79; if (oz <= 16) return 5.30;
    if (w <= 1.5) return 5.95; if (w <= 2) return 6.24; if (w <= 2.5) return 6.65; if (w <= 3) return 6.94;
    return 7.72 + 0.16 * Math.ceil((w - 3) * 2);
  }

  if (sizeTier === "small_oversize") return 10.86 + 0.42 * Math.max(shippingWeightLb - 1, 0);
  if (sizeTier === "medium_oversize") return 21.07 + 0.42 * Math.max(shippingWeightLb - 1, 0);
  if (sizeTier === "large_oversize") return 96.69 + 0.83 * Math.max(shippingWeightLb - 90, 0);
  return 169.88 + 0.83 * Math.max(shippingWeightLb - 90, 0);
}

function calcFbaStorageFee(cubicFeet: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 1.40 : 0.56) : (isQ4 ? 2.40 : 0.87);
  return cubicFeet * rate * months;
}

export const CA_MARKET: AmazonMarketConfig = {
  id: "ca",
  name: "CA",
  fullName: "Canada",
  flag: "\u{1F1E8}\u{1F1E6}",
  domain: "amazon.ca",
  currency: { code: "CAD", symbol: "C$", locale: "en-CA", decimals: 2 },
  units: IMPERIAL_UNITS,
  sellerTypes: [
    { label: "Professional (C$29.99/mo)", value: "professional" },
    { label: "Individual (C$1.49/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: CATEGORIES,
  referralRules: RULES,
  individualFee: 1.49,
  defaults: {
    soldPrice: 39.99, shippingCharged: 0, itemCost: 14, shippingCost: 7,
    weightMajor: 1, weightMinor: 0, dimensionLength: 10, dimensionWidth: 8, dimensionHeight: 2,
  },
  seo: {
    title: "Canada Amazon Fee Calculator | SellerLab",
    description: "Calculate Amazon.ca referral fees, FBA fulfillment fees, storage costs, and net profit for Canadian marketplace sellers.",
    h1: "Canada Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.ca.",
  },
  notes: [
    "Professional sellers pay C$29.99/month. Individual sellers pay C$1.49 per item.",
    "FBA fulfillment fees are based on product size tier and shipping weight (imperial units).",
    "FBA storage fees: standard C$0.87/cu ft (Jan\u2013Sep), C$2.40/cu ft (Oct\u2013Dec).",
    "Most categories charge 15%. Electronics/Computers charge 8%.",
    "Media categories incur an additional C$1.80 closing fee.",
  ],
  classifySizeTier,
  calcFbaFulfillmentFee,
  calcFbaStorageFee,
  dimWeightDivisor: 139,
  cubicDivisor: 1728,
};
