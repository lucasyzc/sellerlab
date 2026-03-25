import type { WalmartMarketConfig, WalmartMarketId } from "../walmart-config";

export { US_MARKET } from "./us";
export { CA_MARKET } from "./ca";
export { MX_MARKET } from "./mx";
export { CL_MARKET } from "./cl";

import { US_MARKET } from "./us";
import { CA_MARKET } from "./ca";
import { MX_MARKET } from "./mx";
import { CL_MARKET } from "./cl";

export const WALMART_MARKETS: Record<WalmartMarketId, WalmartMarketConfig> = {
  us: US_MARKET,
  ca: CA_MARKET,
  mx: MX_MARKET,
  cl: CL_MARKET,
};

export const WALMART_MARKET_LIST: WalmartMarketConfig[] = [
  US_MARKET,
  CA_MARKET,
  MX_MARKET,
  CL_MARKET,
];

export function getWalmartMarket(id: string): WalmartMarketConfig | undefined {
  return WALMART_MARKETS[id as WalmartMarketId];
}
