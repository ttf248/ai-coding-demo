import { test, expect } from "@playwright/test";
import { loadCatalog } from "../../scripts/lib.mjs";
const data = loadCatalog();
test("catalog and topics render without historical experiments", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(page.locator("#stats")).toContainText(String(data.runs.length));
  await page.locator('[data-group="runs"]').click();
  await expect(page.locator("#project-grid .card")).toHaveCount(
    Math.min(9, data.runs.length),
  );
  await page.locator("#q").fill("no-such-experiment-zzzz");
  await expect(page.locator("#empty")).toBeVisible();
  await page.locator("#empty [data-reset]").click();
  await page.locator('[data-view="list"]').click();
  await expect(page.locator("#project-grid")).toHaveClass(/list/);
  await page.locator("#guide-search").fill("typescript");
  await expect(page.locator(".guide")).toHaveCount(1);
  for (const topic of data.topics) {
    await page.goto(`topic.html?id=${topic.id}`);
    await expect(page.locator(".cards .card")).toHaveCount(
      data.runs.filter((r) => r.topicId === topic.id).length,
    );
    await expect(page.locator("details")).toHaveCount(
      data.prompts.filter((p) => p.topicId === topic.id).length,
    );
  }
  expect(errors).toEqual([]);
});
test("published site links and task files are accessible", async ({
  request,
}) => {
  for (const target of [
    "index.html",
    "compare.html",
    "assets/generated/catalog.js",
    ...data.prompts.flatMap((p) => [p.source, p.directory + "/prompt.md"]),
    ...data.guides.flatMap((g) => [g.document, g.example]),
  ]) {
    expect((await request.get(target)).status(), target).toBe(200);
  }
});
