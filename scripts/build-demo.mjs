import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  loadCatalog,
  resolveLocal,
  sourceHash,
  treeHash,
  writeJSON,
} from "./lib.mjs";
const id = process.argv[2];
const run = loadCatalog().runs.find((r) => r.id === id);
if (!run || run.preview.kind !== "build")
  throw Error("Usage: npm run build:demo -- <build-type run ID>");
const cwd = resolveLocal(run.directory);
function npm(args) {
  const cli = process.env.npm_execpath;
  if (!cli) throw Error("Run this script through npm run build:demo.");
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd,
    stdio: "inherit",
  });
  if (result.status !== 0) throw Error(`npm ${args.join(" ")} failed`);
}
npm(["ci", "--no-audit", "--no-fund"]);
npm(run.build.command);
const output = resolveLocal(`${run.directory}/${run.build.output}`);
const targetRel = `previews/${run.topicId}/${run.runId}`;
const target = resolveLocal(targetRel);
if (
  !output.startsWith(cwd + path.sep) ||
  !target.startsWith(resolveLocal("previews") + path.sep)
)
  throw Error("Unsafe build paths");
if (!fs.existsSync(path.join(output, "index.html")))
  throw Error("Build did not produce index.html");
fs.rmSync(target, { force: true, recursive: true });
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.cpSync(output, target, { recursive: true });
writeJSON(`${targetRel}/build-info.json`, {
  schemaVersion: 1,
  runId: run.id,
  sourceHash: sourceHash(run),
  outputHash: treeHash(targetRel),
});
console.log(`Preview updated: ${targetRel}. Commit it with source changes.`);
