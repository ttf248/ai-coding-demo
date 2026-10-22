import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadCatalog } from "../../scripts/lib.mjs";
process.env.NO_PROXY = "127.0.0.1,localhost";

// Run from the repository root: node tests/experiments/gpt-6-astra-max.mjs
// Optional topic IDs limit the run. A temporary read-only server is owned by this script.
const output = "test-results/gpt-6-astra-max";
const resultFile =
  output +
  "/results" +
  (process.argv.length > 2 ? "-" + process.argv.slice(2).join("_") : "") +
  ".json";
fs.mkdirSync(output + "/screenshots", { recursive: true });
const server = spawn(process.execPath, ["scripts/serve.mjs", "--read-only"], {
  env: { ...process.env, PORT: "0", SITE_BASE: "/" },
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let serverErrors = "";
server.stderr.on("data", (chunk) => (serverErrors += chunk));
process.on("exit", () => server.kill());
const base = await new Promise((resolve, reject) => {
  const timer = setTimeout(
    () => reject(Error("Preview startup timeout: " + serverErrors)),
    15000,
  );
  server.once("error", (e) => {
    clearTimeout(timer);
    reject(e);
  });
  server.once("exit", (code) => {
    clearTimeout(timer);
    reject(Error("Preview exited " + code + ": " + serverErrors));
  });
  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk;
    const match = output.match(/Archive: (http:\/\/127\.0\.0\.1:\d+\/)/);
    if (match) {
      clearTimeout(timer);
      resolve(match[1]);
    }
  });
});
const browser = await chromium.launch({
  headless: true,
  args: [
    "--enable-unsafe-swiftshader",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
});
const results = [];

const entry = (t) =>
  t === "bluebook"
    ? "previews/bluebook/gpt-6-astra-max-r01/index.html"
    : "demos/" + t + "/runs/gpt-6-astra-max-r01/index.html";
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, a + " != " + b);
async function test(topic, name, fn) {
  if (process.argv.length > 2 && !process.argv.slice(2).includes(topic)) return;
  const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      hasTouch: true,
      acceptDownloads: true,
    }),
    page = await context.newPage(),
    errors = [];
  page.setDefaultTimeout(20000);
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    await page.goto(base + entry(topic), {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await fn(page, context);
    assert.deepEqual(errors, []);
    results.push({ topic, name, ok: true });
  } catch (e) {
    results.push({
      topic,
      name,
      ok: false,
      error: e.stack?.slice(0, 1800),
      errors,
    });
  } finally {
    await context.close();
    console.log(JSON.stringify(results.at(-1)));
    fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
  }
}
await test(
  "circuit-lab",
  "DC numeric acceptance, editing, singular cases, touch",
  async (p) => {
    let r = await p.evaluate(() => circuitLab.state.readings);
    near(r[0].i, -0.04);
    near(r[1].i, 0.04);
    near(r[2].v, 8);
    await p.selectOption("#preset", "parallel");
    r = await p.evaluate(() => circuitLab.state.readings);
    near(r[0].i, -0.18);
    near(r[1].i, 0.12);
    near(r[2].i, 0.06);
    await p.selectOption("#preset", "switch");
    await p.locator('[data-component="3"]').click();
    await p.locator("#toggle").click();
    r = await p.evaluate(() => circuitLab.state.readings);
    r.forEach((v) => near(v.i, 0));
    await p.locator("#toggle").click();
    r = await p.evaluate(() => circuitLab.state.readings);
    near(r[1].i, 0.12);
    const before = await p.evaluate(() => circuitLab.state.wires),
      b = await p.locator('[data-component="2"] .body').boundingBox();
    await p.mouse.move(b.x + 40, b.y + 25);
    await p.mouse.down();
    await p.mouse.move(b.x + 90, b.y + 55, { steps: 5 });
    await p.mouse.up();
    assert.deepEqual(await p.evaluate(() => circuitLab.state.wires), before);
    await p.locator("#delete").click();
    assert.equal(await p.evaluate(() => circuitLab.state.wires.length), 1);
    await p.selectOption("#preset", "series");
    await p.evaluate(() => circuitLab.connect("1a", "1b"));
    await expect(p.locator("#status")).toContainText("电源短路");
    const errors = await p.evaluate(() => {
      const cs = [
          { id: 1, type: "battery", value: 12 },
          { id: 2, type: "battery", value: 9 },
        ],
        ws = [
          { a: "1a", b: "2a" },
          { a: "1b", b: "2b" },
        ],
        out = [];
      for (const v of [9, 12]) {
        cs[1].value = v;
        try {
          circuitLab.solve(cs, ws);
        } catch (e) {
          out.push(e.message);
        }
      }
      return out;
    });
    assert.match(errors[0], /冲突/);
    assert.match(errors[1], /无唯一解/);
    await p.selectOption("#preset", "empty");
    await p.locator('[data-add="battery"]').click();
    await p.locator('[data-add="resistor"]').click();
    await p.locator('[data-terminal="1a"]').tap();
    await p.locator('[data-terminal="2a"]').tap();
    await p.locator('[data-terminal="1b"]').tap();
    await p.locator('[data-terminal="2b"]').tap();
    assert.equal(await p.evaluate(() => circuitLab.state.wires.length), 2);
    near((await p.evaluate(() => circuitLab.state.readings))[1].i, 0.12);
  },
);
await test(
  "pathfinding-lab",
  "Shortest paths, weighted costs, unreachable, pause/edit",
  async (p) => {
    async function solve(algorithm, preset) {
      await p.selectOption("#algorithm", algorithm);
      await p.selectOption("#preset", preset);
      return p.evaluate(() => {
        for (let i = 0; i < 1000 && !routeLab.state.search?.done; i++)
          routeLab.step();
        const s = routeLab.state.search;
        return {
          cost: s.cost,
          path: s.path,
          closed: s.closed.size,
          cells: routeLab.state.cells,
          start: routeLab.state.start,
          end: routeLab.state.end,
        };
      });
    }
    let r = await solve("bfs", "empty");
    assert.equal(r.path.length - 1, 18);
    assert.equal(r.cost, 18);
    const d = await solve("dijkstra", "weighted"),
      a = await solve("astar", "weighted"),
      b = await solve("bfs", "weighted");
    assert.equal(d.cost, a.cost);
    assert.ok(b.path.length <= d.path.length);
    assert.ok(b.cost > d.cost);
    for (let i = 1; i < a.path.length; i++)
      assert.ok([1, 25].includes(Math.abs(a.path[i] - a.path[i - 1])));
    // Independent weighted Bellman-Ford oracle on the same input.
    const distance = Array(425).fill(Infinity);
    distance[d.start] = 0;
    for (let n = 0; n < 424; n++) {
      let changed = false;
      for (let i = 0; i < 425; i++) {
        if (d.cells[i] === 1) continue;
        for (const j of [
          i % 25 ? i - 1 : -1,
          i % 25 < 24 ? i + 1 : -1,
          i >= 25 ? i - 25 : -1,
          i < 400 ? i + 25 : -1,
        ])
          if (j >= 0 && d.cells[j] !== 1) {
            const c = distance[i] + (d.cells[j] === 2 ? 5 : 1);
            if (c < distance[j]) {
              distance[j] = c;
              changed = true;
            }
          }
      }
      if (!changed) break;
    }
    assert.equal(d.cost, distance[d.end]);
    r = await solve("astar", "closed");
    assert.equal(r.path.length, 0);
    await expect(p.locator("#status")).toContainText("不可达");
    await p.selectOption("#preset", "empty");
    await p.locator("#step").click();
    assert.equal(await p.evaluate(() => routeLab.state.search.closed.size), 1);
    await p.waitForTimeout(300);
    assert.equal(await p.evaluate(() => routeLab.state.search.closed.size), 1);
    await p.locator("#run").click();
    await p.waitForTimeout(300);
    await p.locator("#run").click();
    const count = await p.evaluate(() => routeLab.state.search.closed.size);
    await p.waitForTimeout(200);
    assert.equal(
      await p.evaluate(() => routeLab.state.search.closed.size),
      count,
    );
    await p.evaluate(() => routeLab.edit(0, "wall"));
    assert.equal(await p.evaluate(() => routeLab.state.search), null);
  },
);
await test(
  "fantasy-map-generator",
  "Deterministic terrain, downhill rivers, transformed brush, export",
  async (p) => {
    const initial = await p.evaluate(() => atlasLab.state);
    await p.locator("#generate").click();
    assert.deepEqual(
      (await p.evaluate(() => atlasLab.state)).heights,
      initial.heights,
    );
    await p.fill("#seed", "另一个世界");
    await p.locator("#generate").click();
    assert.notDeepEqual(
      (await p.evaluate(() => atlasLab.state)).heights,
      initial.heights,
    );
    await p.locator("#reset").click();
    for (const r of initial.rivers)
      for (let i = 1; i < r.path.length; i++)
        assert.ok(initial.heights[r.path[i]] < initial.heights[r.path[i - 1]]);
    await p.locator("#in").click();
    await p.locator('[data-mode="lower"]').click();
    const box = await p.locator("#map").boundingBox(),
      x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    const before = await p.evaluate(() => atlasLab.state.heights);
    await p.mouse.move(x, y);
    await p.mouse.down();
    await p.mouse.move(x + 14, y + 10, { steps: 4 });
    await p.mouse.up();
    await p.waitForTimeout(100);
    const after = await p.evaluate(() => atlasLab.state);
    assert.ok(after.revision > 0);
    assert.notDeepEqual(after.heights, before);
    assert.ok(after.heights[65 * 180 + 90] < before[65 * 180 + 90]);
    for (const r of after.rivers)
      for (let i = 1; i < r.path.length; i++)
        assert.ok(after.heights[r.path[i]] < after.heights[r.path[i - 1]]);
    const download = p.waitForEvent("download");
    await p.locator("#export").click();
    assert.match((await download).suggestedFilename(), /\.png$/);
  },
);
await test(
  "fluid-simulation",
  "GPU initialization, evolving pixels, pause, clear, resources, PNG",
  async (p) => {
    await p.waitForFunction(() => window.fluidLab?.state.ready);
    await p.waitForTimeout(500);
    assert.equal(await p.evaluate(() => fluidLab.state.resources), 8);
    const box = await p.locator("#fluid").boundingBox();
    await p.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.4);
    await p.mouse.down();
    await p.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.65, {
      steps: 12,
    });
    await p.mouse.up();
    const first = await p.locator("#fluid").evaluate((c) => c.toDataURL());
    await p.waitForTimeout(500);
    const second = await p.locator("#fluid").evaluate((c) => c.toDataURL());
    assert.ok(first !== second, "Fluid pixels must evolve");
    await p.locator("#pause").click();
    const step = await p.evaluate(() => fluidLab.state.steps),
      frozen = await p.locator("#fluid").evaluate((c) => c.toDataURL());
    await p.waitForTimeout(400);
    assert.equal(await p.evaluate(() => fluidLab.state.steps), step);
    assert.ok(
      frozen === (await p.locator("#fluid").evaluate((c) => c.toDataURL())),
      "Paused GPU pixels must remain identical",
    );
    await p.locator("#clear").click();
    assert.ok(
      frozen !== (await p.locator("#fluid").evaluate((c) => c.toDataURL())),
      "Clear must remove existing dye",
    );
    await p.selectOption("#quality", "96");
    assert.equal(await p.evaluate(() => fluidLab.state.h), 96);
    assert.equal(await p.evaluate(() => fluidLab.state.resources), 8);
    const dl = p.waitForEvent("download");
    await p.locator("#save").click();
    assert.equal((await dl).suggestedFilename(), "chroma-fluid.png");
  },
);
await test(
  "life-diary",
  "Eight screens, save/search/persist, local chat and tasks",
  async (p) => {
    await expect(p.locator("#screens>section")).toHaveCount(8);
    await p.fill("#diaryTitle", "验收记录");
    await p.fill("#diaryBody", "今天出去散步，看见了一棵树。");
    await p.locator("#saveDiary").click();
    await expect(p.locator("#entries")).toContainText("验收记录");
    await p.reload();
    await expect(p.locator("#entries")).toContainText("验收记录");
    await p.fill("#diarySearch", "不存在的词");
    await expect(p.locator("#entries")).toContainText("没有找到");
    await p.fill("#chatInput", "今天有点累");
    await p.locator("#chat button").click();
    await expect(p.locator("#messages")).toContainText("谢谢你");
    await p.fill("#newTask", "出门看云");
    await p.locator("#addTask button").click();
    await expect(p.locator("#tasks")).toContainText("出门看云");
  },
);
await test(
  "meditation",
  "Eight screens, course filtering, real timer, breathing, saved practice",
  async (p) => {
    await expect(p.locator("#screens>section")).toHaveCount(8);
    await p.locator("#search").fill("呼吸");
    await expect(p.locator("#courses button")).toHaveCount(1);
    await p.locator("#courses button").click();
    await expect(p.locator("#courseTitle")).toHaveText("回到呼吸");
    await p.locator("#startCourse").click();
    await p.waitForTimeout(1300);
    await expect(p.locator("#elapsed")).not.toHaveText("00:00");
    await p.locator("#play").click();
    const t = await p.locator("#elapsed").textContent();
    await p.waitForTimeout(300);
    await expect(p.locator("#elapsed")).toHaveText(t);
    await p.locator("#complete").click();
    await expect(p.locator("#sessionsDone")).toHaveText("1");
    await p.locator("#breathe").click();
    await p.waitForTimeout(250);
    await expect(p.locator("#breathPhase")).toHaveText("吸气");
    await p.locator("#breathe").click();
  },
);
await test(
  "bluebook",
  "20 items, filtering, likes, detail, pagination and publish",
  async (p) => {
    await expect(p.locator('[data-testid="note-card"]')).toHaveCount(20);
    await p.locator('[aria-label^="点赞："]').first().click();
    await expect(
      p.locator('[aria-pressed="true"][aria-label^="取消点赞："]'),
    ).toHaveCount(1);
    await p.getByPlaceholder("搜索你感兴趣的内容").fill("咖啡");
    await p.waitForTimeout(300);
    assert.ok((await p.locator('[data-testid="note-card"]').count()) > 0);
    await p.getByPlaceholder("搜索你感兴趣的内容").fill("none-no-results");
    await expect(p.getByText("还没有找到这份灵感")).toBeVisible();
    await p.getByRole("button", { name: "回到发现 →", exact: true }).click();
    await p.locator('[aria-label^="查看笔记"]').first().click();
    await expect(p.locator("dialog")).toBeVisible();
    await p.locator('[aria-label="关闭"]').click();
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(1000);
    assert.ok((await p.locator('[data-testid="note-card"]').count()) > 20);
    await p.getByRole("button", { name: "发布", exact: true }).click();
    const sample = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="130"><rect width="100" height="130" fill="tomato"/></svg>',
    );
    await p.locator("dialog input[type=file]").setInputFiles({
      name: "local.svg",
      mimeType: "image/svg+xml",
      buffer: sample,
    });
    await p.locator('[aria-label="笔记标题"]').fill("本机发布验收");
    await p.getByRole("button", { name: "发布笔记", exact: true }).click();
    await expect(p.locator('[data-testid="note-card"]').first()).toContainText(
      "本机发布验收",
    );
  },
);
await test(
  "neo-gothic-tower-city",
  "Rendering, roaming, collision limits and daylight",
  async (p) => {
    await p.waitForFunction(() => window.cityLab);
    await p.locator("#walk").click();
    let s = await p.evaluate(() => cityLab.state);
    assert.equal(s.mode, "walk");
    await p.locator("canvas").click({ position: { x: 700, y: 350 } });
    await p.keyboard.down("w");
    await p.waitForTimeout(1000);
    await p.keyboard.up("w");
    const moved = await p.evaluate(() => cityLab.state);
    assert.ok(moved.position[2] < s.position[2]);
    assert.equal(await p.evaluate(() => cityLab.collides(0, 0)), true);
    assert.equal(await p.evaluate(() => cityLab.collides(105, 0)), true);
    assert.equal(await p.evaluate(() => cityLab.collides(0, 70)), false);
    await p.locator("#reset").click();
    near((await p.evaluate(() => cityLab.state)).position[2], 70);
    await p.locator("#orbit").click();
    await p.locator("#daylight").fill("0.8");
    await p.locator("#daylight").dispatchEvent("input");
    await expect(p.locator("#time")).toHaveText("日光");
  },
);
await test(
  "voxel-construction-site",
  "Both scenes, rain, pause, controls and GPU batching",
  async (p) => {
    await p.waitForFunction(() => window.constructionLab);
    await p.locator("#rain").click();
    assert.equal((await p.evaluate(() => constructionLab.state)).rain, true);
    await p.locator("#pause").click();
    assert.equal((await p.evaluate(() => constructionLab.state)).paused, true);
    await p.selectOption("#scene", "bridge");
    await expect(p.locator("#status")).toContainText("跨河");
    await p.waitForTimeout(300);
    const s = await p.evaluate(() => constructionLab.state);
    assert.ok(s.dynamic > 15);
    assert.ok(
      s.drawCalls < 180,
      "Expected instanced batching, got " + s.drawCalls,
    );
    await p.selectOption("#scene", "tower");
    await p.locator("#cycle").click();
    assert.equal(
      (await p.evaluate(() => constructionLab.state)).cycling,
      false,
    );
  },
);
await test(
  "pixel-flow",
  "Particle restoration, image resampling, real model lifecycle with fake camera",
  async (p) => {
    await p.waitForFunction(
      () => window.pixelFlow?.state.count > 0,
      {},
      { timeout: 60000 },
    );
    let s = await p.evaluate(() => pixelFlow.state);
    assert.ok(s.count > 1000);
    await p.locator("#restore").click();
    await p.waitForFunction(
      () => parseInt(document.getElementById("percentage").textContent) > 95,
      {},
      { timeout: 20000 },
    );
    await p.locator("#scatter").click();
    await p.waitForFunction(
      () => parseInt(document.getElementById("percentage").textContent) < 10,
    );
    await p.locator("#sample").fill("6");
    await p.locator("#sample").dispatchEvent("input");
    assert.ok((await p.evaluate(() => pixelFlow.state)).count < s.count);
    await p.locator("#camera").click();
    await p.waitForFunction(
      () =>
        window.pixelFlow.state.cameraActive ||
        (!document.getElementById("camera").disabled &&
          document.getElementById("status").textContent.includes("未启动")),
      {},
      { timeout: 90000 },
    );
    s = await p.evaluate(() => pixelFlow.state);
    assert.ok(s.cameraActive, await p.locator("#status").textContent());
    assert.ok(s.modelReady);
    await p.waitForTimeout(500);
    await p.locator("#camera").click();
    s = await p.evaluate(() => pixelFlow.state);
    assert.equal(s.cameraActive, false);
    assert.equal(s.modelReady, false);
  },
);
await test(
  "youtube-ui",
  "Five entry modules, independent search, comments, subscriptions and drafts",
  async (p) => {
    await expect(p.locator("[data-screen]")).toHaveCount(2);
    await p.locator('[data-screen="home"] [data-search] input').fill("森林");
    await p
      .locator('[data-screen="home"] [data-search]')
      .evaluate((f) => f.requestSubmit());
    await expect(
      p.locator('[data-screen="home"] [data-card]:visible'),
    ).toHaveCount(1);
    await expect(
      p.locator('[data-screen="search"] [data-card]:visible'),
    ).toHaveCount(2);
    await p.goto(
      base + entry("youtube-ui").replace("index.html", "watch.html"),
    );
    await p.locator('[data-action="subscribe"]').click();
    await expect(p.locator('[data-action="subscribe"]')).toHaveText("已订阅");
    await p.locator("[data-comment-form] input").fill("这是验收评论");
    await p.locator("[data-comment-form] button").click();
    await expect(p.locator("[data-comments]")).toContainText("这是验收评论");
    await p.goto(
      base + entry("youtube-ui").replace("index.html", "studio.html"),
    );
    await expect(p.locator("[data-screen]")).toHaveCount(3);
    await p.locator("[data-upload] input[type=file]").setInputFiles({
      name: "demo.mp4",
      mimeType: "video/mp4",
      buffer: Buffer.from("test metadata"),
    });
    await p.locator("[data-upload] input[name=title]").fill("我的测试草稿");
    await p.locator("[data-upload]").evaluate((f) => f.requestSubmit());
    await expect(p.locator("[data-draft]")).toContainText("已保存");
    await p.reload();
    await expect(p.locator("[data-upload] input[name=title]")).toHaveValue(
      "我的测试草稿",
    );
  },
);
for (const topic of [
  "circuit-lab",
  "pathfinding-lab",
  "fantasy-map-generator",
  "fluid-simulation",
  "neo-gothic-tower-city",
])
  await test(
    topic,
    "Offline file:// and 390px no overflow",
    async (p, context) => {
      await context.setOffline(true);
      await p.goto(pathToFileURL(path.resolve(entry(topic))).href, {
        waitUntil: "load",
        timeout: 30000,
      });
      await p.setViewportSize({ width: 390, height: 844 });
      await p.waitForTimeout(250);
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      const e = p.locator("#error");
      if (await e.count()) await expect(e).toBeHidden();
      await p.screenshot({
        path: output + "/screenshots/" + topic + "-offline-mobile.png",
      });
    },
  );

