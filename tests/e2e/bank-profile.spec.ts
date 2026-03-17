import { expect, test } from "@playwright/test";

test("renders the bank profile header and overview cards", async ({ page }) => {
  await page.goto("/banks/gcb-bank");

  const overviewPanel = page
    .getByRole("tabpanel")
    .filter({ has: page.getByRole("heading", { name: "Credit context", exact: true }) });

  await expect(page.getByRole("heading", { name: "GCB Bank PLC" })).toBeVisible();
  await expect(page.getByText("Latest vintage summary")).toBeVisible();
  await expect(overviewPanel.getByText("ROA", { exact: true })).toBeVisible();
  await expect(overviewPanel.getByText("ROE", { exact: true })).toBeVisible();
  await expect(overviewPanel.getByText("NIM", { exact: true })).toBeVisible();
  await expect(overviewPanel.getByText("CAR", { exact: true })).toBeVisible();
});

test("switches tabs and renders their active content", async ({ page }) => {
  await page.goto("/banks/gcb-bank");

  await page.getByRole("tab", { name: "CAMEL" }).click();
  const camelPanel = page
    .getByRole("tabpanel")
    .filter({ has: page.getByRole("heading", { name: "Capital Adequacy", exact: true }) });
  await expect(camelPanel.getByRole("heading", { name: "Capital Adequacy", exact: true })).toBeVisible();

  await page.getByRole("tab", { name: "Financials" }).click();
  const financialsPanel = page
    .getByRole("tabpanel")
    .filter({ has: page.getByRole("heading", { name: "5-year common-size-ready table", exact: true }) });
  await expect(financialsPanel.getByRole("heading", { name: "5-year common-size-ready table", exact: true })).toBeVisible();

  await page.getByRole("tab", { name: "Fixed Income" }).click();
  const fixedIncomePanel = page
    .getByRole("tabpanel")
    .filter({ has: page.getByText("This bank has no bonds listed on the Ghana Fixed Income Market.", { exact: true }) });
  await expect(
    fixedIncomePanel.getByText("This bank has no bonds listed on the Ghana Fixed Income Market.", { exact: true }),
  ).toBeVisible();
});

test("expands CAMEL sections and exposes ratio details", async ({ page }) => {
  await page.goto("/banks/gcb-bank");
  await page.getByRole("tab", { name: "CAMEL" }).click();

  const camelPanel = page
    .getByRole("tabpanel")
    .filter({ has: page.getByRole("heading", { name: "Capital Adequacy", exact: true }) });
  const capitalAdequacyCard = camelPanel
    .getByRole("heading", { name: "Capital Adequacy Ratio", exact: true })
    .locator("xpath=ancestor::div[contains(@class,'rounded-xl')][1]");

  await expect(capitalAdequacyCard.getByRole("heading", { name: "Capital Adequacy Ratio", exact: true })).toBeVisible();
  await expect(capitalAdequacyCard.getByText("BoG minimum 13%", { exact: true })).toBeVisible();
  await expect(capitalAdequacyCard.getByText("BoG Capital Requirements Directive", { exact: true })).toBeVisible();
  await expect(capitalAdequacyCard.getByText("Q4 2025", { exact: true })).toBeVisible();
});

test("updates financial statement controls without losing headers", async ({ page }) => {
  await page.goto("/banks/gcb-bank");
  await page.getByRole("tab", { name: "Financials" }).click();

  await page.getByRole("button", { name: "% of Total" }).click();
  await page.getByRole("button", { name: "Balance Sheet" }).click();
  await page.getByRole("button", { name: "3Y" }).click();

  const financialsPanel = page
    .getByRole("tabpanel")
    .filter({ has: page.getByRole("heading", { name: "5-year common-size-ready table", exact: true }) });
  const financialsTable = financialsPanel.getByRole("table");

  await expect(financialsTable.getByRole("columnheader", { name: "2025 Audited", exact: true })).toBeVisible();
  await expect(financialsTable.getByText("Gross loans and advances", { exact: true })).toBeVisible();
});

test("supports the 375px mobile layout with horizontal financial scrolling", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  await page.goto(`${process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000"}/banks/gcb-bank`);
  await page.getByRole("tab", { name: "Financials" }).click();

  const tableContainer = page.locator("table").first();
  await expect(tableContainer).toBeVisible();
  await expect(page.getByRole("tab", { name: "Fixed Income" })).toBeVisible();

  await context.close();
});
