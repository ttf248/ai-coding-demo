import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import Ajv from "ajv";
import {
  read,
  readJSON,
  loadCatalog,
  generatedFiles,
  hash,
  resolveLocal,
  sourceHash,
  treeHash,
} from "../scripts/lib.mjs";
const all = loadCatalog(),
  migrationIds = new Set(
    readJSON("catalog/migration-v2.json").records.map((r) => r.id),
  );
const data = { ...all, runs: all.runs.filter((r) => migrationIds.has(r.id)) };
const ctx = {};
vm.runInNewContext(read("assets/core.js"), ctx);
const U = ctx.ArchiveUI;
test("archive migration preserves record counts and task relations", () => {
  assert.ok(data.topics.length >= 8);
  assert.equal(data.runs.length, 15);
  assert.ok(data.guides.length >= 14);
  for (const r of data.runs) assert.equal(r.rawHash, r.input.hash);
  const city = data.runs.filter((r) => r.topicId === "neo-gothic-tower-city");
  assert.match(U.relation(data, ...city.slice(0, 2)), /原始输入一致/);
  const voxel = data.runs.filter(
    (r) => r.topicId === "voxel-construction-site",
  );
  assert.match(U.relation(data, ...voxel.slice(0, 2)), /任务正文一致/);
  assert.match(U.relation(data, city[0], voxel[0]), /跨主题/);
  const unknown = { ...city[0], input: { completeness: "unknown" } };
  assert.match(U.relation(data, unknown, city[1]), /信息不足/);
});
test("combined filters operate on runs before topic grouping", () => {
  assert.equal(U.filterRuns(data, { model: "gpt-6-astra" }).length, 2);
  assert.equal(
    U.filterRuns(data, { q: "ASTRA", type: "single-html", preview: "yes" })
      .length,
    2,
  );
  assert.equal(
    U.filterRuns(data, { q: "astra", category: "prompt" }).length,
    0,
  );
  assert.equal(U.filterRuns(data, { preview: "no" }).length, 2);
  assert.equal(
    U.filterRuns(data, { prompt: "voxel-construction-site/v1" }).length,
    4,
  );
});
test("diff preserves and escapes input, handles insertion/deletion/large inputs", () => {
  assert.match(U.diff("模型 low", "模型 high").left, /<del>low<\/del>/);
  assert.match(U.diff("模型 low", "模型 high").right, /<ins>high<\/ins>/);
  assert.equal(U.diff("<script>", "<script>").left, "&lt;script&gt;");
  assert.match(U.diff("", "新").right, /<ins>新<\/ins>/);
  const large = "中文".repeat(2000);
  assert.equal(U.diff(large, large).left.replace(/<\/?del>/g, ""), large);
});
test("generation is deterministic and current", () => {
  const a = generatedFiles(all),
    b = generatedFiles(loadCatalog());
  assert.deepEqual([...a], [...b]);
  for (const [file, content] of a) assert.equal(read(file), content, file);
});
test("paths cannot escape workspace and exact input normalization is narrow", () => {
  for (const p of ["../x", "/tmp/file", "a/../../x", "a\\b"])
    assert.throws(() => resolveLocal(p));
  assert.equal(hash("\uFEFFa\r\nb"), hash("a\nb"));
  assert.notEqual(hash("a b"), hash("ab"));
});
test("schema rejects unknown fields, unsafe paths and invalid preview kind", () => {
  const schema = readJSON("catalog/schema.json"),
    validate = new Ajv({ strict: true }).compile({
      ...schema,
      $ref: "#/$defs/run",
    });
  const run = readJSON(`${data.runs[0].directory}/run.json`);
  assert.ok(validate(run));
  assert.equal(validate({ ...run, typo: true }), false);
  assert.equal(
    validate({ ...run, preview: { ...run.preview, kind: "magic" } }),
    false,
  );
  assert.equal(
    validate({ ...run, input: { ...run.input, file: "../prompt.md" } }),
    false,
  );
});
test("built previews match source and output fingerprints", () => {
  for (const r of data.runs.filter((r) => r.preview.kind === "build")) {
    const directory = `previews/${r.topicId}/${r.runId}`,
      info = readJSON(`${directory}/build-info.json`);
    assert.equal(info.sourceHash, sourceHash(r), r.id);
    assert.equal(info.outputHash, treeHash(directory), r.id);
  }
});
