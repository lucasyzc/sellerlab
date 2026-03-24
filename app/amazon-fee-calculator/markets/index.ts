import type { AmazonMarketId, AmazonMarketConfig } from "../amazon-config";

export { US_MARKET } from "./us";
export { UK_MARKET } from "./uk";
export { DE_MARKET, IT_MARKET, ES_MARKET, NL_MARKET, BE_MARKET, SE_MARKET, PL_MARKET } from "./eu";
export { JP_MARKET } from "./jp";
export { CA_MARKET } from "./ca";
export { AU_MARKET, SG_MARKET } from "./apac";
export { AE_MARKET, BR_MARKET, MX_MARKET, TR_MARKET } from "./emerging";

import { US_MARKET } from "./us";
import { UK_MARKET } from "./uk";
import { DE_MARKET, IT_MARKET, ES_MARKET, NL_MARKET, BE_MARKET, SE_MARKET, PL_MARKET } from "./eu";
import { JP_MARKET } from "./jp";
import { CA_MARKET } from "./ca";
import { AU_MARKET, SG_MARKET } from "./apac";
import { AE_MARKET, BR_MARKET, MX_MARKET, TR_MARKET } from "./emerging";

export const AMAZON_MARKETS: Record<AmazonMarketId, AmazonMarketConfig> = {
  us: US_MARKET, uk: UK_MARKET, de: DE_MARKET, jp: JP_MARKET, ca: CA_MARKET,
  it: IT_MARKET, es: ES_MARKET, au: AU_MARKET, ae: AE_MARKET, br: BR_MARKET,
  sg: SG_MARKET, mx: MX_MARKET, nl: NL_MARKET, be: BE_MARKET, se: SE_MARKET,
  pl: PL_MARKET, tr: TR_MARKET,
};

export const AMAZON_MARKET_LIST: AmazonMarketConfig[] = [
  US_MARKET, UK_MARKET, DE_MARKET, JP_MARKET, CA_MARKET,
  IT_MARKET, ES_MARKET, AU_MARKET, AE_MARKET, BR_MARKET,
  SG_MARKET, MX_MARKET, NL_MARKET, BE_MARKET, SE_MARKET,
  PL_MARKET, TR_MARKET,
];

export function getAmazonMarket(id: string): AmazonMarketConfig | undefined {
  return AMAZON_MARKETS[id as AmazonMarketId];
}

