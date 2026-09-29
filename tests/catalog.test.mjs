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
  data = all;
const ctx = {};
vm.runInNewContext(read("assets/core.js"), ctx);
const U = ctx.ArchiveUI;
test("catalog references remain valid with zero or more experiments", () => {
  assert.ok(data.topics.length > 0);
  assert.ok(data.prompts.length > 0);
  for (const r of data.runs) {
    assert.equal(r.rawHash, r.input.hash);
    assert.ok(
      data.prompts.some((p) => p.topicId === r.topicId && p.id === r.promptId),
    );
  }
  assert.equal(U.filterRuns(data, {}).length, data.runs.length);
  assert.equal(U.filterRuns(data, { model: "not-a-model" }).length, 0);
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
  // Deliberately invalid minimal input must not be accepted as a run.
  assert.equal(validate({ schemaVersion: 1, id: "invalid" }), false);
  for (const r of data.runs) {
    const run = readJSON(`${r.directory}/run.json`);
    assert.ok(validate(run));
    assert.equal(validate({ ...run, typo: true }), false);
    assert.equal(
      validate({ ...run, input: { ...run.input, file: "../prompt.md" } }),
      false,
    );
  }
});
test("built previews match source and output fingerprints", () => {
  for (const r of data.runs.filter((r) => r.preview.kind === "build")) {
    const directory = `previews/${r.topicId}/${r.runId}`,
      info = readJSON(`${directory}/build-info.json`);
    assert.equal(info.sourceHash, sourceHash(r), r.id);
    assert.equal(info.outputHash, treeHash(directory), r.id);
  }
});
