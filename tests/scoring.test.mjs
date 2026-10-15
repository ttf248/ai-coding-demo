import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import Ajv from "ajv";
import { loadCatalog, read, readJSON } from "../scripts/lib.mjs";
import { rubricErrors, scoreErrors } from "../scripts/scoring.mjs";
const catalog = loadCatalog(),
  rubric = readJSON("catalog/scoring-rubric.json"),
  schema = readJSON("catalog/schema.json");
const validate = new Ajv({ allErrors: true }).compile({
  ...schema,
  $ref: "#/$defs/caseScore",
});
const rated = catalog.runs.find((run) => run.score.status === "rated");
const context = {};
vm.runInNewContext(read("assets/core.js"), context);
const ui = context.ArchiveUI;
test("every screenshot review is tied to its task, input and evidence", () => {
  assert.deepEqual(rubricErrors(rubric, catalog, schema), []);
  for (const run of catalog.runs) {
    assert.ok(
      validate(run.score),
      `${run.id}: ${JSON.stringify(validate.errors)}`,
    );
    assert.deepEqual(scoreErrors(run, rubric), []);
  }
  const changed = structuredClone(rated);
  changed.screenshotInfo.hash = "0".repeat(64);
  assert.ok(
    scoreErrors(changed, rubric).some((error) =>
      error.includes("Screenshot changed"),
    ),
  );
  changed.screenshotInfo.hash = rated.screenshotInfo.hash;
  changed.rawHash = "0".repeat(64);
  assert.ok(
    scoreErrors(changed, rubric).some((error) =>
      error.includes("Original input changed"),
    ),
  );
  const rules = structuredClone(rubric);
  rules.tasks[`${rated.topicId}/${rated.promptId}`].checks[0].description +=
    "规则调整";
  assert.ok(
    scoreErrors(rated, rules).some((error) =>
      error.includes("Scoring checks changed"),
    ),
  );
});
test("insufficient evidence stays unranked and differs from zero points", () => {
  const run = catalog.runs.find((run) => run.score.status === "insufficient");
  assert.equal(ui.scoreValue(run), null);
  assert.match(ui.scoreBadge(run), /证据不足/);
  assert.ok(!ui.bestScoredRun([run]));
  const zero = {
    ...run,
    id: "valid-zero",
    score: { ...rated.score, total: 0 },
  };
  assert.equal(ui.scoreValue(zero), 0);
  assert.equal(ui.bestScoredRun([run, zero]).id, "valid-zero");
  const invalid = structuredClone(run.score);
  invalid.total = 0;
  assert.equal(validate(invalid), false);
});
test("task points, dimension weights and blocking ceilings cannot drift", () => {
  const invalid = structuredClone(rated);
  invalid.score.taskChecks[Object.keys(invalid.score.taskChecks)[0]]--;
  assert.ok(
    scoreErrors(invalid, rubric).some((error) => error.includes("four checks")),
  );
  const blocked = catalog.runs.find(
    (run) => run.score.captureState === "blocked",
  );
  assert.ok(blocked);
  assert.equal(blocked.score.total, 39);
  const uncapped = structuredClone(blocked);
  uncapped.score.total = Object.values(uncapped.score.dimensions).reduce(
    (a, b) => a + b,
    0,
  );
  assert.ok(
    scoreErrors(uncapped, rubric).some((error) =>
      error.includes("state ceiling"),
    ),
  );
  const weights = structuredClone(rubric);
  weights.dimensionMaximums.craft++;
  assert.ok(
    rubricErrors(weights, catalog, schema).some((error) =>
      error.includes("weights"),
    ),
  );
  const stale = structuredClone(rated.score);
  stale.rubricVersion = 1;
  assert.equal(validate(stale), false);
});
test("score details preserve evidence states and escape review text", () => {
  for (const status of ["insufficient", "unavailable", "pending"]) {
    const html = ui.scoreDetails({
      score: { status, total: null, evidence: "<script>bad</script>" },
    });
    assert.ok(!html.includes("<meter"));
    assert.ok(!html.includes("0/100"));
    assert.ok(html.includes("&lt;script&gt;"));
  }
  const html = ui.scoreDetails(rated);
  assert.equal((html.match(/<meter /g) || []).length, 5);
  assert.ok(html.includes(`${rated.score.total}/100`));
  assert.ok(html.includes("规则 v2"));
});
