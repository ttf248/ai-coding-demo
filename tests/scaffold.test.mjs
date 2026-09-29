import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ROOT } from "../scripts/lib.mjs";

test("new demo scaffolding reuses prompts, allocates repeat runs and refuses unknown models", () => {
  const temporary = fs.mkdtempSync(
    path.join(os.tmpdir(), "ai-archive-scaffold-"),
  );
  const write = (p, value) => {
    const file = path.join(temporary, p);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, value);
  };
  try {
    for (const name of ["lib.mjs", "new-demo.mjs"])
      write(
        "scripts/" + name,
        fs.readFileSync(path.join(ROOT, "scripts", name)),
      );
    fs.mkdirSync(path.join(temporary, "demos"));
    write("catalog/models.json", '[{"id":"unknown","label":"未记录"}]');
    write("catalog/categories.json", "[]");
    write("catalog/guides.json", "[]");
    const command = (args) =>
      execFileSync(
        process.execPath,
        [
          path.join(temporary, "scripts/new-demo.mjs"),
          "--topic",
          "sample",
          "--title",
          "Example",
          "--type",
          "prompt",
          ...args,
        ],
        { cwd: temporary, stdio: "pipe" },
      );
    command([]);
    command(["--prompt", "v1"]);
    const base = path.join(temporary, "demos/sample");
    assert.deepEqual(fs.readdirSync(path.join(base, "runs")), [
      "unknown-unknown-r01",
      "unknown-unknown-r02",
    ]);
    assert.deepEqual(fs.readdirSync(path.join(base, "prompts")), ["v1"]);
    const second = JSON.parse(
      fs.readFileSync(
        path.join(base, "runs/unknown-unknown-r02/run.json"),
        "utf8",
      ),
    );
    assert.equal(second.promptId, "v1");
    assert.equal(second.preview.kind, "none");
    assert.equal(second.status, "draft");
    assert.throws(() => command(["--model", "not-registered"]));
    assert.equal(fs.readdirSync(path.join(base, "runs")).length, 2);
  } finally {
    // Verify the exact temporary root before recursive cleanup.
    if (
      path.dirname(temporary) !== path.resolve(os.tmpdir()) ||
      !path.basename(temporary).startsWith("ai-archive-scaffold-")
    )
      throw Error("Unsafe test cleanup path");
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
