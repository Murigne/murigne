export type ValuationInputs = {
  riskFreeRate: number;
  beta: number;
  marketReturn: number;
  returnOnEquity: number;
  dividendPayoutRatio: number;
  dividendPerShare: number;
  bookValuePerShare: number;
  earningsPerShare: number;
  marketPrice: number;
};

export type ComputedValuation = {
  costOfEquity: number;
  sustainableGrowthRate: number;
  nextDividend: number;
  ddmIntrinsicValue: number | null;
  residualIncomeValue: number | null;
  justifiedPriceToBook: number | null;
  actualPriceToBook: number;
  upsidePercent: number | null;
  valueCreationSpread: number;
};

function isInvalidNumber(value: number): boolean {
  return Number.isNaN(value) || !Number.isFinite(value);
}

export function computeCostOfEquity(
  riskFreeRate: number,
  beta: number,
  marketReturn: number,
): number | null {
  if ([riskFreeRate, beta, marketReturn].some(isInvalidNumber)) {
    return null;
  }

  return riskFreeRate + beta * (marketReturn - riskFreeRate);
}

export function computeSustainableGrowthRate(
  returnOnEquity: number,
  dividendPayoutRatio: number,
): number | null {
  if ([returnOnEquity, dividendPayoutRatio].some(isInvalidNumber)) {
    return null;
  }

  if (dividendPayoutRatio < 0 || dividendPayoutRatio > 1) {
    return null;
  }

  return returnOnEquity * (1 - dividendPayoutRatio);
}

export function computeDdmIntrinsicValue(
  dividendPerShare: number,
  sustainableGrowthRate: number,
  costOfEquity: number,
): number | null {
  if ([dividendPerShare, sustainableGrowthRate, costOfEquity].some(isInvalidNumber)) {
    return null;
  }

  if (dividendPerShare <= 0 || costOfEquity <= sustainableGrowthRate) {
    return null;
  }

  const nextDividend = dividendPerShare * (1 + sustainableGrowthRate);
  return nextDividend / (costOfEquity - sustainableGrowthRate);
}

export function computeResidualIncomeValue(
  bookValuePerShare: number,
  returnOnEquity: number,
  costOfEquity: number,
  sustainableGrowthRate: number,
): number | null {
  if ([bookValuePerShare, returnOnEquity, costOfEquity, sustainableGrowthRate].some(isInvalidNumber)) {
    return null;
  }

  if (bookValuePerShare <= 0 || costOfEquity <= sustainableGrowthRate) {
    return null;
  }

  return bookValuePerShare + (((returnOnEquity - costOfEquity) * bookValuePerShare) / (costOfEquity - sustainableGrowthRate));
}

export function computeJustifiedPriceToBook(
  returnOnEquity: number,
  costOfEquity: number,
  sustainableGrowthRate: number,
): number | null {
  if ([returnOnEquity, costOfEquity, sustainableGrowthRate].some(isInvalidNumber)) {
    return null;
  }

  if (costOfEquity <= sustainableGrowthRate) {
    return null;
  }

  return 1 + (returnOnEquity - costOfEquity) / (costOfEquity - sustainableGrowthRate);
}

export function computeValuation(inputs: ValuationInputs): ComputedValuation | null {
  const costOfEquity = computeCostOfEquity(inputs.riskFreeRate, inputs.beta, inputs.marketReturn);
  const sustainableGrowthRate = computeSustainableGrowthRate(
    inputs.returnOnEquity,
    inputs.dividendPayoutRatio,
  );

  if (costOfEquity === null || sustainableGrowthRate === null || inputs.bookValuePerShare <= 0) {
    return null;
  }

  const nextDividend = inputs.dividendPerShare * (1 + sustainableGrowthRate);
  const ddmIntrinsicValue = computeDdmIntrinsicValue(
    inputs.dividendPerShare,
    sustainableGrowthRate,
    costOfEquity,
  );
  const residualIncomeValue = computeResidualIncomeValue(
    inputs.bookValuePerShare,
    inputs.returnOnEquity,
    costOfEquity,
    sustainableGrowthRate,
  );
  const justifiedPriceToBook = computeJustifiedPriceToBook(
    inputs.returnOnEquity,
    costOfEquity,
    sustainableGrowthRate,
  );
  const actualPriceToBook = inputs.marketPrice / inputs.bookValuePerShare;
  const upsidePercent =
    residualIncomeValue === null ? null : (residualIncomeValue - inputs.marketPrice) / inputs.marketPrice;

  return {
    costOfEquity,
    sustainableGrowthRate,
    nextDividend,
    ddmIntrinsicValue,
    residualIncomeValue,
    justifiedPriceToBook,
    actualPriceToBook,
    upsidePercent,
    valueCreationSpread: inputs.returnOnEquity - costOfEquity,
  };
}
