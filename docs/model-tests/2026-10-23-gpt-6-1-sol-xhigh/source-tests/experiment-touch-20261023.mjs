import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
fs.mkdirSync(".cache/model-test-20261023", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
const page = await context.newPage(),
  cdp = await context.newCDPSession(page);
const base = "http://127.0.0.1:43903/demos/",
  suffix = "/runs/gpt-6-1-sol-xhigh-r01/index.html";
const point = async (selector) => {
  const r = await page.locator(selector).boundingBox();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
};
async function drag(from, to) {
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [from],
  });
  for (let i = 1; i <= 8; i++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: from.x + ((to.x - from.x) * i) / 8,
          y: from.y + ((to.y - from.y) * i) / 8,
        },
      ],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
}
const result = {};
try {
  await page.goto(base + "pathfinding-lab" + suffix);
  await page.locator("#grid").scrollIntoViewIfNeeded();
  const grid = await page.locator("#grid").boundingBox();
  await page.touchscreen.tap(
    grid.x + (grid.width * 8.5) / 30,
    grid.y + (grid.height * 5.5) / 20,
  );
  expect(await page.evaluate(() => window.lab.state.cells[5 * 30 + 8])).toBe(1);
  await drag(
    {
      x: grid.x + (grid.width * 9.5) / 30,
      y: grid.y + (grid.height * 5.5) / 20,
    },
    {
      x: grid.x + (grid.width * 13.5) / 30,
      y: grid.y + (grid.height * 5.5) / 20,
    },
  );
  expect(await page.evaluate(() => window.lab.state.cells[5 * 30 + 12])).toBe(
    1,
  );
  result.pathfindingPaint = true;
  await page.goto(base + "circuit-lab" + suffix);
  await page.locator("#empty").click();
  await page.locator("[data-add=resistor]").click();
  await page.locator("[data-add=resistor]").click();
  await page.locator("#board").scrollIntoViewIfNeeded();
  const ids = await page.evaluate(() =>
    window.lab.state.components.map((c) => c.id),
  );
  for (const pin of [ids[0] + ":1", ids[1] + ":0"]) {
    const p = await point(`[data-pin="${pin}"]`);
    await page.touchscreen.tap(p.x, p.y);
  }
  expect(await page.evaluate(() => window.lab.state.wires.length)).toBe(1);
  const c = await point(`[data-id="${ids[1]}"] rect`);
  await drag(c, { x: c.x + 15, y: c.y + 25 });
  expect(
    await page.evaluate(() => window.lab.state.components[1].y),
  ).toBeGreaterThan(170);
  expect(await page.evaluate(() => window.lab.state.wires.length)).toBe(1);
  await page.locator("#delete").click();
  expect(await page.evaluate(() => window.lab.state.wires.length)).toBe(0);
  result.circuitTouchWiringDragDelete = true;
  await page.goto(base + "fantasy-map-generator" + suffix);
  await page.locator("[data-tool=raise]").click();
  await page.locator("#in").click();
  await page.locator("#map").scrollIntoViewIfNeeded();
  const before = await page.evaluate(() =>
    Array.from(window.lab.state.heights),
  );
  const center = await point("#map");
  await page.touchscreen.tap(center.x, center.y);
  await expect
    .poll(() =>
      page.evaluate(
        (a) => a.some((v, i) => v !== window.lab.state.heights[i]),
        before,
      ),
    )
    .toBe(true);
  result.mapTouchBrush = true;
  await page.goto(base + "fluid-simulation" + suffix);
  await page.locator("#clear").click();
  await page.locator("#fluid").scrollIntoViewIfNeeded();
  const fluid = await point("#fluid");
  await drag(fluid, { x: fluid.x + 45, y: fluid.y + 25 });
  expect(
    await page.evaluate(() =>
      Array.from(window.lab.readDye()).some((v) => v > 0.01),
    ),
  ).toBe(true);
  result.fluidTouchInjection = true;
  await page.goto(base + "pixel-flow" + suffix);
  await page.locator("#particles").scrollIntoViewIfNeeded();
  const particle = await point("#particles");
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [particle],
  });
  await page.waitForTimeout(200);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  expect(
    await page.evaluate(() => window.lab.state.amounts.some((v) => v > 0)),
  ).toBe(true);
  result.particleTouchAttraction = true;
  fs.writeFileSync(
    ".cache/model-test-20261023/experiment-touch-20261023.json",
    JSON.stringify({ pass: true, result }, null, 2) + "\n",
  );
  console.log(JSON.stringify({ pass: true, result }));
} finally {
  await browser.close();
}
