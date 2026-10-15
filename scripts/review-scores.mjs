import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { loadCatalog, ROOT } from "./lib.mjs";

// Review sheets contain no model, effort, date, price or existing score.
const output = process.argv[2]
  ? path.resolve(process.argv[2])
  : fs.mkdtempSync(path.join(os.tmpdir(), "ai-coding-demo-score-review-"));
if (process.argv[2] && fs.existsSync(output) && fs.readdirSync(output).length)
  throw new Error(
    "Review output directory must be empty; preserve earlier review evidence.",
  );
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(path.join(output, "originals"), { recursive: true });
const catalog = loadCatalog();
const manifest = [];
const order = (run) => crypto.createHash("sha256").update(run.id).digest("hex");
let index = 0;
for (const topic of catalog.topics) {
  const runs = catalog.runs
    .filter((run) => run.topicId === topic.id && run.screenshot)
    .sort((a, b) => order(a).localeCompare(order(b)));
  const entries = runs.map((run) => ({
    reviewId: "R" + String(++index).padStart(3, "0"),
    id: run.id,
    topicId: run.topicId,
    promptId: run.promptId,
    inputHash: run.rawHash,
    screenshotHash: run.screenshotInfo.hash,
    file: `${run.directory}/${run.screenshot}`,
    width: run.screenshotInfo.width,
    height: run.screenshotInfo.height,
  }));
  manifest.push(...entries);
  for (const entry of entries) {
    fs.copyFileSync(
      path.join(ROOT, entry.file),
      path.join(output, "originals", `${entry.reviewId}.png`),
    );
  }
  for (let start = 0; start < entries.length; start += 6) {
    const group = entries.slice(start, start + 6);
    const width = 1600,
      slotHeight = 540,
      height = 60 + Math.ceil(group.length / 2) * slotHeight;
    const layers = [
      {
        input: Buffer.from(
          `<svg width="${width}" height="60"><rect width="100%" height="100%" fill="#162235"/><text x="20" y="38" fill="white" font-size="25" font-family="Arial">${topic.id} · ${Math.floor(start / 6) + 1}</text></svg>`,
        ),
        left: 0,
        top: 0,
      },
    ];
    for (const [i, entry] of group.entries()) {
      const left = (i % 2) * 800,
        top = 60 + Math.floor(i / 2) * slotHeight;
      layers.push({
        input: Buffer.from(
          `<svg width="800" height="40"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="12" y="28" fill="#172033" font-size="23" font-family="Arial">${entry.reviewId} · ${entry.promptId} · ${entry.width}×${entry.height}</text></svg>`,
        ),
        left,
        top,
      });
      layers.push({
        input: await sharp(path.join(ROOT, entry.file))
          .resize(792, 492, {
            fit: "contain",
            background: "#fafafa",
            withoutEnlargement: true,
          })
          .png()
          .toBuffer(),
        left: left + 4,
        top: top + 44,
      });
    }
    await sharp({
      create: { width, height, channels: 3, background: "#a4aab3" },
    })
      .composite(layers)
      .png()
      .toFile(
        path.join(output, `${topic.id}-${Math.floor(start / 6) + 1}.png`),
      );
  }
}
fs.writeFileSync(
  path.join(output, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      output,
      screenshots: manifest.length,
      topics: catalog.topics.map((t) => ({
        id: t.id,
        runs: catalog.runs.filter((r) => r.topicId === t.id).length,
        screenshots: manifest.filter((r) => r.topicId === t.id).length,
      })),
      dimensions: [...new Set(manifest.map((r) => `${r.width}x${r.height}`))],
    },
    null,
    2,
  ),
);
