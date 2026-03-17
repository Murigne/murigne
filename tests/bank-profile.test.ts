import { describe, expect, it } from "vitest";

import {
  getBankProfile,
  getBenchmarkState,
  getCamelScoreBand,
  getFinancialStatementRows,
  getHeadlineMetricSummary,
  hasFixedIncomeEmptyState,
  parseBankProfileQuery,
} from "@/lib/bank-profile";

describe("bank profile helpers", () => {
  const profile = getBankProfile("gcb-bank");

  it("maps the headline metric summary with formatted value and benchmark state", () => {
    const metric = profile?.headlineMetrics.find((item) => item.key === "car");
    expect(metric).toBeDefined();

    const summary = getHeadlineMetricSummary(metric!);

    expect(summary.valueLabel).toBe("18.20%");
    expect(summary.yoyLabel).toContain("+1.10pp YoY");
    expect(summary.benchmarkState).toBe("above");
  });

  it("returns score bands across CAMEL boundaries", () => {
    expect(getCamelScoreBand(1.5)).toBe("Strong");
    expect(getCamelScoreBand(1.84)).toBe("Satisfactory");
    expect(getCamelScoreBand(3.2)).toBe("Fair");
    expect(getCamelScoreBand(4.1)).toBe("Marginal");
    expect(getCamelScoreBand(4.8)).toBe("Unsatisfactory");
    expect(getCamelScoreBand(null)).toBeNull();
  });

  it("detects benchmark states and neutral missing values", () => {
    expect(getBenchmarkState(0.18, 0.13)).toBe("above");
    expect(getBenchmarkState(0.04, 0.05)).toBe("below");
    expect(getBenchmarkState(null, 0.05)).toBe("neutral");
  });

  it("filters financial statement rows by statement and year range", () => {
    const rows = getFinancialStatementRows(profile!, "income_statement", "common_size", 3);

    expect(rows).toHaveLength(3);
    expect(rows[0]?.values).toHaveLength(3);
    expect(rows[0]?.values[0]?.year).toBe("2025");
  });

  it("returns the fixed income empty state for a bank without listed bonds", () => {
    expect(hasFixedIncomeEmptyState(profile!)).toBe(true);
  });

  it("parses supported query params and defaults invalid input", () => {
    expect(
      parseBankProfileQuery({
        statementView: "common_size",
        years: "3",
        period: "2025-12-31",
      }),
    ).toEqual({
      statementView: "common_size",
      years: 3,
      period: "2025-12-31",
    });

    expect(
      parseBankProfileQuery({
        statementView: "weird",
        years: "9",
        period: "latest-ish",
      }),
    ).toEqual({
      statementView: "absolute",
      years: 5,
      period: "latest",
    });
  });
});
