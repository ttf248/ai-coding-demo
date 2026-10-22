import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { chromium } from "playwright";
import sharp from "sharp";
import { loadCatalog, ROOT } from "./lib.mjs";

const args = process.argv.slice(2);
const value = (flag, fallback) =>
  args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback;
const batch = value("--batch", "");
if (!/^\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+)?$/.test(batch))
  throw Error(
    "Specify a new dated capture batch with --batch YYYY-MM-DD-label",
  );
const baseURL = value("--base-url", "http://127.0.0.1:4173/");
const topicId = value("--topic", "");
const runId = value("--run", "");
const limit = Number(value("--limit", "0"));
const navigation = value("--navigation", "domcontentloaded");
if (!["commit", "domcontentloaded"].includes(navigation))
  throw Error("Invalid navigation wait");
const boundedFontWait = args.includes("--bounded-font-wait");
if (boundedFontWait) process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";
const catalog = loadCatalog();
const directory = path.join(ROOT, "catalog/screenshot-captures", batch);
fs.mkdirSync(directory, { recursive: true });
const hash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const relative = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
const fixture = path.join(ROOT, "scripts/fixtures/pixel-flow-review.png");
if (!fs.existsSync(fixture))
  throw Error("Missing committed image-upload fixture");
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const browserVersion = browser.version();
let runs = catalog.runs.filter(
  (run) =>
    (!topicId || run.topicId === topicId) && (!runId || run.id === runId),
);
if (limit) runs = runs.slice(0, limit);

async function clickNamed(page, pattern, log) {
  const buttons = page.getByRole("button", { name: pattern });
  for (let i = 0; i < (await buttons.count()); i++) {
    const button = buttons.nth(i);
    if ((await button.isVisible()) && (await button.isEnabled())) {
      const label = (await button.innerText()).trim();
      await button.click({ timeout: 2500 });
      log.push({ action: "click", label });
      return true;
    }
  }
  return false;
}

async function ready(page) {
  await page.waitForTimeout(1600);
  await page.evaluate(async () => {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 1800)),
    ]);
    await Promise.race([
      Promise.all(
        [...document.images].map((img) =>
          img.complete
            ? null
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              }),
        ),
      ),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  });
}

