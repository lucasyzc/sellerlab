export { US_MARKET } from "./us";
export { CA_MARKET } from "./ca";
export { AU_MARKET } from "./au";
export { SG_MARKET } from "./sg";
export { JP_MARKET } from "./jp";
export { EU_MARKET } from "./eu";
export { UK_MARKET } from "./uk";
export { CH_MARKET } from "./ch";

export type ShopifyMarketRegion = "NA" | "APAC" | "EU";

export type Market = {
  code: "us" | "ca" | "au" | "sg" | "jp" | "eu" | "uk" | "ch";
  name: string;
  region: ShopifyMarketRegion;
};

export const SHOPIFY_MARKET_REGISTRY: Market[] = [
  { code: "us", name: "US", region: "NA" },
  { code: "ca", name: "CA", region: "NA" },
  { code: "au", name: "AU", region: "APAC" },
  { code: "sg", name: "SG", region: "APAC" },
  { code: "jp", name: "JP", region: "APAC" },
  { code: "eu", name: "EU", region: "EU" },
  { code: "uk", name: "UK", region: "EU" },
  { code: "ch", name: "CH", region: "EU" },
];

export const SHOPIFY_REGION_LABELS: Record<ShopifyMarketRegion, string> = {
  NA: "North America",
  APAC: "Asia Pacific",
  EU: "Europe",
};
