import { test, expect } from "@playwright/test";

test("mobile directory exposes filters and the first card action within the first screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await expect(page.locator("#category")).toBeHidden();
  await expect(page.locator("#q")).toBeVisible();
  const action = page.locator(".topic-card .preview-link").first();
  const bounds = await action.boundingBox();
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
  await page.locator("#mobile-filter-toggle").click();
  await expect(page.locator("#category")).toBeVisible();
  await page.locator("#model").selectOption("gpt-6-astra");
  await page.locator("#mobile-filter-toggle").click();
  await expect(page.locator('[data-remove-filter="model"]')).toBeVisible();
  await page.reload();
  await expect(page.locator("#model")).toHaveValue("gpt-6-astra");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("mobile experiment cards show actions without horizontal scrolling and expand billing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("topic.html?id=fluid-simulation");
  const row = page.locator(".topic-run-row").first();
  await expect(row.locator(".topic-run-date")).toBeHidden();
  await expect(row.locator("[data-compare]")).toBeVisible();
  const actions = await row.locator(".topic-row-actions").boundingBox();
  expect(actions.x + actions.width).toBeLessThanOrEqual(390);
  await row.locator("[data-row-details]").click();
  await expect(row.locator(".topic-run-date")).toBeVisible();
  await row.locator(".billing-summary summary").click();
  await expect(row.locator(".billing-summary p")).toContainText("批次总额");
  await row.locator("[data-compare]").click();
  await expect(page.locator("#compare-tray")).toContainText(
    "再选一个实验开始对比",
  );
  await row.locator("[data-row-details]").click();
  await expect(row.locator(".topic-run-date")).toBeHidden();
});

test("gallery screenshot errors can be retried without changing the preview source", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/screenshot.png", (route) =>
    fail ? route.abort() : route.continue(),
  );
  await page.goto("./");
  const figure = page.locator(".topic-cover").first();
  await expect(figure.locator(".image-feedback")).toContainText("截图加载失败");
  const source = await figure.locator("img").getAttribute("src");
  fail = false;
  await figure.locator("[data-retry-image]").click();
  await expect(figure.locator(".image-feedback")).toBeHidden();
  await expect(figure.locator("img")).toHaveAttribute("src", source);
  expect(
    await figure.locator("img").evaluate((img) => img.naturalWidth),
  ).toBeGreaterThan(0);
});

test("mobile comparison labels show models and expose only the current preview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("compare.html?group=fluid-simulation/v1");
  await expect(page.locator("#layout")).toBeHidden();
  await expect(page.locator(".mobile-layout-note")).toBeVisible();
  await expect(page.locator("#relation")).toContainText("任务正文一致");
  await expect(page.locator('[data-mobile="left"]')).toContainText("Claude");
  await expect(page.locator("#panel-left .panel-identity")).toContainText(
    "max",
  );
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator('[data-mobile="right"]').click();
  await expect(page.locator("#panel-right")).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator("#panel-right .panel-more summary").click();
  await page.locator('[data-unload="right"]').click();
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
