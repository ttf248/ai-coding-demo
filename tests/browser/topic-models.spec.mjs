import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";

const data = loadCatalog();
const voxel = data.runs.filter(
  (run) => run.topicId === "voxel-construction-site",
);
const historySource = voxel.find(
  (run) =>
    run.modelId === "gpt-6-astra" &&
    run.effort === "xhigh" &&
    run.environment.toolId === "codex",
);
const historyRun = {
  ...historySource,
  id: historySource.id.replace(/r\d+$/, "r99"),
  runId: historySource.runId.replace(/r\d+$/, "r99"),
  date: "2026-10-14",
};
const historyRuns = [
  historyRun,
  ...[98, 97].map((round, index) => ({
    ...historySource,
    id: historySource.id.replace(/r\d+$/, "r" + round),
    runId: historySource.runId.replace(/r\d+$/, "r" + round),
    date: "2026-10-" + (13 - index),
  })),
];
const repeated = historyRuns.slice(0, 2);
const foldedRun = historySource;
async function mockHistory(page) {
  // Future reruns are a fixture: existing Astra records have different tool provenance.
  await page.route("**/assets/generated/catalog.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body:
        "window.ARCHIVE=" +
        JSON.stringify({
          ...data,
          runs: [...data.runs, ...historyRuns],
        }).replace(/</g, "\\u003c") +
        ";",
    }),
  );
}
const modelGroup = (page, model) =>
  page.locator(`[data-model-group="${model}"]`);

test("explicit model view retains the complete overview and collapsed history", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("topic.html?id=voxel-construction-site&view=models");
  await expect(page.locator('[data-topic-view="models"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".topic-model-group")).toHaveCount(
    new Set(voxel.map((run) => run.modelId)).size,
  );
  await expect(page.locator(".model-run-record")).toHaveCount(voxel.length);
  await expect(page.locator(".model-group-records").first()).toBeHidden();
  await expect(page.locator("#topic-prompt")).toBeHidden();
  await expect(page.locator("#topic-context-title")).toContainText("v1");
  await expect(page.locator("#pricing-context")).not.toHaveAttribute("open");
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(
    modelGroup(page, "gpt-6-1-sol").locator(
      ".model-quick-preview .execution-mode-chip",
    ),
  ).toBeVisible();
  const group = modelGroup(page, "gpt-6-astra");
  await expect(group.locator(".model-record-count")).toHaveText("3 条记录");
  await group.locator("[data-model-toggle]").click();
  await expect(group.locator(".model-condition")).toHaveCount(3);
  await expect(group.locator("[data-history-toggle]")).toHaveCount(0);
  await expect(
    group.locator(".model-record-facts").filter({ hasText: "工具未记录" }),
  ).toHaveCount(2);
  await mockHistory(page);
  await page.reload();
  await expect(group.locator(".model-condition")).toHaveCount(3);
  await expect(page.locator(`#run-${repeated[0].id}`)).toBeVisible();
  await expect(page.locator(`#run-${repeated[1].id}`)).toBeVisible();
  await expect(page.locator(`#run-${foldedRun.id}`)).toBeHidden();
  await group.locator("[data-history-toggle]").click();
  await expect(page.locator(`#run-${foldedRun.id}`)).toBeVisible();
  await page.reload();
  await expect(page.locator(`#run-${foldedRun.id}`)).toBeVisible();
  await group.locator("[data-history-toggle]").click();
  await expect(page.locator(`#run-${foldedRun.id}`)).toBeHidden();
  await page.goBack();
  await expect(page.locator(`#run-${foldedRun.id}`)).toBeVisible();
  expect(errors).toEqual([]);
});

