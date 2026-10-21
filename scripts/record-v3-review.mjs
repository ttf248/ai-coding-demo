import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT } from "./lib.mjs";

// Manual review input only: this utility never derives points from earlier scores.
const input = JSON.parse(fs.readFileSync(0, "utf8").replace(/^\uFEFF/, ""));
const manifest = JSON.parse(fs.readFileSync(input.manifest, "utf8"));
const target = path.join(ROOT, "catalog/score-reviews/2026-10-21-v3", input.topic + ".json");
const document = fs.existsSync(target)
  ? JSON.parse(fs.readFileSync(target, "utf8"))
  : { rubricVersion: 3, phase: "manual-review-draft", entries: [] };
const names = ["taskCoverage", "composition", "readability", "interactionClarity", "craft"];
for (const entry of input.entries) {
  const source = manifest.find((row) => row.reviewId === entry.reviewId);
  if (!source || source.topicId !== input.topic) throw new Error("Unknown review identity");
  const points = (value, count) => {
    const values = typeof value === "string" ? [...value].map(Number) : value;
    if (values.length !== count || values.some((p) => !Number.isInteger(p) || p < 0 || p > 5)) throw new Error("Invalid manual points");
    return values;
  };
  const observations = Array.isArray(entry.observations)
    ? Object.fromEntries(names.map((name, i) => [name, entry.observations[i]]))
    : entry.observations;
  if (names.some((name) => typeof observations[name] !== "string" || observations[name].length < 8)) throw new Error("Missing manual observations");
  const captureFile = path.resolve(ROOT, source.captureManifest);
  const capture = JSON.parse(fs.readFileSync(captureFile, "utf8"));
  if (capture.frames.length !== source.frames.length) throw new Error("Review sheet is stale");
  const result = {
    reviewId: source.reviewId, runId: source.runId,
    status: entry.status || "rated",
    taskPoints: entry.status === "insufficient" ? null : points(entry.taskPoints, 8),
    visualPoints: entry.status === "insufficient" ? null : points(entry.visualPoints, 12),
    captureState: entry.captureState || "result", confidence: entry.confidence || "medium",
    ...(entry.reason ? { reason: entry.reason } : {}),
    observations,
    limitations: entry.limitations || ["截图及采集日志只证明已记录状态，不证明完整交互、实现算法或性能。"],
    captureManifest: source.captureManifest,
    evidenceSetHash: crypto.createHash("sha256").update(JSON.stringify(capture)).digest("hex"),
    reviewedFrames: capture.frames.map((frame) => frame.id), supplementReviewed: true,
  };
  const index = document.entries.findIndex((row) => row.reviewId === entry.reviewId);
  if (index < 0) document.entries.push(result); else document.entries[index] = result;
}
document.phase = "manual-review-draft";
document.entries.sort((a, b) => a.reviewId.localeCompare(b.reviewId));
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(document, null, 2) + "\n");
console.log(`${input.topic}: ${document.entries.length} manually reviewed drafts`);
