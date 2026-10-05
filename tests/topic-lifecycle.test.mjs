import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { ROOT } from "../scripts/lib.mjs";
import { updateTestingStatus } from "../scripts/topic-lifecycle.mjs";

function fixture() {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "ai-topic-lifecycle-"),
  );
  const write = (name, value) => {
    const file = path.join(directory, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, value);
  };
  for (const name of [
    "lib.mjs",
    "new-demo.mjs",
    "topic-status.mjs",
    "topic-lifecycle.mjs",
    "serve.mjs",
  ])
    write("scripts/" + name, fs.readFileSync(path.join(ROOT, "scripts", name)));
  fs.mkdirSync(path.join(directory, "demos"));
  write("catalog/models.json", '[{"id":"unknown","label":"Unknown"}]');
  write("catalog/categories.json", "[]");
  write("catalog/guides.json", "[]");
  write(
    "Readme.md",
    "Human timeline\n<!-- catalog:start -->\n<!-- catalog:end -->\n",
  );
  const run = (script, args) =>
    execFileSync(
      process.execPath,
      [path.join(directory, "scripts", script), ...args],
      { cwd: directory, stdio: "pipe" },
    ).toString();
  const scaffold = (extra = []) =>
    run("new-demo.mjs", [
      "--topic",
      "sample",
      "--title",
      "Example",
      "--type",
      "prompt",
      ...extra,
    ]);
  scaffold();
  write(
    "demos/sample/runs/unknown-unknown-r01/index.html",
    "<!doctype html><p>Historical preview</p>",
  );
  return {
    directory,
    run,
    scaffold,
    read: (name) => fs.readFileSync(path.join(directory, name), "utf8"),
    clean: () => {
      if (
        path.dirname(directory) !== path.resolve(os.tmpdir()) ||
        !path.basename(directory).startsWith("ai-topic-lifecycle-")
      )
        throw Error("Unsafe fixture cleanup");
      fs.rmSync(directory, { recursive: true, force: true });
    },
  };
}

test("testing lifecycle requires a reason, preserves history and does not mutate its input", () => {
  const original = { id: "sample" };
  assert.throws(() => updateTestingStatus(original, "archived", ""));
  assert.throws(() =>
    updateTestingStatus(original, "archived", "Reason", "2026-02-30"),
  );
  const archived = updateTestingStatus(
    original,
    "archived",
    "Stop rerunning",
    "2026-10-05",
  );
  assert.equal(original.testingStatus, undefined);
  assert.equal(updateTestingStatus(archived, "archived", "Reason"), archived);
  const restored = updateTestingStatus(
    archived,
    "active",
    "Resume",
    "2026-10-06",
  );
  assert.deepEqual(
    restored.testingHistory.map((v) => v.status),
    ["archived", "active"],
  );
});

test("CLI archive skips future runs, preserves inputs and previews, and supports restoration", () => {
  const f = fixture();
  try {
    const preserved = ["Readme.md", "prompt.md", "index.html"].map((name) => [
      "demos/sample/runs/unknown-unknown-r01/" + name,
      f.read("demos/sample/runs/unknown-unknown-r01/" + name),
    ]);
    f.run("topic-status.mjs", [
      "archive",
      "--topic",
      "sample",
      "--reason",
      "Stop future testing",
    ]);
    assert.deepEqual(
      JSON.parse(f.run("topic-status.mjs", ["list", "--json"])),
      [],
    );
    assert.deepEqual(
      JSON.parse(f.run("topic-status.mjs", ["list", "--all", "--json"])),
      ["sample"],
    );
    assert.match(
      f.read("assets/generated/catalog.js"),
      /"testingStatus":"archived"/,
    );
    assert.match(f.read("Readme.md"), /^Human timeline/);
    assert.throws(() => f.scaffold(["--prompt", "v1"]));
    for (const [file, content] of preserved.filter(
      ([file]) => !file.endsWith("Readme.md"),
    ))
      assert.equal(f.read(file), content);
    assert.ok(f.read(preserved[0][0]).startsWith(preserved[0][1].trimEnd()));
    f.scaffold(["--prompt", "v1", "--allow-archived"]);
    assert.equal(
      JSON.parse(f.read("demos/sample/topic.json")).testingStatus,
      "archived",
    );
    assert.equal(
      JSON.parse(f.read("demos/sample/runs/unknown-unknown-r02/run.json"))
        .changes.length,
      1,
    );
    f.run("topic-status.mjs", [
      "restore",
      "--topic",
      "sample",
      "--reason",
      "Resume testing",
    ]);
    assert.deepEqual(
      JSON.parse(f.run("topic-status.mjs", ["list", "--json"])),
      ["sample"],
    );
    assert.equal(
      JSON.parse(f.read("demos/sample/topic.json")).testingHistory.length,
      2,
    );
    f.scaffold(["--prompt", "v1"]);
  } finally {
    f.clean();
  }
});

test("local preview persists topic state and rejects cross-origin writes", async () => {
  const f = fixture();
  const child = spawn(
    process.execPath,
    [path.join(f.directory, "scripts/serve.mjs")],
    {
      cwd: f.directory,
      env: { ...process.env, PORT: "0", SITE_BASE: "/archive-test/" },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  const exited = new Promise((resolve) => child.once("exit", resolve));
  try {
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(Error("Preview startup timed out")),
        10000,
      );
      child.stdout.on("data", (data) => {
        const match = data.toString().match(/Archive: (http:\/\/[^\s]+)/);
        if (match) {
          clearTimeout(timer);
          resolve(match[1]);
        }
      });
      child.once("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
    assert.equal(
      (await (await fetch(url + "__archive/capabilities")).json()).editable,
      true,
    );
    const request = (origin) =>
      fetch(url + "__archive/topics/sample", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: origin },
        body: JSON.stringify({
          status: "archived",
          reason: "Local preview archive",
        }),
      });
    assert.equal((await request("https://unrelated.example")).status, 403);
    assert.equal(
      JSON.parse(f.read("demos/sample/topic.json")).testingStatus,
      undefined,
    );
    assert.equal((await request(new URL(url).origin)).status, 200);
    assert.equal(
      JSON.parse(f.read("demos/sample/topic.json")).testingStatus,
      "archived",
    );
    assert.match(
      await (await fetch(url + "assets/generated/catalog.js")).text(),
      /"testingStatus":"archived"/,
    );
    assert.equal(
      (await fetch(url + "demos/sample/runs/unknown-unknown-r01/index.html"))
        .status,
      200,
    );
  } finally {
    child.kill();
    await exited;
    f.clean();
  }
});