test("model filters expand matching records and restore explicit collapse and sorting", async ({
  page,
}) => {
  await page.goto("topic.html?id=voxel-construction-site&view=models");
  await page.locator("#topic-model").selectOption("gpt-6-1-sol");
  const group = modelGroup(page, "gpt-6-1-sol");
  await expect(group.locator(".model-group-records")).toBeVisible();
  await expect(group.locator(".model-condition")).toHaveCount(3);
  await expect(group.locator(".model-record-effort")).toContainText([
    "max",
    "xhigh",
    "medium",
  ]);
  await expect(
    group.locator(".model-record-input").filter({ hasText: "自主设计授权" }),
  ).toHaveCount(1);
  await group.locator("[data-model-toggle]").click();
  await page.reload();
  await expect(group.locator(".model-group-records")).toBeHidden();
  await page.locator("#topic-effort").selectOption("xhigh");
  await expect(group.locator(".model-group-records")).toBeVisible();
  await expect(group.locator(".model-run-record")).toHaveCount(1);
  await page.locator("#topic-reset").click();
  await page.locator("#topic-search").fill("MiniMax");
  await expect(page.locator(".model-run-record")).toHaveCount(
    voxel.filter((run) => run.modelId.startsWith("minimax")).length,
  );
  await page.locator("#topic-search").fill("nonexistent-record-xyz");
  await expect(page.locator("#topic-models .topic-empty")).toBeVisible();
  await page.locator("[data-reset-filters]").click();
  await page.locator("#topic-sort").selectOption("recent");
  const dates = await page.locator(".model-group-meta").allTextContents();
  const isoDates = dates.map(
    (text) => text.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "",
  );
  expect(isoDates).toEqual([...isoDates].sort().reverse());
  await page.reload();
  await expect(page.locator("#topic-sort")).toHaveValue("recent");
});

test("historical anchors reveal the target and remain compatible with the full list", async ({
  page,
}) => {
  await mockHistory(page);
  const anchor = `#run-${foldedRun.id}`;
  await page.goto(`topic.html?id=voxel-construction-site&view=models${anchor}`);
  await expect(page.locator(anchor)).toBeVisible();
  await expect(
    modelGroup(page, "gpt-6-astra").locator("[data-model-toggle]"),
  ).toHaveAttribute("aria-expanded", "true");
  await page.locator('[data-topic-view="list"]').click();
  await expect(page).toHaveURL(new RegExp(anchor + "$"));
  await expect(page.locator(anchor)).toBeVisible();
  await expect(page.locator(".topic-run-row")).toHaveCount(
    voxel.length + historyRuns.length,
  );
  await expect(page.locator(anchor)).toHaveCount(1);
  await page.reload();
  await expect(page.locator(anchor)).toBeVisible();
  await page.locator('[data-topic-view="models"]').click();
  await expect(page.locator(anchor)).toBeVisible();
  await page.locator("#topic-model").selectOption("minimax-m3-1-flash-preview");
  expect(new URL(page.url()).hash).toBe("");
  await page.goto(
    "topic.html?id=voxel-construction-site&view=models#run-%E0%A4%A",
  );
  await expect(page.locator(".topic-model-group")).toHaveCount(
    new Set(voxel.map((run) => run.modelId)).size,
  );
});

