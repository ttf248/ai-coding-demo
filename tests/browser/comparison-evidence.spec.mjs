import { test, expect } from "@playwright/test";
test("comparison starts with one empty state and defaults to screenshot evidence", async ({
  page,
}) => {
  await page.goto("compare.html");
  await expect(page.locator("#compare-start")).toBeVisible();
  await expect(page.locator(".compare-grid")).toBeHidden();
  await page.locator("#group").selectOption("fluid-simulation/v1");
  await expect(page.locator('[data-tab="snapshot"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator("#viewport-control")).toBeHidden();
  await expect(page.locator(".summary-record")).toHaveCount(2);
  await expect(page.locator(".summary-record").first()).toContainText(
    "案例批次",
  );
  await page.locator(".summary-record .score-details summary").first().click();
  await expect(
    page.locator(".summary-record").first().locator("meter"),
  ).toHaveCount(5);
  await page.locator('[data-tab="conditions"]').click();
  await expect(page.locator("#conditions-view")).toBeVisible();
  await expect(page.locator("#conditions-view")).toContainText("费用");
  await page.goto("compare.html?group=fluid-simulation/v1&tab=info");
  await expect(page.locator("#conditions-view")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-tab="snapshot"]').click();
  await expect(page.locator(".summary-record")).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
