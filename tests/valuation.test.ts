import { describe, expect, it } from "vitest";

import {
  computeCostOfEquity,
  computeDdmIntrinsicValue,
  computeJustifiedPriceToBook,
  computeResidualIncomeValue,
  computeSustainableGrowthRate,
  computeValuation,
} from "@/lib/valuation";

describe("valuation utilities", () => {
  it("computes cost of equity from CAPM inputs", () => {
    expect(computeCostOfEquity(0.18, 0.92, 0.255)).toBeCloseTo(0.249, 6);
  });

  it("computes sustainable growth from ROE and payout ratio", () => {
    expect(computeSustainableGrowthRate(0.262, 0.34)).toBeCloseTo(0.17292, 6);
  });

  it("returns null for invalid payout ratios", () => {
    expect(computeSustainableGrowthRate(0.2, 1.2)).toBeNull();
  });

  it("computes DDM and Residual Income outputs for valid assumptions", () => {
    expect(computeDdmIntrinsicValue(1.85, 0.17292, 0.249)).toBeCloseTo(28.5213196635, 6);
    expect(computeResidualIncomeValue(9.4, 0.262, 0.249, 0.17292)).toBeCloseTo(11.0062039958, 6);
    expect(computeJustifiedPriceToBook(0.262, 0.249, 0.17292)).toBeCloseTo(1.1708727655, 6);
  });

  it("returns null when the model would divide by zero or worse", () => {
    expect(computeDdmIntrinsicValue(1.85, 0.25, 0.25)).toBeNull();
    expect(computeResidualIncomeValue(9.4, 0.262, 0.17292, 0.17292)).toBeNull();
    expect(computeJustifiedPriceToBook(0.262, 0.17292, 0.17292)).toBeNull();
  });

  it("builds a full valuation payload with upside and value-creation spread", () => {
    const valuation = computeValuation({
      riskFreeRate: 0.18,
      beta: 0.92,
      marketReturn: 0.255,
      returnOnEquity: 0.262,
      dividendPayoutRatio: 0.34,
      dividendPerShare: 1.85,
      bookValuePerShare: 9.4,
      earningsPerShare: 2.46,
      marketPrice: 7.85,
    });

    expect(valuation).not.toBeNull();
    expect(valuation?.actualPriceToBook).toBeCloseTo(0.835106383, 6);
    expect(valuation?.upsidePercent).toBeCloseTo(0.4020642033, 6);
    expect(valuation?.valueCreationSpread).toBeCloseTo(0.013, 6);
  });
});
