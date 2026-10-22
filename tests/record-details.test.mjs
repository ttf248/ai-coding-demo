import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { gzipSync } from "node:zlib";
import { recordDetailOutputs } from "../scripts/record-details.mjs";
test("individual payloads preserve facts and only include their own task rubric", () => {
  const full = JSON.parse(
    fs.readFileSync("assets/generated/topics/circuit-lab.json", "utf8"),
  );
  const outputs = recordDetailOutputs(full);
  assert.equal(outputs.size, full.runs.length);
  for (const run of full.runs) {
    const individual = JSON.parse(
      outputs.get(`assets/generated/records/${run.id}.json`),
    );
    assert.deepEqual(individual.runs, [run]);
    assert.deepEqual(Object.keys(individual.scoringRubric.tasks), [
      `${run.topicId}/${run.promptId}`,
    ]);
    assert.deepEqual(
      individual.scoringRubric.visualChecks,
      full.scoringRubric.visualChecks,
    );
  }
  const selected = full.runs
    .slice(0, 2)
    .map((run) => outputs.get(`assets/generated/records/${run.id}.json`));
  const fullBytes = Buffer.byteLength(JSON.stringify(full));
  assert.ok(
    selected.reduce((n, s) => n + Buffer.byteLength(s), 0) < fullBytes * 0.3,
  );
  assert.ok(
    selected.reduce((n, s) => n + gzipSync(s).length, 0) <
      gzipSync(JSON.stringify(full)).length * 0.5,
  );
});
