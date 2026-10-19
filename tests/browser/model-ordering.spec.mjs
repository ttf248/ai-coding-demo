import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";

const data = loadCatalog();
const expected = {
  OpenAI: [
    "gpt-6-astra",
    "gpt-6-1-sol",
    "gpt-6-sol",
    "gpt-6-luna",
    "gpt-5-6-sol",
    "gpt-5-6-luna",
    "gpt-6",
  ],
  Anthropic: [
    "claude-opus-5-5",
    "claude-sonnet-5-5",
    "claude-haiku-5-5",
    "claude-haiku-45",
    "claude-4-0",
  ],
  "Alibaba Cloud": ["qwen3-8-max", "qwen3-8-flash"],
  MiniMax: [
    "minimax-m3",
    "minimax-m2-1",
    "minimax-m2",
    "minimax-m3-1-flash-preview",
  ],
};
const optionIds = (page, selector, ids) =>
  page
    .locator(`${selector} option`)
    .evaluateAll(
      (options, ids) =>
        options.map((option) => option.value).filter((id) => ids.includes(id)),
      ids,
    );

test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/[^/]*google(tagmanager|analytics)\.com\//,
    (route) => route.abort(),
  );
});

test("model filters and all topic record views use generations and same-generation capability", async ({
  page,
}) => {
  await page.goto("./");
  for (const ids of Object.values(expected))
    expect(await optionIds(page, "#model", ids)).toEqual(ids);
  await page.goto("topic.html?id=bluebook&prompt=v2");
  for (const [provider, ids] of Object.entries(expected)) {
    const registered = new Set(
      data.runs
        .filter((run) => run.topicId === "bluebook")
        .map((run) => run.modelId),
    );
    expect(await optionIds(page, "#topic-model", ids)).toEqual(
      ids.filter((id) => registered.has(id)),
    );
    await page.locator("#topic-model").selectOption({ label: provider });
    const matching = new Set(
      data.runs
        .filter((run) => run.topicId === "bluebook" && run.promptId === "v2")
        .map((run) => run.modelId),
    );
    const wanted = ids.filter((id) => matching.has(id));
    await page.locator('[data-topic-view="list"]').click();
    const rows = await page
      .locator(".topic-run-row")
      .evaluateAll((rows) => rows.map((row) => row.id.slice(4)));
    expect([
      ...new Set(
        rows.map((id) => data.runs.find((run) => run.id === id).modelId),
      ),
    ]).toEqual(wanted);
    await page.locator('[data-topic-view="models"]').click();
    expect(
      await page
        .locator("[data-model-group]")
        .evaluateAll((groups) =>
          groups.map((group) => group.dataset.modelGroup),
        ),
    ).toEqual(wanted);
    await page.locator('[data-topic-view="matrix"]').click();
    expect(
      await page
        .locator("#topic-matrix tbody tr")
        .evaluateAll((rows) =>
          rows.map((row) => row.querySelector("td[data-model]").dataset.model),
        ),
    ).toEqual(wanted);
    await page.reload();
    await expect(page.locator("#topic-model")).toHaveValue(
      "provider:" + provider,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("official evidence review is available as a static local reader", async ({
  page,
}) => {
  await page.goto("assets/generated/readers/docs/model-ordering.html");
  await expect(page.locator("h1")).toHaveText("模型排序与官方资料核对表");
  await expect(page.locator(".document-content")).toContainText(
    "DeepSeek-V4.1-Flash-0731",
  );
  await expect(
    page
      .locator('a[href="https://developers.openai.com/api/docs/changelog"]')
      .first(),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
