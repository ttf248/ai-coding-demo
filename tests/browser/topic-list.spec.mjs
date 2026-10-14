import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";

const data = loadCatalog();
const runs = data.runs.filter((run) => run.topicId === "circuit-lab");

test("topic opens the complete compact list with recorded batch durations", async ({
  page,
}) => {
  await page.goto("topic.html?id=circuit-lab");
  await expect(page.locator('[data-topic-view="list"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".topic-run-row")).toHaveCount(runs.length);
  await expect(page.locator(".topic-run-row").first()).toBeVisible();
  const auditedRun = runs.find(
    (run) => run.input.executionModeNote === "自我审查十轮",
  );
  expect(auditedRun).toBeTruthy();
  await expect(
    page.locator(`#run-${auditedRun.id} .topic-run-input .execution-mode-chip`),
  ).toHaveText("自我审查十轮");
  await expect(page.locator(".topic-runs-table thead th")).toHaveText([
    "模型 / 厂商",
    "接入供应商 / 工具",
    "档位 / 轮次",
    "日期",
    "费用记录",
    "执行耗时",
    "输入 / 执行模式",
    "操作",
  ]);
  const table = page.locator(".topic-table-scroll");
  expect(
    await table.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  const first = await page.locator(".topic-run-row").first().boundingBox();
  const eighth = await page.locator(".topic-run-row").nth(7).boundingBox();
  expect(eighth.y + eighth.height - first.y).toBeLessThan(700);
  await expect(page.locator("iframe")).toHaveCount(0);

  for (const run of runs.filter((run) => run.billing?.duration)) {
    const row = page.locator("#run-" + run.id);
    await expect(row.locator(".topic-run-duration")).toContainText(
      run.billing.duration.text,
    );
    await expect(row.locator(".topic-run-duration small")).toHaveText(
      `批次耗时 · ${run.billing.caseCount} 案例`,
    );
    await expect(row.locator(".topic-run-tool")).not.toBeEmpty();
    await expect(row.locator(".topic-run-input > span")).toHaveText(
      {
        recorded: "原始输入已记录",
        partial: "输入留存不完整",
        unknown: "未记录",
      }[run.input.completeness],
    );
  }
  const unknown = runs.find((run) => !run.billing?.duration);
  await expect(
    page.locator("#run-" + unknown.id + " .topic-run-duration"),
  ).toHaveText("耗时未记录");
  await page.locator("#topic-model").selectOption("qwen3-8-max");
  const row = page.locator(".topic-run-row");
  await expect(row).toHaveCount(1);
  await expect(row.locator(".topic-run-duration")).toContainText("2h 50m 7s");
  await expect(row.locator(".topic-run-billing")).toContainText("91.81 CNY");
  await page.reload();
  await expect(row).toHaveCount(1);
  await expect(page.locator('[data-topic-view="list"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator('[data-topic-view="models"]').click();
  await expect(page.locator(".model-record-duration strong")).toHaveText(
    "2h 50m 7s",
  );
  await expect(page.locator(".model-record-duration small")).toHaveText(
    `批次耗时 · ${runs.find((run) => run.modelId === "qwen3-8-max").billing.caseCount} 案例`,
  );
  await page.goBack();
  await expect(page.locator("#topic-list")).toBeVisible();
});

test("390px list exposes facts and duration without disclosures or page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("topic.html?id=circuit-lab");
  const firstAction = await page
    .locator(".topic-row-actions")
    .first()
    .boundingBox();
  expect(firstAction.y + firstAction.height).toBeLessThanOrEqual(844);
  await page.goto(
    "topic.html?id=circuit-lab&model=deepseek-v4-pro-0813&effort=high",
  );
  const row = page.locator(".topic-run-row");
  await expect(row).toHaveCount(1);
  for (const selector of [
    ".topic-run-model-maker",
    ".topic-run-provider",
    ".topic-run-tool",
    ".topic-run-effort",
    ".topic-run-round",
    ".topic-run-date",
    ".topic-run-billing",
    ".topic-run-duration",
    ".topic-run-input",
    ".topic-row-actions",
  ])
    await expect(row.locator(selector)).toBeVisible();
  await expect(row.locator(".topic-run-duration")).toContainText("31m 55s");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await row.locator(".billing-summary summary").click();
  await expect(row.locator(".billing-summary p")).toContainText(
    "批次耗时 31m 55s",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await row.locator("[data-compare]").click();
  await expect(page.locator("#compare-tray")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.screenshot({
    path: "test-results/topic-list-mobile-" + test.info().project.name + ".png",
    fullPage: true,
  });
});
