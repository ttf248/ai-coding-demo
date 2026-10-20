import { test, expect } from "@playwright/test";

const initial = {
  left: "circuit-lab--deepseek-v4-1-flash-1017-max-r01",
  right: "circuit-lab--deepseek-v4-1-flash-1017-high-r01",
  group: "circuit-lab/v1",
};

test.beforeEach(async ({ page, baseURL }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(baseURL).origin) return route.abort();
    if (/\/(previews|demos)\/.*\.html$/.test(url.pathname))
      return route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><h1>Preview</h1>",
      });
    return route.continue();
  });
  await page.goto("compare.html?" + new URLSearchParams(initial));
  await expect(page.locator("#run-left")).toHaveValue(initial.left);
});

test("wide toolbar centers task navigation and controls, keeps actions on the right and fits mobile", async ({
  page,
}) => {
  for (const [width, height] of [
    [2560, 1440],
    [1440, 960],
    [1200, 960],
    [1024, 768],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await expect(page.locator("#group-keyboard-tip")).toBeHidden();
    await expect(page.locator("#group")).toHaveAttribute(
      "aria-describedby",
      "group-keyboard-tip",
    );
    const rects = await page.evaluate(() => {
      const rect = (selector) => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return {
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
          center: (r.left + r.right) / 2,
        };
      };
      return {
        topic: rect(".topic-navigation"),
        actions: rect(".workspace-actions"),
        home: rect(".workspace-home"),
        segments: rect(".compare-controls .segments"),
        context: rect(".comparison-context"),
        controls: rect(".compare-controls"),
        grid: rect(".compare-grid"),
        overflow: document.documentElement.scrollWidth > innerWidth,
        controlsOverlap: (() => {
          const b = document
            .querySelector(".comparison-context")
            .getBoundingClientRect();
          return [
            ...document.querySelectorAll(
              ".compare-controls > :not(.comparison-context)",
            ),
          ]
            .filter((el) => el.getClientRects().length)
            .some((el) => {
              const a = el.getBoundingClientRect();
              return (
                a.left < b.right &&
                a.right > b.left &&
                a.top < b.bottom &&
                a.bottom > b.top
              );
            });
        })(),
      };
    });
    expect(rects.overflow, `overflow at ${width}px`).toBe(false);
    if (width >= 1200) {
      expect(Math.abs(rects.topic.center - width / 2)).toBeLessThan(2);
      expect(rects.home.right).toBeLessThan(rects.topic.left);
      expect(rects.actions.left).toBeGreaterThan(rects.topic.right);
      expect(rects.segments.left).toBeGreaterThan(width / 5);
      expect(rects.controlsOverlap).toBe(false);
      expect((height - rects.grid.top) / height).toBeGreaterThan(0.8);
    }
    await page.locator("#group").focus();
    await expect(page.locator("#group-keyboard-tip")).toBeVisible();
    await page.locator("#group").blur();
    if (width === 390) {
      expect(rects.actions.top).toBeGreaterThanOrEqual(rects.topic.bottom);
      await expect(page.locator("iframe")).toHaveCount(1);
      // 次级设置收进折叠块，关系状态与内容页签常驻。
      const settings = page.locator(".compare-settings");
      await expect(settings).not.toHaveAttribute("open", "");
      await expect(page.locator("#relation")).toBeVisible();
      await expect(page.locator(".compare-controls .segments")).toBeVisible();
      const panel = await page.locator("#panel-left").boundingBox();
      expect(panel.y).toBeLessThan(420);
      await page.locator(".compare-settings > summary").click();
      await expect(settings).toHaveAttribute("open", "");
      await expect(page.locator("#viewport")).toBeVisible();
      await page.locator(".workspace-help > summary").click();
      const notice = await page.locator(".compare-notice").boundingBox();
      expect(notice.x).toBeGreaterThanOrEqual(0);
      expect(notice.x + notice.width).toBeLessThanOrEqual(width);
      await page.locator(".workspace-help > summary").click();
    }
    await page.screenshot({
      path: `test-results/compare-toolbar-${width}-${test.info().project.name}.png`,
    });
  }
});

test("focused theme arrows and navigation buttons switch immediately while preserving models and history", async ({
  page,
}) => {
  const group = page.locator("#group");
  await group.focus();
  for (const [key, topic] of [
    ["ArrowDown", "fantasy-map-generator"],
    ["ArrowDown", "fluid-simulation"],
    ["ArrowUp", "fantasy-map-generator"],
  ]) {
    await group.press(key);
    await expect(group).toHaveValue(`${topic}/v1`);
    await expect(group).toBeFocused();
    await expect(page.locator("#run-left")).toHaveValue(
      `${topic}--deepseek-v4-1-flash-1017-max-r01`,
    );
    await expect(page.locator("#run-right")).toHaveValue(
      `${topic}--deepseek-v4-1-flash-1017-high-r01`,
    );
    const params = new URL(page.url()).searchParams;
    expect(params.get("group")).toBe(`${topic}/v1`);
    expect(params.get("left")).toBe(
      `${topic}--deepseek-v4-1-flash-1017-max-r01`,
    );
    await expect(page.locator("iframe")).toHaveCount(2);
  }
  const previous = page.url();
  await page.locator("#next-topic").click();
  await expect(group).toHaveValue("fluid-simulation/v1");
  await page.goBack();
  await expect(group).toHaveValue("fantasy-map-generator/v1");
  expect(page.url()).toBe(previous);
  await page.locator("#previous-topic").click();
  await expect(group).toHaveValue("circuit-lab/v1");
  await expect(page.locator("#run-left")).toHaveValue(initial.left);
});

test("theme shortcuts stop at boundaries and leave modified keys and other controls alone", async ({
  page,
}) => {
  const group = page.locator("#group");
  await group.selectOption("bluebook/v1");
  await expect(page.locator("#previous-topic")).toBeDisabled();
  await group.focus();
  const first = page.url();
  await group.press("ArrowUp");
  expect(page.url()).toBe(first);
  const lastGroup = await group.locator("option").last().getAttribute("value");
  await group.selectOption(lastGroup);
  await expect(page.locator("#next-topic")).toBeDisabled();
  const last = page.url();
  await group.press("ArrowDown");
  expect(page.url()).toBe(last);
  for (const modifier of ["altKey", "ctrlKey", "metaKey", "shiftKey"]) {
    expect(
      await group.evaluate(
        (el, modifier) =>
          el.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "ArrowUp",
              bubbles: true,
              cancelable: true,
              [modifier]: true,
            }),
          ),
        modifier,
      ),
    ).toBe(true);
    expect(page.url()).toBe(last);
  }
  await page.locator("#pick-models").click();
  await page.locator("#model-search").press("ArrowUp");
  await expect(group).toHaveValue(lastGroup);
  await page.locator("#close-picker").click();
  await group.selectOption("");
  await group.focus();
  await group.press("ArrowDown");
  await expect(group).toHaveValue("bluebook/v1");
});
