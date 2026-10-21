import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { chromium } from "playwright";
import { ROOT, loadCatalog } from "./lib.mjs";

// Explicit reviewer-selected navigation only; original artifacts and captures stay intact.
const plan = JSON.parse(fs.readFileSync(0, "utf8").replace(/^\uFEFF/, ""));
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";
const run = loadCatalog().runs.find((r) => r.id === plan.runId);
if (!run || !Array.isArray(plan.states) || !plan.states.length)
  throw Error("Missing state plan");
const batch = plan.batch || "2026-10-21-states";
if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9]+$/.test(batch)) throw Error("Invalid batch");
const sourceFile = path.resolve(ROOT, plan.source);
if (
  !sourceFile.startsWith(
    path.join(ROOT, "catalog/screenshot-captures") + path.sep,
  )
)
  throw Error("Invalid source");
const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
if (source.runId !== run.id) throw Error("Source identity mismatch");
const hash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const relative = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
const output = path.join(ROOT, run.directory, "captures", batch);
const target = path.join(
  ROOT,
  "catalog/screenshot-captures",
  batch,
  run.id + ".json",
);
if (
  fs.existsSync(target) ||
  (fs.existsSync(output) && fs.readdirSync(output).length)
)
  throw Error("Capture already exists");
fs.mkdirSync(output, { recursive: true });
const record = {
  ...source,
  batch,
  capturedAt: new Date().toISOString(),
  sourceCapturedAt: source.capturedAt,
  environment: {
    ...source.environment,
    screenshotFontWait: "bounded-1800ms-before-capture",
  },
  previousCapture: { file: relative(sourceFile), sha256: hash(sourceFile) },
  actions: [...source.actions],
  frames: [...source.frames],
  errors: [...source.errors],
  failedRequests: [...source.failedRequests],
};
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
try {
  for (const state of plan.states) {
    if (
      !/^[a-z0-9-]+$/.test(state.id) ||
      record.frames.some((f) => f.id === state.id)
    )
      throw Error("Invalid state id");
    const viewport = state.mobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 900 };
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      locale: "zh-CN",
      timezoneId: "Asia/Shanghai",
      reducedMotion: "reduce",
    });
    await context.route(/google-analytics|googletagmanager/, (route) =>
      route.abort(),
    );
    const page = await context.newPage();
    page.on("pageerror", (error) => record.errors.push(error.message));
    page.on("requestfailed", (r) => {
      if (!/google-analytics|googletagmanager/.test(r.url()))
        record.failedRequests.push({
          url: r.url(),
          error: r.failure()?.errorText,
        });
    });
    try {
      const entry =
        run.preview.pages.find(
          (p) => p.id === (state.pageId || run.preview.defaultPage),
        ) || run.preview.pages[0];
      await page.goto(
        new URL(entry.href, plan.baseUrl || "http://127.0.0.1:43931/").href,
        { waitUntil: "commit", timeout: 25000 },
      );
      try {
        await page.waitForLoadState("domcontentloaded", { timeout: 20000 });
      } catch {
        record.actions.push({
          kind: "document-ready-timeout",
          state: state.id,
          timeoutMs: 20000,
        });
      }
      await page.waitForTimeout(2300);
      await Promise.race([
        page.evaluate(() => document.fonts.ready),
        page.waitForTimeout(1800),
      ]);
      for (const action of state.actions || []) {
        const locator = page.locator(action.selector).first();
        if (action.kind === "click") await locator.click({ timeout: 5000 });
        else if (action.kind === "pointer-click") {
          await locator.scrollIntoViewIfNeeded({ timeout: 10000 });
          await page.waitForTimeout(500);
          const box = await locator.boundingBox();
          if (!box) throw Error("Pointer target is absent");
          await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
          record.actions.push({
            kind: "observed-pointer-click",
            state: state.id,
            selector: action.selector,
            box,
          });
        } else if (action.kind === "scroll") {
          const observed = await locator.evaluate((e, a) => {
            e.scrollTo({
              left: a.left || 0,
              top: a.top || 0,
              behavior: "instant",
            });
            return {
              left: e.scrollLeft,
              top: e.scrollTop,
              maxLeft: e.scrollWidth - e.clientWidth,
              maxTop: e.scrollHeight - e.clientHeight,
            };
          }, action);
          record.actions.push({
            kind: "observed-scroll",
            state: state.id,
            selector: action.selector,
            requested: action,
            observed,
          });
        } else throw Error("Unsupported action");
        await page.waitForTimeout(700);
      }
      record.actions.push({
        kind: "review-state-navigation",
        state: state.id,
        viewport,
        actions: state.actions || [],
        result: "completed",
      });
      const file = path.join(output, state.id + ".png");
      const height = await page.evaluate(
        () => document.documentElement.scrollHeight,
      );
      const fullPage = Boolean(
        state.fullPage &&
        height <= 6000 &&
        plan.captureMethod !== "cdp-viewport",
      );
      if (plan.captureMethod === "cdp-viewport") {
        const session = await context.newCDPSession(page);
        const shot = await session.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: false,
        });
        fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
        await session.detach();
      } else await page.screenshot({ path: file, fullPage, timeout: 60000 });
      const metadata = await sharp(file).metadata();
      record.frames.push({
        id: state.id,
        pageId: entry.id,
        file: relative(file),
        sha256: hash(file),
        width: metadata.width,
        height: metadata.height,
        viewport,
        fullPage,
        captureMethod: plan.captureMethod || "playwright",
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
      console.log("CAPTURED " + state.id);
    } finally {
      await context.close();
    }
  }
  record.status = "captured";
  delete record.supplementError;
} catch (error) {
  record.supplementError = error.message;
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(record, null, 2) + "\n");
  console.log(relative(target));
}
