export type MarketId = "us" | "uk" | "de" | "au" | "ca" | "fr" | "it";

export type FeeRule = {
  calcType: "tiered" | "threshold";
  tiers: Array<{ upTo: number; rate: number }>;
  perOrderFee: number;
  checkSoldPriceOnly?: boolean;
  waivePerOrderFeeOnHigherTier?: boolean;
};

export type SubCat = { label: string; value: string };
export type Cat = { label: string; value: string; subs?: SubCat[] };

export type MarketConfig = {
  id: MarketId;
  name: string;
  fullName: string;
  siteName: string;
  flag: string;
  domain: string;
  currency: { code: string; symbol: string; locale: string };
  storeTypes: Array<{ label: string; value: string }>;
  storeLabel: string;
  categories: Cat[];
  rules: Record<string, FeeRule>;
  feeGroup: (storeType: string) => string;
  paymentProcessing: { rate: number; fixedFee: number; label: string } | null;
  internationalFeeRate: number;
  internationalLabel: string;
  internationalDestinations?: Array<{ label: string; value: string; rate: number }>;
  internationalFeeOverride?: (storeType: string) => number | null;
  regulatoryFee: { rate: number; label: string } | null;
  regulatoryFeeExempt?: (storeType: string) => boolean;
  topRatedDiscount: number;
  topRatedLabel: string;
  taxLabel: string;
  perOrderFeeByAmount?: { threshold: number; below: number };
  fvfCap?: (storeType: string) => number | null;
  defaults: { soldPrice: number; shippingCharged: number; itemCost: number; shippingCost: number };
  seo: { title: string; description: string; h1: string; subtitle: string };
  notes: string[];
};

export type FormState = {
  storeType: string;
  category: string;
  subCategory: string;
  soldPrice: number;
  shippingCharged: number;
  actualShippingCost: number;
  itemCost: number;
  otherCosts: number;
  taxRate: number;
  isTopRated: boolean;
  isInternational: boolean;
  internationalDestination: string;
  adRate: number;
};

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function mkT(tiers: Array<[number, number]>, fee: number): FeeRule {
  return { calcType: "tiered", tiers: tiers.map(([upTo, rate]) => ({ upTo, rate })), perOrderFee: fee };
}

function mkTh(
  tiers: Array<[number, number]>,
  fee: number,
  opts?: { sp?: boolean; w?: boolean }
): FeeRule {
  return {
    calcType: "threshold",
    tiers: tiers.map(([upTo, rate]) => ({ upTo, rate })),
    perOrderFee: fee,
    checkSoldPriceOnly: opts?.sp,
    waivePerOrderFeeOnHigherTier: opts?.w,
  };
}

function d(rules: Record<string, FeeRule>, g: string, c: string, sc: string, rule: FeeRule) {
  rules[`${g}:${c}:${sc}`] = rule;
}

// ═══════════════════════════════════════════════════════════════
// Calculation
// ═══════════════════════════════════════════════════════════════

export function lookupRule(config: MarketConfig, storeType: string, cat: string, sub: string): FeeRule {
  const g = config.feeGroup(storeType);
  return config.rules[`${g}:${cat}:${sub}`] ?? config.rules[`${g}:${cat}:*`] ?? config.rules[`${g}:*:*`];
}

function calcTiered(amount: number, tiers: FeeRule["tiers"]): number {
  let fee = 0, prev = 0;
  for (const { upTo, rate } of tiers) {
    const portion = Math.min(Math.max(amount - prev, 0), upTo === Infinity ? Infinity : upTo - prev);
    fee += portion * (rate / 100);
    prev = upTo;
    if (prev >= amount) break;
  }
  return fee;
}

export type CalcResult = {
  saleAmt: number;
  tax: number;
  totalWithTax: number;
  fvfBase: number;
  perOrder: number;
  trsDiscount: number;
  fvf: number;
  fvfCapped: boolean;
  mpFee: number;
  intlFee: number;
  intlRate: number;
  regFee: number;
  adFee: number;
  totalFees: number;
  revenue: number;
  netProfit: number;
  margin: number;
  rule: FeeRule;
};

export function calculate(f: FormState, config: MarketConfig): CalcResult {
  const rule = lookupRule(config, f.storeType, f.category, f.subCategory);
  const saleAmt = f.soldPrice + f.shippingCharged;
  const tax = saleAmt * (f.taxRate / 100);
  const totalWithTax = saleAmt + tax;

  let fvfBase: number;
  if (rule.calcType === "tiered") {
    fvfBase = calcTiered(saleAmt, rule.tiers);
  } else {
    const checkAmt = rule.checkSoldPriceOnly ? f.soldPrice : saleAmt;
    const tier = rule.tiers.find(t => checkAmt <= t.upTo) ?? rule.tiers[rule.tiers.length - 1];
    fvfBase = saleAmt * (tier.rate / 100);
  }

  let fvfCapped = false;
  if (config.fvfCap) {
    const cap = config.fvfCap(f.storeType);
    if (cap !== null && fvfBase > cap) {
      fvfBase = cap;
      fvfCapped = true;
    }
  }

  let perOrder = rule.perOrderFee;
  if (config.perOrderFeeByAmount && rule.perOrderFee > 0 && saleAmt <= config.perOrderFeeByAmount.threshold) {
    perOrder = config.perOrderFeeByAmount.below;
  }
  if (rule.waivePerOrderFeeOnHigherTier && rule.calcType === "threshold") {
    const checkAmt = rule.checkSoldPriceOnly ? f.soldPrice : saleAmt;
    if (rule.tiers.findIndex(t => checkAmt <= t.upTo) > 0) perOrder = 0;
  }

  const trsDiscount = f.isTopRated ? fvfBase * config.topRatedDiscount : 0;
  let fvf = fvfBase - trsDiscount + perOrder;

  const mpFee = config.paymentProcessing
    ? totalWithTax * config.paymentProcessing.rate + config.paymentProcessing.fixedFee
    : 0;

  let intlRate = config.internationalFeeRate;
  const rateOverride = config.internationalFeeOverride?.(f.storeType) ?? null;
  if (rateOverride !== null) {
    intlRate = rateOverride;
  } else if (config.internationalDestinations && f.internationalDestination) {
    const dest = config.internationalDestinations.find(d => d.value === f.internationalDestination);
    if (dest) intlRate = dest.rate;
  }
  const intlFee = f.isInternational ? saleAmt * intlRate : 0;

  const regExempt = config.regulatoryFeeExempt?.(f.storeType) ?? false;
  const regFee = config.regulatoryFee && !regExempt ? saleAmt * config.regulatoryFee.rate : 0;
  const adFee = totalWithTax * (f.adRate / 100);

  const totalFees = fvf + mpFee + intlFee + regFee + adFee;
  const revenue = saleAmt;
  const netProfit = revenue - f.itemCost - f.actualShippingCost - f.otherCosts - totalFees;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return { saleAmt, tax, totalWithTax, fvfBase, perOrder, trsDiscount, fvf, fvfCapped, mpFee, intlFee, intlRate, regFee, adFee, totalFees, revenue, netProfit, margin, rule };
}

