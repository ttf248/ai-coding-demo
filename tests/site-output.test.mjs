import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import Ajv from "ajv";
import {
  loadCatalog,
  read,
  readJSON,
  hash,
  billingDescription,
  resolveLocal,
} from "../scripts/lib.mjs";
import {
  browserOutputs,
  documentOutputs,
  readerPath,
} from "../scripts/site-output.mjs";
const catalog = loadCatalog(),
  outputs = browserOutputs(catalog),
  context = {};
context.window = context;
vm.runInNewContext(outputs.get("assets/generated/catalog.js"), context);
const summary = context.ARCHIVE,
  ui = {};
vm.runInNewContext(read("assets/core.js"), ui);

test("summary omits large bodies and deduplicated inputs preserve normalized text", () => {
  assert.equal(summary.runs.length, catalog.runs.length);
  for (const run of summary.runs) {
    assert.equal(run.raw, undefined);
    assert.equal(run.changes, undefined);
    assert.equal(run.billing, undefined);
    const original = catalog.runs.find((item) => item.id === run.id),
      raw = JSON.parse(outputs.get(run.rawHref));
    assert.equal(raw, original.raw);
    assert.equal(hash(raw), original.rawHash);
  }
  for (const prompt of summary.prompts) {
    assert.equal(prompt.text, undefined);
    assert.equal(hash(JSON.parse(outputs.get(prompt.textHref))), prompt.hash);
  }
  assert.equal(
    [...outputs.keys()].filter((file) => file.includes("/inputs/")).length,
    new Set(catalog.runs.map((run) => run.rawHash)).size,
  );
  assert.ok(
    // Keep the summary budget proportional to the growing archive.
    Buffer.byteLength(outputs.get("assets/generated/catalog.js")) <
      catalog.runs.length * 2200,
  );
});
test("input relationships and completeness work before lazy body loading", () => {
  const recorded = summary.runs.find(
    (run) =>
      run.input.completeness === "recorded" &&
      summary.runs.some(
        (other) =>
          other.id !== run.id &&
          other.topicId === run.topicId &&
          other.rawHash === run.rawHash,
      ),
  );
  assert.equal(
    ui.ArchiveUI.completenessLabel(recorded.input.completeness),
    "原始输入已记录",
  );
  const sibling = summary.runs.find(
    (run) =>
      run.id !== recorded.id &&
      run.topicId === recorded.topicId &&
      run.rawHash === recorded.rawHash,
  );
  assert.equal(
    ui.ArchiveUI.relation(summary, recorded, sibling),
    "已记录的原始输入一致",
  );
  assert.equal(ui.ArchiveUI.completenessLabel("partial"), "输入留存不完整");
  assert.equal(ui.ArchiveUI.completenessLabel("unknown"), "未记录");
});
test("topic details reference canonical billing batches and retain tool provenance", () => {
  for (const topic of catalog.topics)
    for (const run of JSON.parse(
      outputs.get("assets/generated/topics/" + topic.id + ".json"),
    ).runs) {
      assert.equal(run.raw, undefined);
      if (run.billing?.type === "batch") {
        assert.deepEqual(Object.keys(run.billing).sort(), ["batchId", "type"]);
        assert.ok(
          catalog.batches.some(
            (batch) => batch.batchId === run.billing.batchId,
          ),
        );
      }
      assert.equal(
        run.environment.tool,
        catalog.runs.find((item) => item.id === run.id).environment.tool,
      );
    }
  assert.equal(
    catalog.models.find((model) => model.id === "gemini-3-8-flash").provider,
    "Google",
  );
  assert.equal(
    catalog.models.find((model) => model.id === "claude-haiku-5-5").provider,
    "Anthropic",
  );
});
test("generated thumbnail dimensions and provenance match original PNGs", () => {
  for (const run of catalog.runs.filter((run) => run.screenshot)) {
    const bytes = fs.readFileSync(
      resolveLocal(run.directory + "/" + run.screenshot),
    );
    assert.equal(run.screenshotInfo.width, bytes.readUInt32BE(16));
    assert.equal(run.screenshotInfo.height, bytes.readUInt32BE(20));
    assert.equal(
      run.screenshotInfo.capturedAt,
      run.screenshotCapturedAt || null,
    );
    for (const variant of run.screenshotInfo.variants) {
      assert.ok(variant.width <= run.screenshotInfo.width);
      assert.ok(fs.existsSync(resolveLocal(variant.path)));
      assert.ok(variant.path.includes(run.screenshotInfo.hash.slice(0, 12)));
    }
  }
});
test("billing never turns missing amounts into zero or batch totals into run costs", () => {
  assert.match(
    billingDescription({
      type: "batch",
      provider: "Example",
      amount: null,
      unit: "USD",
      caseCount: null,
      batchId: "example",
    }),
    /金额未记录.*案例数未记录/,
  );
  assert.doesNotMatch(
    billingDescription({ type: "batch", amount: null, unit: "USD" }),
    /\$0\.00/,
  );
  assert.match(
    billingDescription({ type: "run", amount: 0, unit: "USD" }),
    /单次实验：\$0\.00 USD/,
  );
  assert.match(
    billingDescription({
      type: "batch",
      amount: 2,
      unit: "USD",
      sourceAmount: 7,
    }),
    /换算比例未记录/,
  );
});
test("schema accepts new archival metadata and canonical batch references", () => {
  const schema = readJSON("catalog/schema.json"),
    validate = new Ajv().compile({ ...schema, $ref: "#/$defs/run" });
  const run = readJSON(catalog.runs[0].directory + "/run.json");
  assert.ok(
    validate({
      ...run,
      archivedAt: null,
      screenshotCapturedAt: null,
      sourceRunId: null,
      environment: { ...run.environment, toolId: null },
      billing: { type: "batch", batchId: "registered-batch" },
    }),
  );
  assert.equal(validate({ ...run, archivedAt: "2026-10" }), false);
  assert.equal(
    validate({ ...run, billing: { type: "batch", batchId: "../unsafe" } }),
    false,
  );
});
test("reader escapes Markdown HTML and marks unavailable historical attachments", () => {
  const docs = documentOutputs(
    catalog,
    new Map([
      [
        "Readme.md",
        "# Example\n\n<script>alert(1)</script>\n\n[missing](nonexistent-history.zip)\n\n[guide](docs/react/Readme.md)\n\n```text\nline  \n\t \n```\n",
      ],
    ]),
  );
  const html = docs.get(readerPath("Readme.md"));
  assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
  assert.ok(html.includes("文件未留存"));
  assert.ok(html.includes("原文路径：nonexistent-history.zip"));
  assert.ok(
    html.includes("readers/docs/react/Readme.html") ||
      html.includes('href="docs/react/Readme.html"'),
  );
  assert.ok(!html.includes('href="../../../nonexistent-history.zip"'));
  assert.ok(html.includes("line&#32;&#32;\n"));
  assert.ok(html.includes("&#9;&#32;\n"));
  assert.doesNotMatch(html, /[ \t]+$/m);
});
