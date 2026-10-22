import fs from "node:fs";
import path from "node:path";
import { ROOT, loadCatalog, readJSON, resolveLocal } from "./lib.mjs";
import {
  criteriaHash,
  captureInventoryHash,
  rubricFingerprint,
} from "./scoring.mjs";
import { expandManualReview, v3ReviewErrors } from "./scoring-v3.mjs";

const rubric = readJSON("catalog/scoring-rubric-v3.json");
const catalog = loadCatalog();
const source = readJSON("catalog/score-reviews/2026-10-21-v3-source.json");
const directory = "catalog/score-reviews/2026-10-21-v3";
const reviews = fs
  .readdirSync(resolveLocal(directory))
  .flatMap((file) => readJSON(directory + "/" + file).entries);
if (
  reviews.length !== catalog.runs.length ||
  new Set(reviews.map((e) => e.runId)).size !== catalog.runs.length
)
  throw Error("Complete independent reviews are required before activation");
const selection = readJSON("catalog/score-reviews/2026-10-21-v3-covers.json");
const writes = [];
const counts = {};
for (const run of catalog.runs) {
  const entry = reviews.find((e) => e.runId === run.id);
  const capture = readJSON(entry.captureManifest);
  const expanded = expandManualReview(entry, rubric, capture);
  const errors = v3ReviewErrors(expanded, rubric, capture);
  if (errors.length) throw Error(run.id + ": " + errors.join("; "));
  const frame = capture.frames.find((f) => f.id === selection[run.id]);
  if (
    entry.status !== "unavailable" &&
    (!frame || !entry.reviewedFrames.includes(frame.id))
  )
    throw Error("Cover must be an actually reviewed frame: " + run.id);
  const score = {
    rubricVersion: 3,
    status: entry.status,
    total: expanded.total,
    dimensions: expanded.dimensions || null,
    taskChecks: expanded.taskChecks || null,
    visualChecks: expanded.visualChecks || null,
    captureState:
      entry.status === "insufficient"
        ? "undemonstrated"
        : entry.status === "unavailable"
          ? null
          : entry.captureState,
    ceiling: expanded.ceiling ?? null,
    assessedAt: "2026-10-22",
    inputHash: run.rawHash,
    screenshotHash: frame?.sha256 || null,
    criteriaHash: criteriaHash(rubric.tasks[run.topicId + "/" + run.promptId]),
    rubricHash: rubricFingerprint(rubric),
    evidence: entry.reason || Object.values(entry.observations).join(" "),
    observations: entry.observations,
    confidence: entry.confidence,
    limitations: entry.limitations,
    captureManifest: entry.captureManifest,
    evidenceSetHash: entry.evidenceSetHash,
    captureInventoryHash: captureInventoryHash(run.id),
    reviewedFrames: entry.reviewedFrames,
  };
  const file = run.directory + "/run.json",
    stored = readJSON(file);
  if (stored.score.rubricVersion !== 2)
    throw Error("Activation is a one-time v2 migration: " + run.id);
  if (
    !source.runs.some(
      (r) =>
        r.id === run.id &&
        JSON.stringify(r.score) === JSON.stringify(stored.score),
    )
  )
    throw Error("Original score snapshot differs: " + run.id);
  if (frame) {
    stored.screenshot = path.posix.relative(run.directory, frame.file);
    stored.screenshotCapturedAt = readJSON(
      "catalog/screenshot-captures/" +
        stored.screenshot.split("/")[1] +
        "/" +
        run.id +
        ".json",
    ).capturedAt.slice(0, 10);
  }
  stored.score = score;
  stored.changes.push(
    entry.status === "unavailable"
      ? "维护者于 2026-10-22 按 v3 核对原始输入及无预览采集记录，保留 unavailable；未生成截图或数值评分。旧 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json，未重跑模型、启动历史后端或改写实验源码。"
      : "维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。",
  );
  writes.push([file, stored]);
  counts[score.status] = (counts[score.status] || 0) + 1;
}
if (!process.argv.includes("--write")) {
  console.log(
    JSON.stringify({
      ready: writes.length,
      counts,
      note: "Review prepared; pass --write to activate",
    }),
  );
} else {
  for (const [file, value] of writes)
    fs.writeFileSync(resolveLocal(file), JSON.stringify(value, null, 2) + "\n");
  fs.writeFileSync(
    path.join(ROOT, "catalog/scoring-rubric.json"),
    JSON.stringify(rubric, null, 2) + "\n",
  );
  console.log(JSON.stringify({ activated: writes.length, counts }));
}
