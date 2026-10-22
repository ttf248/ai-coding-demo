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
    470,
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

test("mobile record details retain facts when switching to the desktop table", async ({
  page,
}) => {
  await page.goto(
    "topic.html?id=circuit-lab&model=deepseek-v4-pro-0813&effort=high",
  );
  const row = page.locator(".topic-run-row");
  await expect(row.locator(".topic-run-billing")).toBeHidden();
  await expect(row.locator(".topic-run-actions")).toBeVisible();
  await row.locator(".run-context > summary").click();
  await expect(row.locator(".topic-run-duration")).toContainText("31m 55s");
  await expect(row.locator(".topic-run-billing")).toBeVisible();
  await row.locator(".billing-summary > summary").click();
  await expect(row.locator(".billing-summary p")).toContainText("批次耗时");
  await page.setViewportSize({ width: 1440, height: 960 });
  await expect(row.locator(".topic-run-facts")).toHaveCount(0);
  await expect(row.locator(".topic-run-billing")).toHaveCount(1);
  await expect(row.locator(".topic-run-duration")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(row.locator(".topic-run-facts")).toHaveCount(1);
  await expect(row.locator(".topic-run-billing")).toHaveCount(1);
});

test("mobile comparison keeps switches available and zooms the selected original screenshot", async ({
  page,
}) => {
  await page.goto(
    "compare.html?group=circuit-lab/v1&left=circuit-lab--claude-opus-5-5-max-r01&right=circuit-lab--gpt-6-1-sol-max-r01&tab=snapshot",
  );
  await expect(page.locator("#run-left")).toBeHidden();
  await page.locator('[data-mobile="right"]').click();
  const panel = page.locator("#panel-right");
  const original = await panel
    .locator(".snapshot-preview")
    .getAttribute("href");
  await panel.locator("[data-zoom-snapshot]").click();
  const dialog = page.locator("#screenshot-zoom");
  await expect(dialog).toBeVisible();
  await expect(page.locator("#screenshot-zoom-image")).toHaveAttribute(
    "src",
    original,
  );
  await page.locator('[data-image-scale="actual"]').click();
  await expect(dialog).toHaveAttribute("data-scale", "actual");
  await expect
    .poll(() =>
      page
        .locator(".screenshot-zoom-stage")
        .evaluate((el) => el.scrollWidth > el.clientWidth),
    )
    .toBe(true);
  await page
    .locator(".screenshot-zoom-stage")
    .evaluate((el) => el.scrollTo(100, 100));
  expect(
    await page
      .locator(".screenshot-zoom-stage")
      .evaluate((el) => el.scrollLeft),
  ).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(panel.locator("[data-zoom-snapshot]")).toBeFocused();
  await page.evaluate(() => scrollTo(0, 250));
  const switcher = await page.locator(".compare-switcher").boundingBox();
  expect(switcher.y).toBeGreaterThanOrEqual(0);
  expect(switcher.y).toBeLessThan(10);
  await page.locator('[data-mobile="left"]').click();
  await expect(page.locator("#panel-left")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("mobile card scores identify their screenshot and preview keeps its original proportions", async ({
  page,
}) => {
  await page.goto("index.html");
  const card = page.locator(".topic-card").first();
  await expect(card.locator(".score-chip")).toContainText("本次实验截图评分");
  await card.locator(".experiment-info > summary").click();
  await expect(card.locator(".latest-run")).toContainText(
    "不代表主题总分或模型排名",
  );
  const id = await card
    .locator("[data-screenshot-run]")
    .getAttribute("data-screenshot-run");
  const label = await page.evaluate((id) => {
    const run = window.ARCHIVE.runs.find((r) => r.id === id);
    return window.ArchiveUI.modelLabel(window.ARCHIVE, run);
  }, id);
  await expect(card.locator(".latest-run strong")).toContainText(label);
  await card.locator(".experiment-info > summary").click();
  for (const selector of ["[data-pick-topic]", ".experiment-info > summary"]) {
    expect(
      (await card.locator(selector).boundingBox()).height,
    ).toBeGreaterThanOrEqual(44);
  }
  await card.locator(".cover-preview").click();
  await expect
    .poll(() =>
      page.locator("#preview-stage img").evaluate((img) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  const stage = await page.locator("#preview-stage").boundingBox();
  const image = await page.locator("#preview-stage img").boundingBox();
  expect(Math.abs(stage.height - image.height)).toBeLessThan(4);
  await expect(page.locator("#preview-original")).toHaveAttribute(
    "href",
    await page.locator("#preview-stage img").getAttribute("src"),
  );
  await page.keyboard.press("Escape");
  await expect(card.locator(".cover-preview")).toBeFocused();
});

test("mobile display settings dismiss by keyboard and empty selections reset their expansion", async ({
  page,
}) => {
  await page.goto("index.html");
  await page.locator("#display-options > summary").click();
  await page.keyboard.press("Escape");
  await expect(page.locator("#display-options")).not.toHaveAttribute("open");
  await expect(page.locator("#display-options > summary")).toBeFocused();
  await page.locator("#display-options > summary").click();
  await page.locator("#q").click();
  await expect(page.locator("#display-options")).not.toHaveAttribute("open");
  await page.locator(".card [data-compare]").first().click();
  await page.locator("[data-selection-toggle]").click();
  await page.locator("[data-clear]").click();
  await page.locator(".card [data-compare]").first().click();
  await expect(page.locator("#compare-tray")).toHaveAttribute(
    "data-expanded",
    "false",
  );
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
});
