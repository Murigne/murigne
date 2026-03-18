import { expect, test } from "@playwright/test";

test("bank profile route uses widened content shell", async ({ page }) => {
  await page.goto("/banks/gcb-bank");

  await expect(page.getByRole("heading", { name: "GCB Bank PLC" })).toBeVisible();

  const profileContent = page.getByTestId("bank-profile-content");

  await expect(profileContent).toBeVisible();
  await expect(profileContent).toHaveClass(/max-w-\[72rem\]/);
});
