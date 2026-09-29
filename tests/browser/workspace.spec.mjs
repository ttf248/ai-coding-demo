import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
const data = loadCatalog();
test("comparison opens without any selected experiments", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("compare.html");
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator("#group option")).toHaveCount(
    data.prompts.length + 1,
  );
  await page.locator("#layout").selectOption("quad");
  await expect(page.locator(".compare-panel:visible")).toHaveCount(4);
  await page.locator('[data-tab="prompt"]').click();
  await page.locator("#pick-models").click();
  await page.locator("#model-search").fill("no-such-model-zzzz");
  await expect(page.locator("#model-list")).toContainText("没有匹配");
  await page.locator("#close-picker").click();
  await page.reload();
  await expect(page.locator("#layout")).toHaveValue("quad");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-mobile="fourth"]').click();
  await expect(page.locator("#panel-fourth")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
