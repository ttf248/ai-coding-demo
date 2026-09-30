import { test, expect } from "@playwright/test";

async function prepare(page) {
  // Isolate workspace lifecycle checks from historical demo/CDN behavior.
  await page.route(/\/(previews|demos)\/.*\.html(?:\?.*)?$/, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html><body><h1>Preview fixture</h1></body></html>",
    }),
  );
  await page.goto("compare.html?group=bluebook%2Fv1");
}

test("model picker groups vendors and sorts versions on desktop and mobile", async ({
  page,
}) => {
  await prepare(page);
  await page.locator("#pick-models").click();
  await page.locator("#scope").selectOption("all");
  await expect(page.locator(".model-provider")).toHaveText([
    /Anthropic/,
    /MiniMax/,
    /OpenAI/,
    /未记录/,
  ]);
  const inspect = () =>
    page.locator(".model-choice").evaluateAll((buttons) => {
      const d = window.ARCHIVE;
      return buttons.map((b) => {
        const r = d.runs.find((r) => r.id === b.dataset.choice);
        const m = d.models.find((m) => m.id === r.modelId);
        return { provider: m.provider, version: m.version };
      });
    });
  const rows = await inspect();
  for (let i = 1; i < rows.length; i++) {
    const a = rows[i - 1],
      b = rows[i];
    if (a.provider !== b.provider) continue;
    for (let j = 0; j < Math.max(a.version.length, b.version.length); j++) {
      const diff = (a.version[j] || 0) - (b.version[j] || 0);
      if (diff) {
        expect(diff).toBeGreaterThan(0);
        break;
      }
    }
  }
  await page.locator("#model-search").fill("gpt-6.1-sol");
  await expect(page.locator(".model-provider")).toHaveCount(1);
  await expect(page.locator(".model-choice").first()).toContainText(
    "GPT 6.1 Sol",
  );
  await page.locator("#model-search").fill("MiniMax");
  await expect(page.locator(".model-provider")).toHaveCount(1);
  await expect(page.locator(".model-choice").first()).toContainText(
    "MiniMax M3.1 Flash Preview",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator("#model-picker")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
});

test("prompt workspace supports cycling, searchable selection, four panels and URL restore", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await prepare(page);
  const group = await page.evaluate(() => {
    const d = window.ARCHIVE;
    return d.prompts.find(
      (p) =>
        d.runs.filter((r) => r.topicId === p.topicId && r.promptId === p.id)
          .length >= 3,
    );
  });
  await page.locator("#group").selectOption(group.topicId + "/" + group.id);
  await expect(page.locator("iframe")).toHaveCount(2);
  await page
    .locator("#panel-left iframe")
    .evaluate((f) => (f.dataset.kept = "yes"));
  const before = await page.locator("#run-right").inputValue();
  await page.locator('[data-side="right"][data-step="1"]').click();
  await expect(page.locator("#run-right")).not.toHaveValue(before);
  await expect(page.locator("#panel-left iframe")).toHaveAttribute(
    "data-kept",
    "yes",
  );
  await page.locator("#pick-models").click();
  await page.locator("#scope").selectOption("all");
  await page.locator("#model-search").fill("no-such-model");
  await expect(page.locator("#model-list")).toContainText("没有匹配");
  await page.locator("#model-search").fill("");
  await expect(page.locator(".model-choice").first()).toContainText(" · ");
  await page.locator(".model-choice:not(:disabled)").first().click();
  await expect(page.locator("#model-picker")).not.toBeVisible();
  await page.locator("#layout").selectOption("quad");
  await expect(page.locator("iframe")).toHaveCount(4);
  const ids = await page
    .locator("[data-run]")
    .evaluateAll((nodes) => nodes.map((n) => n.value));
  expect(new Set(ids).size).toBe(4);
  await page.reload();
  await expect(page.locator("#layout")).toHaveValue("quad");
  expect(
    await page
      .locator("[data-run]")
      .evaluateAll((nodes) => nodes.map((n) => n.value)),
  ).toEqual(ids);
  await page.locator('[data-tab="prompt"]').click();
  await expect(page.locator("#panel-third pre")).not.toContainText("undefined");
  await expect(page.locator("#panel-third")).toContainText("与基准 A");
  await page.locator('[data-tab="preview"]').click();
  await page.locator('[data-maximize="third"]').click();
  await expect(page.locator(".compare-panel:visible")).toHaveCount(1);
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator('[data-maximize="third"]').click();
  await expect(page.locator("iframe")).toHaveCount(4);
  const gaps = await page.evaluate(() => {
    const a = document.querySelector("#panel-left").getBoundingClientRect();
    const c = document.querySelector("#panel-third").getBoundingClientRect();
    return { gap: c.top - a.bottom, bottom: innerHeight - c.bottom };
  });
  expect(gaps.gap).toBeLessThan(10);
  expect(gaps.bottom).toBeLessThan(12);
  await page.screenshot({
    path: `test-results/workspace-quad-${test.info().project.name}.png`,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator('[data-mobile="fourth"]').click();
  await expect(page.locator("#panel-fourth iframe")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator("#layout").selectOption("single");
  await expect(page.locator("#panel-left iframe")).toHaveCount(1);
  await page.locator('[data-mobile="right"]').click();
  await expect(page.locator("#panel-right iframe")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("workspace fills desktop height and preserves fixed viewport dimensions", async ({
  page,
}) => {
  await prepare(page);
  const dimensions = await page.evaluate(() => {
    const grid = document
      .querySelector(".compare-grid")
      .getBoundingClientRect();
    return {
      height: grid.height,
      bottom: grid.bottom,
      width: grid.width,
      windowHeight: innerHeight,
      windowWidth: innerWidth,
    };
  });
  expect(dimensions.height / dimensions.windowHeight).toBeGreaterThan(0.8);
  expect(dimensions.windowHeight - dimensions.bottom).toBeLessThan(12);
  expect(dimensions.windowWidth - dimensions.width).toBeLessThan(20);
  await page.locator("#viewport").selectOption("desktop");
  await expect
    .poll(() =>
      page
        .locator("iframe")
        .first()
        .evaluate((f) => f.style.width),
    )
    .toBe("1440px");
  await page.locator("#viewport").selectOption("adaptive");
  await expect
    .poll(() =>
      page
        .locator("iframe")
        .first()
        .evaluate((f) =>
          Math.abs(
            parseInt(f.style.height) - f.closest("[data-content]").clientHeight,
          ),
        ),
    )
    .toBeLessThan(2);
  await page.screenshot({
    path: `test-results/workspace-dual-${test.info().project.name}.png`,
  });
});