test("history comparison opens the exact pair without executing previews", async ({
  page,
}) => {
  await mockHistory(page);
  await page.goto(
    "topic.html?id=voxel-construction-site&view=models&model=gpt-6-astra",
  );
  const link = modelGroup(page, "gpt-6-astra").locator(
    ".model-history-controls a",
  );
  const url = new URL(await link.getAttribute("href"), page.url());
  expect(url.searchParams.get("left")).toBe(repeated[0].id);
  expect(url.searchParams.get("right")).toBe(repeated[1].id);
  expect(url.searchParams.get("tab")).toBe("snapshot");
  await modelGroup(page, "gpt-6-astra")
    .locator("[data-history-toggle]")
    .click();
  await page.locator(`#run-${repeated[1].id} [data-compare]`).click();
  await expect(page.locator(".selection-item")).toHaveCount(1);
  await expect(
    page.locator(`#run-${repeated[1].id} [data-compare]`),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator('[data-topic-view="list"]').click();
  await expect(
    page.locator(`#run-${repeated[1].id} [data-compare]`),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto(url.href);
  await expect(page.locator("#run-left")).toHaveValue(repeated[0].id);
  await expect(page.locator("#run-right")).toHaveValue(repeated[1].id);
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("multiple task versions remain separate and task reading returns to the overview", async ({
  page,
}) => {
  const blue = data.runs.filter((run) => run.topicId === "bluebook");
  await page.goto("topic.html?id=bluebook&view=models");
  await expect(page.locator("#topic-prompt")).toBeVisible();
  await expect(page.locator(".topic-model-group")).toHaveCount(
    new Set(blue.map((run) => `${run.promptId}/${run.modelId}`)).size,
  );
  await page.locator("#topic-prompt").selectOption("v2");
  await expect(page.locator(".model-run-record")).toHaveCount(
    blue.filter((run) => run.promptId === "v2").length,
  );
  await expect(
    page.locator('.topic-model-group[data-prompt="v1"]'),
  ).toHaveCount(0);
  await page.locator("[data-read-task]").click();
  await page.locator("#topic-prompts summary").click();
  await expect(page.locator("#topic-prompts pre")).toContainText("瀑布流");
  await page.goBack();
  await expect(page.locator("#topic-models")).toBeVisible();
  await expect(page.locator("#topic-prompt")).toHaveValue("v2");
});

test("mobile model overview shows its first preview on the first screen and advanced filters restore", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("topic.html?id=voxel-construction-site&view=models");
  await expect(page.locator("#topic-effort")).toBeHidden();
  const bounds = await page
    .locator(".model-quick-preview")
    .first()
    .boundingBox();
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.locator("#topic-more-filters > summary").click();
  await page.locator("#topic-effort").selectOption("max");
  await page.reload();
  await expect(page.locator("#topic-more-filters")).toHaveAttribute("open", "");
  await expect(page.locator("#topic-effort")).toHaveValue("max");
  const row = page.locator(".model-run-record").first();
  await expect(row.locator(".model-record-facts")).toBeVisible();
  await expect(row.locator(".model-record-provider")).not.toBeEmpty();
  await expect(row.locator(".model-record-tool")).not.toBeEmpty();
  await row.locator("[data-compare]").click();
  await expect(page.locator("#compare-tray")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.screenshot({
    path: `test-results/topic-models-mobile-${test.info().project.name}.png`,
    fullPage: true,
  });
});

test("expanded model shows compact facts and direct detail links without nested disclosures", async ({
  page,
}) => {
  await page.goto(
    "topic.html?id=voxel-construction-site&view=models&model=gpt-6-1-sol",
  );
  const group = modelGroup(page, "gpt-6-1-sol");
  await expect(group.locator(".model-run-record")).toHaveCount(3);
  await expect(group.locator(".model-group-records details")).toHaveCount(0);
  await expect(group.locator(".model-record-facts").first()).toContainText(
    "OpenAI",
  );
  await expect(group.locator(".model-record-input").first()).toContainText(
    "输入留存不完整",
  );
  await expect(group.locator(".model-record-fee").first()).toContainText(
    "ChatGPT Plus",
  );
  expect((await group.boundingBox()).height).toBeLessThan(330);
  const row = group.locator(".model-run-record").first();
  await expect(row).toHaveRole("row");
  await expect(row.locator("th, td")).toHaveCount(7);
  await expect(group.locator(".model-records-table thead th")).toHaveText([
    "档位 / 轮次",
    "日期",
    "接入供应商 / 工具",
    "费用记录",
    "执行耗时",
    "输入 / 执行模式",
    "操作",
  ]);
  const positions = await group
    .locator(".model-run-record")
    .evaluateAll((rows) =>
      rows.map((row) =>
        Array.from(row.cells, (cell) => cell.getBoundingClientRect().x),
      ),
    );
  expect(positions[1]).toEqual(positions[0]);
  expect(positions[2]).toEqual(positions[0]);
  await row.locator(".model-record-reader").click();
  await expect(page).toHaveURL(
    /assets\/generated\/readers\/demos\/voxel-construction-site\/runs\/gpt-6-1-sol-max-r01\/Readme\.html/,
  );
  await expect(page.locator("main")).toContainText("ChatGPT Plus");
  await page.goBack();
  await expect(group.locator(".model-group-records")).toBeVisible();
});

test("short rerun histories are immediately visible when the model opens", async ({
  page,
}) => {
  await page.route("**/assets/generated/catalog.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body:
        "window.ARCHIVE=" +
        JSON.stringify({ ...data, runs: [...data.runs, historyRun] }).replace(
          /</g,
          "\\u003c",
        ) +
        ";",
    }),
  );
  await page.goto(
    "topic.html?id=voxel-construction-site&view=models&model=gpt-6-astra",
  );
  const group = modelGroup(page, "gpt-6-astra");
  await expect(page.locator(`#run-${historyRun.id}`)).toBeVisible();
  await expect(page.locator(`#run-${historySource.id}`)).toBeVisible();
  await expect(group.locator("[data-history-toggle]")).toHaveCount(0);
  await expect(group.locator("details")).toHaveCount(0);
  await expect(
    page.locator(`#run-${historySource.id} .model-record-facts`),
  ).toBeVisible();
});
