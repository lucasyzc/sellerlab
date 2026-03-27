import {
  calculate,
  type CalcResult,
  type Cat,
  type FormState,
  type MarketConfig,
} from "../ebay-fee-calculator/market-config";

export type PricingTargetMode = "profit_amount" | "profit_margin";

export type PricingFormState = {
  targetMode: PricingTargetMode;
  targetValue: number;
  discountRate: number;
  shippingCharged: number;
  itemCost: number;
  actualShippingCost: number;
  otherCosts: number;
  storeType: string;
  category: string;
  subCategory: string;
  taxRate: number;
  isTopRated: boolean;
  isInternational: boolean;
  internationalDestination: string;
  adRate: number;
};

export type PricingSolveStatus = "ok" | "invalid_input" | "unreachable";

export type PricingEvaluation = {
  listingPrice: number;
  soldPrice: number;
  calcResult: CalcResult;
  targetReached: boolean;
};

export type PricingSolveResult = {
  status: PricingSolveStatus;
  message: string;
  listingPrice: number;
  soldPrice: number;
  calcResult: CalcResult | null;
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

function targetReached(form: PricingFormState, calcResult: CalcResult): boolean {
  if (form.targetMode === "profit_amount") {
    return calcResult.netProfit >= form.targetValue - EPSILON;
  }
  return calcResult.margin >= form.targetValue - EPSILON;
}

function buildFeeForm(form: PricingFormState, soldPrice: number): FormState {
  return {
    storeType: form.storeType,
    category: form.category,
    subCategory: form.subCategory,
    soldPrice,
    shippingCharged: form.shippingCharged,
    actualShippingCost: form.actualShippingCost,
    itemCost: form.itemCost,
    otherCosts: form.otherCosts,
    taxRate: form.taxRate,
    isTopRated: form.isTopRated,
    isInternational: form.isInternational,
    internationalDestination: form.internationalDestination,
    adRate: form.adRate,
  };
}

function validate(form: PricingFormState): string | null {
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
    [form.itemCost, "Item cost"],
    [form.actualShippingCost, "Actual shipping cost"],
    [form.otherCosts, "Other costs"],
    [form.taxRate, "Tax rate"],
    [form.adRate, "Promoted listing ad rate"],
  ];

  for (const [value, label] of nonNegativeFields) {
    if (!Number.isFinite(value) || value < 0) {
      return `${label} must be a non-negative number.`;
    }
  }

  return null;
}

export function getDefaultSubCategory(category: Cat | undefined): string {
  return category?.subs?.[0]?.value ?? "";
}

export function makeDefaultPricingForm(config: MarketConfig): PricingFormState {
  const firstCategory = config.categories[0];
  return {
    targetMode: "profit_amount",
    targetValue: 10,
    discountRate: 0,
    shippingCharged: config.defaults.shippingCharged,
    itemCost: config.defaults.itemCost,
    actualShippingCost: config.defaults.shippingCost,
    otherCosts: 0,
    storeType: config.storeTypes[0].value,
    category: firstCategory.value,
    subCategory: getDefaultSubCategory(firstCategory),
    taxRate: 0,
    isTopRated: false,
    isInternational: false,
    internationalDestination: config.internationalDestinations?.[0]?.value ?? "",
    adRate: 0,
  };
}

export function evaluateAtListingPrice(
  listingPrice: number,
  form: PricingFormState,
  config: MarketConfig,
): PricingEvaluation {
  const normalizedListingPrice = normalizeNonNegative(listingPrice);
  const factor = discountFactor(form.discountRate);
  const soldPrice = normalizeNonNegative(normalizedListingPrice * factor);
  const calcResult = calculate(buildFeeForm(form, soldPrice), config);

  return {
    listingPrice: roundToCent(normalizedListingPrice),
    soldPrice: roundToCent(soldPrice),
    calcResult,
    targetReached: targetReached(form, calcResult),
  };
}

export function solveListingPrice(
  form: PricingFormState,
  config: MarketConfig,
): PricingSolveResult {
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
