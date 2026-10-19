import { test, expect } from "@playwright/test";
test("comparison defaults to live preview first and preserves screenshot evidence", async ({
  page,
}) => {
  await page.route(/\/(previews|demos)\/.*\.html(?:\?.*)?$/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><h1>Preview</h1>",
    }),
  );
  await page.goto("compare.html");
  await expect(page.locator("#compare-start")).toBeVisible();
  await expect(page.locator(".compare-grid")).toBeHidden();
  await expect(page.locator(".compare-controls [data-tab]")).toHaveText([
    "实时预览",
    "截图比较",
    "提示词差异",
    "实验详情",
  ]);
  await page.locator("#group").selectOption("fluid-simulation/v1");
  await expect(page.locator('[data-tab="preview"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("iframe")).toHaveCount(2);
  await expect(page.locator("#viewport-control")).toBeVisible();
  await page.reload();
  await expect(page.locator("iframe")).toHaveCount(2);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator('[data-mobile="right"]').click();
  await expect(page.locator("#panel-right iframe")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.locator('[data-tab="snapshot"]').click();
  await page.reload();
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
