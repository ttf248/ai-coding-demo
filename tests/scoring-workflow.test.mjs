import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT, loadCatalog, readJSON } from "../scripts/lib.mjs";

const execute = (script, args = [], input) =>
  execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", script), ...args],
    { cwd: ROOT, encoding: "utf8", stdio: "pipe", input },
  );

test("capture tools require explicit new batches and supplement sources before writing", () => {
  assert.throws(
    () => execute("capture-screenshots.mjs"),
    /Specify a new dated capture batch/,
  );
  assert.throws(
    () =>
      execute("capture-scroll-evidence.mjs", ["--batch", "2030-01-01-scroll"]),
    /Supplement must use a distinct dated batch/,
  );
  assert.throws(
    () =>
      execute("capture-horizontal-evidence.mjs", [
        "--batch",
        "2030-01-01-horizontal",
      ]),
    /Specify distinct dated/,
  );
  assert.throws(
    () =>
      execute(
        "capture-review-states.mjs",
        [],
        JSON.stringify({
          runId: loadCatalog().runs[0].id,
          states: [{ id: "result" }],
        }),
      ),
    /Invalid batch/,
  );
});

test("single-run review sheets read the bound full evidence and preserve existing output", () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "ai-review-workflow-"),
  );
  try {
    const run = loadCatalog().runs.find(
      (r) =>
        r.score.status === "rated" &&
        r.score.captureManifest.includes("-scroll/"),
    );
    const args = ["--run", run.id, "--output", directory];
    execute("review-captures.mjs", args);
    const file = path.join(directory, "manifest.json"),
      before = fs.readFileSync(file, "utf8"),
      rows = JSON.parse(before);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].runId, run.id);
    assert.equal(rows[0].captureManifest, run.score.captureManifest);
    assert.deepEqual(
      rows[0].frames.map((frame) => frame.id),
      readJSON(run.score.captureManifest).frames.map((frame) => frame.id),
    );
    assert.throws(
      () => execute("review-captures.mjs", args),
      /Review output must be empty/,
    );
    assert.equal(fs.readFileSync(file, "utf8"), before);
  } finally {
    assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith("ai-review-workflow-"));
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
