import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CSS_BASELINE, cssReport, parseCss } from "../scripts/css-structure.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "assets/site.css",
  "assets/polish.css",
  "assets/home.css",
  "assets/topic.css",
  "assets/compare.css",
  "assets/document.css",
  "assets/guide.css",
  "assets/topic-lifecycle.css",
].map((file) => path.join(root, file));

test("css duplication stays within the recorded baseline", () => {
  const report = cssReport(files);
  assert.ok(
    report.acrossFilesCount <= CSS_BASELINE.acrossFiles,
    `cross-file duplication grew to ${report.acrossFilesCount}`,
  );
  assert.ok(
    report.repeatedCount <= CSS_BASELINE.repeated,
    `in-file repetition grew to ${report.repeatedCount}`,
  );
});

test("css parser keeps selectors, media queries and declarations apart", () => {
  const rules = parseCss(
    "@media (max-width: 700px){.a{color:red}.b{color:blue}}.c{color:green}",
  );
  assert.equal(rules.length, 3);
  assert.equal(rules[0].selector, ".a");
  assert.equal(rules[0].media, "@media (max-width: 700px)");
  assert.equal(rules[1].media, "@media (max-width: 700px)");
  assert.equal(rules[2].selector, ".c");
  assert.equal(rules[2].media, "");
  assert.ok(rules[2].declarations.includes("color:green"));
});

test("every stylesheet referenced by the report exists", () => {
  for (const file of files) assert.ok(fs.existsSync(file));
});

test("only identical repeated declarations count as duplication", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "css-structure-"));
  const file = path.join(dir, "sample.css");
  fs.writeFileSync(
    file,
    [
      ".a {",
      "  color: red;",
      "  margin: 0;",
      "}",
      ".a {",
      "  color: red;",
      "  margin: 4px;",
      "}",
    ].join("\n"),
  );
  const report = cssReport([file]);
  // color:red 出现两次且取值相同，算重复；margin 取值不同，属于渐进覆盖，不算。
  assert.equal(report.repeatedCount, 1);
  assert.equal(report.repeated[0].selector, ".a");
  assert.equal(report.repeated[0].media, "");
  assert.equal(report.repeated[0].property, "color");
  assert.equal(report.repeated[0].value, "red");
  fs.rmSync(dir, { recursive: true, force: true });
});
