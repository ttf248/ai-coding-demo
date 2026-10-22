import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { chromium } from "playwright";
import { loadCatalog, ROOT } from "./lib.mjs";
import { scrollExistingDocument, restoreScrollTop } from "./capture-scroll.mjs";

const args = process.argv.slice(2),
  option = (key, fallback) =>
    args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const sourceBatch = option("--source", ""),
  batch = option("--batch", "");
const topic = option("--topic", "");
const runId = option("--run", "");
if (
  !/^\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+)?$/.test(batch) ||
  !/^\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+)?$/.test(sourceBatch) ||
  batch === sourceBatch
)
  throw Error("Supplement must use a distinct dated batch");
const catalog = loadCatalog(),
  directory = path.join(ROOT, "catalog/screenshot-captures", batch);
fs.mkdirSync(directory, { recursive: true });
const hash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const relative = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
const queue = catalog.runs.filter((run) => {
  const file = path.join(
    ROOT,
    "catalog/screenshot-captures",
    sourceBatch,
    run.id + ".json",
  );
  if (
    (topic && run.topicId !== topic) ||
    (runId && run.id !== runId) ||
    !fs.existsSync(file) ||
    fs.existsSync(path.join(directory, run.id + ".json"))
  )
    return false;
  const source = JSON.parse(fs.readFileSync(file, "utf8"));
  return (
    (run.topicId === "bluebook" && source.frames.length > 0) ||
    source.frames.some(
      (frame) => frame.fullPage || frame.id === "desktop-bottom",
    )
  );
});

async function capture(run) {
  const sourceFile = path.join(
      ROOT,
      "catalog/screenshot-captures",
      sourceBatch,
      run.id + ".json",
    ),
    source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const output = path.join(ROOT, run.directory, "captures", batch);
  if (fs.existsSync(output) && fs.readdirSync(output).length)
    throw Error("Inspect incomplete supplement first: " + output);
  fs.mkdirSync(output, { recursive: true });
  const record = {
    ...source,
    batch,
    capturedAt: new Date().toISOString(),
    sourceCapturedAt: source.capturedAt,
    previousCapture: { file: relative(sourceFile), sha256: hash(sourceFile) },
    actions: [...source.actions],
    frames: [...source.frames],
    errors: [...source.errors],
    failedRequests: [...source.failedRequests],
  };
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
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
  async function save(id, pageId, fullPage) {
    const file = path.join(output, id + ".png");
    await page.screenshot({ path: file, fullPage, timeout: 20000 });
    const metadata = await sharp(file).metadata();
    record.frames.push({
      id,
      pageId,
      file: relative(file),
      sha256: hash(file),
      width: metadata.width,
      height: metadata.height,
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
    await page.goto(
      new URL(entry.href, option("--base-url", "http://127.0.0.1:4173/")).href,
      {
        waitUntil: "domcontentloaded",
        timeout: 25000,
      },
    );
    await page.waitForTimeout(1800);
    record.actions.push(await scrollExistingDocument(page));
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    if (height <= 6000) await save("desktop-scrolled-full", entry.id, true);
    else await save("desktop-scrolled-lower", entry.id, false);
    await restoreScrollTop(page);
    await page.waitForTimeout(500);
    await save("desktop-scrolled-top", entry.id, false);
    record.status = "captured";
  } catch (error) {
    record.supplementError = error.message;
  } finally {
    await context.close();
    fs.writeFileSync(
      path.join(directory, run.id + ".json"),
      JSON.stringify(record, null, 2) + "\n",
    );
    console.log(
      `${record.supplementError ? "LIMITED" : "SCROLLED"} ${run.id} ${record.frames.length - source.frames.length} additional frames`,
    );
  }
}
try {
  await Promise.all(
    Array.from({ length: 2 }, async () => {
      while (queue.length) await capture(queue.shift());
    }),
  );
} finally {
  await browser.close();
}
