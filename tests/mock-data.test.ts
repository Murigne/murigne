import { describe, expect, it } from "vitest";

import { bankProfile, bankHealthRatios, marketOverviewCards, primaryNavigation } from "@/lib/mock-data";

describe("bank profile mock contract", () => {
  it("exposes overview data and bank profile valuation outputs", () => {
    expect(marketOverviewCards).toHaveLength(4);
    expect(bankProfile.name).toBe("GCB Bank PLC");
    expect(bankProfile.valuation.ddmIntrinsicValue).not.toBeNull();
    expect(bankProfile.valuation.residualIncomeValue).not.toBeNull();
    expect(bankProfile.valuation.justifiedPriceToBook).not.toBeNull();
  });

  it("keeps every ratio formula-linked and vintage-stamped", () => {
    expect(bankHealthRatios).toHaveLength(4);
    expect(
      bankHealthRatios.every((ratio) => ratio.formula.length > 0 && ratio.vintage.sourceLabel.length > 0),
    ).toBe(true);
  });

  it("defines the roadmap-driven trend views and navigation entry points", () => {
    expect(primaryNavigation[0]?.id).toBe("dashboard");
    expect(bankProfile.trends).toHaveLength(3);
    expect(bankProfile.trends.filter((trend) => trend.values.length > 0)).toHaveLength(3);
    expect(bankProfile.trends.every((trend) => trend.values.length === 5)).toBe(true);
  });
});