async function ready(page, topic) {
  if (topic === "bluebook")
    await expect(
      page.locator('[data-testid="note-card"]').first(),
    ).toBeVisible();
  else if (topic === "life-diary" || topic === "meditation")
    await expect(page.locator("#screens>section")).toHaveCount(8);
  else if (topic === "youtube-ui")
    await expect(page.locator("[data-screen]").first()).toBeVisible();
  else if (topic === "pixel-flow")
    await page.waitForFunction(
      () => window.pixelFlow?.state.count > 0,
      {},
      { timeout: 60000 },
    );
  else if (topic === "voxel-construction-site")
    await page.waitForFunction(() => window.constructionLab);
  else if (topic === "neo-gothic-tower-city")
    await page.waitForFunction(() => window.cityLab);
  else if (topic === "fluid-simulation")
    await page.waitForFunction(() => window.fluidLab?.state.ready);
  else if (topic === "circuit-lab")
    await page.waitForFunction(() => window.circuitLab);
  else if (topic === "fantasy-map-generator")
    await page.waitForFunction(() => window.atlasLab);
  else if (topic === "pathfinding-lab")
    await page.waitForFunction(() => window.routeLab);
}
for (const run of loadCatalog().runs.filter(
  (r) => r.runId === "gpt-6-astra-max-r01",
)) {
  for (const item of run.preview.pages) {
    await test(
      run.topicId,
      "HTTP " + item.id + " / desktop and 390px layout / linked input",
      async (p) => {
        const response = await p.goto(base + item.href, {
          waitUntil: "load",
          timeout: 60000,
        });
        assert.equal(response.status(), 200);
        await ready(p, run.topicId);
        if (run.topicId === "bluebook") {
          await p.waitForFunction(
            () =>
              [...document.querySelectorAll("article img")].every((img) => {
                const rect = img.getBoundingClientRect();
                return (
                  rect.top > innerHeight ||
                  rect.bottom < 0 ||
                  (img.complete && img.naturalWidth > 0)
                );
              }),
            {},
            { timeout: 20000 },
          );
        }
        await p.waitForTimeout(700);
        assert.equal(
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        const stem = output + "/screenshots/" + run.topicId + "-" + item.id;
        await p.screenshot({ path: stem + "-desktop.png" });
        await p.setViewportSize({ width: 390, height: 844 });
        await p.waitForTimeout(700);
        assert.equal(
          await p.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        await p.screenshot({ path: stem + "-mobile.png" });
        for (const href of [
          run.directory + "/prompt.md",
          "topic.html?id=" + run.topicId,
        ]) {
          assert.equal((await p.request.get(base + href)).status(), 200, href);
        }
      },
    );
    if (run.preview.kind === "static" && run.preview.network !== "offline") {
      await test(
        run.topicId,
        "Online file:// " + item.id + " / usable page",
        async (p) => {
          await p.goto(pathToFileURL(path.resolve(item.href)).href, {
            waitUntil: "load",
            timeout: 60000,
          });
          await ready(p, run.topicId);
          await p.setViewportSize({ width: 390, height: 844 });
          assert.equal(
            await p.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
            false,
          );
        },
      );
    }
  }
}
await test(
  "fluid-simulation",
  "WebGL unavailable gives an explicit fallback",
  async (p, context) => {
    await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return type.startsWith("webgl")
          ? null
          : original.call(this, type, ...args);
      };
    });
    await p.reload();
    await expect(p.locator("#error")).toBeVisible();
    await expect(p.locator("#error")).toContainText("WebGL 2");
    await expect(p.locator("#pause")).toBeDisabled();
  },
);
await test(
  "life-diary",
  "Original named entry remains byte-identical and reachable",
  async (p) => {
    const standard = fs.readFileSync(entry("life-diary"));
    const original = entry("life-diary").replace(
      "index.html",
      "canghe_app_prototype.html",
    );
    assert.ok(standard.equals(fs.readFileSync(original)));
    assert.equal((await p.goto(base + original)).status(), 200);
    await ready(p, "life-diary");
  },
);
await test(
  "bluebook",
  "Mobile pull refresh, responsive columns, failed image fallback",
  async (p, context) => {
    const columns = p.locator(".feed-enter");
    assert.equal(
      await columns.evaluate((el) => getComputedStyle(el).columnCount),
      "4",
    );
    await p.setViewportSize({ width: 800, height: 900 });
    assert.equal(
      await columns.evaluate((el) => getComputedStyle(el).columnCount),
      "3",
    );
    await p.setViewportSize({ width: 390, height: 844 });
    assert.equal(
      await columns.evaluate((el) => getComputedStyle(el).columnCount),
      "2",
    );
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForFunction(
      () => document.querySelectorAll('[data-testid="note-card"]').length > 20,
    );
    await p.evaluate(() => window.scrollTo(0, 0));
    const session = await context.newCDPSession(p);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 180, y: 180 }],
    });
    for (let y = 200; y <= 380; y += 20) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 180, y }],
      });
      await p.waitForTimeout(20);
    }
    await expect(p.getByText("松开刷新", { exact: false })).toBeVisible();
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(p.locator('[role="status"]')).toContainText("正在寻找");
    await expect(p.locator('[data-testid="note-card"]')).toHaveCount(20);
    await p.route("https://images.unsplash.com/**", (route) => route.abort());
    await p.reload();
    await expect(p.locator("article button img").first()).toHaveAttribute(
      "src",
      /^data:image\/svg\+xml/,
    );
    assert.equal(
      await p
        .locator("article button img")
        .first()
        .evaluate((img) => img.naturalWidth > 0),
      true,
    );
  },
);
await test(
  "fantasy-map-generator",
  "390px touch brush edits terrain",
  async (p) => {
    await p.setViewportSize({ width: 390, height: 844 });
    await p.locator('[data-mode="lower"]').tap();
    const before = await p.evaluate(() => atlasLab.state.heights);
    await p.locator("#map").tap();
    await p.waitForFunction(() => atlasLab.state.revision > 0);
    assert.notDeepEqual(
      (await p.evaluate(() => atlasLab.state)).heights,
      before,
    );
  },
);
await test(
  "pixel-flow",
  "Local image upload replaces particle data",
  async (p) => {
    await ready(p, "pixel-flow");
    const before = await p.evaluate(() => pixelFlow.state.count);
    await p.locator('input[type="file"]').setInputFiles({
      name: "sample.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="48"><rect width="64" height="48" fill="#ff7744"/></svg>',
      ),
    });
    await p.waitForFunction(
      (old) => pixelFlow.state.count > 0 && pixelFlow.state.count < old,
      before,
    );
  },
);
await browser.close();
server.kill();
console.log(
  "PASS " + results.filter((r) => r.ok).length + " / " + results.length,
);
process.exitCode = results.some((r) => !r.ok) ? 1 : 0;