async function interact(page, run, log) {
  if (run.topicId === "circuit-lab") {
    return clickNamed(page, /串联|series/i, log);
  }
  if (run.topicId === "pathfinding-lab") {
    const selects = page.locator("select");
    for (let i = 0; i < (await selects.count()); i++) {
      const select = selects.nth(i);
      const option = (
        await select
          .locator("option")
          .evaluateAll((es) =>
            es.map((e) => ({ value: e.value, label: e.textContent })),
          )
      ).find((o) => /加权|weighted|迷宫|maze/i.test(o.label));
      if (option && (await select.isVisible())) {
        await select.selectOption(option.value);
        log.push({
          action: "select",
          label: option.label,
          value: option.value,
        });
        break;
      }
    }
    await clickNamed(page, /^(加权|迷宫|障碍预设|Maze|Weighted)/i, log);
    const sliders = page.locator('input[type="range"]');
    for (let i = 0; i < (await sliders.count()); i++) {
      const slider = sliders.nth(i);
      const identity = await slider.evaluate(
        (el) =>
          `${el.id} ${el.name} ${el.getAttribute("aria-label")} ${el.closest("label")?.textContent}`,
      );
      if (/speed|速度|步频/i.test(identity) && (await slider.isVisible())) {
        await slider.focus();
        await slider.press("End");
        log.push({ action: "keyboard", target: identity, key: "End" });
      }
    }
    return clickNamed(
      page,
      /^(?:[▶▷►]\s*)?(?:运行|开始|开始搜索|开始寻路|Run|Start)(?:\s|$|搜索|寻路)/i,
      log,
    );
  }
  if (run.topicId === "fluid-simulation") {
    const boxes = await page.locator("canvas").evaluateAll((es) =>
      es.map((e, i) => ({
        index: i,
        rect: e.getBoundingClientRect().toJSON(),
      })),
    );
    const largest = boxes
      .filter((x) => x.rect.width > 180 && x.rect.height > 180)
      .sort(
        (a, b) => b.rect.width * b.rect.height - a.rect.width * a.rect.height,
      )[0];
    if (!largest) return false;
    const r = largest.rect;
    for (let stroke = 0; stroke < 3; stroke++) {
      await page.mouse.move(
        r.x + r.width * 0.3,
        r.y + r.height * (0.35 + stroke * 0.12),
      );
      await page.mouse.down();
      for (let step = 0; step < 14; step++) {
        await page.mouse.move(
          r.x + r.width * (0.3 + step * 0.03),
          r.y + r.height * (0.48 + Math.sin(step * 0.6 + stroke) * 0.18),
          { steps: 2 },
        );
      }
      await page.mouse.up();
    }
    log.push({
      action: "pointer-strokes",
      canvasIndex: largest.index,
      strokes: 3,
      steps: 14,
      description: "通过真实鼠标在画布中心注入染料，不修改模拟状态",
    });
    return true;
  }
  if (run.topicId === "pixel-flow") {
    const input = page.locator('input[type="file"]');
    if (await input.count()) {
      await input.first().setInputFiles(fixture);
      log.push({
        action: "upload",
        file: relative(fixture),
        sha256: hash(fixture),
      });
      await page.waitForTimeout(1400);
      await clickNamed(
        page,
        /^(?:[\W_]*)(?:还原|重构|恢复图片|Restore|Reconstruct)/i,
        log,
      );
      return true;
    }
  }
  if (run.topicId === "fantasy-map-generator") {
    const seeds = page.locator(
      'input[id*="seed" i],input[name*="seed" i],input[aria-label*="种子"]',
    );
    if ((await seeds.count()) && (await seeds.first().isVisible())) {
      await seeds.first().fill("20261021");
      await seeds.first().press("Tab");
      log.push({ action: "fill", target: "seed", value: "20261021" });
      await clickNamed(
        page,
        /^(?:[\W_]*)(?:生成|重新生成|Generate|Regenerate)/i,
        log,
      );
      return true;
    }
  }
  return false;
}

