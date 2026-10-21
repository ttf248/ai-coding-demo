import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { chromium } from "playwright";
import { ROOT, loadCatalog } from "./lib.mjs";
import {
  discoverHorizontalContainers,
  scrollHorizontalContainer,
} from "./capture-scroll.mjs";

const args = process.argv.slice(2);
const option = (name, fallback = "") =>
  args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const batch = option("--batch", "2026-10-21-horizontal");
if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9]+$/.test(batch)) throw Error("Invalid batch");
const hash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const relative = (file) => path.relative(ROOT, file).replaceAll("\\", "/");
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader"],
});
try {
  for (const run of loadCatalog().runs.filter(
    (r) =>
      (!option("--topic") || r.topicId === option("--topic")) &&
      (!option("--run") || r.id === option("--run")),
  )) {
    const target = path.join(
      ROOT,
      "catalog/screenshot-captures",
      batch,
      run.id + ".json",
    );
    if (fs.existsSync(target)) continue;
    const sourceFile = [
      "2026-10-21-states4",
      "2026-10-21-states3",
      "2026-10-21-states2",
      "2026-10-21-states",
      "2026-10-21-retry",
      "2026-10-21-scroll",
      "2026-10-21",
    ]
      .map((b) =>
        path.join(ROOT, "catalog/screenshot-captures", b, run.id + ".json"),
      )
      .find((f) => fs.existsSync(f));
    if (!sourceFile) throw Error("Missing capture " + run.id);
    const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
    if (source.status !== "captured") continue;
    const output = path.join(ROOT, run.directory, "captures", batch);
    if (fs.existsSync(output) && fs.readdirSync(output).length)
      throw Error("Existing images " + run.id);
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
    page.on("pageerror", (e) => record.errors.push(e.message));
    page.on("requestfailed", (r) => {
      if (!/google-analytics|googletagmanager/.test(r.url()))
        record.failedRequests.push({
          url: r.url(),
          error: r.failure()?.errorText,
        });
    });
    try {
      const entry =
        run.preview.pages.find((p) => p.id === run.preview.defaultPage) ||
        run.preview.pages[0];
      await page.goto(
        new URL(entry.href, option("--base-url", "http://127.0.0.1:43931/"))
          .href,
        { waitUntil: "commit", timeout: 25000 },
      );
      try {
        await page.waitForLoadState("domcontentloaded", { timeout: 25000 });
      } catch {
        record.actions.push({
          kind: "horizontal-document-ready-timeout",
          timeoutMs: 25000,
        });
      }
      await page.waitForTimeout(2300);
      await Promise.race([
        page.evaluate(() => document.fonts.ready),
        page.waitForTimeout(1800),
      ]);
      const containers = await discoverHorizontalContainers(page);
      record.actions.push({
        kind: "discover-horizontal-containers",
        containers,
        limit:
          "仅默认入口中宽至少 300px、高至少 200px 的最外层横向滚动区，最多扫描 12000px；不代表穷尽应用状态。",
      });
      for (const [c, container] of containers.entries()) {
        const maximum = Math.min(container.maxLeft, 12000);
        const positions = [];
        for (let x = Math.min(900, maximum); x < maximum; x += 900)
          positions.push(x);
        positions.push(maximum);
        for (const [i, left] of positions.entries()) {
          const actual = await scrollHorizontalContainer(page, container, left);
          record.actions.push({
            kind: "horizontal-scroll",
            selector: container.selector,
            requestedLeft: left,
            observed: actual,
          });
          for (const lower of [false, true]) {
            if (lower) {
              const height = await page.evaluate(
                () => document.documentElement.scrollHeight,
              );
              if (height <= 950) continue;
              await page.evaluate(() =>
                scrollTo({
                  top: Math.min(
                    document.documentElement.scrollHeight - innerHeight,
                    5400,
                  ),
                  behavior: "instant",
                }),
              );
              await page.waitForTimeout(500);
            }
            const id = `desktop-horizontal-${c}-${i}${lower ? "-lower" : ""}`;
            const file = path.join(output, id + ".png");
            fs.mkdirSync(output, { recursive: true });
            await page.screenshot({
              path: file,
              fullPage: false,
              timeout: 45000,
            });
            const meta = await sharp(file).metadata();
            record.frames.push({
              id,
              pageId: entry.id,
              file: relative(file),
              sha256: hash(file),
              width: meta.width,
              height: meta.height,
              viewport: { width: 1440, height: 900 },
              fullPage: false,
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
        }
      }
      delete record.supplementError;
    } catch (error) {
      record.supplementError = error.message;
    } finally {
      await context.close();
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, JSON.stringify(record, null, 2) + "\n");
      console.log(
        `${run.id}: ${record.frames.length - source.frames.length} additional frames${record.supplementError ? " | " + record.supplementError.split("\n")[0] : ""}`,
      );
    }
  }
} finally {
  await browser.close();
}
