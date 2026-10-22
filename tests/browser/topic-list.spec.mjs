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
    "作品",
    "模型 / 档位",
    "截图评分",
    "费用记录",
    "执行耗时",
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
  expect(eighth.y + eighth.height - first.y).toBeLessThan(1200);
  await expect(page.locator("iframe")).toHaveCount(0);

  // 118px 的记录缩略图使用 240w 变体，不拉取 960w。
  const art = page.locator(".topic-run-art img").first();
  await expect(art).toHaveAttribute("srcset", /240w.*480w.*960w/);
  await expect(art).toHaveAttribute(
    "sizes",
    "(max-width: 700px) 88px, (min-width: 1288px) 118px, calc(11vw - 23.5px)",
  );
  expect(await art.evaluate((image) => image.currentSrc)).toMatch(
    /-240\.webp$/,
  );
  const artBox = await art.boundingBox();
  expect(artBox.width).toBeLessThanOrEqual(120);
  expect(artBox.height).toBeLessThanOrEqual(100);

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

test("390px list keeps works compact and expands recorded facts without page overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("topic.html?id=circuit-lab");
  const firstAction = await page
    .locator(".topic-row-actions")
    .first()
    .boundingBox();
  expect(firstAction.y + firstAction.height).toBeLessThanOrEqual(844);
  // 首屏控件收紧后，第一条记录整条出现在首屏内。
  const firstRow = await page.locator(".topic-run-row").first().boundingBox();
  expect(firstRow.y).toBeLessThan(520);
  expect(firstRow.y + firstRow.height).toBeLessThanOrEqual(844);
  expect(firstRow.height).toBeLessThan(270);
  await expect(page.locator(".topic-run-billing").first()).toBeHidden();
  await page.goto(
    "topic.html?id=circuit-lab&model=deepseek-v4-pro-0813&effort=high",
  );
  const row = page.locator(".topic-run-row");
  await expect(row).toHaveCount(1);
  await expect(row.locator(".run-context")).not.toHaveAttribute("open", "");
  await row.locator(".run-context > summary").click();
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
test("screenshot ranking restores from URL and expands real evidence", async ({
  page,
}) => {
  const expected = [...runs]
    .filter((r) => r.score.status === "rated")
    .sort((a, b) => b.score.total - a.score.total)[0];
  await page.goto("topic.html?id=circuit-lab");
  await expect(page.locator("#topic-sort")).toHaveValue("score");
  expect(new URL(page.url()).searchParams.has("sort")).toBe(false);
  const first = page.locator(".topic-run-row").first();
  await expect(first.locator(".score-details > summary")).toContainText(
    `${expected.score.total}/100`,
  );
  await page.goto("topic.html?id=circuit-lab&sort=score");
  await expect(first.locator(".score-details > summary")).toContainText(
    `${expected.score.total}/100`,
  );
  await first.locator(".score-details > summary").click();
  await expect(first.locator("meter")).toHaveCount(5);
  await expect(first.locator(".score-evidence")).toContainText("规则 v3");
  await page.reload();
  await expect(page.locator("#topic-sort")).toHaveValue("score");
});

test("default ranking orders every rated record by screenshot score", async ({
  page,
}) => {
  await page.goto("topic.html?id=circuit-lab");
  const scored = await page
    .locator(".topic-run-score .score-chip")
    .allTextContents();
  const totals = scored
    .map((text) => Number(text.match(/(\d+)/)?.[1]))
    .filter((value) => Number.isInteger(value));
  expect(totals).toEqual([...totals].sort((a, b) => b - a));
  const rows = await page
    .locator(".topic-run-row")
    .evaluateAll((nodes) => nodes.map((node) => node.id.slice(4)));
  const expected = [...runs]
    .sort(
      (a, b) =>
        (b.score?.total ?? -1) - (a.score?.total ?? -1) ||
        (b.date || "").localeCompare(a.date || "") ||
        a.id.localeCompare(b.id, "en"),
    )
    .map((run) => run.id);
  expect(rows).toEqual(expected);
});
