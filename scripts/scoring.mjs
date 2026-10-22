import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ROOT, resolveLocal } from "./lib.mjs";
import {
  captureErrors,
  v3ReviewErrors,
  v3RubricErrors,
} from "./scoring-v3.mjs";

export const criteriaHash = (definition) =>
  crypto.createHash("sha256").update(JSON.stringify(definition)).digest("hex");
export function rubricFingerprint({ tasks, ...globalRules }) {
  return criteriaHash(globalRules);
}
const fileHash = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

// New supplements invalidate a review even when its selected cover is unchanged.
export function captureInventoryHash(runId) {
  const directory = path.join(ROOT, "catalog/screenshot-captures");
  const records = fs.existsSync(directory)
    ? fs
        .readdirSync(directory)
        .sort()
        .flatMap((batch) => {
          const file = path.join(directory, batch, runId + ".json");
          return fs.existsSync(file)
            ? [[batch + "/" + runId + ".json", fileHash(file)]]
            : [];
        })
    : [];
  return criteriaHash(records);
}

export function rubricErrors(rubric, catalog, schema) {
  const errors = v3RubricErrors(rubric, catalog);
  if (rubric.version !== schema.$defs.caseScore.properties.rubricVersion.const)
    errors.push("Scoring rubric and run schema versions differ");
  const maxima = rubric.dimensionMaximums || {};
  const dimensions = schema.$defs.scoreDimensions;
  if (
    Object.values(maxima).reduce((a, b) => a + b, 0) !== 100 ||
    JSON.stringify(Object.keys(maxima).sort()) !==
      JSON.stringify([...dimensions.required].sort()) ||
    Object.entries(maxima).some(
      ([key, value]) => value !== dimensions.properties[key]?.maximum,
    )
  )
    errors.push("Scoring weights must match schema and sum to 100");
  if (
    JSON.stringify(rubric.stateCeilings) !==
    JSON.stringify({ result: 100, initial: 100, partial: 100, blocked: 39 })
  )
    errors.push(
      "Unexpected screenshot state ceilings; update rubric version and validation together",
    );
  return errors;
}

export function scoreErrors(run, rubric) {
  const errors = [],
    score = run.score || {};
  const fail = (message) => errors.push(message + ": " + run.id);
  if (score.rubricVersion !== rubric.version)
    fail("Reassess with current scoring rubric");
  if (score.status === "pending") {
    if (run.status !== "draft" || run.screenshot)
      fail("Only an unfinished draft can await visual review");
    return errors;
  }
  if (run.screenshot) {
    if (!["rated", "insufficient"].includes(score.status))
      fail("Screenshot requires a completed visual review");
    if (score.screenshotHash !== run.screenshotInfo?.hash)
      fail("Screenshot changed; reassess score");
  } else if (score.status !== "unavailable")
    fail("Missing screenshot must be unavailable or an unfinished draft");
  const definition = rubric.tasks?.[run.topicId + "/" + run.promptId];
  if (!definition) fail("Register task-specific scoring checks before rating");
  if (definition && score.criteriaHash !== criteriaHash(definition))
    fail("Scoring checks changed; reassess");
  if (score.rubricHash !== rubricFingerprint(rubric))
    fail("Scoring rubric changed; reassess");
  if (score.inputHash !== run.rawHash)
    fail("Original input changed; reassess score");
  if (typeof score.evidence !== "string" || score.evidence.trim().length < 24)
    fail("Explain visible evidence and the principal limitation");
  try {
    if (
      !/^catalog\/screenshot-captures\/[^/]+\/[^/]+\.json$/.test(
        score.captureManifest || "",
      )
    )
      throw Error("Missing capture manifest");
    const capture = JSON.parse(
      fs.readFileSync(resolveLocal(score.captureManifest), "utf8"),
    );
    errors.push(...captureErrors(capture, run).map((e) => e + ": " + run.id));
    errors.push(
      ...v3ReviewErrors(score, rubric, capture).map((e) => e + ": " + run.id),
    );
    if (score.captureInventoryHash !== captureInventoryHash(run.id))
      fail("Capture inventory changed; reassess all supplemental evidence");
    if (
      run.screenshot &&
      !capture.frames.some(
        (frame) =>
          frame.file === run.directory + "/" + run.screenshot &&
          frame.sha256 === score.screenshotHash,
      )
    )
      fail("Selected screenshot must be a reviewed capture frame");
    for (const frame of capture.frames) {
      const file = resolveLocal(frame.file);
      if (fileHash(file) !== frame.sha256)
        fail("Evidence PNG changed; reassess all frames");
      const bytes = fs.readFileSync(file);
      if (
        bytes.toString("hex", 0, 8) !== "89504e470d0a1a0a" ||
        bytes.readUInt32BE(16) !== frame.width ||
        bytes.readUInt32BE(20) !== frame.height
      )
        fail("Evidence PNG dimensions differ from capture");
    }
  } catch (error) {
    fail("Invalid capture evidence: " + error.message);
  }
  return errors;
}
