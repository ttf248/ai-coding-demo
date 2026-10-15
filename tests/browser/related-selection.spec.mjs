import { test, expect } from "@playwright/test";
test("first selection finds the same task beyond the current model filter", async ({
  page,
}) => {
  await page.goto("./?group=runs");
  const selected = page.locator(".run-card [data-compare]").first();
  const id = await selected.getAttribute("data-compare");
  await selected.click();
  const model = await page.evaluate(
    (id) => window.ARCHIVE.runs.find((r) => r.id === id).modelId,
    id,
  );
  await page.locator("#model").selectOption(model);
  await page.locator("#compare-tray [data-find-related]").click();
  await expect(page.locator("#quick-picker")).toBeVisible();
  await expect(page.locator("#quick-scope")).toContainText("未应用首页筛选");
  const expected = await page.evaluate(
    (id) => window.ARCHIVE.runs.find((r) => r.id === id).promptId,
    id,
  );
  await expect(page.locator("#quick-prompt")).toHaveValue(expected);
  while (await page.locator("#quick-more").isVisible()) {
    await page.locator("#quick-more").click();
  }
  await expect(
    page.locator(`.quick-candidate [data-compare="${id}"]`),
  ).toHaveAttribute("aria-pressed", "true");
  const other = page
    .locator('.quick-candidate [data-compare][aria-pressed="false"]')
    .first();
  await other.click();
  await expect(page.locator("#quick-start")).toBeVisible();
  await expect(page.locator("#quick-selection")).toContainText("2/4");
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("related selection on a topic keeps the selected experiment and task", async ({
  page,
}) => {
  await page.goto("./?group=runs");
  const button = page.locator(".run-card [data-compare]").first();
  const id = await button.getAttribute("data-compare");
  await button.click();
  const run = await page.evaluate(
    (id) => window.ARCHIVE.runs.find((r) => r.id === id),
    id,
  );
  await page.goto("./topic.html?id=" + encodeURIComponent(run.topicId));
  await page.locator("#compare-tray [data-find-related]").click();
  expect(new URL(page.url()).searchParams.get("prompt")).toBe(run.promptId);
  expect(new URL(page.url()).searchParams.get("view")).toBe("list");
  await expect(page.locator("#compare-tray")).toHaveAttribute(
    "data-count",
    "1",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
