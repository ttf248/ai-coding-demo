import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics|googletagmanager/, (route) =>
    route.abort(),
  );
});

test("recommended pairs have evidence, respect their comparison question and open in two clicks", async ({
  page,
}) => {
  await page.goto("index.html");
  const pairs = await page.evaluate(() => {
    const d = window.ARCHIVE,
      u = window.ArchiveUI;
    return window.ArchiveDiscovery.recommendations(d).map(({ kind, a, b }) => ({
      kind,
      sameTask: u.promptFor(d, a).hash === u.promptFor(d, b).hash,
      distinct: a.id !== b.id,
      embed: a.preview.embed && b.preview.embed,
      rated: a.score.status === "rated" && b.score.status === "rated",
      sameModel: a.modelId === b.modelId,
      sameEffort: a.effort === b.effort,
      archived: [a, b].some((r) =>
        u.isTopicArchived(d.topics.find((t) => t.id === r.topicId)),
      ),
    }));
  });
  expect(pairs.map((p) => p.kind)).toEqual(["models", "efforts", "rounds"]);
  for (const pair of pairs) {
    expect(
      pair.sameTask &&
        pair.distinct &&
        pair.embed &&
        pair.rated &&
        !pair.archived,
    ).toBe(true);
    expect(pair.sameModel).toBe(pair.kind !== "models");
    if (pair.kind !== "models")
      expect(pair.sameEffort).toBe(pair.kind === "rounds");
  }
  await page.locator("#open-recommendations").click();
  await page.locator("[data-recommendation]").first().click();
  await expect(page).toHaveURL(/tab=snapshot/);
  await expect(page.locator("#comparison-summary")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.dataLayer.filter((x) => x[1] === "archive_compare_start")
            .length,
      ),
    )
    .toBe(1);
  await page.locator('[data-tab="prompt"]').click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.dataLayer.filter((x) => x[1] === "archive_prompt_view").length,
      ),
    )
    .toBe(1);
});

test("search reports empty results without collecting search text and recommendations fit mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("index.html");
  await page.locator("#q").fill("private-example-no-match");
  await expect(page.locator("#empty")).toBeVisible();
  const event = await page.evaluate(() =>
    Array.from(window.dataLayer.find((x) => x[1] === "archive_search")),
  );
  expect(event[2]).toMatchObject({ query_length: 24, result_count: 0 });
  expect(event[2].page_location).not.toContain("?");
  expect(JSON.stringify(event)).not.toContain("private-example");
  await page.locator("#open-recommendations").click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
