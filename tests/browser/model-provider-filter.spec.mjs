import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";

const data = loadCatalog();
const providerOf = (run) =>
  data.models.find((model) => model.id === run.modelId)?.provider;
const activeRuns = data.runs.filter(
  (run) =>
    data.topics.find((topic) => topic.id === run.topicId).testingStatus !==
    "archived",
);

test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/[^/]*google(tagmanager|analytics)\.com\//,
    (route) => route.abort(),
  );
});

test("homepage selects entire providers, switches models and restores filter counts", async ({
  page,
}) => {
  await page.goto("./?model=gpt-6-astra");
  for (const provider of new Set(
    data.models.map((m) => m.provider).filter(Boolean),
  )) {
    await expect(
      page.locator(`#model option[value="provider:${provider}"]`),
    ).toHaveText(
      `${provider} · ${activeRuns.filter((run) => providerOf(run) === provider).length} 条实验`,
    );
  }
  await page.locator("#model").selectOption("provider:Anthropic");
  const count = activeRuns.filter(
    (run) => providerOf(run) === "Anthropic",
  ).length;
  await expect(page.locator("#result-count")).toContainText(
    `${count} 条匹配记录`,
  );
  await expect(page.locator("#provider")).toHaveValue("Anthropic");
  expect(new URL(page.url()).searchParams.get("model")).toBeNull();
  await page.reload();
  await expect(page.locator("#model")).toHaveValue("provider:Anthropic");
  await expect(page.locator("#result-count")).toContainText(
    `${count} 条匹配记录`,
  );
  await page.locator('[data-group="runs"]').click();
  while (await page.locator("#load-more").isVisible())
    await page.locator("#load-more").click();
  await expect(page.locator(".run-card")).toHaveCount(count);
  const runIds = await page
    .locator(".run-card")
    .evaluateAll((cards) => cards.map((card) => card.dataset.item));
  expect(
    runIds.every(
      (id) => providerOf(data.runs.find((r) => r.id === id)) === "Anthropic",
    ),
  ).toBe(true);
  expect(
    new Set(runIds.map((id) => data.runs.find((r) => r.id === id).modelId))
      .size,
  ).toBeGreaterThan(1);
  await page.locator("#model").selectOption("gpt-6-1-sol");
  await expect(page.locator("#provider")).toHaveValue("");
  await expect(page.locator("#result-count")).toContainText(
    `${activeRuns.filter((run) => run.modelId === "gpt-6-1-sol").length} 条匹配记录`,
  );
  await page.locator("#model").selectOption("provider:OpenAI");
  await page.locator('[data-remove-filter="provider"]').click();
  await expect(page.locator("#model")).toHaveValue("");
  if (!(await page.locator("#provider").isVisible()))
    await page.locator("#advanced-filters > summary").click();
  await page.locator("#model").selectOption("gpt-6-astra");
  await page.locator("#provider").selectOption("MiniMax");
  await expect(page.locator("#model")).toHaveValue("provider:MiniMax");
  await expect(page.locator("#result-count")).toContainText(
    `${activeRuns.filter((run) => providerOf(run) === "MiniMax").length} 条匹配记录`,
  );
  await page.locator("#model").selectOption("");
  await expect(page.locator("#provider")).toHaveValue("");
});

test("provider filtering combines with search and remains usable on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.locator("#mobile-filter-toggle").click();
  await page.locator("#model").selectOption("provider:OpenAI");
  const topic = data.topics.find((t) => t.id === "voxel-construction-site");
  await page.locator("#q").fill(topic.title);
  const count = activeRuns.filter(
    (run) => run.topicId === topic.id && providerOf(run) === "OpenAI",
  ).length;
  await expect(page.locator("#result-count")).toContainText(
    `${count} 条匹配记录`,
  );
  await page.locator("#mobile-filter-toggle").click();
  await expect(page.locator('[data-remove-filter="provider"]')).toBeVisible();
  await page.reload();
  await expect(page.locator("#model")).toHaveValue("provider:OpenAI");
  await expect(page.locator("#result-count")).toContainText(
    `${count} 条匹配记录`,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("topic provider filters apply to records, model groups and matrix with history and reset", async ({
  page,
}) => {
  const topicRuns = data.runs.filter(
    (run) => run.topicId === "voxel-construction-site",
  );
  const matches = topicRuns.filter((run) => providerOf(run) === "OpenAI");
  const modelCount = new Set(matches.map((run) => run.modelId)).size;
  await page.goto(
    "topic.html?id=voxel-construction-site&model=claude-haiku-5-5",
  );
  await page.locator("#topic-model").selectOption({ label: "OpenAI" });
  await expect(page.locator(".topic-run-row")).toHaveCount(matches.length);
  expect(new URL(page.url()).searchParams.get("provider")).toBe("OpenAI");
  expect(new URL(page.url()).searchParams.get("model")).toBeNull();
  await page.reload();
  await expect(page.locator("#topic-model")).toHaveValue("provider:OpenAI");
  await page.locator('[data-topic-view="models"]').click();
  await expect(page.locator(".topic-model-group")).toHaveCount(modelCount);
  await page.locator('[data-topic-view="matrix"]').click();
  await expect(page.locator("#topic-matrix tbody tr")).toHaveCount(modelCount);
  await page.locator("#topic-model").selectOption("claude-haiku-5-5");
  await expect(page.locator("#topic-matrix tbody tr")).toHaveCount(1);
  expect(new URL(page.url()).searchParams.get("provider")).toBeNull();
  await page.goBack();
  await expect(page.locator("#topic-model")).toHaveValue("provider:OpenAI");
  await expect(page.locator("#topic-matrix tbody tr")).toHaveCount(modelCount);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-topic-view="list"]').click();
  await expect(page.locator(".topic-run-row")).toHaveCount(matches.length);
  await expect(page.locator("#topic-model")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.locator("#topic-reset").click();
  await expect(page.locator("#topic-model")).toHaveValue("");
  await expect(page.locator(".topic-run-row")).toHaveCount(topicRuns.length);
  expect(new URL(page.url()).searchParams.get("provider")).toBeNull();
});