export function formatCurrency(value: number, config: MarketConfig): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat(config.currency.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  const sign = value < 0 ? "\u2212" : "";
  return `${sign}${config.currency.symbol}${formatted}`;
}

export function describeRule(rule: FeeRule, symbol: string): string {
  if (rule.calcType === "tiered") {
    return rule.tiers
      .map(t => t.upTo === Infinity ? `${t.rate}% above` : `${t.rate}% up to ${symbol}${t.upTo.toLocaleString()}`)
      .join(" → ");
  }
  return rule.tiers
    .map(t => t.upTo === Infinity ? `${t.rate}% above` : `≤ ${symbol}${t.upTo.toLocaleString()}: ${t.rate}%`)
    .join(" → ");
}

// ═══════════════════════════════════════════════════════════════
// Shared Constants
// ═══════════════════════════════════════════════════════════════

const STD_STORE_TYPES = [
  { label: "No Store", value: "none" },
  { label: "Starter Store", value: "starter" },
  { label: "Basic Store", value: "basic" },
  { label: "Premium Store", value: "premium" },
  { label: "Anchor Store", value: "anchor" },
  { label: "Enterprise Store", value: "enterprise" },
];

const EU_SELLER_TYPES = [
  { label: "Private Seller", value: "private" },
  { label: "Business Seller", value: "business" },
];

const stdFeeGroup = (st: string) => st === "none" || st === "starter" ? "ns" : "st";
const euFeeGroup = (st: string) => st === "private" ? "prv" : "com";
const ukFeeGroup = (st: string) => st === "private" ? "prv" : "biz";

const UK_STORE_TYPES = [
  { label: "Private Seller (UK-based)", value: "private" },
  { label: "Business - No Shop", value: "none" },
  { label: "Business - Basic Shop", value: "basic" },
  { label: "Business - Featured Shop", value: "featured" },
  { label: "Business - Anchor Shop", value: "anchor" },
];

const EN_CATEGORIES: Cat[] = [
  { label: "Everything Else", value: "default" },
  { label: "Antiques", value: "antiques" },
  { label: "Art", value: "art" },
  { label: "Baby", value: "baby" },
  { label: "Books & Magazines", value: "books" },
  {
    label: "Business & Industrial",
    value: "business",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Heavy Equipment / Printing Presses / Food Trucks", value: "heavy" },
    ],
  },
  {
    label: "Clothing, Shoes & Accessories",
    value: "clothing",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Athletic Shoes (Men's & Women's)", value: "athletic_shoes" },
      { label: "Women's Bags & Handbags", value: "womens_bags" },
    ],
  },
  {
    label: "Coins & Paper Money",
    value: "coins",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Bullion", value: "bullion" },
    ],
  },
  { label: "Collectibles", value: "collectibles" },
  {
    label: "Computers/Tablets & Networking",
    value: "computers",
    subs: [
      { label: "Accessories & Peripherals", value: "accessories" },
      { label: "Laptops, Desktops, Monitors, CPUs, RAM", value: "core" },
      { label: "Everything Else", value: "else" },
    ],
  },
  {
    label: "Consumer Electronics",
    value: "electronics",
    subs: [
      { label: "Accessories, Batteries & Parts", value: "accessories" },
      { label: "Everything Else", value: "else" },
    ],
  },
  { label: "Crafts", value: "crafts" },
  { label: "Dolls & Bears", value: "dolls" },
  {
    label: "eBay Motors (Parts & Accessories)",
    value: "motors",
    subs: [
      { label: "Automotive Tools & Parts", value: "tools" },
      { label: "Tires", value: "tires" },
      { label: "In-Car Technology & GPS", value: "gps" },
    ],
  },
  { label: "Entertainment Memorabilia", value: "entertainment" },
  { label: "Health & Beauty", value: "health" },
  { label: "Home & Garden", value: "home" },
  {
    label: "Jewelry & Watches",
    value: "jewelry",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Watches, Parts & Accessories", value: "watches" },
    ],
  },
  { label: "Movies & TV", value: "movies" },
  {
    label: "Music",
    value: "music",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Vinyl Records", value: "vinyl" },
    ],
  },
  {
    label: "Musical Instruments & Gear",
    value: "instruments",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Guitars & Basses", value: "guitars" },
      { label: "DJ Equipment & Pro Audio", value: "dj" },
    ],
  },
  { label: "Pet Supplies", value: "pets" },
  { label: "Pottery & Glass", value: "pottery" },
  { label: "Sporting Goods", value: "sporting" },
  { label: "Sports Mem, Cards & Fan Shop", value: "sports_cards" },
  { label: "Toys & Hobbies", value: "toys" },
  {
    label: "Video Games & Consoles",
    value: "videogames",
    subs: [
      { label: "Games, Accessories & Parts", value: "games_acc" },
      { label: "Video Game Consoles", value: "consoles" },
      { label: "Everything Else", value: "else" },
    ],
  },
];

