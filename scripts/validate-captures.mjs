import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { loadCatalog, ROOT, resolveLocal } from "./lib.mjs";
import {
  captureErrors,
  evidenceSetHash,
  expandManualReview,
  v3ReviewErrors,
} from "./scoring-v3.mjs";

const catalog = loadCatalog(),
  problems = [],
  files = new Map();
const digest = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const directory = path.join(ROOT, "catalog/screenshot-captures");
let records = 0,
  attempts = 0,
  supplements = 0;
const rubric = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "catalog/score-reviews/2026-10-21-v3-rubric.json"),
    "utf8",
  ),
);
const reviewed = new Set();
for (const batch of fs.readdirSync(directory)) {
  for (const name of fs.readdirSync(path.join(directory, batch))) {
    const file = path.join(directory, batch, name);
    const capture = JSON.parse(fs.readFileSync(file, "utf8"));
    const run = catalog.runs.find((row) => row.id === capture.runId);
    if (!run) {
      problems.push("Unknown experiment: " + name);
      continue;
    }
    records++;
    if (capture.supplementError) supplements++;
    const errors = captureErrors(capture, run);
    if (capture.status === "capture-error" && capture.reason) {
      attempts++;
      // A failed attempt is retained as evidence, and cannot count as a completed capture.
      const index = errors.indexOf("Capture has no real screenshot");
      if (index >= 0) errors.splice(index, 1);
    }
    problems.push(...errors.map((error) => name + ": " + error));
    if (
      capture.previousCapture &&
      digest(resolveLocal(capture.previousCapture.file)) !==
        capture.previousCapture.sha256
    )
      problems.push(name + ": previous capture changed");
    for (const frame of capture.frames) {
      const png = resolveLocal(frame.file);
      if (!files.has(png))
        files.set(png, {
          sha256: digest(png),
          ...(await sharp(png).metadata()),
        });
      // Each manifest declaration must match the PNG, including repeated references.
      const meta = files.get(png);
      if (meta.sha256 !== frame.sha256)
        problems.push(frame.file + ": PNG fingerprint changed");
      if (
        meta.format !== "png" ||
        meta.width !== frame.width ||
        meta.height !== frame.height
      )
        problems.push(frame.file + ": PNG dimensions changed");
    }
  }
}
const historicalIds = new Set(
  JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "catalog/score-reviews/2026-10-21-v3-source.json"),
      "utf8",
    ),
  ).runs.map((r) => r.id),
);
for (const run of catalog.runs.filter((r) => historicalIds.has(r.id))) {
  const base = path.join(directory, "2026-10-21", run.id + ".json");
  if (!fs.existsSync(base)) {
    problems.push("Missing base capture: " + run.id);
    continue;
  }
  const capture = JSON.parse(fs.readFileSync(base, "utf8"));
  if (capture.status === "capture-error") {
    const retry = path.join(directory, "2026-10-21-retry", run.id + ".json");
    if (
      !fs.existsSync(retry) ||
      JSON.parse(fs.readFileSync(retry, "utf8")).status !== "captured"
    )
      problems.push("Missing successful retry: " + run.id);
  }
}
for (const topicFile of fs.readdirSync(
  path.join(ROOT, "catalog/score-reviews/2026-10-21-v3"),
)) {
  const draft = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "catalog/score-reviews/2026-10-21-v3", topicFile),
      "utf8",
    ),
  );
  for (const entry of draft.entries) {
    if (reviewed.has(entry.runId))
      problems.push(entry.reviewId + ": duplicate review");
    reviewed.add(entry.runId);
    const capture = JSON.parse(
      fs.readFileSync(resolveLocal(entry.captureManifest), "utf8"),
    );
    if (
      entry.runId !== capture.runId ||
      entry.evidenceSetHash !== evidenceSetHash(capture)
    )
      problems.push(entry.reviewId + ": reviewed evidence changed");
    if (
      JSON.stringify([...entry.reviewedFrames].sort()) !==
      JSON.stringify(capture.frames.map((frame) => frame.id).sort())
    )
      problems.push(entry.reviewId + ": unreviewed frames");
    try {
      problems.push(
        ...v3ReviewErrors(
          expandManualReview(entry, rubric, capture),
          rubric,
          capture,
        ).map((e) => entry.reviewId + ": " + e),
      );
    } catch (error) {
      problems.push(entry.reviewId + ": " + error.message);
    }
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `${records} capture records, ${files.size} PNGs, ${attempts} retained failed attempts, ${supplements} incomplete supplemental attempts; ${reviewed.size}/${historicalIds.size} archived manual reviews. Production rubric v${JSON.parse(fs.readFileSync(path.join(ROOT, "catalog/scoring-rubric.json"), "utf8")).version}.`,
  );
