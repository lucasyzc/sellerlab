import {
  type AmazonMarketConfig, type SizeTier,
  flat, tiered, threshold, IMPERIAL_UNITS,
} from "../amazon-config";
import { withSuiteBrand } from "@/lib/brand";

const CATEGORIES = [
  { label: "Amazon Device Accessories", value: "device_accessories" },
  { label: "Automotive & Powersports", value: "automotive" },
  { label: "Baby Products", value: "baby" },
  { label: "Backpacks, Handbags & Luggage", value: "bags" },
  { label: "Base Equipment Power Tools", value: "power_tools" },
  { label: "Beauty, Health & Personal Care", value: "beauty" },
  { label: "Books", value: "books" },
  { label: "Business, Industrial & Scientific", value: "business" },
  { label: "Clothing & Accessories", value: "clothing" },
  { label: "Collectible Coins", value: "coins" },
  { label: "Compact Appliances", value: "compact_appliances" },
  { label: "Computers", value: "computers" },
  { label: "Consumer Electronics", value: "electronics" },
  { label: "DVDs & Blu-ray", value: "dvd" },
  { label: "Electronics Accessories", value: "elec_accessories" },
  { label: "Everything Else", value: "default" },
  { label: "Fine Art", value: "fine_art" },
  { label: "Footwear", value: "footwear" },
  { label: "Full-Size Appliances", value: "full_appliances" },
  { label: "Furniture", value: "furniture" },
  { label: "Gift Cards", value: "gift_cards" },
  { label: "Grocery & Gourmet Food", value: "grocery" },
  { label: "Handmade", value: "handmade" },
  { label: "Home & Kitchen", value: "home" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Lawn & Garden", value: "lawn_garden" },
  { label: "Lawn Mowers & Snow Throwers", value: "lawn_mowers" },
  { label: "Mattresses", value: "mattresses" },
  { label: "Media \u2013 Music", value: "music" },
  { label: "Media \u2013 Software", value: "software" },
  { label: "Media \u2013 Video", value: "video" },
  { label: "Musical Instruments & AV Production", value: "instruments" },
  { label: "Office Products", value: "office" },
  { label: "Outdoors", value: "outdoors" },
  { label: "Personal Computers", value: "personal_computers" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Sports & Outdoors", value: "sports" },
  { label: "Sports Collectibles", value: "sports_collectibles" },
  { label: "Tires", value: "tires" },
  { label: "Tools & Home Improvement", value: "tools" },
  { label: "Toys & Games", value: "toys" },
  { label: "Video Game Consoles", value: "game_consoles" },
  { label: "Video Games & Gaming Accessories", value: "videogames" },
  { label: "Watches", value: "watches" },
];

const RULES: Record<string, ReturnType<typeof flat>> = {
  default:            flat(15, 0.30),
  device_accessories: flat(45, 0.30),
  automotive:         flat(12, 0.30),
  baby:               threshold([[10, 8], [Infinity, 15]], 0.30),
  bags:               flat(15, 0.30),
  power_tools:        flat(12, 0.30),
  beauty:             threshold([[10, 8], [Infinity, 15]], 0.30),
  books:              flat(15, 0, 1.80),
  business:           flat(12, 0.30),
  clothing:           flat(17, 0.30),
  coins:              flat(15, 0.30),
  compact_appliances: tiered([[300, 15], [Infinity, 8]], 0.30),
  computers:          flat(8, 0.30),
  electronics:        flat(8, 0.30),
  dvd:                flat(15, 0, 1.80),
  elec_accessories:   tiered([[100, 15], [Infinity, 8]], 0.30),
  fine_art:           tiered([[100, 20], [1000, 15], [5000, 10], [Infinity, 5]], 0),
  footwear:           flat(15, 0.30),
  full_appliances:    flat(8, 0.30),
  furniture:          tiered([[200, 15], [Infinity, 10]], 0.30),
  gift_cards:         flat(20, 0),
  grocery:            threshold([[15, 8], [Infinity, 15]], 0),
  handmade:           flat(15, 0.30),
  home:               flat(15, 0.30),
  jewelry:            tiered([[250, 20], [Infinity, 5]], 0.30),
  kitchen:            flat(15, 0.30),
  lawn_garden:        flat(15, 0.30),
  lawn_mowers:        tiered([[500, 15], [Infinity, 8]], 0.30),
  mattresses:         flat(15, 0.30),
  music:              flat(15, 0, 1.80),
  software:           flat(15, 0, 1.80),
  video:              flat(15, 0, 1.80),
  instruments:        flat(15, 0.30),
  office:             flat(15, 0.30),
  outdoors:           flat(15, 0.30),
  personal_computers: flat(8, 0.30),
  pets:               flat(15, 0.30),
  sports:             flat(15, 0.30),
  sports_collectibles: flat(15, 0.30),
  tires:              flat(10, 0.30),
  tools:              flat(15, 0.30),
  toys:               flat(15, 0.30),
  game_consoles:      flat(8, 0),
  videogames:         flat(15, 0),
  watches:            tiered([[1500, 16], [Infinity, 3]], 0.30),
};

function classifySizeTier(weightLb: number, length: number, width: number, height: number): SizeTier {
  const dims = [length, width, height].sort((a, b) => b - a);
  const [longest, median, shortest] = dims;
  const girth = 2 * (median + shortest);
  const lpg = longest + girth;

  if (weightLb <= 1 && longest <= 15 && median <= 12 && shortest <= 0.75) return "small_standard";
  if (weightLb <= 20 && longest <= 18 && median <= 14 && shortest <= 8) return "large_standard";
  if (weightLb <= 70 && longest <= 60 && median <= 30 && lpg <= 130) return "small_oversize";
  if (weightLb <= 150 && longest <= 108 && lpg <= 130) return "medium_oversize";
  if (weightLb <= 150 && longest <= 108 && lpg <= 165) return "large_oversize";
  return "special_oversize";
}

function calcFbaFulfillmentFee(sizeTier: SizeTier, shippingWeightLb: number, isApparel: boolean, isDG: boolean): number {
  const oz = shippingWeightLb * 16;

  if (sizeTier === "small_standard") {
    if (isDG) {
      if (oz <= 4) return 3.72; if (oz <= 8) return 3.90; if (oz <= 12) return 4.08; return 4.27;
    }
    if (isApparel) {
      if (oz <= 4) return 3.43; if (oz <= 8) return 3.58; if (oz <= 12) return 3.87; return 4.15;
    }
    if (oz <= 4) return 3.22; if (oz <= 8) return 3.40; if (oz <= 12) return 3.58; return 3.77;
  }

  if (sizeTier === "large_standard") {
    const w = shippingWeightLb;
    if (isDG) {
      if (oz <= 4) return 4.36; if (oz <= 8) return 4.58; if (oz <= 12) return 4.74; if (oz <= 16) return 5.25;
      if (w <= 1.5) return 5.90; if (w <= 2) return 6.19; if (w <= 2.5) return 6.60; if (w <= 3) return 6.89;
      return 7.67 + 0.16 * Math.ceil((w - 3) * 2);
    }
    if (isApparel) {
      if (oz <= 4) return 4.43; if (oz <= 8) return 4.63; if (oz <= 12) return 4.88; if (oz <= 16) return 5.32;
      if (w <= 1.5) return 6.10; if (w <= 2) return 6.37; if (w <= 2.5) return 6.85; if (w <= 3) return 7.10;
      return 7.96 + 0.16 * Math.ceil((w - 3) * 2);
    }
    if (oz <= 4) return 3.86; if (oz <= 8) return 4.08; if (oz <= 12) return 4.24; if (oz <= 16) return 4.75;
    if (w <= 1.5) return 5.40; if (w <= 2) return 5.69; if (w <= 2.5) return 6.10; if (w <= 3) return 6.39;
    return 7.17 + 0.16 * Math.ceil((w - 3) * 2);
  }

  if (sizeTier === "small_oversize") return 9.73 + 0.42 * Math.max(shippingWeightLb - 1, 0);
  if (sizeTier === "medium_oversize") return 19.05 + 0.42 * Math.max(shippingWeightLb - 1, 0);
  if (sizeTier === "large_oversize") return 89.98 + 0.83 * Math.max(shippingWeightLb - 90, 0);
  return 158.49 + 0.83 * Math.max(shippingWeightLb - 90, 0);
}

function calcFbaStorageFee(cubicFeet: number, months: number, month: number, isOversize: boolean): number {
  const isQ4 = month >= 10 && month <= 12;
  const rate = isOversize ? (isQ4 ? 1.40 : 0.56) : (isQ4 ? 2.40 : 0.87);
  return cubicFeet * rate * months;
}

export const US_MARKET: AmazonMarketConfig = {
  id: "us",
  name: "US",
  fullName: "United States",
  flag: "\u{1F1FA}\u{1F1F8}",
  domain: "amazon.com",
  currency: { code: "USD", symbol: "$", locale: "en-US", decimals: 2 },
  units: IMPERIAL_UNITS,
  sellerTypes: [
    { label: "Professional ($39.99/mo)", value: "professional" },
    { label: "Individual ($0.99/item)", value: "individual" },
  ],
  fulfillmentMethods: [
    { label: "FBA (Fulfilled by Amazon)", value: "fba" },
    { label: "FBM (Fulfilled by Merchant)", value: "fbm" },
  ],
  categories: CATEGORIES,
  referralRules: RULES,
  individualFee: 0.99,
  defaults: {
    soldPrice: 29.99, shippingCharged: 0, itemCost: 10, shippingCost: 5,
    weightMajor: 1, weightMinor: 0, dimensionLength: 10, dimensionWidth: 8, dimensionHeight: 2,
  },
  seo: {
    title: withSuiteBrand("US Amazon Fee Calculator"),
    description: "Calculate Amazon.com referral fees, FBA fulfillment fees, storage costs, and net profit for US sellers. Accurate rates for 45+ categories.",
    h1: "US Amazon Fee Calculator",
    subtitle: "Calculate referral fees, FBA costs & profit when selling on Amazon.com. Rates updated as of 2025.",
  },
  notes: [
    "Professional sellers pay a $39.99 monthly subscription but no per-item fee. Individual sellers pay $0.99 per item sold.",
    "FBA fulfillment fees are based on the product\u2019s size tier and shipping weight. Apparel and dangerous goods have higher rates.",
    "FBA storage fees vary by season: standard-size items cost $0.87/cu ft (Jan\u2013Sep) and $2.40/cu ft (Oct\u2013Dec).",
    "Referral fee rates vary by category from 8% to 45%. Most categories charge 15%.",
    "Media categories (Books, DVDs, Music, Software, Video) incur an additional $1.80 variable closing fee per item.",
  ],
  classifySizeTier,
  calcFbaFulfillmentFee: calcFbaFulfillmentFee,
  calcFbaStorageFee: calcFbaStorageFee,
  dimWeightDivisor: 139,
  cubicDivisor: 1728,
};



