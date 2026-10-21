import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics|googletagmanager/, (route) =>
    route.abort(),
  );
  await page.setViewportSize({ width: 390, height: 844 });
});

test("mobile directory reveals works early and keeps display options usable", async ({
  page,
}) => {
  await page.goto("index.html");
  await expect(page.locator("#display-options")).not.toHaveAttribute("open");
  await expect(page.locator("#result-count")).toBeVisible();
  expect((await page.locator(".card").first().boundingBox()).y).toBeLessThan(
    410,
  );
  await page.locator("#display-options > summary").click();
  await page.locator('[data-group="runs"]').click();
  await page.locator('[data-view="list"]').click();
  await page.locator("#sort").selectOption("recent");
  await page.locator("#display-options > summary").click();
  await page.reload();
  await expect(page.locator("#project-grid")).toHaveClass(/run-ledger/);
  await expect(page.locator("#sort")).toHaveValue("recent");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("mobile selection stays compact and leads to a second same-task experiment", async ({
  page,
}) => {
  await page.goto("index.html");
  const first = page.locator(".topic-card").first();
  await expect(first.locator("[data-pick-topic]")).toContainText("挑选模型");
  await expect(first.locator("[data-compare]")).toHaveText("加入对比");
  await first.locator("[data-compare]").click();
  const tray = page.locator("#compare-tray");
  await expect(tray).toHaveAttribute("data-expanded", "false");
  expect((await tray.boundingBox()).height).toBeLessThan(100);
  await tray.locator("[data-find-related]").click();
  await expect(page.locator("#quick-picker")).toBeVisible();
  await page
    .locator('#quick-candidates [data-compare][aria-pressed="false"]')
    .first()
    .click();
  await page.locator("#quick-close").click();
  await expect(tray).toHaveAttribute("data-count", "2");
  expect((await tray.boundingBox()).height).toBeLessThan(100);
  await tray.locator("[data-selection-toggle]").click();
  await expect(tray.locator(".selection-item")).toHaveCount(2);
  await expect(tray.locator(".selection-item").first()).toBeVisible();
  const padding = await page
    .locator("body")
    .evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
  expect(padding).toBeGreaterThan((await tray.boundingBox()).height);
  await tray.locator("[data-selection-toggle]").click();
  const href = await tray.locator("a.primary").getAttribute("href");
  const selected = new URL(href, "https://example.test").searchParams;
  const sameTask = await page.evaluate(
    ([a, b]) => {
      const runs = window.ARCHIVE.runs;
      const left = runs.find((r) => r.id === a),
        right = runs.find((r) => r.id === b);
      return left.topicId === right.topicId && left.promptId === right.promptId;
    },
    [selected.get("left"), selected.get("right")],
  );
  expect(sameTask).toBe(true);
  await tray.locator("a.primary").click();
  await expect(page).toHaveURL(/compare.html/);
  await page.goBack();
  await expect(tray).toHaveAttribute("data-count", "2");
  await tray.locator("[data-selection-toggle]").click();
  await tray.locator("[data-remove]").first().click();
  await expect(tray).toHaveAttribute("data-count", "1");
  await tray.locator("[data-clear]").click();
  await expect(tray).toBeHidden();
});
