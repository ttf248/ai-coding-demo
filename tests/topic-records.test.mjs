import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { read, loadCatalog } from "../scripts/lib.mjs";

const data = loadCatalog();
const context = {};
vm.runInNewContext(read("assets/core.js"), context);
vm.runInNewContext(read("assets/topic-records.js"), context);
const R = context.ArchiveTopicRecords;

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
