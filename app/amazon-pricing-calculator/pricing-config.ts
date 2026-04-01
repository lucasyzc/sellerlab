import {
  calculate,
  type AmazonCalcResult,
  type AmazonFormState,
  type AmazonMarketConfig,
  type AmazonMarketId,
} from "../amazon-fee-calculator/amazon-config";

export const AMAZON_PRICING_MARKET_IDS: AmazonMarketId[] = ["us"];

export type AmazonPricingTargetMode = "profit_amount" | "profit_margin";

export type AmazonPricingFormState = {
  targetMode: AmazonPricingTargetMode;
  targetValue: number;
  discountRate: number;
  sellerType: string;
  category: string;
  fulfillmentMethod: string;
  shippingCharged: number;
  giftWrapCharge: number;
  itemCost: number;
  actualShippingCost: number;
  otherCosts: number;
  weightMajor: number;
  weightMinor: number;
  dimensionLength: number;
  dimensionWidth: number;
  dimensionHeight: number;
  isApparel: boolean;
  isDangerousGoods: boolean;
  storageMonths: number;
  storageMonth: number;
};

export type AmazonPricingSolveStatus = "ok" | "invalid_input" | "unreachable";

export type AmazonPricingEvaluation = {
  listingPrice: number;
  soldPrice: number;
  calcResult: AmazonCalcResult;
  targetReached: boolean;
};

export type AmazonPricingSolveResult = {
  status: AmazonPricingSolveStatus;
  message: string;
  listingPrice: number;
  soldPrice: number;
  calcResult: AmazonCalcResult | null;
  iterations: number;
};

const EPSILON = 1e-9;
const CENT = 0.01;
const SAFE_MAX_LISTING_PRICE = 1_000_000;
const MAX_BINARY_STEPS = 80;
const MAX_CENT_ADJUST_STEPS = 300;

function roundToCent(value: number): number {
  return Math.round((value + EPSILON) * 100) / 100;
}

function ceilToCent(value: number): number {
  return Math.ceil((value - EPSILON) * 100) / 100;
}

function normalizeNonNegative(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return value < 0 ? 0 : value;
}

function discountFactor(discountRate: number): number {
  return 1 - discountRate / 100;
}

function isTargetReached(
  form: AmazonPricingFormState,
  calcResult: AmazonCalcResult,
): boolean {
  if (form.targetMode === "profit_amount") {
    return calcResult.netProfit >= form.targetValue - EPSILON;
  }
  return calcResult.margin >= form.targetValue - EPSILON;
}

function buildFeeForm(
  form: AmazonPricingFormState,
  soldPrice: number,
): AmazonFormState {
  return {
    sellerType: form.sellerType,
    category: form.category,
    fulfillmentMethod: form.fulfillmentMethod,
    soldPrice,
    shippingCharged: form.shippingCharged,
    giftWrapCharge: form.giftWrapCharge,
    itemCost: form.itemCost,
    actualShippingCost: form.actualShippingCost,
    otherCosts: form.otherCosts,
    weightMajor: form.weightMajor,
    weightMinor: form.weightMinor,
    dimensionLength: form.dimensionLength,
    dimensionWidth: form.dimensionWidth,
    dimensionHeight: form.dimensionHeight,
    isApparel: form.isApparel,
    isDangerousGoods: form.isDangerousGoods,
    storageMonths: form.storageMonths,
    storageMonth: form.storageMonth,
  };
}

function validate(form: AmazonPricingFormState): string | null {
  if (!Number.isFinite(form.targetValue) || form.targetValue < 0) {
    return "Target value must be a non-negative number.";
  }

  if (!Number.isFinite(form.discountRate) || form.discountRate < 0) {
    return "Discount rate must be a non-negative number.";
  }

  if (form.discountRate >= 100) {
    return "Discount rate must be lower than 100%.";
  }

  const nonNegativeFields: Array<[number, string]> = [
    [form.shippingCharged, "Shipping charged"],
    [form.giftWrapCharge, "Gift wrap charge"],
    [form.itemCost, "Item cost"],
    [form.actualShippingCost, "Actual shipping cost"],
    [form.otherCosts, "Other costs"],
  ];

  for (const [value, label] of nonNegativeFields) {
    if (!Number.isFinite(value) || value < 0) {
      return `${label} must be a non-negative number.`;
    }
  }

  return null;
}

export function makeDefaultPricingForm(
  config: AmazonMarketConfig,
): AmazonPricingFormState {
  return {
    targetMode: "profit_amount",
    targetValue: 10,
    discountRate: 0,
    sellerType: config.sellerTypes[0].value,
    category: config.categories[0].value,
    fulfillmentMethod: config.fulfillmentMethods[0].value,
    shippingCharged: config.defaults.shippingCharged,
    giftWrapCharge: 0,
    itemCost: config.defaults.itemCost,
    actualShippingCost: config.defaults.shippingCost,
    otherCosts: 0,
    weightMajor: config.defaults.weightMajor,
    weightMinor: config.defaults.weightMinor,
    dimensionLength: config.defaults.dimensionLength,
    dimensionWidth: config.defaults.dimensionWidth,
    dimensionHeight: config.defaults.dimensionHeight,
    isApparel: false,
    isDangerousGoods: false,
    storageMonths: 1,
    storageMonth: 1,
  };
}

export function evaluateAtListingPrice(
  listingPrice: number,
  form: AmazonPricingFormState,
  config: AmazonMarketConfig,
): AmazonPricingEvaluation {
  const normalizedListingPrice = normalizeNonNegative(listingPrice);
  const factor = discountFactor(form.discountRate);
  const soldPrice = normalizeNonNegative(normalizedListingPrice * factor);
  const calcResult = calculate(buildFeeForm(form, soldPrice), config);

  return {
    listingPrice: roundToCent(normalizedListingPrice),
    soldPrice: roundToCent(soldPrice),
    calcResult,
    targetReached: isTargetReached(form, calcResult),
  };
}

export function solveListingPrice(
  form: AmazonPricingFormState,
  config: AmazonMarketConfig,
): AmazonPricingSolveResult {
  const validationError = validate(form);
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

  const factor = discountFactor(form.discountRate);
  if (factor <= 0) {
    return {
      status: "invalid_input",
      message: "Discount rate must be lower than 100%.",
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

  let iterations = 1;
  let low = 0;
  let high = Math.max(1, config.defaults.soldPrice / factor);
  let highEval = evaluateAtListingPrice(high, form, config);
  iterations += 1;

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

  while (
    candidate >= 0 &&
    candidateEval.targetReached &&
    adjustSteps < MAX_CENT_ADJUST_STEPS
  ) {
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