async function captureRun(run) {
  const recordFile = path.join(directory, run.id + ".json");
  if (fs.existsSync(recordFile)) {
    console.log("RESUME " + run.id);
    return;
  }
  const record = {
    batch,
    runId: run.id,
    topicId: run.topicId,
    promptId: run.promptId,
    inputHash: run.rawHash,
    capturedAt: new Date().toISOString(),
    environment: {
      browser: browserVersion,
      headless: true,
      deviceScaleFactor: 1,
      renderer: "Chromium / software WebGL allowed",
      camera: "未提供真实相机或手部，不模拟视频/关键点",
      analytics: "blocked",
      network: "真实网络资源，不替换 CDN、图片或应用脚本",
      navigationWait: navigation,
      fontWait: boundedFontWait
        ? "bounded 1800ms; screenshot does not await unresolved fonts"
        : "Playwright screenshot default",
    },
    previousScreenshot: run.screenshot
      ? {
          file: run.directory + "/" + run.screenshot,
          sha256: run.screenshotInfo.hash,
        }
      : null,
    frames: [],
    actions: [],
    errors: [],
    failedRequests: [],
    pages: [],
  };
  if (run.preview.kind === "none" || !run.preview.pages.length) {
    record.status = "unavailable";
    record.reason =
      "没有登记可运行的页面入口；不启动独立服务、不制造静态预览或占位截图。";
    fs.writeFileSync(recordFile, JSON.stringify(record, null, 2) + "\n");
    console.log("UNAVAILABLE " + run.id);
    return;
  }
  const output = path.join(ROOT, run.directory, "captures", batch);
  if (fs.existsSync(output) && fs.readdirSync(output).length)
    throw Error(
      "Unfinished capture directory requires inspection: " + relative(output),
    );
  fs.mkdirSync(output, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: "zh-CN",
    timezoneId: "Asia/Shanghai",
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  await context.route(/google-analytics|googletagmanager/, (route) =>
    route.abort(),
  );
  const page = await context.newPage();
  page.on("pageerror", (error) => record.errors.push(error.message));
  page.on("requestfailed", (request) => {
    if (!/google-analytics|googletagmanager/.test(request.url()))
      record.failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText,
      });
  });
  page.on("dialog", (dialog) => {
    record.actions.push({
      action: "dismiss-dialog",
      type: dialog.type(),
      message: dialog.message(),
    });
    dialog.dismiss().catch(() => {});
  });
  async function save(id, pageId, fullPage = false) {
    const file = path.join(output, id + ".png");
    await page.screenshot({ path: file, fullPage, timeout: 20000 });
    const meta = await sharp(file).metadata();
    record.frames.push({
      id,
      pageId,
      file: relative(file),
      sha256: hash(file),
      width: meta.width,
      height: meta.height,
      viewport: page.viewportSize(),
      fullPage,
      observation: await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        scrollX,
        scrollY,
        imageCount: document.images.length,
        brokenImages: [...document.images].filter(
          (i) => i.complete && !i.naturalWidth,
        ).length,
        canvasCount: document.querySelectorAll("canvas").length,
      })),
    });
  }
  try {
    const entry =
      run.preview.pages.find((p) => p.id === run.preview.defaultPage) ||
      run.preview.pages[0];
    const response = await page.goto(new URL(entry.href, baseURL).href, {
      waitUntil: navigation,
      timeout: 25000,
    });
    record.pages.push({
      id: entry.id,
      path: entry.href,
      status: response?.status(),
    });
    await ready(page);
    await save("desktop-initial", entry.id);
    try {
      if (await interact(page, run, record.actions)) {
        await page.waitForTimeout(
          run.topicId === "pathfinding-lab" ? 5500 : 2200,
        );
        await save("desktop-result", entry.id);
      }
    } catch (error) {
      record.actions.push({
        action: "interaction-error",
        message: error.message,
      });
    }
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    if (height > 1000 && height <= 6000)
      await save("desktop-full", entry.id, true);
    if (height > 6000) {
      await page.evaluate(() =>
        scrollTo(0, document.documentElement.scrollHeight - innerHeight),
      );
      await save("desktop-bottom", entry.id);
      await page.evaluate(() => scrollTo(0, 0));
    }
    for (const [i, entry] of run.preview.pages
      .filter((p) => p.id !== run.preview.defaultPage)
      .entries()) {
      const response = await page.goto(new URL(entry.href, baseURL).href, {
        waitUntil: navigation,
        timeout: 25000,
      });
      await ready(page);
      record.pages.push({
        id: entry.id,
        path: entry.href,
        status: response?.status(),
      });
      await save(
        "page-" + String(i + 1).padStart(2, "0"),
        entry.id,
        await page.evaluate(
          () => document.documentElement.scrollHeight <= 6000,
        ),
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(new URL(entry.href, baseURL).href, {
      waitUntil: navigation,
      timeout: 25000,
    });
    await ready(page);
    await save("mobile-initial", entry.id);
    record.status = "captured";
  } catch (error) {
    record.status = "capture-error";
    record.reason = error.message;
    if (!record.frames.length) {
      try {
        await save("capture-error", run.preview.defaultPage);
      } catch {}
    }
  } finally {
    await context.close();
    fs.writeFileSync(recordFile, JSON.stringify(record, null, 2) + "\n");
    console.log(
      `${record.status.toUpperCase()} ${run.id} ${record.frames.length} frames ${record.errors.length} errors`,
    );
  }
}
try {
  // Each page is a real isolated browser context. Concurrent 3D performance is not scored.
  const queue = [...runs];
  await Promise.all(
    Array.from({ length: 2 }, async () => {
      while (queue.length) await captureRun(queue.shift());
    }),
  );
} finally {
  await browser.close();
}
