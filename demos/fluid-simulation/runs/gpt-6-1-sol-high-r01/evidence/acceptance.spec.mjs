import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

// 本轮产物的数值与交互验收；空白基线缺少这些 runs 时不依赖历史实现。
const topics = [
  "circuit-lab",
  "fantasy-map-generator",
  "fluid-simulation",
  "pathfinding-lab",
];
const run = "gpt-6-1-sol-high-r01";
const entry = (topic) => `demos/${topic}/runs/${run}/index.html`;
const available = (topic) => fs.existsSync(entry(topic));

test("新增实验：目录登记、静态入口与原始输入链接可访问", async ({
  page,
  request,
}) => {
  test.skip(!topics.every(available));
  await page.goto("./");
  const ids = await page.evaluate(() =>
    window.ARCHIVE.runs.map((run) => run.id),
  );
  for (const topic of topics) {
    expect(ids).toContain(`${topic}--${run}`);
    for (const file of [
      "index.html",
      "prompt.md",
      "Readme.md",
      "run.json",
      "first-pass/index.html",
      "evidence/desktop.png",
      "evidence/mobile.png",
    ]) {
      const response = await request.get(`demos/${topic}/runs/${run}/${file}`);
      expect(response.status(), `${topic}/${file}`).toBe(200);
    }
  }
});

test("电路：串并联、混合电路、开关、电源异常及浮置支路", async ({ page }) => {
  test.skip(!available("circuit-lab"), "本轮实验不存在");
  await page.goto(entry("circuit-lab"));
  const solution = () => page.evaluate(() => lab.solve());
  let result = await solution();
  expect(result.total).toBeCloseTo(0.04, 9);
  expect(result.readings[2].voltage).toBeCloseTo(4, 9);
  expect(result.readings[4].current).toBeCloseTo(0.04, 9);
  await page.locator("#parallel").click();
  result = await solution();
  expect(result.readings[2].current).toBeCloseTo(0.12, 9);
  expect(result.readings[3].current).toBeCloseTo(0.06, 9);
  expect(result.total).toBeCloseTo(0.18, 9);
  await page.locator('[data-id="4"] rect').click();
  await page.locator("#toggle").click();
  result = await solution();
  expect(result.readings[2].current).toBe(0);
  expect(result.readings[3].current).toBe(0);
  expect(result.readings[4].current).toBe(0);

  const mixed = await page.evaluate(() => {
    const s = lab.state;
    s.components = [
      { id: 1, type: "battery", value: 12, x: 150, y: 200 },
      { id: 2, type: "resistor", value: 100, x: 350, y: 100 },
      { id: 3, type: "resistor", value: 200, x: 600, y: 100 },
      { id: 4, type: "resistor", value: 200, x: 600, y: 300 },
      { id: 5, type: "lamp", value: 100, x: 350, y: 400 },
    ];
    s.wires = [
      ["1:a", "2:a"],
      ["2:b", "3:a"],
      ["3:a", "4:a"],
      ["3:b", "4:b"],
      ["4:b", "1:b"],
    ].map(([a, b]) => ({ a, b }));
    return lab.solve();
  });
  expect(mixed.total).toBeCloseTo(0.06, 9);
  expect(mixed.readings[3].current).toBeCloseTo(0.03, 9);
  expect(mixed.readings[4].current).toBeCloseTo(0.03, 9);
  expect(mixed.readings[5].current).toBe(0);
  const errors = await page.evaluate(() => {
    const s = lab.state;
    s.components = [
      { id: 1, type: "battery", value: 12 },
      { id: 2, type: "battery", value: 6 },
    ];
    s.wires = [{ a: "1:a", b: "1:b" }];
    const short = lab.solve().error;
    s.wires = [
      { a: "1:a", b: "2:a" },
      { a: "1:b", b: "2:b" },
    ];
    const conflict = lab.solve().error;
    s.components[1].value = 12;
    const redundant = lab.solve().error;
    return { short, conflict, redundant };
  });
  expect(errors.short).toContain("短路");
  expect(errors.conflict).toContain("冲突");
  expect(errors.redundant).toContain("无唯一解");
  await page.locator("#reset").click();
  await page.locator("#value").fill("24");
  await page.locator("#value").press("Tab");
  expect((await solution()).total).toBeCloseTo(0.08, 9);
  await page.locator('[data-id="2"] rect').click();
  await page.locator("#value").fill("1e-300");
  await page.locator("#value").press("Tab");
  await expect(page.locator("#valueError")).toContainText("电阻范围");
  expect((await solution()).total).toBeCloseTo(0.08, 9);
  await page.locator("#value").fill("");
  await page.locator("#value").press("Tab");
  await expect(page.locator("#valueError")).toContainText("有效数值");
  expect((await solution()).total).toBeCloseTo(0.08, 9);
});

