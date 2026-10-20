import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { read, loadCatalog } from "../scripts/lib.mjs";

const data = loadCatalog();
const context = {};
vm.runInNewContext(read("assets/core.js"), context);
vm.runInNewContext(read("assets/topic-records.js"), context);
const R = context.ArchiveTopicRecords;
const U = context.ArchiveUI;

test("duration display preserves recorded scope, approximate text and unknown values", () => {
  assert.equal(R.durationSummary({}), "耗时未记录");
  assert.equal(R.durationSummary({ billing: { type: "batch" } }), "耗时未记录");
  assert.equal(
    R.durationSummary({
      billing: { type: "run", duration: { seconds: 0, text: "0s" } },
    }),
    "单次耗时 0s",
  );
  for (const batch of data.batches.filter((batch) => batch.duration)) {
    const related = data.runs.filter(
      (run) => run.billing?.batchId === batch.batchId,
    );
    assert.ok(related.length > 0);
    for (const run of related) {
      assert.deepEqual(run.billing.duration, batch.duration);
      assert.equal(R.durationSummary(run), "批次耗时 " + batch.duration.text);
    }
  }
  const approximate = data.batches.find(
    (batch) => batch.duration?.seconds === null,
  );
  assert.ok(approximate.duration.text.includes("精确时长未记录"));
  const historical = data.runs.find(
    (run) => run.billing?.batchId === approximate.batchId,
  );
  const source = JSON.parse(read(historical.directory + "/run.json"));
  assert.equal(source.billing.duration, undefined);
});

test("topic model groups preserve every record and separate task versions", () => {
  for (const topic of data.topics) {
    const runs = data.runs.filter((run) => run.topicId === topic.id);
    const groups = R.group(data, runs);
    assert.deepEqual(
      Array.from(groups)
        .flatMap((group) => Array.from(group.runs, (run) => run.id))
        .sort(),
      runs.map((run) => run.id).sort(),
    );
    for (const group of groups) {
      assert.ok(
        group.runs.every(
          (run) =>
            run.modelId === group.modelId && run.promptId === group.promptId,
        ),
      );
      assert.equal(
        group.conditions.reduce(
          (count, condition) => count + condition.runs.length,
          0,
        ),
        group.runs.length,
      );
    }
  }
});

test("history grouping separates efforts, tools and execution modes", () => {
  const source = data.runs.find(
    (run) => run.topicId === "voxel-construction-site",
  );
  const fixture = [
    {
      ...source,
      id: "baseline",
      effort: "high",
      environment: { toolId: "codex" },
      input: {},
    },
    {
      ...source,
      id: "repeat",
      effort: "high",
      environment: { toolId: "codex" },
      input: {},
    },
    {
      ...source,
      id: "effort",
      effort: "max",
      environment: { toolId: "codex" },
      input: {},
    },
    {
      ...source,
      id: "tool",
      effort: "high",
      environment: { toolId: "opencode" },
      input: {},
    },
    {
      ...source,
      id: "mode",
      effort: "high",
      environment: { toolId: "codex" },
      input: { executionMode: "design-enhanced" },
    },
    {
      ...source,
      id: "unknown-tool",
      effort: "high",
      environment: {},
      input: {},
    },
    {
      ...source,
      id: "version",
      promptId: "v99",
      effort: "high",
      environment: { toolId: "codex" },
      input: {},
    },
  ];
  const groups = R.group(data, fixture);
  assert.equal(groups.length, 2);
  const model = groups.find((group) => group.promptId === source.promptId);
  assert.equal(model.conditions.length, 5);
  assert.deepEqual(Array.from(model.efforts), ["max", "high"]);
  assert.equal(
    model.conditions.find((condition) =>
      condition.runs.some((run) => run.id === "baseline"),
    ).runs.length,
    2,
  );
});

test("score ranking is independent from the model ordering", () => {
  const rated = data.runs.filter((run) => U.scoreValue(run) !== null);
  const best = rated.reduce((top, run) =>
    (run.score.total ?? -1) > (top?.score.total ?? -1) ? run : top,
  );
  const worse = rated.reduce((low, run) =>
    (run.score.total ?? 101) < (low?.score.total ?? 101) ? run : low,
  );
  assert.ok(U.compareRunsBySort(data, best, worse, "score") < 0);
  assert.ok(U.compareRunsBySort(data, worse, best, "score") > 0);
  // Equal scores and dates fall back to the run id, not to the model ordering.
  const twin = rated.find(
    (run) =>
      run.id !== best.id &&
      run.score.total === best.score.total &&
      run.date === best.date,
  );
  if (twin)
    assert.equal(
      Math.sign(U.compareRunsBySort(data, best, twin, "score")),
      Math.sign(best.id.localeCompare(twin.id, "en")),
    );
  // Records without a numeric score rank after rated records.
  const unscored = data.runs.find((run) => U.scoreValue(run) === null);
  assert.ok(unscored, "the archive keeps records without a screenshot score");
  assert.ok(U.compareRunsBySort(data, unscored, best, "score") > 0);
});

test("model groups rank by their best screenshot score", () => {
  const runs = data.runs.filter(
    (run) => run.topicId === "voxel-construction-site",
  );
  const groups = R.group(data, runs, "score");
  const bestScores = groups.map((group) =>
    group.runs.reduce((best, run) => Math.max(best, U.scoreValue(run) ?? -1), -1),
  );
  for (let i = 1; i < bestScores.length; i++)
    assert.ok(
      bestScores[i - 1] >= bestScores[i],
      "groups follow the recorded screenshot score",
    );
  const modelGroups = R.group(data, runs, "model");
  assert.deepEqual(
    modelGroups.map((group) => group.key).sort(),
    groups.map((group) => group.key).sort(),
  );
  assert.notDeepEqual(
    modelGroups.map((group) => group.key),
    groups.map((group) => group.key),
  );
});

test("latest records use recorded dates and preview links skip unavailable outputs", () => {
  const source = data.runs.find(
    (run) => run.topicId === "voxel-construction-site",
  );
  const fixture = [
    { ...source, id: "unknown", date: null, runId: "model-high-r99" },
    { ...source, id: "old", date: "2026-01-01", runId: "model-high-r01" },
    { ...source, id: "recent", date: "2026-02-01", runId: "model-high-r02" },
    {
      ...source,
      id: "no-preview",
      date: "2026-03-01",
      runId: "model-high-r03",
      preview: { ...source.preview, kind: "none" },
    },
  ];
  const [group] = R.group(data, fixture);
  assert.equal(group.latest.id, "no-preview");
  assert.equal(group.latestPreview.id, "recent");
  assert.deepEqual(
    Array.from(group.runs, (run) => run.id),
    ["no-preview", "recent", "old", "unknown"],
  );
  assert.ok(
    fixture.every(
      (run) =>
        !Object.hasOwn(run, "sourceRunId") ||
        run.sourceRunId === source.sourceRunId,
    ),
  );
});
