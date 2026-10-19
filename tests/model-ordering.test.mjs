import test from "node:test";
import assert from "node:assert/strict";
import Ajv from "ajv";
import { readJSON } from "../scripts/lib.mjs";
import {
  compareModels,
  modelResearchQueue,
  modelOrderingReport,
} from "../scripts/model-ordering.mjs";

const models = readJSON("catalog/models.json");
const fixture = (id, releaseDate, capabilityRank, generation = [1]) => ({
  id,
  provider: "Provider",
  version: [1],
  variant: "",
  ordering: { releaseDate, capabilityRank, generation },
});

test("generation precedes capability, which precedes release date across months", () => {
  const examples = [
    fixture("older-flagship", "2026-08-31", 9),
    fixture("later-small", "2026-09-29", 1),
    fixture("earlier-flagship", "2026-09-03", 3),
    fixture("new-month-small", "2026-10-01", 0),
    fixture("new-generation-small", "2026-07-01", 0, [2]),
    fixture("same-rank-later", "2026-09-22", 3),
    fixture("month-only", "2026-09", 2),
    fixture("unknown-capability", "2026-09-30", null),
    { ...fixture("unknown-release", null, 99, [99]), version: [99] },
  ];
  assert.deepEqual(
    examples.sort(compareModels).map((model) => model.id),
    [
      "new-generation-small",
      "older-flagship",
      "same-rank-later",
      "earlier-flagship",
      "month-only",
      "later-small",
      "new-month-small",
      "unknown-capability",
      "unknown-release",
    ],
  );
});

test("registered models follow curated official release evidence instead of version numbers", () => {
  const ids = (provider) =>
    models
      .filter((m) => m.provider === provider)
      .sort(compareModels)
      .map((m) => m.id);
  assert.deepEqual(ids("OpenAI"), [
    "gpt-6-astra",
    "gpt-6-1-sol",
    "gpt-6-sol",
    "gpt-6-luna",
    "gpt-5-6-sol",
    "gpt-5-6-luna",
    "gpt-6",
  ]);
  assert.deepEqual(ids("Anthropic"), [
    "claude-opus-5-5",
    "claude-sonnet-5-5",
    "claude-haiku-5-5",
    "claude-haiku-45",
    "claude-4-0",
  ]);
  assert.deepEqual(ids("Alibaba Cloud"), ["qwen3-8-max", "qwen3-8-flash"]);
  assert.deepEqual(ids("Deepseek"), [
    "deepseek-v4-1-flash-1017",
    "deepseek-v4-pro-0813",
    "deepseek-v4-1-flash-0731",
  ]);
  assert.equal([...models].sort(compareModels).at(-1).id, "unknown");
});

test("release research is cached, including unresolved identities and partial dates", () => {
  assert.deepEqual(modelResearchQueue(models).needsResearch, []);
  const unrecorded = { id: "unrecorded", provider: "Provider" };
  const cachedUnknown = models.find((m) => m.id === "gpt-6");
  const queue = modelResearchQueue([unrecorded, cachedUnknown]);
  assert.deepEqual(queue.needsResearch, ["unrecorded"]);
  assert.deepEqual(
    queue.needsConfirmation.map((item) => item.id),
    ["gpt-6"],
  );
  assert.equal(cachedUnknown.ordering.releaseDate, null);
  assert.equal(
    models.find((m) => m.id === "deepseek-v4-1-flash-0731").ordering
      .releaseDate,
    null,
  );
  assert.equal(
    models.find((m) => m.id === "minimax-m3-1-flash-preview").ordering
      .releaseDate,
    null,
  );
});

test("model ordering schema requires evidence and preserves unknowns and month precision", () => {
  const schema = readJSON("catalog/schema.json");
  const validate = new Ajv().compile({
    ...schema,
    $ref: "#/$defs/modelOrdering",
  });
  for (const model of models)
    assert.ok(
      validate(model.ordering),
      `${model.id}: ${JSON.stringify(validate.errors)}`,
    );
  const verified = models.find((m) => m.id === "gpt-6-astra").ordering;
  for (const invalid of [
    { ...verified, sources: [] },
    { ...verified, releaseDate: null },
    { ...verified, releaseDate: "2026-13-01" },
    { ...verified, capabilityRank: -1 },
    { ...verified, generation: [] },
    { ...verified, generation: [-1] },
    { ...verified, generation: undefined },
    { ...verified, checkedAt: null },
    { ...verified, status: "unresolved" },
    { ...verified, invented: true },
  ])
    assert.equal(validate(invalid), false);
  const unresolved = models.find((m) => m.id === "gpt-6").ordering;
  assert.equal(validate({ ...unresolved, generation: [6] }), false);
});

test("review report uses the shared UI ordering and includes every recorded source", () => {
  const report = modelOrderingReport(models);
  assert.ok(
    report.indexOf("| 1 | Claude Opus 5.5 |") <
      report.indexOf("| 2 | Claude Sonnet 5.5 |"),
  );
  assert.ok(
    report.indexOf("| 2 | Claude Sonnet 5.5 |") <
      report.indexOf("| 3 | Claude Haiku 5.5 |"),
  );
  for (const model of models) {
    assert.ok(report.includes(`\`${model.id}\``), model.id);
    for (const source of model.ordering.sources)
      assert.ok(report.includes(source));
  }
  assert.equal(report, modelOrderingReport(models));
});
