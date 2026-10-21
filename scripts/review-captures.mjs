import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { loadCatalog, ROOT } from "./lib.mjs";

const args = process.argv.slice(2),
  option = (name, fallback) =>
    args.includes(name) ? args[args.indexOf(name) + 1] : fallback;
const batch = option("--batch", "2026-10-21"),
  topicId = option("--topic", "");
const output = option(
  "--output",
  fs.mkdtempSync(path.join(os.tmpdir(), "ai-score-v3-")),
);
fs.mkdirSync(output, { recursive: true });
const catalog = loadCatalog();
const anon = (run) =>
  crypto
    .createHash("sha256")
    .update("v3-2026-10-21/" + run.id)
    .digest("hex");
const runs = [...catalog.runs].sort(
  (a, b) =>
    a.topicId.localeCompare(b.topicId) || anon(a).localeCompare(anon(b)),
);
const manifest = [];
for (const [index, run] of runs.entries()) {
  if (topicId && run.topicId !== topicId) continue;
  const recordFile = path.join(
    ROOT,
    "catalog/screenshot-captures",
    batch,
    run.id + ".json",
  );
  if (!fs.existsSync(recordFile)) continue;
  const capture = JSON.parse(fs.readFileSync(recordFile, "utf8"));
  const reviewId = "R" + String(index + 1).padStart(3, "0");
  const sheets = [];
  for (let start = 0; start < capture.frames.length; start += 4) {
    const frames = capture.frames.slice(start, start + 4),
      layers = [];
    const height = 52 + Math.ceil(frames.length / 2) * 620;
    const title = `${reviewId} | ${run.topicId}/${run.promptId} | evidence ${Math.floor(start / 4) + 1}`;
    layers.push({
      input: Buffer.from(
        `<svg width="1840" height="52"><rect width="100%" height="100%" fill="#162235"/><text x="16" y="34" fill="white" font-size="24" font-family="Arial">${title}</text></svg>`,
      ),
      left: 0,
      top: 0,
    });
    for (const [i, frame] of frames.entries()) {
      const left = (i % 2) * 920,
        top = 52 + Math.floor(i / 2) * 620;
      layers.push({
        input: Buffer.from(
          `<svg width="920" height="32"><rect width="100%" height="100%" fill="#e1e8ef"/><text x="12" y="23" fill="#172033" font-size="18" font-family="Arial">${frame.id} | ${frame.width} x ${frame.height}</text></svg>`,
        ),
        left,
        top,
      });
      layers.push({
        input: await sharp(path.join(ROOT, frame.file))
          .resize(912, 580, {
            fit: "contain",
            background: "#f5f6f8",
            withoutEnlargement: true,
          })
          .png()
          .toBuffer(),
        left: left + 4,
        top: top + 36,
      });
    }
    const name = `${reviewId}-${Math.floor(start / 4) + 1}.png`;
    await sharp({
      create: { width: 1840, height, channels: 3, background: "#bdc7d2" },
    })
      .composite(layers)
      .png()
      .toFile(path.join(output, name));
    sheets.push(name);
  }
  const task = catalog.prompts.find(
    (p) => p.topicId === run.topicId && p.id === run.promptId,
  );
  const differences = run.raw.includes(task.text)
    ? run.raw.replaceAll(task.text, "【共用任务正文，已单独提供】")
    : run.raw;
  manifest.push({
    reviewId,
    runId: run.id,
    topicId: run.topicId,
    promptId: run.promptId,
    sheets,
    frames: capture.frames.map((f) => ({
      id: f.id,
      file: f.file,
      width: f.width,
      height: f.height,
    })),
    status: capture.status,
    captureManifest: path.relative(ROOT, recordFile).replaceAll("\\", "/"),
    inputCompleteness: run.input.completeness,
    inputDifferences: differences,
    inputNotes: run.input.notes,
    executionMode: run.input.executionMode || "unknown",
    authorization: run.input.authorization || null,
  });
}
fs.writeFileSync(
  path.join(output, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      output,
      runs: manifest.length,
      sheets: manifest.reduce((s, r) => s + r.sheets.length, 0),
      topics: [...new Set(manifest.map((r) => r.topicId))],
    },
    null,
    2,
  ),
);