test("电路：拖动保留连线，删除清理连线，灯泡功率影响亮度", async ({ page }) => {
  test.skip(!available("circuit-lab"));
  await page.goto(entry("circuit-lab"));
  const box = await page.locator('[data-id="2"] rect').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 35,
    box.y + box.height / 2 + 25,
  );
  await page.mouse.up();
  const after = await page.evaluate(() => ({
    wires: lab.state.wires.length,
    x: lab.state.components[1].x,
    current: lab.solve().total,
  }));
  expect(after.wires).toBe(4);
  expect(after.x).toBeGreaterThan(450);
  expect(after.current).toBeCloseTo(0.04, 9);
  await page.locator("#delete").click();
  expect(await page.evaluate(() => lab.state.wires.length)).toBe(2);
  expect((await page.evaluate(() => lab.solve())).total).toBe(0);
  await page.locator("#reset").click();
  const powers = await page.evaluate(() => {
    const s = lab.state;
    s.components[1].type = "lamp";
    lab.render();
    const p1 = lab.solve().readings[2].power;
    s.components[0].value = 24;
    lab.render();
    return [p1, lab.solve().readings[2].power];
  });
  expect(powers[1]).toBeCloseTo(powers[0] * 4, 9);
});

test("地图：种子复现、参数变化、缩放绘制坐标、水系下降与导出", async ({
  page,
}) => {
  test.skip(!available("fantasy-map-generator"));
  await page.goto(entry("fantasy-map-generator"));
  const fingerprint = async () => {
    const value = await page.evaluate(() => ({
      heights: Array.from(lab.state.heights),
      png: lab.atlas.toDataURL(),
    }));
    const hash = (value) => createHash("sha256").update(value).digest("hex");
    return {
      heights: hash(JSON.stringify(value.heights)),
      png: hash(value.png),
    };
  };
  const first = await fingerprint();
  await page.locator("#generate").click();
  expect(await fingerprint()).toEqual(first);
  await page.locator("#seed").fill("另一片大陆");
  await page.locator("#generate").click();
  expect((await fingerprint()).heights).not.toEqual(first.heights);
  await page.locator("#reset").click();
  await page.locator("#sea").fill("0.6");
  await page.locator("#sea").dispatchEvent("input");
  expect((await fingerprint()).png).not.toBe(first.png);
  expect((await fingerprint()).heights).toEqual(first.heights);
  await page.locator("#reset").click();
  await page.locator("#zoomIn").click();
  await page.locator('[data-tool="raise"]').click();
  const before = await page.evaluate(() => ({
    h: lab.state.heights[60 * 160 + 80],
    q: lab.world({ x: 480, y: 360 }),
    r: lab.state.rivers.length,
  }));
  const canvas = await page.locator("#map").boundingBox();
  await page.mouse.click(
    canvas.x + canvas.width / 2,
    canvas.y + canvas.height / 2,
  );
  const after = await page.evaluate(() => ({
    h: lab.state.heights[60 * 160 + 80],
    edited: lab.state.edited,
    downhill: lab.state.rivers.every((p) =>
      p.every(
        (i, k) => k === 0 || lab.state.heights[i] < lab.state.heights[p[k - 1]],
      ),
    ),
    rivers: lab.state.rivers.length,
    lakes: lab.state.lakes.every((i) => lab.state.receiver[i] === -1),
  }));
  expect(before.q.x).toBeCloseTo(80, 8);
  expect(before.q.y).toBeCloseTo(60, 8);
  expect(after.h).toBeGreaterThan(before.h);
  expect(after.edited).toBe(true);
  expect(after.downhill).toBe(true);
  expect(after.lakes).toBe(true);
  expect(after.rivers).toBeGreaterThan(0);
  await page.locator("#labels").uncheck();
  const without = (await fingerprint()).png;
  await page.locator("#labels").check();
  expect((await fingerprint()).png).not.toBe(without);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export").click(),
  ]);
  const file = await download.path();
  const png = fs.readFileSync(file);
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(960);
  expect(png.readUInt32BE(20)).toBe(720);
  const actual = await page.evaluate(() => lab.atlas.toDataURL().split(",")[1]);
  expect(png.equals(Buffer.from(actual, "base64"))).toBe(true);
  await page.locator("#seed").fill("");
  await page.locator("#generate").click();
  await expect(page.locator("#status")).toContainText("非空");
});

