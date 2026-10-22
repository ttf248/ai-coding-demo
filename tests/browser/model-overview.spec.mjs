import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics|googletagmanager/, (r) => r.abort());
});
test("model coverage and history stay task-specific and load only opened topics", async ({
  page,
}) => {
  const requests = [];
  page.on("request", (r) => {
    if (r.url().includes("generated/topics/")) requests.push(r.url());
  });
  await page.goto("model.html?id=minimax-m3-1-flash");
  await expect(page.locator("#model-overview h2")).toHaveText(
    "MiniMax M3.1 Flash",
  );
  expect(requests).toEqual([]);
  const expected = await page.evaluate(() => {
    const d = window.ARCHIVE,
      runs = d.runs.filter((r) => r.modelId === "minimax-m3-1-flash");
    return {
      runs: runs.length,
      topics: new Set(runs.map((r) => r.topicId)).size,
      all: d.topics.length,
      bluebook: runs.filter((r) => r.topicId === "bluebook").length,
    };
  });
  await expect(page.locator("#model-overview")).toContainText(
    `${expected.runs} 条实验`,
  );
  await expect(page.locator(".model-topic")).toHaveCount(expected.topics);
  await expect(page.locator(".model-missing")).toHaveCount(
    expected.all - expected.topics,
  );
  const topic = page.locator('[data-model-topic="bluebook"]');
  await topic.locator(":scope > summary").click();
  await expect(topic).toHaveAttribute("data-loaded", "true");
  await expect(topic.locator(".model-history > li")).toHaveCount(
    expected.bluebook,
  );
  expect(requests).toHaveLength(1);
  await topic.locator(".model-history summary").first().click();
  await expect(topic).toContainText("维护者");
  await page.locator("#overview-model").selectOption("gpt-6-astra");
  await expect(page).toHaveURL(/id=gpt-6-astra/);
  await page.goBack();
  await expect(page.locator("#overview-model")).toHaveValue(
    "minimax-m3-1-flash",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await topic.locator(":scope > summary").click();
  await expect(topic).toHaveAttribute("data-loaded", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
test("model details recover from network failure without losing coverage", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/assets/generated/topics/bluebook.json", (route) =>
    fail
      ? route.fulfill({ status: 503, body: "unavailable" })
      : route.continue(),
  );
  await page.goto("model.html?id=minimax-m3-1-flash");
  const topic = page.locator('[data-model-topic="bluebook"]');
  await topic.locator(":scope > summary").click();
  await expect(topic).toContainText("资料加载失败");
  fail = false;
  await topic.locator("button").click();
  await expect(topic).toHaveAttribute("data-loaded", "true");
  await page.goto("model.html?id=unknown-invalid");
  await expect(page.locator("#model-overview")).toContainText("选择一个模型");
});
