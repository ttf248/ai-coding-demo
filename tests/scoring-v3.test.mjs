import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { readJSON, loadCatalog, sourceHash, ROOT } from "../scripts/lib.mjs";
import {
  v3RubricErrors,
  captureErrors,
  evidenceSetHash,
  v3ReviewErrors,
} from "../scripts/scoring-v3.mjs";
const rubric = readJSON("catalog/scoring-rubric-v3.json"),
  catalog = loadCatalog();

test("capture PNGs do not invalidate builds, while source assets and code still do", () => {
  const temporary = fs.mkdtempSync(
    path.join(ROOT, "tests", ".tmp-capture-hash-"),
  );
  const run = {
    directory: path.relative(ROOT, temporary).replaceAll("\\", "/"),
    build: { command: ["run", "build"], output: "dist" },
  };
  try {
    fs.writeFileSync(
      path.join(temporary, "index.html"),
      "<!doctype html><h1>Real source</h1>",
    );
    const before = sourceHash(run),
      capture = path.join(temporary, "captures", "2026-10-21");
    fs.mkdirSync(capture, { recursive: true });
    fs.copyFileSync(
      path.join(ROOT, "scripts/fixtures/pixel-flow-review.png"),
      path.join(capture, "desktop.png"),
    );
    assert.equal(sourceHash(run), before);
    fs.writeFileSync(path.join(capture, "runtime.js"), "window.changed=true;");
    assert.notEqual(sourceHash(run), before);
    fs.rmSync(path.join(capture, "runtime.js"));
    fs.copyFileSync(
      path.join(ROOT, "scripts/fixtures/pixel-flow-review.png"),
      path.join(temporary, "source-image.png"),
    );
    assert.notEqual(sourceHash(run), before);
  } finally {
    assert.ok(temporary.startsWith(path.join(ROOT, "tests") + path.sep));
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test("v3 separates eight task checks and twelve visual observations", () => {
  assert.deepEqual(v3RubricErrors(rubric, catalog), []);
  const broken = structuredClone(rubric);
  broken.tasks[Object.keys(broken.tasks)[0]].checks.pop();
  assert.ok(v3RubricErrors(broken, catalog).some((e) => e.includes("eight")));
  broken.visualChecks.composition.pop();
  assert.ok(v3RubricErrors(broken, catalog).some((e) => e.includes("Visual")));
});

test("capture review binds every screenshot and preserves missing evidence", () => {
  const run = catalog.runs.find((r) => r.preview.kind === "none");
  const capture = {
    runId: run.id,
    topicId: run.topicId,
    promptId: run.promptId,
    inputHash: run.rawHash,
    status: "unavailable",
    reason: "没有登记可运行页面，不伪造图像",
    capturedAt: "2026-10-21T00:00:00Z",
    environment: {
      browser: "test",
      deviceScaleFactor: 1,
      analytics: "blocked",
    },
    frames: [],
    actions: [],
    errors: [],
    failedRequests: [],
  };
  assert.deepEqual(captureErrors(capture, run), []);
  const score = {
    status: "unavailable",
    total: null,
    evidenceSetHash: evidenceSetHash(capture),
  };
  assert.deepEqual(v3ReviewErrors(score, rubric, capture), []);
  capture.frames.push({ id: "invented" });
  assert.ok(captureErrors(capture, run).length);
  assert.ok(
    v3ReviewErrors(score, rubric, capture).some((e) => e.includes("changed")),
  );
  const incomplete = {
    status: "rated",
    evidenceSetHash: evidenceSetHash(capture),
    reviewedFrames: [],
    limitations: [],
    confidence: "high",
  };
  assert.ok(
    v3ReviewErrors(incomplete, rubric, capture).some((e) =>
      e.includes("every recorded frame"),
    ),
  );
  assert.ok(
    v3ReviewErrors(incomplete, rubric, capture).some((e) =>
      e.includes("observations"),
    ),
  );
});