test("寻路：已知最短结果、独立代价参照、不可达与真实逐步控制", async ({
  page,
}) => {
  test.skip(!available("pathfinding-lab"));
  await page.goto(entry("pathfinding-lab"));
  const results = await page.evaluate(() => {
    function complete(algorithm, preset) {
      document.getElementById("algorithm").value = algorithm;
      lab.preset(preset);
      for (let i = 0; i < 1000 && !lab.state.search?.done; i++) lab.step();
      return {
        steps: Number(document.getElementById("steps").textContent),
        cost: Number(document.getElementById("cost").textContent),
        path: lab.state.search.path,
        visited: lab.state.search.visited,
      };
    }
    return {
      empty: complete("astar", "empty"),
      bfs: complete("bfs", "weighted"),
      dijkstra: complete("dijkstra", "weighted"),
      astar: complete("astar", "weighted"),
      sealed: complete("astar", "sealed"),
    };
  });
  expect(results.empty.steps).toBe(25);
  expect(results.empty.cost).toBe(25);
  expect(results.bfs.steps).toBe(25);
  expect(results.bfs.cost).toBe(89);
  expect(results.dijkstra.cost).toBe(31);
  expect(results.astar.cost).toBe(31);
  expect(results.sealed.path).toHaveLength(0);
  await expect(page.locator("#status")).toContainText("不可达");
  const randomCosts = await page.evaluate(() => {
    lab.preset("empty");
    const s = lab.state;
    let rng = 738;
    const random = () => {
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
      return rng / 4294967296;
    };
    for (let i = 0; i < s.cells.length; i++)
      if (i !== s.start && i !== s.end) {
        const r = random();
        s.cells[i] = r < 0.15 ? 1 : r < 0.5 ? 2 : 0;
      }
    const dist = Array(s.cells.length).fill(Infinity),
      done = new Set();
    dist[s.start] = 0;
    for (let k = 0; k < s.cells.length; k++) {
      let u = -1;
      for (let i = 0; i < dist.length; i++)
        if (!done.has(i) && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0 || !Number.isFinite(dist[u])) break;
      done.add(u);
      const x = u % 32,
        y = Math.floor(u / 32);
      for (const v of [
        x > 0 ? u - 1 : -1,
        x < 31 ? u + 1 : -1,
        y > 0 ? u - 32 : -1,
        y < 19 ? u + 32 : -1,
      ])
        if (v >= 0 && s.cells[v] !== 1)
          dist[v] = Math.min(dist[v], dist[u] + (s.cells[v] === 2 ? 5 : 1));
    }
    const out = { reference: dist[s.end] };
    for (const algorithm of ["dijkstra", "astar"]) {
      lab.clearSearch();
      document.getElementById("algorithm").value = algorithm;
      for (let k = 0; k < 1000 && !s.search?.done; k++) lab.step();
      out[algorithm] = Number(document.getElementById("cost").textContent);
    }
    return out;
  });
  expect(randomCosts.dijkstra).toBe(randomCosts.reference);
  expect(randomCosts.astar).toBe(randomCosts.reference);
  await page.locator("#preset").selectOption("empty");
  await page.locator("#step").click();
  expect(await page.locator("#visited").textContent()).toBe("1");
  await page.locator("#run").click();
  await page.waitForTimeout(100);
  await page.locator("#pause").click();
  const stopped = await page.locator("#visited").textContent();
  await page.waitForTimeout(100);
  expect(await page.locator("#visited").textContent()).toBe(stopped);
  await page.locator("#step").click();
  expect(Number(await page.locator("#visited").textContent())).toBe(
    Number(stopped) + 1,
  );
  const box = await page.locator("#grid").boundingBox();
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.25);
  expect(await page.evaluate(() => lab.state.search)).toBeNull();
  expect(await page.evaluate(() => lab.state.running)).toBe(false);
});

