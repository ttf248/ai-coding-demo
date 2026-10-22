import { test, expect } from "@playwright/test";

const sides = ["left", "right", "third", "fourth"];
const original = {
  left: "voxel-construction-site--deepseek-v4-1-flash-1017-max-r01",
  right: "voxel-construction-site--deepseek-v4-1-flash-0731-max-r01",
  group: "fluid-simulation/v1",
  scope: "task",
  layout: "dual",
  viewport: "adaptive",
  tab: "preview",
  source: "task",
  mobile: "left",
};

test.beforeEach(async ({ page, baseURL }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(baseURL).origin) return route.abort();
    if (/\/(previews|demos)\/.*\.html$/.test(url.pathname))
      return route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><h1>Preview fixture</h1>",
      });
    return route.continue();
  });
});

async function expectTask(page, group, ids) {
  const expected = await page.evaluate((ids) => {
    const data = window.ARCHIVE;
    const U = window.ArchiveUI;
    return ids.map((id) => {
      const run = data.runs.find((r) => r.id === id);
      return run
        ? { group: run.topicId + "/" + run.promptId, href: U.previewURL(run) }
        : null;
    });
  }, ids);
  await expect(page.locator("#group")).toHaveValue(group);
  for (const [index, side] of sides.entries()) {
    const id = ids[index] || "";
    await expect(page.locator(`#run-${side}`)).toHaveValue(id);
    expect(new URL(page.url()).searchParams.get(side) || "").toBe(id);
    const frame = page.locator(`#panel-${side} iframe`);
    if (id) expect(expected[index]?.group).toBe(group);
    if (expected[index]?.href && (await frame.count()))
      await expect(frame).toHaveAttribute("src", expected[index].href);
  }
  return expected;
}

const pairFor = (topic) => [
  `${topic}--deepseek-v4-1-flash-1017-max-r01`,
  `${topic}--deepseek-v4-1-flash-0731-max-r01`,
];

test("task switching replaces old experiments and restores the updated URL and history", async ({
  page,
}) => {
  // Reproduce the reported URL: a new group with IDs from the previous topic.
  await page.goto("compare.html?" + new URLSearchParams(original));
  await expect(page.locator("#run-left")).toHaveValue(original.left);
  await expect(page.locator("#run-right")).toHaveValue(original.right);
  await page.locator("#group").selectOption("voxel-construction-site/v1");
  await expectTask(
    page,
    "voxel-construction-site/v1",
    pairFor("voxel-construction-site"),
  );
  const previous = page.url();
  await page.locator("#group").selectOption("fluid-simulation/v1");
  await expectTask(page, "fluid-simulation/v1", pairFor("fluid-simulation"));
  await expect(page.locator("iframe")).toHaveCount(2);
  const updated = page.url();
  await page.reload();
  await expectTask(page, "fluid-simulation/v1", pairFor("fluid-simulation"));
  expect(page.url()).toBe(updated);
  await page.goBack();
  await expectTask(
    page,
    "voxel-construction-site/v1",
    pairFor("voxel-construction-site"),
  );
  expect(page.url()).toBe(previous);
  await page.goForward();
  await expectTask(page, "fluid-simulation/v1", pairFor("fluid-simulation"));
  expect(page.url()).toBe(updated);
});

test("quad task switching clears old page, unload and focus state and clearing the group empties slots", async ({
  page,
}) => {
  const params = new URLSearchParams({
    ...original,
    group: "voxel-construction-site/v1",
    layout: "quad",
    focus: "right",
    mobile: "fourth",
    scope: "all",
    viewport: "tablet",
    ...Object.fromEntries(sides.map((side) => [side + "Page", "old-page"])),
    third: "voxel-construction-site--gpt-6-astra-low-r01",
    fourth: "voxel-construction-site--minimax-m3-1-flash-preview-max-r01",
  });
  params.delete("rightPage");
  await page.goto("compare.html?" + params);
  await page.locator("#panel-right .panel-more > summary").click();
  await page.locator('[data-unload="right"]').click();
  await expect(page.locator("#panel-right")).toContainText("已卸载此侧");
  await page.locator("#group").selectOption("fluid-simulation/v1");
  await expectTask(page, "fluid-simulation/v1", [
    ...pairFor("fluid-simulation"),
    "fluid-simulation--gpt-6-astra-low-r01",
    "fluid-simulation--minimax-m3-1-flash-preview-max-r03",
  ]);
  await expect(page.locator("iframe")).toHaveCount(4);
  await expect(page.locator("#layout")).toHaveValue("quad");
  await expect(page.locator("#viewport")).toHaveValue("tablet");
  const updated = new URL(page.url()).searchParams;
  expect(updated.get("scope")).toBe("task");
  expect(updated.get("mobile")).toBe("left");
  expect(updated.has("focus")).toBe(false);
  for (const side of sides) expect(updated.has(side + "Page")).toBe(false);
  await page.locator("#group").selectOption("");
  await expect(page.locator("#compare-start")).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  for (const side of sides) {
    expect(new URL(page.url()).searchParams.has(side)).toBe(false);
    expect(new URL(page.url()).searchParams.has(side + "Model")).toBe(false);
  }
});

