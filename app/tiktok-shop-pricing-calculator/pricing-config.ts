import {
  calculate,
  getTikTokMarket,
  makeDefaultForm,
  type TikTokCalcResult,
  type TikTokFormState,
  type TikTokMarketConfig,
  type TikTokMarketId,
  type TikTokPercentageFeeRule,
  type TikTokFeeRule,
  TIKTOK_MARKET_LIST,
} from "../tiktok-shop-fee-calculator/tiktok-config";

export const TIKTOK_PRICING_MARKET_IDS: TikTokMarketId[] = TIKTOK_MARKET_LIST.map(
  (market) => market.id,
);

export type TikTokPricingTargetMode = "profit_amount" | "profit_margin";

export type TikTokPricingFormState = TikTokFormState & {
  targetMode: TikTokPricingTargetMode;
  targetValue: number;
};

export type TikTokPricingSolveStatus = "ok" | "invalid_input" | "unreachable";

export type TikTokPricingSolveResult = {
  status: TikTokPricingSolveStatus;
  message: string;
  listingPrice: number;
  soldPrice: number;
  calcResult: TikTokCalcResult | null;
  iterations: number;
};

const EPSILON = 1e-9;
const CENT = 0.01;
const SAFE_MAX_LISTING_PRICE = 1_000_000;
const MAX_BINARY_STEPS = 80;
const MAX_CENT_ADJUST_STEPS = 300;

function normalizeNonNegative(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return value < 0 ? 0 : value;
}

function roundToCent(value: number): number {
  return Math.round((value + EPSILON) * 100) / 100;
}

function ceilToCent(value: number): number {
  return Math.ceil((value - EPSILON) * 100) / 100;
}

function isTargetReached(
  form: TikTokPricingFormState,
  calcResult: TikTokCalcResult,
): boolean {
  if (form.targetMode === "profit_amount") {
    return calcResult.netProfit >= form.targetValue - EPSILON;
  }
  return calcResult.margin >= form.targetValue - EPSILON;
}

function validate(form: TikTokPricingFormState, config: TikTokMarketConfig): string | null {
  if (!Number.isFinite(form.targetValue) || form.targetValue < 0) {
    return "Target value must be a non-negative number.";
  }

  if (!Number.isFinite(form.taxRate) || form.taxRate < 0) {
    return `${config.tax.name} rate must be a non-negative number.`;
  }

  const nonNegativeFields: Array<[number, string]> = [
    [form.sellerDiscount, "Seller discount"],
    [form.platformDiscount, "Platform discount"],
    [form.buyerShippingFee, "Buyer shipping fee"],
    [form.itemCost, "Item cost"],
    [form.shippingCost, "Shipping cost"],
    [form.otherCosts, "Other costs"],
    [form.affiliateRate, "Affiliate commission rate"],
    [form.adSpendPerUnit, "Ad spend per unit"],
    [form.storageDays, "Storage duration"],
  ];

  for (const [value, label] of nonNegativeFields) {
    if (!Number.isFinite(value) || value < 0) {
      return `${label} must be a non-negative number.`;
    }
  }

  if (form.affiliateRate > 100) {
    return "Affiliate commission rate must not exceed 100%.";
  }

  return null;
}

function buildFeeForm(
  form: TikTokPricingFormState,
  soldPrice: number,
): TikTokFormState {
  return {
    ...form,
    soldPrice: normalizeNonNegative(soldPrice),
  };
}

export function makeDefaultPricingForm(
  config: TikTokMarketConfig,
): TikTokPricingFormState {
  return {
    ...makeDefaultForm(config),
    targetMode: "profit_amount",
    targetValue: 15,
  };
}