test("流体：GPU 求解、动量、演化、暂停、清空、重建释放与 PNG", async ({
  page,
}) => {
  test.skip(!available("fluid-simulation"));
  await page.goto(entry("fluid-simulation"));
  expect(await page.evaluate(() => lab.ready)).toBe(true);
  await page.locator("#pause").click();
  const image = () =>
    page.evaluate(() => document.getElementById("fluid").toDataURL());
  const paused = await image();
  await page.waitForTimeout(150);
  expect(await image()).toBe(paused);
  await page.locator("#clear").click();
  const empty = await image();
  expect(empty).not.toBe(paused);
  const velocity = await page.evaluate(() => {
    const gl = lab.gl;
    lab.splat(0.5, 0.5, 40, -25, [1, 0.4, 0.8]);
    gl.bindFramebuffer(gl.FRAMEBUFFER, lab.velocity.read.fbo);
    const p = new Float32Array(4);
    gl.readPixels(80, 50, 1, 1, gl.RGBA, gl.FLOAT, p);
    return { v: [...p], error: gl.getError() };
  });
  expect(velocity.error).toBe(0);
  expect(velocity.v[0]).toBeGreaterThan(0);
  expect(velocity.v[1]).toBeLessThan(0);
  const initial = await image();
  await page.evaluate(() => {
    lab.advance(0.02);
    lab.draw();
  });
  expect(await image()).not.toBe(initial);
  const decays = await page.evaluate(() => {
    const read = () => {
      const gl = lab.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, lab.dye.read.fbo);
      const p = new Float32Array(4);
      gl.readPixels(80, 50, 1, 1, gl.RGBA, gl.FLOAT, p);
      return p[0];
    };
    const result = [];
    for (const value of ["0", "3"]) {
      lab.clear();
      document.getElementById("decay").value = value;
      lab.splat(0.5, 0.5, 0, 0, [1, 0, 0]);
      for (let k = 0; k < 10; k++) lab.advance(0.02);
      result.push(read());
    }
    return result;
  });
  expect(decays[0]).toBeGreaterThan(decays[1]);
  const deleted = await page.evaluate(() => {
    const gl = lab.gl,
      old = [...lab.resources];
    document.getElementById("resolution").value = "96";
    lab.rebuild();
    return {
      deleted: old.every(
        (t) => !gl.isTexture(t.texture) && !gl.isFramebuffer(t.fbo),
      ),
      count: lab.resources.length,
      width: lab.velocity.read.width,
      error: gl.getError(),
    };
  });
  expect(deleted.deleted).toBe(true);
  expect(deleted.width).toBe(96);
  expect(deleted.count).toBe(8);
  expect(deleted.error).toBe(0);
  await page.locator("#pause").click();
  const box = await page.locator("#fluid").boundingBox();
  await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.4);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.65, {
    steps: 10,
  });
  await page.mouse.up();
  await page.locator("#pause").click();
  expect(await image()).not.toBe(empty);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#snapshot").click(),
  ]);
  const png = fs.readFileSync(await download.path());
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  await page.locator("#reset").click();
  expect(await page.locator("#resolution").inputValue()).toBe("160");
  expect(await page.evaluate(() => lab.paused)).toBe(false);
});

