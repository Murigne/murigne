import { describe, expect, it } from "vitest";

import {
  bankHealthRatios,
  bankUniverseRows,
  marketOverviewCards,
  primaryNavigation,
  vintageHighlights,
} from "@/lib/mock-data";

describe("Phase 0 scaffold", () => {
  it("exposes dashboard card seed data", () => {
    expect(marketOverviewCards).toHaveLength(4);
  });

  it("provides formula-aware ratio displays with unique ids", () => {
    expect(bankHealthRatios).toHaveLength(4);
    expect(new Set(bankHealthRatios.map((ratio) => ratio.id)).size).toBe(bankHealthRatios.length);
    expect(bankHealthRatios.every((ratio) => ratio.formula.length > 0)).toBe(true);
  });

  it("defines navigation and provenance preview data", () => {
    expect(primaryNavigation[0]?.id).toBe("dashboard");
    expect(vintageHighlights.some((item) => item.auditStatus === "Audited")).toBe(true);
    expect(bankUniverseRows).toHaveLength(3);
  });
});