const EU_CATEGORIES: Cat[] = [
  { label: "Everything Else", value: "default" },
  { label: "Art, Antiques & Collectables", value: "art" },
  { label: "Baby & Childcare", value: "baby" },
  { label: "Beauty & Health", value: "beauty" },
  { label: "Books & Magazines", value: "books" },
  { label: "Clothing, Shoes & Accessories", value: "clothing" },
  { label: "Computers & Tablets", value: "computers" },
  { label: "Consumer Electronics", value: "electronics" },
  { label: "Electronic Accessories", value: "elec_accessories" },
  { label: "Home & Garden", value: "home" },
  { label: "Home Appliances", value: "appliances" },
  { label: "Motorcycle Parts & Accessories", value: "motorcycle" },
  { label: "Musical Instruments", value: "instruments" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Professional Equipment", value: "professional" },
  { label: "Tyres, Rims & Hubcaps", value: "tires" },
  { label: "Toys & Games", value: "toys" },
  { label: "Vehicle Parts & Accessories", value: "motors" },
];

const UK_CATEGORIES: Cat[] = [
  { label: "Everything Else", value: "default" },
  { label: "Antiques", value: "antiques" },
  { label: "Art", value: "art" },
  { label: "Baby", value: "baby" },
  { label: "Books, Comics & Magazines", value: "books" },
  { label: "Business, Office & Industrial", value: "business" },
  {
    label: "Cameras & Photography",
    value: "cameras",
    subs: [
      { label: "General", value: "else" },
      { label: "Lenses, Digital Cameras & Camcorders", value: "core" },
    ],
  },
  {
    label: "Clothes, Shoes & Accessories",
    value: "clothing",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Trainers (Men's & Women's)", value: "trainers" },
      { label: "Women's Bags & Handbags", value: "womens_bags" },
    ],
  },
  { label: "Coins", value: "coins" },
  { label: "Collectables", value: "collectibles" },
  {
    label: "Computers, Tablets & Networking",
    value: "computers",
    subs: [
      { label: "General", value: "else" },
      { label: "Laptops, Desktops, Tablets & Servers", value: "core" },
    ],
  },
  { label: "Crafts", value: "crafts" },
  { label: "Dolls & Bears", value: "dolls" },
  { label: "Films & TV", value: "movies" },
  { label: "Garden & Patio", value: "garden" },
  {
    label: "Health & Beauty",
    value: "health",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Hair Extensions & Wigs", value: "hair" },
    ],
  },
  {
    label: "Home, Furniture & DIY",
    value: "home",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "DIY Tools & Appliances", value: "tools" },
      { label: "Furniture, Bath & Plumbing", value: "furniture" },
    ],
  },
  {
    label: "Jewellery & Watches",
    value: "jewelry",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Watches, Parts & Accessories", value: "watches" },
    ],
  },
  {
    label: "Mobile Phones & Communication",
    value: "mobile",
    subs: [
      { label: "General", value: "else" },
      { label: "Mobile & Smart Phones", value: "phones" },
    ],
  },
  { label: "Music", value: "music" },
  { label: "Musical Instruments & DJ Equipment", value: "instruments" },
  { label: "Pet Supplies", value: "pets" },
  { label: "Pottery, Ceramics & Glass", value: "pottery" },
  {
    label: "Sound & Vision",
    value: "electronics",
    subs: [
      { label: "General", value: "else" },
      { label: "TVs, HiFi, Headphones & DVD", value: "core" },
    ],
  },
  { label: "Sporting Goods", value: "sporting" },
  { label: "Sports Memorabilia", value: "sports_cards" },
  { label: "Toys & Games", value: "toys" },
  {
    label: "Vehicle Parts & Accessories",
    value: "motors",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Power Tools, GPS & Tyres", value: "tools_gps_tires" },
    ],
  },
  {
    label: "Video Games & Consoles",
    value: "videogames",
    subs: [
      { label: "Everything Else", value: "else" },
      { label: "Video Game Consoles", value: "consoles" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// US Market
// ═══════════════════════════════════════════════════════════════

const usRules: Record<string, FeeRule> = {};
const uf = 0.3;

d(usRules, "ns", "*", "*",              mkT([[7500, 13.25], [Infinity, 2.35]], uf));
d(usRules, "ns", "books", "*",          mkT([[7500, 14.95], [Infinity, 2.35]], uf));
d(usRules, "ns", "business", "heavy",   mkT([[15000, 3], [Infinity, 0.5]], uf));
d(usRules, "ns", "clothing", "athletic_shoes", mkTh([[149.99, 13.25], [Infinity, 8]], uf, { sp: true, w: true }));
d(usRules, "ns", "clothing", "womens_bags",    mkTh([[2000, 15], [Infinity, 9]], uf));
d(usRules, "ns", "coins", "bullion",    mkTh([[7500, 13.25], [Infinity, 7]], uf));
d(usRules, "ns", "jewelry", "*",        mkTh([[5000, 15], [Infinity, 9]], uf));
d(usRules, "ns", "jewelry", "else",     mkTh([[5000, 15], [Infinity, 9]], uf));
d(usRules, "ns", "jewelry", "watches",  mkT([[1000, 15], [7500, 6.5], [Infinity, 3]], uf));
d(usRules, "ns", "movies", "*",         mkT([[7500, 14.95], [Infinity, 2.35]], uf));
d(usRules, "ns", "music", "*",          mkT([[7500, 14.95], [Infinity, 2.35]], uf));
d(usRules, "ns", "music", "else",       mkT([[7500, 14.95], [Infinity, 2.35]], uf));
d(usRules, "ns", "music", "vinyl",      mkT([[7500, 13.25], [Infinity, 2.35]], uf));
d(usRules, "ns", "instruments", "guitars", mkT([[7500, 6.35], [Infinity, 2.35]], uf));

d(usRules, "st", "*", "*",              mkT([[2500, 12.35], [Infinity, 2.35]], uf));
d(usRules, "st", "books", "*",          mkT([[2500, 14.95], [Infinity, 2.35]], uf));
d(usRules, "st", "business", "heavy",   mkT([[15000, 2.5], [Infinity, 0.5]], uf));
d(usRules, "st", "clothing", "athletic_shoes", mkTh([[149.99, 12.35], [Infinity, 7]], uf, { sp: true, w: true }));
d(usRules, "st", "clothing", "womens_bags",    mkTh([[2000, 13], [Infinity, 7]], uf));
d(usRules, "st", "coins", "*",          mkT([[4000, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "coins", "else",       mkT([[4000, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "coins", "bullion",    mkTh([[1500, 7.35], [10000, 5], [Infinity, 4.5]], uf));
d(usRules, "st", "computers", "accessories", mkT([[2500, 12.35], [Infinity, 2.35]], uf));
d(usRules, "st", "computers", "core",   mkT([[2500, 7], [Infinity, 2.35]], uf));
d(usRules, "st", "computers", "*",      mkT([[2500, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "computers", "else",   mkT([[2500, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "electronics", "accessories", mkT([[2500, 12.35], [Infinity, 2.35]], uf));
d(usRules, "st", "electronics", "*",    mkT([[2500, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "electronics", "else", mkT([[2500, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "motors", "tools",     mkT([[1000, 11.35], [Infinity, 2.35]], uf));
d(usRules, "st", "motors", "tires",     mkT([[1000, 9.35], [Infinity, 2.35]], uf));
d(usRules, "st", "motors", "gps",       mkT([[1000, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "motors", "*",         mkT([[1000, 11.35], [Infinity, 2.35]], uf));
d(usRules, "st", "jewelry", "*",        mkT([[5000, 13], [Infinity, 7]], uf));
d(usRules, "st", "jewelry", "else",     mkT([[5000, 13], [Infinity, 7]], uf));
d(usRules, "st", "jewelry", "watches",  mkT([[1000, 12.5], [5000, 4], [Infinity, 3]], uf));
d(usRules, "st", "movies", "*",         mkT([[2500, 14.95], [Infinity, 2.35]], uf));
d(usRules, "st", "music", "*",          mkT([[2500, 14.95], [Infinity, 2.35]], uf));
d(usRules, "st", "music", "else",       mkT([[2500, 14.95], [Infinity, 2.35]], uf));
d(usRules, "st", "music", "vinyl",      mkT([[2500, 12.35], [Infinity, 2.35]], uf));
d(usRules, "st", "instruments", "guitars", mkT([[2500, 6.35], [Infinity, 2.35]], uf));
d(usRules, "st", "instruments", "dj",   mkT([[2500, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "instruments", "*",    mkT([[2500, 10], [Infinity, 2.35]], uf));
d(usRules, "st", "instruments", "else", mkT([[2500, 10], [Infinity, 2.35]], uf));
d(usRules, "st", "videogames", "games_acc", mkT([[2500, 12.35], [Infinity, 2.35]], uf));
d(usRules, "st", "videogames", "consoles", mkT([[2500, 7], [Infinity, 2.35]], uf));
d(usRules, "st", "videogames", "*",     mkT([[2500, 9], [Infinity, 2.35]], uf));
d(usRules, "st", "videogames", "else",  mkT([[2500, 9], [Infinity, 2.35]], uf));

const US: MarketConfig = {
  id: "us", name: "US", fullName: "United States", siteName: "eBay.com",
  flag: "\u{1F1FA}\u{1F1F8}", domain: "ebay.com",
  currency: { code: "USD", symbol: "$", locale: "en-US" },
  storeTypes: STD_STORE_TYPES, storeLabel: "eBay Store",
  categories: EN_CATEGORIES, rules: usRules, feeGroup: stdFeeGroup,
  paymentProcessing: { rate: 0.027, fixedFee: 0.25, label: "Managed Payments (2.7% + $0.25)" },
  internationalFeeRate: 0.0165, internationalLabel: "International Sale (+1.65%)",
  regulatoryFee: null,
  topRatedDiscount: 0.1, topRatedLabel: "Top Rated Seller (10% FVF discount)",
  taxLabel: "Sales Tax (%)",
  defaults: { soldPrice: 39.99, shippingCharged: 5, itemCost: 12, shippingCost: 4.5 },
  seo: {
    title: "US eBay Fee Calculator | SellerLab",
    description: "Calculate eBay.com final value fees, managed payments, and net profit for US sellers. Accurate rates updated for 2025.",
    h1: "US eBay Fee Calculator",
    subtitle: "Calculate final value fees & profit when selling on eBay.com. Rates updated as of Mar 2025.",
  },
  notes: [
    "Sales tax is collected by eBay and remitted to the state — it does not affect your profit directly, but it is included in the Managed Payments and Promoted Listing fee basis.",
  ],
};

// ═══════════════════════════════════════════════════════════════
// UK Market — Source: eBay UK business seller fees, effective 12 Feb 2026
// ═══════════════════════════════════════════════════════════════

const ukRules: Record<string, FeeRule> = {};
const ukf = 0.40;

d(ukRules, "prv", "*", "*",                    mkT([[Infinity, 0]], 0));

d(ukRules, "biz", "*", "*",                    mkT([[Infinity, 12.9]], ukf));
d(ukRules, "biz", "antiques", "*",             mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "art", "*",                  mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "baby", "*",                 mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "books", "*",                mkT([[Infinity, 9.9]], ukf));
d(ukRules, "biz", "business", "*",             mkT([[Infinity, 12.5]], ukf));
d(ukRules, "biz", "cameras", "*",              mkT([[Infinity, 9.9]], ukf));
d(ukRules, "biz", "cameras", "core",           mkT([[1000, 6.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "clothing", "*",             mkT([[Infinity, 11.9]], ukf));
d(ukRules, "biz", "clothing", "trainers",      mkTh([[99.99, 11.9], [Infinity, 7]], ukf, { sp: true }));
d(ukRules, "biz", "clothing", "womens_bags",   mkT([[800, 12.9], [Infinity, 7]], ukf));
d(ukRules, "biz", "coins", "*",                mkT([[450, 10.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "collectibles", "*",         mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "computers", "*",            mkT([[Infinity, 9.9]], ukf));
d(ukRules, "biz", "computers", "core",         mkT([[1000, 6.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "crafts", "*",               mkT([[Infinity, 12.9]], ukf));
d(ukRules, "biz", "dolls", "*",                mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "movies", "*",               mkT([[Infinity, 9.9]], ukf));
d(ukRules, "biz", "garden", "*",               mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "health", "*",               mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "health", "hair",            mkT([[Infinity, 11.9]], ukf));
d(ukRules, "biz", "home", "*",                 mkT([[500, 11.9], [Infinity, 7.9]], ukf));
d(ukRules, "biz", "home", "tools",             mkT([[400, 6.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "home", "furniture",          mkT([[500, 10.9], [1000, 7.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "jewelry", "*",              mkT([[1000, 14.9], [Infinity, 4]], ukf));
d(ukRules, "biz", "jewelry", "watches",        mkT([[750, 12.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "mobile", "*",               mkT([[Infinity, 9.9]], ukf));
d(ukRules, "biz", "mobile", "phones",          mkT([[1000, 6.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "music", "*",                mkT([[Infinity, 9.9]], ukf));
d(ukRules, "biz", "instruments", "*",          mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "pets", "*",                 mkT([[Infinity, 12.9]], ukf));
d(ukRules, "biz", "pottery", "*",              mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "electronics", "*",          mkT([[Infinity, 9.9]], ukf));
d(ukRules, "biz", "electronics", "core",       mkT([[1000, 6.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "sporting", "*",             mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "sports_cards", "*",         mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "toys", "*",                 mkT([[Infinity, 10.9]], ukf));
d(ukRules, "biz", "motors", "*",               mkT([[750, 9.5], [Infinity, 3]], ukf));
d(ukRules, "biz", "motors", "tools_gps_tires", mkT([[750, 6.9], [Infinity, 3]], ukf));
d(ukRules, "biz", "videogames", "*",           mkT([[Infinity, 9.9]], ukf));
d(ukRules, "biz", "videogames", "consoles",    mkT([[400, 6.9], [Infinity, 2]], ukf));

const UK: MarketConfig = {
  id: "uk", name: "UK", fullName: "United Kingdom", siteName: "eBay.co.uk",
  flag: "\u{1F1EC}\u{1F1E7}", domain: "ebay.co.uk",
  currency: { code: "GBP", symbol: "\u00A3", locale: "en-GB" },
  storeTypes: UK_STORE_TYPES, storeLabel: "Seller Type",
  categories: UK_CATEGORIES, rules: ukRules, feeGroup: ukFeeGroup,
  paymentProcessing: null,
  internationalFeeRate: 0.02,
  internationalLabel: "International Fee",
  internationalDestinations: [
    { label: "Eurozone & Northern Europe (1.05%)", value: "eu", rate: 0.0105 },
    { label: "US & Canada (1.8%)", value: "us_ca", rate: 0.018 },
    { label: "All Other Countries (2.0%)", value: "other", rate: 0.02 },
  ],
  internationalFeeOverride: (st: string) => st === "private" ? 0.03 : null,
  regulatoryFee: { rate: 0.0035, label: "Regulatory Operating Fee (0.35%)" },
  regulatoryFeeExempt: (st: string) => st === "private",
  topRatedDiscount: 0.1, topRatedLabel: "Top Rated Seller (10% FVF discount)",
  taxLabel: "VAT (%)",
  perOrderFeeByAmount: { threshold: 10, below: 0.30 },
  defaults: { soldPrice: 29.99, shippingCharged: 3.95, itemCost: 8, shippingCost: 3.5 },
  seo: {
    title: "UK eBay Fee Calculator | SellerLab",
    description: "Calculate eBay.co.uk final value fees, regulatory fees, and net profit for UK sellers. Rates effective 12 February 2026.",
    h1: "UK eBay Fee Calculator",
    subtitle: "Calculate final value fees & profit when selling on eBay.co.uk. Rates updated as of Feb 2026.",
  },
  notes: [
    "UK-based private sellers pay no final value fees or regulatory operating fees on domestic sales.",
    "Per-order fee: \u00A30.40 for orders above \u00A310, \u00A30.30 for orders \u00A310 or less.",
    "International fee varies by destination: Eurozone/Northern Europe 1.05%, US/Canada 1.8%, Other 2.0%. Private sellers: 3% for all international sales.",
    "Regulatory operating fee: 0.35% (excl. VAT) on all business seller sales.",
    "All fee rates shown are exclusive of VAT.",
  ],
};

// ═══════════════════════════════════════════════════════════════
// DE Market (Germany)
// ═══════════════════════════════════════════════════════════════

const deRules: Record<string, FeeRule> = {};
const def_ = 0.35;

d(deRules, "prv", "*", "*",             mkT([[Infinity, 0]], 0));
d(deRules, "com", "*", "*",             mkT([[1990, 11], [Infinity, 2]], def_));
d(deRules, "com", "electronics", "*",   mkT([[Infinity, 3]], def_));
d(deRules, "com", "tires", "*",         mkT([[Infinity, 3]], def_));
d(deRules, "com", "elec_accessories", "*", mkT([[Infinity, 5.7]], def_));
d(deRules, "com", "motorcycle", "*",    mkT([[Infinity, 5.7]], def_));
d(deRules, "com", "motors", "*",        mkT([[Infinity, 5.7]], def_));
d(deRules, "com", "art", "*",           mkT([[Infinity, 6.5]], def_));
d(deRules, "com", "books", "*",         mkT([[Infinity, 6.5]], def_));
d(deRules, "com", "appliances", "*",    mkT([[Infinity, 6.5]], def_));
d(deRules, "com", "instruments", "*",   mkT([[Infinity, 6.5]], def_));
d(deRules, "com", "professional", "*",  mkT([[Infinity, 6.5]], def_));
d(deRules, "com", "toys", "*",          mkT([[Infinity, 6.5]], def_));
d(deRules, "com", "computers", "*",     mkT([[Infinity, 6.5]], def_));
d(deRules, "com", "default", "*",       mkT([[Infinity, 6.5]], def_));
d(deRules, "com", "baby", "*",          mkT([[Infinity, 7]], def_));
d(deRules, "com", "home", "*",          mkT([[Infinity, 7]], def_));
d(deRules, "com", "pets", "*",          mkT([[Infinity, 7]], def_));
d(deRules, "com", "beauty", "*",        mkT([[Infinity, 8]], def_));
d(deRules, "com", "clothing", "*",      mkT([[Infinity, 8]], def_));

const DE: MarketConfig = {
  id: "de", name: "DE", fullName: "Germany", siteName: "eBay.de",
  flag: "\u{1F1E9}\u{1F1EA}", domain: "ebay.de",
  currency: { code: "EUR", symbol: "\u20AC", locale: "de-DE" },
  storeTypes: EU_SELLER_TYPES, storeLabel: "Seller Type",
  categories: EU_CATEGORIES, rules: deRules, feeGroup: euFeeGroup,
  paymentProcessing: null,
  internationalFeeRate: 0.0191, internationalLabel: "International Sale (+1.91%)",
  regulatoryFee: null,
  topRatedDiscount: 0.1, topRatedLabel: "Top Rated Seller (10% FVF discount)",
  taxLabel: "VAT (%)",
  perOrderFeeByAmount: { threshold: 9.99, below: 0.05 },
  defaults: { soldPrice: 29.99, shippingCharged: 4.99, itemCost: 10, shippingCost: 4.5 },
  seo: {
    title: "Germany eBay Fee Calculator | SellerLab",
    description: "Calculate eBay.de final value fees and net profit for German sellers. Accurate category-based rates.",
    h1: "Germany eBay Fee Calculator",
    subtitle: "Calculate final value fees & profit when selling on eBay.de.",
  },
  notes: [
    "Private sellers within Germany/EEA selling domestically pay no final value fees.",
    "Per-order fee: \u20AC0.35 for orders \u20AC10+, \u20AC0.05 for orders under \u20AC10.",
    "International fee varies by destination: 1.91% (EU/US/CA), 1.43% (UK), 3.93% (other).",
  ],
};

// ═══════════════════════════════════════════════════════════════
// AU Market (Australia)
// ═══════════════════════════════════════════════════════════════

const auRules: Record<string, FeeRule> = {};
const auf = 0.30;

d(auRules, "ns", "*", "*",              mkT([[4000, 13.4], [Infinity, 2.5]], auf));
d(auRules, "ns", "books", "*",          mkT([[4000, 14.95], [Infinity, 2.5]], auf));
d(auRules, "ns", "jewelry", "*",        mkTh([[5000, 14], [Infinity, 9]], auf));
d(auRules, "ns", "jewelry", "watches",  mkT([[1000, 14], [5000, 6], [Infinity, 3]], auf));
d(auRules, "ns", "coins", "bullion",    mkTh([[7500, 13.4], [Infinity, 7]], auf));

d(auRules, "st", "*", "*",              mkT([[4000, 10.4], [Infinity, 2.5]], auf));
d(auRules, "st", "books", "*",          mkT([[4000, 14.95], [Infinity, 2.5]], auf));
d(auRules, "st", "computers", "core",   mkT([[4000, 7], [Infinity, 2.5]], auf));
d(auRules, "st", "computers", "*",      mkT([[4000, 9], [Infinity, 2.5]], auf));
d(auRules, "st", "electronics", "*",    mkT([[4000, 9], [Infinity, 2.5]], auf));
d(auRules, "st", "jewelry", "*",        mkT([[5000, 12], [Infinity, 7]], auf));
d(auRules, "st", "jewelry", "watches",  mkT([[1000, 12], [5000, 4], [Infinity, 3]], auf));
d(auRules, "st", "motors", "*",         mkT([[1000, 9.5], [Infinity, 3]], auf));
d(auRules, "st", "videogames", "consoles", mkT([[4000, 7], [Infinity, 2.5]], auf));

const AU: MarketConfig = {
  id: "au", name: "AU", fullName: "Australia", siteName: "eBay.com.au",
  flag: "\u{1F1E6}\u{1F1FA}", domain: "ebay.com.au",
  currency: { code: "AUD", symbol: "A$", locale: "en-AU" },
  storeTypes: STD_STORE_TYPES, storeLabel: "eBay Store",
  categories: EN_CATEGORIES, rules: auRules, feeGroup: stdFeeGroup,
  paymentProcessing: null,
  internationalFeeRate: 0.01, internationalLabel: "International Sale (+1.0%)",
  regulatoryFee: null,
  topRatedDiscount: 0.1, topRatedLabel: "Top Rated Seller (10% FVF discount)",
  taxLabel: "GST (%)",
  fvfCap: (st: string) => st === "none" || st === "starter" ? 440 : 400,
  defaults: { soldPrice: 49.99, shippingCharged: 8.95, itemCost: 20, shippingCost: 8 },
  seo: {
    title: "Australia eBay Fee Calculator | SellerLab",
    description: "Calculate eBay.com.au final value fees and net profit for Australian sellers. Updated rates for 2025.",
    h1: "Australia eBay Fee Calculator",
    subtitle: "Calculate final value fees & profit when selling on eBay.com.au.",
  },
  notes: [
    "Payment processing fees are included in the final value fee.",
    "Maximum FVF cap: A$440 per item (non-store), A$400 (store).",
    "Currency conversion charge of 3.0-3.3% applies to international payments.",
  ],
};

// ═══════════════════════════════════════════════════════════════
// CA Market (Canada)
// ═══════════════════════════════════════════════════════════════

const caRules: Record<string, FeeRule> = {};
const caf = 0.30;

d(caRules, "ns", "*", "*",              mkT([[7500, 13.6], [Infinity, 2.35]], caf));
d(caRules, "ns", "books", "*",          mkT([[7500, 15.3], [Infinity, 2.35]], caf));
d(caRules, "ns", "business", "heavy",   mkT([[15000, 3], [Infinity, 0.5]], caf));
d(caRules, "ns", "clothing", "athletic_shoes", mkTh([[149.99, 13.6], [Infinity, 8]], caf, { sp: true, w: true }));
d(caRules, "ns", "clothing", "womens_bags",    mkTh([[2000, 15], [Infinity, 9]], caf));
d(caRules, "ns", "coins", "bullion",    mkTh([[7500, 13.6], [Infinity, 7]], caf));
d(caRules, "ns", "jewelry", "*",        mkTh([[5000, 15], [Infinity, 9]], caf));
d(caRules, "ns", "jewelry", "else",     mkTh([[5000, 15], [Infinity, 9]], caf));
d(caRules, "ns", "jewelry", "watches",  mkT([[1000, 15], [7500, 6.5], [Infinity, 3]], caf));
d(caRules, "ns", "movies", "*",         mkT([[7500, 15.3], [Infinity, 2.35]], caf));
d(caRules, "ns", "music", "*",          mkT([[7500, 15.3], [Infinity, 2.35]], caf));
d(caRules, "ns", "music", "vinyl",      mkT([[7500, 13.6], [Infinity, 2.35]], caf));
d(caRules, "ns", "instruments", "guitars", mkT([[7500, 6.35], [Infinity, 2.35]], caf));

d(caRules, "st", "*", "*",              mkT([[2500, 12.7], [Infinity, 2.35]], caf));
d(caRules, "st", "books", "*",          mkT([[2500, 15.3], [Infinity, 2.35]], caf));
d(caRules, "st", "business", "heavy",   mkT([[15000, 2.5], [Infinity, 0.5]], caf));
d(caRules, "st", "clothing", "athletic_shoes", mkTh([[149.99, 12.7], [Infinity, 7]], caf, { sp: true, w: true }));
d(caRules, "st", "clothing", "womens_bags",    mkTh([[2000, 13], [Infinity, 7]], caf));
d(caRules, "st", "coins", "*",          mkT([[4000, 9], [Infinity, 2.35]], caf));
d(caRules, "st", "coins", "bullion",    mkTh([[1500, 7.35], [10000, 5], [Infinity, 4.5]], caf));
d(caRules, "st", "computers", "core",   mkT([[2500, 7], [Infinity, 2.35]], caf));
d(caRules, "st", "computers", "*",      mkT([[2500, 9], [Infinity, 2.35]], caf));
d(caRules, "st", "electronics", "*",    mkT([[2500, 9], [Infinity, 2.35]], caf));
d(caRules, "st", "motors", "*",         mkT([[1000, 11.35], [Infinity, 2.35]], caf));
d(caRules, "st", "jewelry", "*",        mkT([[5000, 13], [Infinity, 7]], caf));
d(caRules, "st", "jewelry", "watches",  mkT([[1000, 12.5], [5000, 4], [Infinity, 3]], caf));
d(caRules, "st", "movies", "*",         mkT([[2500, 15.3], [Infinity, 2.35]], caf));
d(caRules, "st", "music", "*",          mkT([[2500, 15.3], [Infinity, 2.35]], caf));
d(caRules, "st", "music", "vinyl",      mkT([[2500, 12.7], [Infinity, 2.35]], caf));
d(caRules, "st", "instruments", "guitars", mkT([[2500, 6.35], [Infinity, 2.35]], caf));
d(caRules, "st", "instruments", "*",    mkT([[2500, 10], [Infinity, 2.35]], caf));
d(caRules, "st", "videogames", "consoles", mkT([[2500, 7], [Infinity, 2.35]], caf));
d(caRules, "st", "videogames", "*",     mkT([[2500, 9], [Infinity, 2.35]], caf));

const CA: MarketConfig = {
  id: "ca", name: "CA", fullName: "Canada", siteName: "eBay.ca",
  flag: "\u{1F1E8}\u{1F1E6}", domain: "ebay.ca",
  currency: { code: "CAD", symbol: "C$", locale: "en-CA" },
  storeTypes: STD_STORE_TYPES, storeLabel: "eBay Store",
  categories: EN_CATEGORIES, rules: caRules, feeGroup: stdFeeGroup,
  paymentProcessing: { rate: 0.027, fixedFee: 0.25, label: "Managed Payments (2.7% + C$0.25)" },
  internationalFeeRate: 0.0165, internationalLabel: "International Sale (+1.65%)",
  regulatoryFee: null,
  topRatedDiscount: 0.1, topRatedLabel: "Top Rated Seller (10% FVF discount)",
  taxLabel: "Sales Tax (%)",
  defaults: { soldPrice: 39.99, shippingCharged: 7, itemCost: 15, shippingCost: 6 },
  seo: {
    title: "Canada eBay Fee Calculator | SellerLab",
    description: "Calculate eBay.ca final value fees, managed payments, and net profit for Canadian sellers. Updated rates for 2025.",
    h1: "Canada eBay Fee Calculator",
    subtitle: "Calculate final value fees & profit when selling on eBay.ca. Rates updated as of Mar 2025.",
  },
  notes: [
    "Rates increased up to 0.35% starting March 3, 2025.",
    "Sales tax handling varies by province (GST/HST/PST).",
  ],
};

// ═══════════════════════════════════════════════════════════════
// FR Market (France)
// ═══════════════════════════════════════════════════════════════

const frRules: Record<string, FeeRule> = {};
const frf = 0.35;

d(frRules, "prv", "*", "*",             mkT([[Infinity, 8]], frf));
d(frRules, "com", "*", "*",             mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "default", "*",       mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "electronics", "*",   mkT([[Infinity, 3]], frf));
d(frRules, "com", "tires", "*",         mkT([[Infinity, 3]], frf));
d(frRules, "com", "elec_accessories", "*", mkT([[Infinity, 5.7]], frf));
d(frRules, "com", "motorcycle", "*",    mkT([[Infinity, 5.7]], frf));
d(frRules, "com", "motors", "*",        mkT([[Infinity, 5.7]], frf));
d(frRules, "com", "art", "*",           mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "books", "*",         mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "appliances", "*",    mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "instruments", "*",   mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "professional", "*",  mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "toys", "*",          mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "computers", "*",     mkT([[Infinity, 6.5]], frf));
d(frRules, "com", "baby", "*",          mkT([[Infinity, 7]], frf));
d(frRules, "com", "home", "*",          mkT([[Infinity, 7]], frf));
d(frRules, "com", "pets", "*",          mkT([[Infinity, 7]], frf));
d(frRules, "com", "beauty", "*",        mkT([[Infinity, 8]], frf));
d(frRules, "com", "clothing", "*",      mkT([[Infinity, 8]], frf));

const FR: MarketConfig = {
  id: "fr", name: "FR", fullName: "France", siteName: "eBay.fr",
  flag: "\u{1F1EB}\u{1F1F7}", domain: "ebay.fr",
  currency: { code: "EUR", symbol: "\u20AC", locale: "fr-FR" },
  storeTypes: EU_SELLER_TYPES, storeLabel: "Seller Type",
  categories: EU_CATEGORIES, rules: frRules, feeGroup: euFeeGroup,
  paymentProcessing: null,
  internationalFeeRate: 0.0191, internationalLabel: "International Sale (+1.91%)",
  regulatoryFee: null,
  topRatedDiscount: 0.1, topRatedLabel: "Top Rated Seller (10% FVF discount)",
  taxLabel: "VAT (%)",
  fvfCap: (st: string) => st === "private" ? 200 : null,
  defaults: { soldPrice: 29.99, shippingCharged: 4.99, itemCost: 10, shippingCost: 4.5 },
  seo: {
    title: "France eBay Fee Calculator | SellerLab",
    description: "Calculate eBay.fr final value fees and net profit for French sellers. Category-based rates for private and business sellers.",
    h1: "France eBay Fee Calculator",
    subtitle: "Calculate final value fees & profit when selling on eBay.fr.",
  },
  notes: [
    "Private sellers: flat 8% on all categories (capped at \u20AC200 per item).",
    "Business sellers: rates vary by category from 3% to 8%.",
  ],
};

// ═══════════════════════════════════════════════════════════════
// IT Market (Italy)
// ═══════════════════════════════════════════════════════════════

const itRules: Record<string, FeeRule> = {};
const itf = 0.35;

d(itRules, "prv", "*", "*",             mkT([[Infinity, 8]], itf));
d(itRules, "com", "*", "*",             mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "default", "*",       mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "electronics", "*",   mkT([[Infinity, 3]], itf));
d(itRules, "com", "tires", "*",         mkT([[Infinity, 3]], itf));
d(itRules, "com", "elec_accessories", "*", mkT([[Infinity, 5.7]], itf));
d(itRules, "com", "motorcycle", "*",    mkT([[Infinity, 5.7]], itf));
d(itRules, "com", "motors", "*",        mkT([[Infinity, 5.7]], itf));
d(itRules, "com", "art", "*",           mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "books", "*",         mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "appliances", "*",    mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "instruments", "*",   mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "professional", "*",  mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "toys", "*",          mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "computers", "*",     mkT([[Infinity, 6.5]], itf));
d(itRules, "com", "baby", "*",          mkT([[Infinity, 7]], itf));
d(itRules, "com", "home", "*",          mkT([[Infinity, 7]], itf));
d(itRules, "com", "pets", "*",          mkT([[Infinity, 7]], itf));
d(itRules, "com", "beauty", "*",        mkT([[Infinity, 8]], itf));
d(itRules, "com", "clothing", "*",      mkT([[Infinity, 8]], itf));

const IT: MarketConfig = {
  id: "it", name: "IT", fullName: "Italy", siteName: "eBay.it",
  flag: "\u{1F1EE}\u{1F1F9}", domain: "ebay.it",
  currency: { code: "EUR", symbol: "\u20AC", locale: "it-IT" },
  storeTypes: EU_SELLER_TYPES, storeLabel: "Seller Type",
  categories: EU_CATEGORIES, rules: itRules, feeGroup: euFeeGroup,
  paymentProcessing: null,
  internationalFeeRate: 0.0191, internationalLabel: "International Sale (+1.91%)",
  regulatoryFee: null,
  topRatedDiscount: 0.1, topRatedLabel: "Top Rated Seller (10% FVF discount)",
  taxLabel: "VAT (%)",
  fvfCap: (st: string) => st === "private" ? 200 : null,
  defaults: { soldPrice: 29.99, shippingCharged: 4.99, itemCost: 10, shippingCost: 4.5 },
  seo: {
    title: "Italy eBay Fee Calculator | SellerLab",
    description: "Calculate eBay.it final value fees and net profit for Italian sellers. Category-based rates for private and business sellers.",
    h1: "Italy eBay Fee Calculator",
    subtitle: "Calculate final value fees & profit when selling on eBay.it.",
  },
  notes: [
    "Private sellers: flat 8% on all categories (capped at \u20AC200 per item).",
    "Business sellers: rates vary by category from 3% to 8%.",
  ],
};

// ═══════════════════════════════════════════════════════════════
// Registry
// ═══════════════════════════════════════════════════════════════

export const MARKETS: Record<MarketId, MarketConfig> = { us: US, uk: UK, de: DE, au: AU, ca: CA, fr: FR, it: IT };
export const MARKET_LIST: MarketConfig[] = [US, UK, DE, AU, CA, FR, IT];
export function getMarket(id: string): MarketConfig | undefined { return MARKETS[id as MarketId]; }
