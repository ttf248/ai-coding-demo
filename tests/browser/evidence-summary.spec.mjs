import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics|googletagmanager/, (r) => r.abort());
});
test("comparison exposes recorded observations, reviewed frames and unverified functionality", async ({
  page,
}) => {
  await page.goto(
    "compare.html?left=circuit-lab--claude-opus-5-5-max-r01&right=circuit-lab--gpt-6-1-sol-max-r01&tab=snapshot",
  );
  const summary = page.locator(".difference-summary");
  await expect(summary).toBeVisible();
  await expect(summary).toContainText("任务可见覆盖");
  await expect(summary).toContainText("功能验证：未登记");
  await summary.locator("details > summary").first().click();
  const link = summary.locator('a[href^="screenshots.html"]').first();
  await expect(link).toBeVisible();
  const href = await link.getAttribute("href");
  await link.click();
  await expect(page).toHaveURL(new RegExp("frame="));
  await expect(page.locator(".captures-stage img")).toBeVisible();
  expect(new URL(page.url()).searchParams.get("frame")).toBe(
    new URL(href, "https://example.test").searchParams.get("frame"),
  );
});
test("score split remains readable on mobile and preview availability is not functional validation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("index.html");
  await expect(page.locator("#preview-only")).toHaveText("有预览");
  await page.goto("topic.html?id=bluebook");
  await expect(page.locator(".score-split").first()).toContainText("视觉表现");
  await page.locator(".score-details > summary").first().click();
  await expect(page.locator(".verification-note").first()).toContainText(
    "未登记",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
