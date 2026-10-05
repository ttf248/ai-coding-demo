import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
const data = loadCatalog();
const blue = data.runs.filter((r) => r.topicId === "bluebook");
test("topic browsing groups versions, filters experiments and restores state", async ({
  page,
}) => {
  await page.goto("topic.html?id=bluebook");
  await expect(page.locator('[data-topic-view="list"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".topic-run-row")).toHaveCount(blue.length);
  await expect(page.locator(".topic-run-group")).toHaveCount(2);
  await expect(
    page.locator(".topic-run-group").first().locator(".version-badge"),
  ).toHaveText("v2");
  for (const group of await page.locator(".topic-run-group").all()) {
    const version = await group.locator(".version-badge").textContent();
    const ids = await group
      .locator(".topic-run-row")
      .evaluateAll((cards) => cards.map((card) => card.id.slice(4)));
    expect(
      ids.every((id) => blue.find((r) => r.id === id).promptId === version),
    ).toBe(true);
  }
  await page.locator("#topic-model").selectOption("gpt-6-1-sol");
  await expect(page.locator(".topic-run-row")).toHaveCount(2);
  await page.locator("#topic-effort").selectOption("medium");
  await expect(page.locator(".topic-run-row")).toHaveCount(1);
  await expect(page.locator(".topic-run-model")).toHaveText("GPT-6.1 Sol");
  await expect(page.locator(".topic-run-effort")).toContainText("medium（中）");
  await page.reload();
  await expect(page.locator("#topic-model")).toHaveValue("gpt-6-1-sol");
  await expect(page.locator("#topic-effort")).toHaveValue("medium");
  await page.locator("#topic-reset").click();
  await page.locator("#topic-search").fill("MiniMax");
  await expect(page.locator(".topic-run-row")).toHaveCount(
    blue.filter((r) => r.modelId.startsWith("minimax")).length,
  );
  await page.locator("#topic-search").fill("no-such-experiment");
  await expect(page.locator("#topic-list .topic-empty")).toBeVisible();
  await page.locator("[data-reset-filters]").click();
  await page.locator("#topic-prompt").selectOption("v1");
  await expect(page.locator(".topic-run-group")).toHaveCount(1);
  await expect(page.locator("#topic-context-title")).toContainText("v1");
  await page.locator("[data-read-task]").click();
  await expect(page.locator("#topic-prompts")).toBeVisible();
  await expect(page.locator("#topic-filters")).toBeHidden();
  await page.goBack();
  await expect(page.locator("#topic-list")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".topic-run-row").first()).toBeVisible();
  await page
    .locator(".topic-table-scroll")
    .first()
    .evaluate((table) => {
      table.scrollLeft = table.scrollWidth;
    });
  await page.locator("#topic-list [data-compare]").first().click();
  await expect(page.locator(".selection-item")).toHaveCount(1);
  await page.locator("[data-clear]").click();
  await page
    .locator(".topic-table-scroll")
    .first()
    .evaluate((table) => {
      table.scrollLeft = 0;
    });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/topic-redesign-mobile-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.locator("#topic-prompt").selectOption("");
  await page.screenshot({
    path: `test-results/topic-redesign-desktop-${test.info().project.name}.png`,
    fullPage: true,
  });
});
test("effort names remain visible in topic matrices and comparison selectors", async ({
  page,
}) => {
  await page.goto("topic.html?id=life-diary&view=matrix");
  await expect(page.locator(".matrix-desktop thead")).toContainText(
    "medium（中）",
  );
  await expect(page.locator(".matrix-desktop thead")).toContainText(
    "max（最大）",
  );
  const medium = data.runs.find(
    (r) =>
      r.topicId === "life-diary" &&
      r.modelId === "gpt-6-1-sol" &&
      r.effort === "medium",
  );
  await page.goto("compare.html?left=" + medium.id + "&tab=info");
  await expect(
    page.locator('#run-left option[value="' + medium.id + '"]'),
  ).toContainText("medium（中）");
  await expect(
    page.locator('#run-left option[value="life-diary--gpt-6-1-sol-max-r01"]'),
  ).toContainText("max（最大）");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("topic.html?id=life-diary&view=matrix");
  await page
    .locator(".matrix-model summary")
    .filter({ hasText: "GPT-6.1 Sol" })
    .click();
  await expect(page.locator(".matrix-mobile")).toContainText("medium（中）");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
async function isolatePreviews(page) {
  await page.route(/\/(previews|demos)\/.*\.html(?:\?.*)?$/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body>Preview fixture</body></html>",
    }),
  );
}

test("compact homepage supports removable filters, URL restore and recent experiment links", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator("#advanced-filters")).not.toHaveAttribute("open");
  await page.locator("#model").selectOption("gpt-6-1-sol");
  await expect(page.locator('[data-remove-filter="model"]')).toContainText(
    "GPT-6.1 Sol",
  );
  await page.locator('[data-remove-filter="model"]').click();
  await expect(page.locator("#model")).toHaveValue("");
  await page.locator("#advanced-filters summary").click();
  await page.locator("#preview").selectOption("no");
  await page.reload();
  await expect(page.locator("#advanced-filters")).toHaveAttribute("open", "");
  await expect(page.locator("#preview")).toHaveValue("no");
  await page.locator('[data-remove-filter="preview"]').click();
  await expect(page.locator("#active-filters")).toBeEmpty();
  await expect(page.locator("#recent-list a")).toHaveCount(5);
  await page.locator("#recent-list a").first().click();
  await expect(page.locator('[data-topic-view="list"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("#topic-prompt")).not.toHaveValue("");
  const target = await page.evaluate(() =>
    decodeURIComponent(location.hash.slice(1)),
  );
  await expect(page.locator('[id="' + target + '"]')).toBeVisible();
});

test("topic matrix filters versions, exposes repeat runs and switches to a mobile list", async ({
  page,
}) => {
  await page.goto("topic.html?id=bluebook&view=matrix");
  await expect(page.locator(".matrix-desktop [data-matrix-run]")).toHaveCount(
    blue.length,
  );
  const repeated = blue.find(
    (r) =>
      blue.filter(
        (other) => other.modelId === r.modelId && other.effort === r.effort,
      ).length > 1,
  );
  const cell = page.locator(
    `.matrix-desktop td[data-model="${repeated.modelId}"][data-effort="${repeated.effort}"]`,
  );
  await cell.locator("summary").click();
  await expect(cell.locator(".matrix-record")).toHaveCount(
    blue.filter(
      (r) => r.modelId === repeated.modelId && r.effort === repeated.effort,
    ).length,
  );
  await cell.locator("[data-compare]").first().click();
  await expect(page.locator(".selection-item")).toHaveCount(1);
  await expect(page.locator(".selection-item")).toContainText(
    data.models.find((m) => m.id === repeated.modelId).label,
  );
  await page.locator("#topic-prompt").selectOption("v2");
  await expect(page.locator(".matrix-desktop [data-matrix-run]")).toHaveCount(
    blue.filter((r) => r.promptId === "v2").length,
  );
  await expect(
    page.locator(".matrix-desktop .missing-record").first(),
  ).toContainText("无记录");
  await expect(page.locator(".selection-item")).toHaveCount(1);
  await page.reload();
  await expect(page.locator("#topic-prompt")).toHaveValue("v2");
  await expect(page.locator(".selection-item")).toHaveCount(1);
  await page.locator('[data-topic-view="prompt"]').click();
  await expect(page.locator("#topic-prompts details")).toHaveCount(1);
  await page.locator("#topic-prompts summary").click();
  await expect(page.locator("#topic-prompts pre")).toContainText("瀑布流");
  await page.goBack();
  await expect(page.locator('[data-topic-view="matrix"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".matrix-desktop")).toBeHidden();
  await expect(page.locator(".matrix-mobile")).toBeVisible();
  await page.locator(".matrix-model summary").first().click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/archive-matrix-mobile-${test.info().project.name}.png`,
    fullPage: true,
  });
});

test("four-slot selection persists across pages, replaces, removes and opens exact quad selection", async ({
  page,
}) => {
  await isolatePreviews(page);
  await page.goto("./?group=runs");
  const buttons = page.locator("#project-grid [data-compare]");
  const ids = await buttons.evaluateAll((nodes) =>
    nodes.slice(0, 5).map((n) => n.dataset.compare),
  );
  for (let i = 0; i < 4; i++) await buttons.nth(i).click();
  await expect(page.locator(".selection-item")).toHaveCount(4);
  await buttons.nth(4).click();
  await expect(page.locator("#replace-dialog")).toBeVisible();
  await expect(page.locator("[data-slot]")).toHaveCount(4);
  await page.locator('[data-slot="2"]').click();
  await page.reload();
  await expect(page.locator(".selection-item")).toHaveCount(4);
  await page.goto("topic.html?id=bluebook");
  await expect(page.locator(".selection-item")).toHaveCount(4);
  await page.locator('[data-remove="' + ids[0] + '"]').click();
  await expect(page.locator(".selection-item")).toHaveCount(3);
  const threeLink = await page.locator("#compare-tray a").getAttribute("href");
  expect(
    new URL(threeLink, "https://example.com").searchParams.has("fourth"),
  ).toBe(false);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("./?group=runs");
  await page.locator('#project-grid [data-compare="' + ids[0] + '"]').click();
  await page.locator("#compare-tray a").click();
  await expect(page.locator("#layout")).toHaveValue("quad");
  const chosen = [ids[1], ids[4], ids[3], ids[0]];
  expect(
    await page
      .locator("[data-run]")
      .evaluateAll((nodes) => nodes.map((n) => n.value)),
  ).toEqual(chosen);
  await expect(page.locator("iframe")).toHaveCount(
    chosen.filter((id) => data.runs.find((r) => r.id === id).preview.embed)
      .length,
  );
  await page.reload();
  expect(
    await page
      .locator("[data-run]")
      .evaluateAll((nodes) => nodes.map((n) => n.value)),
  ).toEqual(chosen);
});

test("conditions compare all selected experiments, filter differences and restore sharing state", async ({
  page,
}) => {
  await isolatePreviews(page);
  const city = data.runs.filter(
    (r) => r.topicId === "neo-gothic-tower-city" && r.modelId === "gpt-6",
  );
  const absent = data.runs.find((r) => r.preview.kind === "none");
  await page.goto(
    `compare.html?left=${city[0].id}&right=${city[1].id}&third=${absent.id}&layout=quad&tab=conditions`,
  );
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator(".conditions-table thead th")).toHaveCount(4);
  await expect(page.locator("#conditions-table")).toContainText("无预览");
  await expect(page.locator("#conditions-table")).toContainText("输入留存");
  await page.locator("#differences-only").check();
  await expect(page).toHaveURL(/differencesOnly=1/);
  await page.reload();
  await expect(page.locator("#differences-only")).toBeChecked();
  await expect(page.locator('[data-tab="conditions"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("#share").click();
  await expect(page.locator("#share-message")).toContainText(/已复制|请复制/);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("iframe")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/archive-conditions-mobile-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page.goto(
    `compare.html?left=${city[0].id}&right=${city[1].id}&tab=conditions`,
  );
  await expect(
    page
      .locator("#conditions-table tbody tr")
      .filter({ hasText: "原始输入指纹" }),
  ).toHaveCount(1);
  await page.locator("#differences-only").check();
  await expect(
    page
      .locator("#conditions-table tbody tr")
      .filter({ hasText: "原始输入指纹" }),
  ).toHaveCount(0);
  await expect(
    page.locator("#conditions-table tbody tr").filter({ hasText: "推理档位" }),
  ).toHaveCount(1);
  await page.goto(
    `compare.html?left=${city[0].id}&tab=conditions&differencesOnly=1`,
  );
  await expect(page.locator("#differences-only")).toBeDisabled();
  await expect(page.locator("#conditions-notice")).toContainText(
    "至少选择两个",
  );
  await page.goto("compare.html?left=missing-run&tab=conditions");
  await expect(page.locator("#conditions-table")).toContainText("实验不存在");
});
