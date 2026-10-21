import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { loadCatalog, ROOT, resolveLocal } from "./lib.mjs";
import { captureErrors, evidenceSetHash } from "./scoring-v3.mjs";

const catalog = loadCatalog(), problems = [], files = new Set();
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const directory = path.join(ROOT, "catalog/screenshot-captures");
let records = 0, attempts = 0;
for (const batch of fs.readdirSync(directory)) {
  for (const name of fs.readdirSync(path.join(directory, batch))) {
    const file = path.join(directory, batch, name);
    const capture = JSON.parse(fs.readFileSync(file, "utf8"));
    const run = catalog.runs.find((row) => row.id === capture.runId);
    if (!run) { problems.push("Unknown experiment: " + name); continue; }
    records++;
    const errors = captureErrors(capture, run);
    if (capture.status === "capture-error" && capture.reason) {
      attempts++;
      // A failed attempt is retained as evidence, and cannot count as a completed capture.
      const index = errors.indexOf("Capture has no real screenshot");
      if (index >= 0) errors.splice(index, 1);
    }
    problems.push(...errors.map((error) => name + ": " + error));
    if (capture.previousCapture && digest(resolveLocal(capture.previousCapture.file)) !== capture.previousCapture.sha256)
      problems.push(name + ": previous capture changed");
    for (const frame of capture.frames) {
      const png = resolveLocal(frame.file);
      if (files.has(png)) continue;
      files.add(png);
      if (digest(png) !== frame.sha256) problems.push(frame.file + ": PNG fingerprint changed");
      const meta = await sharp(png).metadata();
      if (meta.format !== "png" || meta.width !== frame.width || meta.height !== frame.height)
        problems.push(frame.file + ": PNG dimensions changed");
    }
  }
}
for (const run of catalog.runs) {
  const base = path.join(directory, "2026-10-21", run.id + ".json");
  if (!fs.existsSync(base)) { problems.push("Missing base capture: " + run.id); continue; }
  const capture = JSON.parse(fs.readFileSync(base, "utf8"));
  if (capture.status === "capture-error") {
    const retry = path.join(directory, "2026-10-21-retry", run.id + ".json");
    if (!fs.existsSync(retry) || JSON.parse(fs.readFileSync(retry, "utf8")).status !== "captured")
      problems.push("Missing successful retry: " + run.id);
  }
}
for (const topicFile of fs.readdirSync(path.join(ROOT, "catalog/score-reviews/2026-10-21-v3"))) {
  const draft = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog/score-reviews/2026-10-21-v3", topicFile), "utf8"));
  for (const entry of draft.entries) {
    const capture = JSON.parse(fs.readFileSync(resolveLocal(entry.captureManifest), "utf8"));
    if (entry.runId !== capture.runId || entry.evidenceSetHash !== evidenceSetHash(capture))
      problems.push(entry.reviewId + ": reviewed evidence changed");
    if (JSON.stringify([...entry.reviewedFrames].sort()) !== JSON.stringify(capture.frames.map((frame) => frame.id).sort()))
      problems.push(entry.reviewId + ": unreviewed frames");
  }
}
if (problems.length) { console.error(problems.join("\n")); process.exitCode = 1; }
else console.log(`${records} capture records, ${files.size} PNGs, ${attempts} retained failed attempts; all experiments accounted for. Draft coverage is not a completed rescore.`);
