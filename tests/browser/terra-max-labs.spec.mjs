import { test, expect } from "@playwright/test";
import fs from "node:fs";

test.beforeEach(async ({ page }) => {
  await page.route(/google-analytics|googletagmanager/, (route) =>
    route.abort(),
  );
});

const run = (topic) => `demos/${topic}/runs/gpt-6-1-terra-max-r01/index.html`;
const available = (topic) => fs.existsSync(run(topic));

test("circuit presets, open switch, wiring and short circuit", async ({
  page,
}) => {
  test.skip(!available("circuit-lab"), "This test run is not present.");
  await page.goto(run("circuit-lab"));
  await expect(page.locator("#results")).toContainText("0.0400 A");
  await page.locator("#parallel").click();
  for (const current of ["0.1200 A", "0.0600 A", "-0.1800 A"])
    await expect(page.locator("#results")).toContainText(current);
  const pin = (id, end) =>
    page.locator(`circle[data-id="${id}"][data-pin="${end}"]`);
  await pin("c1", "a").click();
  await pin("c1", "b").click();
  await expect(page.locator("#status")).toContainText("电源短路");
  await page.locator("#reset").click();
  for (const kind of ["battery", "resistor", "switch"])
    await page.locator(`[data-add="${kind}"]`).click();
  for (const [a, ap, b, bp] of [
    ["c1", "a", "c2", "a"],
    ["c2", "b", "c3", "a"],
    ["c3", "b", "c1", "b"],
  ]) {
    await pin(a, ap).click();
    await pin(b, bp).click();
  }
  await expect(page.locator("#results")).toContainText("0.1200 A");
  await page.locator('.part[data-id="c3"]').click();
  await page.locator("#toggle").click();
  await expect(page.locator("#results")).toContainText("0.0000 A");
  await page.locator('.part[data-id="c2"]').click();
  await page.locator("#delete").click();
  await expect(page.locator("#board path")).toHaveCount(1);
});

test("path algorithms report correct costs and unreachable targets", async ({
  page,
}) => {
  test.skip(!available("pathfinding-lab"), "This test run is not present.");
  await page.goto(run("pathfinding-lab"));
  async function finish() {
    return page.evaluate(() => {
      for (let i = 0; i < 1000; i++) {
        if (
          ["已找到", "不可达"].includes(
            document.querySelector("#state").textContent,
          )
        )
          break;
        document.querySelector("#step").click();
      }
      return {
        state: document.querySelector("#state").textContent,
        steps: document.querySelector("#steps").textContent,
        cost: document.querySelector("#cost").textContent,
      };
    });
  }
  await page.selectOption("#algorithm", "bfs");
  expect(await finish()).toEqual({ state: "已找到", steps: "21", cost: "21" });
  await page.selectOption("#algorithm", "dijkstra");
  await page.locator("#preset").click();
  const dijkstra = await finish();
  await page.selectOption("#algorithm", "astar");
  await page.locator("#preset").click();
  const astar = await finish();
  expect(astar.state).toBe("已找到");
  expect(astar.cost).toBe(dijkstra.cost);
  await page.locator("#reset").click();
  const bounds = await page.locator("#grid").boundingBox();
  for (const [x, y] of [
    [23, 8],
    [25, 8],
    [24, 7],
    [24, 9],
  ])
    await page.mouse.click(
      bounds.x + ((x + 0.5) * bounds.width) / 28,
      bounds.y + ((y + 0.5) * bounds.height) / 16,
    );
  expect((await finish()).state).toBe("不可达");
});

test("map seed, zoomed editing and PNG export", async ({ page }) => {
  test.skip(
    !available("fantasy-map-generator"),
    "This test run is not present.",
  );
  await page.goto(run("fantasy-map-generator"));
  const image = () =>
    page.locator("#map").evaluate((canvas) => canvas.toDataURL());
  const first = await image();
  await page.locator("#generate").click();
  expect(await image()).toBe(first);
  await page.locator("#seed").fill("another seed");
  await page.locator("#generate").click();
  expect(await image()).not.toBe(first);
  await page.locator("#in").click();
  await page.locator('[data-tool="raise"]').click();
  const beforeEdit = await image();
  const b = await page.locator("#map").boundingBox();
  await page.mouse.move(b.x + b.width * 0.5, b.y + b.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width * 0.54, b.y + b.height * 0.54, {
    steps: 4,
  });
  await page.mouse.up();
  expect(await image()).not.toBe(beforeEdit);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export").click(),
  ]);
  expect(download.suggestedFilename()).toBe("fantasy-map.png");
});

test("fluid pause and clear operate on the rendered field", async ({
  page,
}) => {
  test.skip(!available("fluid-simulation"), "This test run is not present.");
  await page.goto(run("fluid-simulation"));
  const error = await page.locator("#error").innerText();
  if (error) {
    expect(error).toContain("WebGL");
    return;
  }
  await expect(page.locator("#status")).toContainText("运行中");
  await page.locator("#pause").click();
  const image = () =>
    page.locator("canvas").evaluate((canvas) => canvas.toDataURL());
  const paused = await image();
  await page.waitForTimeout(200);
  expect(await image()).toBe(paused);
  await page.locator("#clear").click();
  expect(await image()).not.toBe(paused);
});