test("流体：不支持 WebGL 时显示明确错误", async ({ page }) => {
  test.skip(!available("fluid-simulation"));
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type === "webgl2" ? null : original.call(this, type, ...args);
    };
  });
  await page.goto(entry("fluid-simulation"));
  await expect(page.locator("#error")).toBeVisible();
  await expect(page.locator("#error")).toContainText("不支持 WebGL 2");
  await page.locator("#snapshot").click();
  await expect(page.locator("#status")).toContainText("无法运行");
});

for (const topic of topics) {
  test(`${topic}：file:// 与 HTTP，390px 触摸无水平溢出`, async ({
    browser,
    baseURL,
  }) => {
    test.skip(!available(topic));
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const url of [
      new URL(entry(topic), baseURL).href,
      pathToFileURL(path.resolve(entry(topic))).href,
    ]) {
      await page.goto(url);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (topic === "circuit-lab") {
        await page.locator('[data-terminal="1:a"]').tap();
        await page.locator('[data-terminal="1:b"]').tap();
        await expect(page.locator("#status")).toContainText("短路");
        await page.locator("#reset").tap();
        const component = await page
          .locator('[data-id="2"] rect')
          .boundingBox();
        const board = await page.locator("#board").boundingBox();
        const touch = await context.newCDPSession(page);
        const point = {
          x: component.x + component.width / 2,
          y: component.y + component.height / 2,
        };
        await touch.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [point],
        });
        await touch.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: point.x + 15, y: point.y + 10 }],
        });
        await touch.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await touch.detach();
        const moved = await page.evaluate(() => lab.state.components[1]);
        expect(moved.x).toBeCloseTo(450 + (15 * 900) / board.width, 0);
        expect(moved.y).toBeCloseTo(150 + (10 * 900) / board.width, 0);
        expect(await page.evaluate(() => lab.solve().total)).toBeCloseTo(
          0.04,
          9,
        );
      } else if (topic === "fantasy-map-generator") {
        await page.locator('[data-tool="raise"]').tap();
        await page.locator("#map").scrollIntoViewIfNeeded();
        const r = await page.locator("#map").boundingBox();
        await page.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2);
        expect(await page.evaluate(() => lab.state.edited)).toBe(true);
      } else if (topic === "pathfinding-lab") {
        await page.locator("#grid").scrollIntoViewIfNeeded();
        const r = await page.locator("#grid").boundingBox();
        await page.touchscreen.tap(r.x + r.width * 0.5, r.y + r.height * 0.25);
        expect(await page.evaluate(() => lab.state.cells[5 * 32 + 16])).toBe(1);
        await page.locator("#step").tap();
        expect(await page.locator("#visited").textContent()).toBe("1");
      } else {
        expect(await page.evaluate(() => lab.ready)).toBe(true);
        await page.locator("#pause").tap();
        await page.locator("#clear").tap();
        await page.locator("#pause").tap();
        await page.locator("#fluid").tap();
        await page.setViewportSize({ width: 390, height: 750 });
        expect(await page.evaluate(() => lab.gl.getError())).toBe(0);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
    await context.close();
  });
}
