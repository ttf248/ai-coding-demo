import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { read } from "../scripts/lib.mjs";
const context = { URLSearchParams };
vm.runInNewContext(read("assets/core.js"), context);
vm.runInNewContext(read("assets/workspace-state.js"), context);
vm.runInNewContext(read("assets/compare-records.js"), context);
const { homeFromURL, compareFromURL } = context.ArchiveState;
const runs = [
  {
    id: "a",
    runId: "alpha-high-r01",
    modelId: "alpha",
    effort: "high",
    topicId: "topic",
    promptId: "v1",
  },
];
test("URL decoding preserves shared links and rejects unsupported view values", () => {
  const home = homeFromURL(
    "?q=%E6%A8%A1%E5%9E%8B&testing=invalid&view=bad&sort=latest&group=runs",
  );
  assert.equal(home.q, "模型");
  assert.equal(home.testing, "active");
  assert.equal(home.view, "compact");
  assert.equal(home.sort, "");
  const state = compareFromURL(
    "?left=a&leftModel=wrong&leftEffort=max&rightModel=beta&rightEffort=low&tab=info&layout=quad&differencesOnly=1",
    { runs },
  );
  assert.equal(state.left, "a");
  assert.equal(state.leftModel, "alpha");
  assert.equal(state.leftEffort, "high");
  assert.equal(state.rightModel, "beta");
  assert.equal(state.rightEffort, "low");
  assert.equal(state.group, "topic/v1");
  assert.equal(state.tab, "conditions");
  assert.equal(state.layout, "quad");
  assert.equal(state.differencesOnly, true);
  const captures = compareFromURL(
    "?left=a&leftCapture=mobile-initial&rightCapture=../../bad&thirdCapture=desktop-result",
    { runs },
  );
  assert.equal(captures.leftCapture, "mobile-initial");
  assert.equal(captures.rightCapture, "");
  assert.equal(captures.thirdCapture, "desktop-result");
  assert.equal(
    compareFromURL(
      "?left=missing&leftModel=alpha&leftEffort=high&group=other/v2",
      { runs },
    ).left,
    "missing",
  );
});
test("conditions share filtering, escape evidence and handle empty or invalid selections", () => {
  const render = context.ArchiveCompareRecords.conditions;
  const base = {
    columns: ["left", "right"],
    selected: [runs[0], runs[0]],
    labels: { left: "A", right: "B" },
    data: { models: [{ id: "alpha", label: "Alpha" }] },
    differencesOnly: true,
  };
  const output = render({
    ...base,
    fields: [
      ["模型", () => "same"],
      ["评分依据", (run) => "<script>unsafe</script>"],
    ],
  });
  assert.doesNotMatch(output.table, /<script>/);
  assert.doesNotMatch(output.mobile, /<h3>模型<\/h3>/);
  const escaped = render({
    ...base,
    differencesOnly: false,
    fields: [["评分依据", () => "<script>unsafe</script>"]],
  });
  assert.match(escaped.table, /&lt;script&gt;/);
  assert.match(escaped.mobile, /&lt;script&gt;/);
  assert.match(
    render({
      ...base,
      selected: [null, null],
      fields: [["模型", () => "alpha"]],
    }).table,
    /实验不存在/,
  );
  assert.match(
    render({ ...base, columns: [], selected: [], fields: [] }).mobile,
    /请选择实验/,
  );
});
