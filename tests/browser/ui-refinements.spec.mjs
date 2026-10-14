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
  await page.goto("topic.html?id=fluid-simulation&view=list");
  const row = page.locator(".topic-run-row").first();
  await expect(row.locator(".topic-run-date")).toBeHidden();
  await expect(row.locator(".topic-run-billing")).toBeVisible();
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

test("experiment rows distinguish model makers from billing providers and explain API price scale", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("topic.html?id=fluid-simulation&view=list");
  const row = page.locator(".topic-run-row").first();
  await expect(page.locator(".topic-runs-table thead th").nth(1)).toHaveText(
    "模型厂商",
  );
  await expect(page.locator(".topic-runs-table thead th").nth(2)).toHaveText(
    "接入/付费供应商",
  );
  await row.locator("[data-row-details]").click();
  await expect(row.locator(".topic-run-model-maker")).toContainText(
    "Anthropic",
  );
  await expect(
    row.locator(".topic-run-model-maker .mobile-cell-label"),
  ).toBeVisible();
  await expect(row.locator(".topic-run-provider")).toBeVisible();
  await expect(row.locator(".topic-run-provider")).toContainText(
    "GitHub Copilot",
  );
  await expect(
    row.locator(".topic-run-provider .mobile-cell-label"),
  ).toBeVisible();
  await expect(row.locator(".topic-run-billing summary")).not.toContainText(
    "接入/付费供应商",
  );
  const pricing = page.locator("#pricing-context");
  await expect(pricing).toBeVisible();
  await pricing.locator(":scope > summary").click();
  await pricing.locator("details > summary").click();
  await expect(pricing.locator(".pricing-examples")).toBeVisible();
  await expect(pricing.locator(".pricing-examples")).toContainText(
    "API 约 $60",
  );
  await expect(pricing.locator(".pricing-examples")).toContainText(
    "API 约 $24",
  );
  await expect(
    pricing.locator(
      'a[href="https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus"]',
    ),
  ).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.setViewportSize({ width: 1440, height: 960 });
  const makerBounds = await row.locator(".topic-run-model-maker").boundingBox();
  const billingProviderBounds = await row
    .locator(".topic-run-provider")
    .boundingBox();
  expect(billingProviderBounds.x).toBeGreaterThan(makerBounds.x);
});

test("gallery screenshot errors can be retried without changing the preview source", async ({
  page,
}) => {
  await page.goto("./");
  const source = await page
    .locator(".topic-cover img")
    .first()
    .evaluate((img) => img.currentSrc);
  const screenshotURL = new URL(source, page.url()).href;
  let fail = true;
  await page.route(screenshotURL, (route) =>
    fail ? route.abort() : route.continue(),
  );
  await page.reload();
  const figure = page.locator(".topic-cover").first();
  await expect(figure.locator(".image-feedback")).toContainText("截图加载失败");
  fail = false;
  await figure.locator("[data-retry-image]").click();
  await expect(figure.locator(".image-feedback")).toBeHidden();
  await expect(figure.locator("img")).toHaveJSProperty("currentSrc", source);
  expect(
    await figure.locator("img").evaluate((img) => img.naturalWidth),
  ).toBeGreaterThan(0);
});

test("mobile comparison labels show models and expose only the current preview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "compare.html?left=fluid-simulation--claude-sonnet-5-5-medium-r01&right=fluid-simulation--claude-haiku-5-5-max-r01",
  );
  await expect(page.locator("#layout")).toBeHidden();
  await expect(page.locator(".mobile-layout-note")).toBeVisible();
  await expect(page.locator("#relation")).toContainText("已记录的原始输入一致");
  await expect(page.locator('[data-mobile="left"]')).toContainText(
    "Claude Sonnet 5.5",
  );
  await expect(page.locator("#panel-left .panel-identity")).toContainText(
    "medium",
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