test("mobile version switching retains the content tab and loads only the current preview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "compare.html?" +
      new URLSearchParams({
        group: "bluebook/v1",
        tab: "prompt",
        left: "bluebook--longcat-25-preview-free-default-r01",
        right: "bluebook--minimax-m3-1-flash-preview-max-r04",
      }),
  );
  await expect(page.locator("#panel-left pre")).toBeVisible();
  await page.locator('[data-mobile="right"]').click();
  await expect(page.locator("#panel-right pre")).toBeVisible();
  await page.locator("#group").selectOption("bluebook/v2");
  await expectTask(page, "bluebook/v2", [
    "bluebook--longcat-25-preview-free-default-r02",
    "bluebook--minimax-m3-1-flash-preview-max-r05",
  ]);
  await expect(page.locator('[data-tab="prompt"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator("#panel-left pre")).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.locator('[data-tab="preview"]').click();
  await expect(page.locator("iframe")).toHaveCount(1);
  await page.locator('[data-mobile="right"]').click();
  await expect(page.locator("#panel-right iframe")).toHaveCount(1);
  await page.locator("#group").selectOption("fluid-simulation/v1");
  await expectTask(page, "fluid-simulation/v1", [
    "fluid-simulation--longcat-25-preview-free-default-r01",
    "fluid-simulation--minimax-m3-1-flash-preview-max-r03",
  ]);
  await expect(page.locator("#panel-left iframe")).toHaveCount(1);
  await expect(page.locator("iframe")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("missing models stay remembered through refresh and restore when returning to a supported topic", async ({
  page,
}) => {
  const ids = [
    "voxel-construction-site--gpt-5-6-sol-high-r01",
    "voxel-construction-site--gpt-6-sol-medium-r01",
  ];
  await page.goto(
    "compare.html?" +
      new URLSearchParams({
        ...original,
        group: "voxel-construction-site/v1",
        left: ids[0],
        right: ids[1],
      }),
  );
  await expect(page.locator("#run-left")).toHaveValue(ids[0]);
  await page.locator("#group").selectOption("fluid-simulation/v1");
  await expectTask(page, "fluid-simulation/v1", []);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator("#compare-start")).toBeHidden();
  await expect(page.locator("#panel-left")).toContainText("GPT-5.6 Sol");
  await expect(page.locator("#panel-right")).toContainText("GPT-6 Sol");
  await expect(page.locator("#panel-left")).toContainText(
    "此任务暂无所选模型的实验",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('[data-mobile="left"]')).toContainText(
    "GPT-5.6 Sol",
  );
  await expect(page.locator('[data-mobile="right"]')).toContainText(
    "GPT-6 Sol",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.reload();
  await expectTask(page, "fluid-simulation/v1", []);
  await expect(page.locator("#panel-left")).toContainText("已保留模型选择");
  await page.locator("#group").selectOption("voxel-construction-site/v1");
  await expectTask(page, "voxel-construction-site/v1", ids);
  await page.goBack();
  await expectTask(page, "fluid-simulation/v1", []);
  await page.goForward();
  await expectTask(page, "voxel-construction-site/v1", ids);
});

test("same-model slots reserve exact efforts before fallbacks and preserve preferences when swapping or editing", async ({
  page,
}) => {
  await page.goto(
    "compare.html?" +
      new URLSearchParams({
        ...original,
        group: "voxel-construction-site/v1",
        left: "voxel-construction-site--gpt-6-1-sol-medium-r01",
        right: "voxel-construction-site--gpt-6-1-sol-max-r01",
      }),
  );
  await expect(page.locator("#run-left")).toHaveValue(
    "voxel-construction-site--gpt-6-1-sol-medium-r01",
  );
  await page.locator("#group").selectOption("fluid-simulation/v1");
  await expectTask(page, "fluid-simulation/v1", [
    "fluid-simulation--gpt-6-1-sol-xhigh-r02",
    "fluid-simulation--gpt-6-1-sol-max-r01",
  ]);
  expect(new URL(page.url()).searchParams.get("leftEffort")).toBe("medium");
  await page.reload();
  await expect(page.locator("#run-left")).toHaveValue(
    "fluid-simulation--gpt-6-1-sol-xhigh-r02",
  );
  await page.locator("#swap").click();
  await page.locator("#group").selectOption("voxel-construction-site/v1");
  await expectTask(page, "voxel-construction-site/v1", [
    "voxel-construction-site--gpt-6-1-sol-max-r01",
    "voxel-construction-site--gpt-6-1-sol-medium-r01",
  ]);
  await page.locator("#run-left").selectOption(original.left);
  await page.locator("#group").selectOption("fluid-simulation/v1");
  await expect(page.locator("#run-left")).toHaveValue(
    pairFor("fluid-simulation")[0],
  );
});
