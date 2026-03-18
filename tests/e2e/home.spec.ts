import { expect, test } from "@playwright/test";

test("renders the Phase 1 bank profile page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "GCB Bank PLC" })).toBeVisible();
  await expect(page.getByText("DDM, Residual Income, and P/B signal")).toBeVisible();
  await expect(page.getByText("Five-year trends required by the bank profile roadmap")).toBeVisible();
  await expect(page.getByText("Relative sector context for Phase 1 review")).toBeVisible();
});
