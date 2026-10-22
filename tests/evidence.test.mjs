import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import Ajv from "ajv";
const context = {};
context.window = context;
for (const file of ["core", "evidence"])
  vm.runInNewContext(fs.readFileSync(`assets/${file}.js`, "utf8"), context);
const E = context.ArchiveEvidence;
test("evidence differences require same task and scoring definition and never rank insufficient records", () => {
  const a = {
    id: "a",
    topicId: "t",
    promptId: "v1",
    score: {
      status: "rated",
      total: 80,
      rubricVersion: 3,
      criteriaHash: "x",
      rubricHash: "rule",
    },
  };
  const b = { ...a, id: "b", score: { ...a.score } };
  const data = { prompts: [{ topicId: "t", id: "v1", hash: "task" }] };
  assert.equal(E.comparable(data, a, b), true);
  assert.equal(E.comparable(data, a, a), false);
  for (const score of [
    { ...b.score, status: "insufficient" },
    { ...b.score, criteriaHash: "y" },
    { ...b.score, rubricVersion: 2 },
  ])
    assert.equal(E.comparable(data, a, { ...b, score }), false);
  assert.equal(E.comparable(data, a, { ...b, promptId: "v2" }), false);
  assert.match(E.verification(a), /未登记/);
});
test("functional verification requires evidence for any tested result and an explicit unverified scope", () => {
  const schema = JSON.parse(fs.readFileSync("catalog/schema.json", "utf8"));
  const validate = new Ajv().compile({
    ...schema,
    $ref: "#/$defs/run/properties/verification",
  });
  const v = {
    reviewedAt: "2026-10-22",
    environment: "本地 Chromium",
    unverified: "其他交互未验证",
    checks: [{ label: "求解器", status: "passed" }],
  };
  assert.equal(validate(v), false);
  v.checks[0].evidence = "docs/maintenance.md";
  assert.equal(validate(v), true);
  v.checks[0].evidence = "javascript:alert(1)";
  assert.equal(validate(v), false);
  delete v.checks[0].evidence;
  v.checks[0].status = "untested";
  assert.equal(validate(v), true);
  assert.match(
    E.verification({ verification: { ...v, environment: "<script>" } }),
    /&lt;script&gt;/,
  );
});