export function evaluateAtListingPrice(
  listingPrice: number,
  form: TikTokPricingFormState,
  config: TikTokMarketConfig,
) {
  const normalizedListingPrice = normalizeNonNegative(listingPrice);
  const calcResult = calculate(buildFeeForm(form, normalizedListingPrice), config);

  return {
    listingPrice: roundToCent(normalizedListingPrice),
    soldPrice: roundToCent(normalizedListingPrice),
    calcResult,
    targetReached: isTargetReached(form, calcResult),
  };
}

export function solveListingPrice(
  form: TikTokPricingFormState,
  config: TikTokMarketConfig,
): TikTokPricingSolveResult {
  const validationError = validate(form, config);
  if (validationError) {
    return {
      status: "invalid_input",
      message: validationError,
      listingPrice: 0,
      soldPrice: 0,
      calcResult: null,
      iterations: 0,
    };
  }

  const atZero = evaluateAtListingPrice(0, form, config);
  if (atZero.targetReached) {
    return {
      status: "ok",
      message: "Target reached at listing price 0.",
      listingPrice: atZero.listingPrice,
      soldPrice: atZero.soldPrice,
      calcResult: atZero.calcResult,
      iterations: 1,
    };
  }

  let low = 0;
  let high = Math.max(1, form.soldPrice || 1);
  let highEval = evaluateAtListingPrice(high, form, config);
  let iterations = 2;

  while (!highEval.targetReached && high < SAFE_MAX_LISTING_PRICE) {
    low = high;
    high = Math.min(high * 2, SAFE_MAX_LISTING_PRICE);
    highEval = evaluateAtListingPrice(high, form, config);
    iterations += 1;
  }

  if (!highEval.targetReached) {
    return {
      status: "unreachable",
      message:
        "Target profit is not reachable within the current assumptions. Lower the target or reduce costs.",
      listingPrice: highEval.listingPrice,
      soldPrice: highEval.soldPrice,
      calcResult: highEval.calcResult,
      iterations,
    };
  }

  for (let i = 0; i < MAX_BINARY_STEPS; i += 1) {
    const mid = (low + high) / 2;
    const midEval = evaluateAtListingPrice(mid, form, config);
    iterations += 1;

    if (midEval.targetReached) {
      high = mid;
      highEval = midEval;
    } else {
      low = mid;
    }

    if (high - low <= CENT / 2) {
      break;
    }
  }

  let finalListing = ceilToCent(high);
  let finalEval = evaluateAtListingPrice(finalListing, form, config);
  iterations += 1;

  let adjustSteps = 0;
  while (!finalEval.targetReached && adjustSteps < MAX_CENT_ADJUST_STEPS) {
    finalListing = roundToCent(finalListing + CENT);
    finalEval = evaluateAtListingPrice(finalListing, form, config);
    adjustSteps += 1;
    iterations += 1;
  }

  if (!finalEval.targetReached) {
    return {
      status: "unreachable",
      message:
        "Target profit is not reachable within the current assumptions. Lower the target or reduce costs.",
      listingPrice: finalEval.listingPrice,
      soldPrice: finalEval.soldPrice,
      calcResult: finalEval.calcResult,
      iterations,
    };
  }

  let candidate = roundToCent(Math.max(0, finalListing - CENT));
  let candidateEval = evaluateAtListingPrice(candidate, form, config);
  iterations += 1;

  while (candidate >= 0 && candidateEval.targetReached && adjustSteps < MAX_CENT_ADJUST_STEPS) {
    finalListing = candidate;
    finalEval = candidateEval;
    candidate = roundToCent(Math.max(0, candidate - CENT));
    candidateEval = evaluateAtListingPrice(candidate, form, config);
    iterations += 1;
    adjustSteps += 1;
  }

  return {
    status: "ok",
    message: "Recommended listing price found.",
    listingPrice: finalEval.listingPrice,
    soldPrice: finalEval.soldPrice,
    calcResult: finalEval.calcResult,
    iterations,
  };
}

export function getPricingMarketConfig(market: string): TikTokMarketConfig | undefined {
  return getTikTokMarket(market as TikTokMarketId);
}
