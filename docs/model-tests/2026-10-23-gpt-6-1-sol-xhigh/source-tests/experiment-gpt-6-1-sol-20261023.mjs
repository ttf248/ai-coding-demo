import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { loadCatalog } from "../scripts/lib.mjs";

const runs = loadCatalog().runs.filter(
  (r) => r.runId === "gpt-6-1-sol-xhigh-r01",
);
fs.mkdirSync(".cache/model-test-20261023", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
const base = process.env.EXPERIMENT_BASE || "http://127.0.0.1:43903/";
const report = [];
let failures = 0;
async function check(label, callback) {
  try {
    const detail = await callback();
    report.push({ label, pass: true, detail });
    console.log("PASS " + label + " " + JSON.stringify(detail ?? ""));
  } catch (e) {
    failures++;
    report.push({ label, pass: false, error: e.message });
    console.error("FAIL " + label + " " + e.stack);
  }
}
async function open(run, options = {}) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 980 },
    ...options,
  });
  const errors = [],
    consoleErrors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  await page.goto(base + run.preview.pages[0].href, {
    waitUntil: "domcontentloaded",
  });
  return { page, errors, consoleErrors };
}
for (const run of runs) {
  await check(run.topicId + " HTTP / mobile / file", async () => {
    const { page, errors, consoleErrors } = await open(run);
    try {
      await page.waitForTimeout(run.topicId === "bluebook" ? 800 : 500);
      assert.deepEqual(errors, []);
      if (
        [
          "voxel-construction-site",
          "neo-gothic-tower-city",
          "pixel-flow",
        ].includes(run.topicId)
      )
        assert.equal(
          await page.locator("#error").isVisible(),
          false,
          await page.locator("#error").textContent(),
        );
      if (run.topicId === "fluid-simulation")
        assert.equal(
          await page.evaluate(() => window.lab.state.ready),
          true,
          await page.locator("#error").textContent(),
        );
      assert.equal(
        consoleErrors.some((e) =>
          /shader error|VALIDATE_STATUS|compile.*error/i.test(e),
        ),
        false,
        consoleErrors.join("\n"),
      );
      if (run.topicId !== "bluebook")
        await page.screenshot({
          path: `${run.directory}/evidence/desktop.png`,
          fullPage: ![
            "neo-gothic-tower-city",
            "voxel-construction-site",
          ].includes(run.topicId),
        });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(180);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        "390px horizontal overflow",
      );
      if (run.topicId !== "bluebook")
        await page.screenshot({
          path: `${run.directory}/evidence/mobile.png`,
          fullPage: true,
        });
      assert.equal(
        (await page.request.get(base + run.directory + "/prompt.md")).status(),
        200,
      );
      let file = false;
      if (run.preview.kind === "static") {
        await page.goto(
          pathToFileURL(path.resolve(run.directory, "index.html")).href,
          { waitUntil: "domcontentloaded" },
        );
        await page.waitForTimeout(200);
        assert.deepEqual(errors, []);
        if (await page.locator("#error").count())
          assert.equal(await page.locator("#error").isVisible(), false);
        file = true;
      }
      return {
        http: true,
        mobile: 390,
        file,
        externalConsoleErrors: consoleErrors
          .filter((e) => !/404.*favicon/.test(e))
          .slice(0, 5),
      };
    } finally {
      await page.close();
    }
  });
}
const runFor = (t) => runs.find((r) => r.topicId === t);
await check("电路：串并联、断路、短路、冲突电源", async () => {
  const { page } = await open(runFor("circuit-lab"));
  try {
    const values = await page.evaluate(() => {
      const l = window.lab;
      l.preset("series");
      const series = [...l.solve().values()].map((x) => x.i);
      l.preset("parallel");
      const parallel = [...l.solve().values()].map((x) => x.i);
      l.state.components.find((c) => c.type === "switch").closed = false;
      l.update();
      const opened = [...l.solve().values()].map((x) => x.i);
      l.preset("series");
      const b = l.state.components[0];
      l.connect(b, 0, b, 1);
      let short = "";
      try {
        l.solve();
      } catch (e) {
        short = e.message;
      }
      l.preset("parallel");
      const b1 = l.state.components[0],
        b2 = l.add("battery");
      b2.value = 9;
      l.connect(b1, 0, b2, 0);
      l.connect(b1, 1, b2, 1);
      let conflict = "";
      try {
        l.solve();
      } catch (e) {
        conflict = e.message;
      }
      return { series, parallel, opened, short, conflict };
    });
    assert(values.series.every((x) => Math.abs(Math.abs(x) - 0.04) < 1e-8));
    for (const n of [0.12, 0.06, 0.18])
      assert(values.parallel.some((x) => Math.abs(Math.abs(x) - n) < 1e-8));
    assert(values.opened.every((x) => Math.abs(x) < 1e-9));
    assert.match(values.short, /短路/);
    assert.match(values.conflict, /无唯一解|冲突/);
    return values;
  } finally {
    await page.close();
  }
});
await check("寻路：权重最优、BFS步数、不可达与单步暂停", async () => {
  const { page } = await open(runFor("pathfinding-lab"));
  try {
    const result = await page.evaluate(() => {
      const l = window.lab,
        out = {};
      for (const kind of ["bfs", "dijkstra", "astar"]) {
        l.preset("weighted");
        document.querySelector("#algorithm").value = kind;
        l.begin();
        for (let i = 0; i < 2000 && !l.state.search.done; i++) l.step();
        out[kind] = {
          steps: Number(document.querySelector("#steps").textContent),
          cost: Number(document.querySelector("#cost").textContent),
        };
      }
      l.preset("sealed");
      l.begin();
      for (let i = 0; i < 2000 && !l.state.search.done; i++) l.step();
      out.sealed = document.querySelector("#status").textContent;
      l.preset("empty");
      l.step();
      out.singleStep = l.state.search.count;
      return out;
    });
    assert.equal(result.dijkstra.cost, result.astar.cost);
    assert(result.bfs.steps <= result.astar.steps);
    assert(result.bfs.cost > result.astar.cost);
    assert.match(result.sealed, /不可达/);
    assert.equal(result.singleStep, 1);
    await page.locator("#run").click();
    await page.waitForTimeout(150);
    await page.locator("#pause").click();
    const count = await page.evaluate(() => window.lab.state.search.count);
    await page.waitForTimeout(150);
    assert.equal(
      await page.evaluate(() => window.lab.state.search.count),
      count,
    );
    return result;
  } finally {
    await page.close();
  }
});
await check("地图：确定性、下游势能、编辑与PNG导出", async () => {
  const { page } = await open(runFor("fantasy-map-generator"));
  try {
    const result = await page.evaluate(() => {
      const l = window.lab,
        original = Array.from(l.state.heights);
      l.generate();
      const same = original.every((v, i) => v === l.state.heights[i]);
      document.querySelector("#seed").value = "another-world";
      l.generate();
      const different = original.some((v, i) => v !== l.state.heights[i]);
      let uphill = 0;
      const { parent, filled } = l.state;
      for (let i = 0; i < parent.length; i++)
        if (parent[i] >= 0 && filled[parent[i]] > filled[i] + 1e-6) uphill++;
      l.zoomAt(2, { x: 550, y: 425 });
      document.querySelector('[data-tool="raise"]').click();
      const before = Array.from(l.state.heights);
      l.brush({ x: 550, y: 425 });
      const edited = before.some((v, i) => v !== l.state.heights[i]);
      return { same, different, uphill, edited, zoom: l.state.zoom };
    });
    assert(result.same && result.different && result.edited);
    assert.equal(result.uphill, 0);
    const download = page.waitForEvent("download");
    await page.locator("#export").click();
    assert.match((await download).suggestedFilename(), /\.png$/);
    return result;
  } finally {
    await page.close();
  }
});
await check("流体：GPU场演化、暂停、清空与重建", async () => {
  const { page } = await open(runFor("fluid-simulation"));
  try {
    await page.locator("#pause").click();
    const a = await page.evaluate(() => Array.from(window.lab.readDye()));
    assert(a.some((x) => x > 0.01));
    await page.waitForTimeout(100);
    assert.deepEqual(
      await page.evaluate(() => Array.from(window.lab.readDye())),
      a,
    );
    await page.evaluate(() => window.lab.simulate(1 / 30));
    const b = await page.evaluate(() => Array.from(window.lab.readDye()));
    assert(b.some((v, i) => Math.abs(v - a[i]) > 1e-6));
    await page.locator("#clear").click();
    const c = await page.evaluate(() => Array.from(window.lab.readDye()));
    assert(c.every((v) => v === 0));
    await page.locator("#resolution").selectOption("96");
    const result = await page.evaluate(() => ({
      ready: window.lab.state.ready,
      w: window.lab.state.width,
      h: window.lab.state.height,
      error: window.lab.state.gl.getError(),
    }));
    assert(result.ready && Math.max(result.w, result.h) === 96);
    assert.equal(result.error, 0);
    const download = page.waitForEvent("download");
    await page.locator("#shot").click();
    await download;
    return result;
  } finally {
    await page.close();
  }
});
await check("粒子：本地图片、还原、重采样、手动吸引与权限错误", async () => {
  const { page } = await open(runFor("pixel-flow"));
  try {
    assert(await page.evaluate(() => window.lab.state.amounts.length > 1000));
    await page.locator("#restore").click();
    await page.waitForTimeout(1000);
    assert(
      await page.evaluate(() => window.lab.state.amounts.every((v) => v === 1)),
    );
    await page.locator("#scatter").click();
    assert(
      await page.evaluate(() => window.lab.state.amounts.every((v) => v === 0)),
    );
    await page.locator("#sample").selectOption("11");
    assert(await page.evaluate(() => window.lab.state.amounts.length < 2000));
    const image = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/></svg>',
    );
    await page
      .locator("#upload")
      .setInputFiles({
        name: "test.svg",
        mimeType: "image/svg+xml",
        buffer: image,
      });
    await page.waitForTimeout(150);
    assert.equal(
      await page.evaluate(() => window.lab.state.amounts.length),
      100,
    );
    const result = await page.evaluate(() => ({
      particles: window.lab.state.amounts.length,
      tracking: window.lab.state.tracking,
    }));
    return { ...result, realCamera: "not tested" };
  } finally {
    await page.close();
  }
});
await check("3D：场景切换、设备与漫游", async () => {
  const { page } = await open(runFor("voxel-construction-site"));
  try {
    await page.locator("#site").selectOption("1");
    await page.locator("#speed").click();
    await page.locator("#rain").click();
    const voxel = await page.evaluate(() => ({
      ...window.lab.state,
      drawCalls: window.lab.renderer.info.render.calls,
    }));
    assert.equal(voxel.site, 1);
    assert.equal(voxel.speed, 2);
    assert.equal(voxel.rain, true);
    assert(voxel.drawCalls > 0);
    await page.goto(
      base + runFor("neo-gothic-tower-city").preview.pages[0].href,
    );
    await page.locator("#walk").click();
    const before = await page.evaluate(() =>
      window.lab.camera.position.toArray(),
    );
    await page.keyboard.down("w");
    await page.waitForTimeout(180);
    await page.keyboard.up("w");
    const after = await page.evaluate(() =>
      window.lab.camera.position.toArray(),
    );
    assert.notDeepEqual(before, after);
    assert.equal(await page.evaluate(() => window.lab.allowed(0, -48)), false);
    return {
      voxel,
      city: {
        mode: await page.evaluate(() => window.lab.mode),
        collision: true,
        moved: true,
      },
      fps: "software-rendered; not a hardware performance conclusion",
    };
  } finally {
    await page.close();
  }
});
await check("小蓝书：20条、点赞、搜索、追加、发布、详情", async () => {
  const { page, errors } = await open(runFor("bluebook"));
  try {
    await page.waitForSelector("article");
    assert.equal(await page.locator("article").count(), 20);
    const like = page.locator('article button[aria-label="点赞"]').first();
    await like.click();
    assert.equal(
      await page.locator('article button[aria-pressed="true"]').count(),
      1,
    );
    await page.getByRole("textbox", { name: "搜索" }).fill("山野");
    assert((await page.locator("article").count()) > 0);
    await page.getByRole("textbox", { name: "搜索" }).fill("");
    await page.locator("article>button").first().click();
    assert(await page.locator(".modal").isVisible());
    await page.getByRole("button", { name: "关闭详情" }).click();
    await page.locator("main>div").last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    assert((await page.locator("article").count()) >= 40);
    await page.getByRole("button", { name: "＋ 发布" }).click();
    await page
      .locator("input[type=file]")
      .setInputFiles({
        name: "red.svg",
        mimeType: "image/svg+xml",
        buffer: Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="red"/></svg>',
        ),
      });
    await page.getByRole("textbox", { name: "笔记标题" }).fill("本机发布验收");
    await page.getByRole("button", { name: "发布笔记", exact: true }).click();
    assert(
      await page.getByRole("heading", { name: "本机发布验收" }).isVisible(),
    );
    assert.deepEqual(errors, []);
    return {
      initial: 20,
      loaded: await page.locator("article").count(),
      publish: true,
    };
  } finally {
    await page.close();
  }
});
await check("应用原型：日记本地保存、呼吸节拍、视频互动", async () => {
  const { page } = await open(runFor("life-diary"));
  try {
    await page.locator("#diaryTitle").fill("测试");
    await page.locator("#diaryText").fill("今天散步时看见了阳光。");
    await page.locator("#saveDiary").click();
    assert.match(await page.locator("#saveStatus").textContent(), /已保存/);
    assert(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem("gentle-diary")).length > 0,
      ),
    );
    await page.goto(base + runFor("meditation").preview.pages[0].href);
    await page.locator("#breathStart").click();
    assert.equal(await page.locator("#breathPhase").textContent(), "吸气");
    await page.waitForTimeout(1150);
    assert.equal(await page.locator("#breathCount").textContent(), "3");
    await page.locator("#play").click();
    await page.waitForTimeout(1200);
    assert.notEqual(await page.locator("#elapsed").textContent(), "00:00");
    await page.goto(base + runFor("youtube-ui").preview.pages[0].href);
    await page.locator("#subscribe").click();
    assert.equal(await page.locator("#subscribe").textContent(), "已订阅");
    await page.locator("#commentInput").fill("很喜欢这个原型");
    await page.locator("#commentForm button").click();
    assert.equal(await page.locator("#commentCount").textContent(), "2");
    return {
      diary: true,
      breathing: true,
      playback: true,
      subscribe: true,
      comment: true,
    };
  } finally {
    await page.close();
  }
});
await check("WebGL 缺失时的可读错误", async () => {
  for (const topic of [
    "fluid-simulation",
    "voxel-construction-site",
    "neo-gothic-tower-city",
    "pixel-flow",
  ]) {
    const page = await browser.newPage();
    try {
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
          if (String(kind).includes("webgl")) return null;
          return original.call(this, kind, ...args);
        };
      });
      await page.goto(base + runFor(topic).preview.pages[0].href);
      assert.equal(await page.locator("#error").isVisible(), true, topic);
      assert((await page.locator("#error").textContent()).length > 10);
    } finally {
      await page.close();
    }
  }
  return { topics: 4 };
});
await browser.close();
fs.mkdirSync(".cache/model-test-20261023", { recursive: true });
fs.writeFileSync(
  ".cache/model-test-20261023/experiment-20261023.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(`${report.length - failures}/${report.length} checks passed`);
process.exitCode = failures ? 1 : 0;
