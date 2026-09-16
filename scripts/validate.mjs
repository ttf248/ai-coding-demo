import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import {
  ROOT,
  read,
  readJSON,
  resolveLocal,
  loadCatalog,
  generatedFiles,
  sourceHash,
  treeHash,
} from "./lib.mjs";
const errors = [];
const check = (ok, message) => {
  if (!ok) errors.push(message);
};
const exists = (p) => {
  try {
    resolveLocal(p);
    let current = ROOT;
    for (const part of p.split("/")) {
      if (!fs.readdirSync(current).includes(part)) return false;
      current = path.join(current, part);
    }
    return fs.statSync(current).isFile();
  } catch {
    return false;
  }
};
const unique = (list, label) =>
  check(new Set(list).size === list.length, `Duplicate ${label}`);
const ajv = new Ajv({ allErrors: true });
const schema = readJSON("catalog/schema.json");
const schemas = Object.fromEntries(
  ["topic", "prompt", "run"].map((k) => [
    k,
    ajv.compile({ ...schema, $ref: `#/$defs/${k}` }),
  ]),
);
const catalog = loadCatalog();
for (const [kind, list] of [
  ["topic", catalog.topics],
  ["prompt", catalog.prompts],
  ["run", catalog.runs],
]) {
  for (const item of list) {
    const file = `${item.directory}/${kind}.json`;
    const valid = schemas[kind](readJSON(file));
    check(valid, `${file}: ${ajv.errorsText(schemas[kind].errors)}`);
  }
  unique(
    list.map((v) => (kind === "prompt" ? `${v.topicId}/${v.id}` : v.id)),
    `${kind} ID`,
  );
}
for (const key of ["models", "categories"]) {
  unique(
    catalog[key].map((v) => v.id),
    key,
  );
  for (const v of catalog[key])
    check(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.id) &&
        typeof v.label === "string" &&
        v.label.length > 0,
      `Invalid ${key} entry`,
    );
}
for (const t of catalog.topics) {
  check(t.directory === `demos/${t.id}`, `Topic directory mismatch ${t.id}`);
  check(
    catalog.categories.some((c) => c.id === t.category),
    `Unknown category ${t.id}`,
  );
}
for (const p of catalog.prompts) {
  check(
    p.directory === `demos/${p.topicId}/prompts/${p.id}`,
    `Prompt directory mismatch ${p.id}`,
  );
  check(!!p.text.trim(), `Empty task ${p.id}`);
  check(
    p.hash === readJSON(`${p.directory}/prompt.json`).hash,
    `Task input changed: ${p.topicId}/${p.id}; create a new prompt version.`,
  );
  check(exists(p.source), `Missing prompt source ${p.source}`);
  check(
    !p.previousId ||
      catalog.prompts.some(
        (v) =>
          v.topicId === p.topicId && v.id === p.previousId && v.id !== p.id,
      ),
    `Invalid previous prompt ${p.id}`,
  );
  let current = p,
    seen = new Set();
  while (current?.previousId) {
    const key = `${current.topicId}/${current.id}`;
    if (seen.has(key)) {
      check(false, `Prompt cycle ${key}`);
      break;
    }
    seen.add(key);
    current = catalog.prompts.find(
      (v) => v.topicId === p.topicId && v.id === current.previousId,
    );
  }
}
for (const r of catalog.runs) {
  check(
    r.id === `${r.topicId}--${r.runId}` &&
      r.directory === `demos/${r.topicId}/runs/${r.runId}`,
    `Run directory mismatch ${r.id}`,
  );
  check(
    catalog.models.some((m) => m.id === r.modelId),
    `Unknown model ${r.id}`,
  );
  check(
    catalog.prompts.some((p) => p.topicId === r.topicId && p.id === r.promptId),
    `Unknown prompt ${r.id}`,
  );
  check(
    r.rawHash === r.input.hash,
    `Original input changed: ${r.id}. Preserve history; create a new run for changed input.`,
  );
  check(exists(r.document), `Missing Readme ${r.id}`);
  if (r.date) {
    const [year, month = 1, day = 1] = r.date.split("-").map(Number);
    const d = new Date(Date.UTC(year, month - 1, day));
    check(
      d.getUTCFullYear() === year &&
        d.getUTCMonth() === month - 1 &&
        d.getUTCDate() === day,
      `Invalid date ${r.id}`,
    );
  }
  unique(
    r.preview.pages.map((p) => p.id),
    `page IDs ${r.id}`,
  );
  const local = ["static", "build"].includes(r.preview.kind);
  check(
    local
      ? r.preview.pages.length > 0 &&
          r.preview.pages.some((p) => p.id === r.preview.defaultPage)
      : !r.preview.pages.length && r.preview.defaultPage === null,
    `Invalid default page ${r.id}`,
  );
  for (const p of r.preview.pages)
    check(exists(p.href), `Missing preview ${p.href}`);
  check(
    r.preview.kind === "external"
      ? /^https:\/\//.test(r.preview.externalUrl || "")
      : r.preview.externalUrl === null,
    `Invalid external URL ${r.id}`,
  );
  check(
    r.preview.kind !== "none" || !r.preview.embed,
    `Non-preview cannot embed ${r.id}`,
  );
  if (r.preview.kind === "build") {
    check(!!r.build, `Missing build settings ${r.id}`);
    check(
      exists(`${r.directory}/package-lock.json`),
      `Missing lockfile ${r.id}`,
    );
    const dir = `previews/${r.topicId}/${r.runId}`;
    try {
      const info = readJSON(`${dir}/build-info.json`);
      check(
        info.runId === r.id && info.sourceHash === sourceHash(r),
        `Stale source build: ${r.id}`,
      );
      check(
        info.outputHash === treeHash(dir),
        `Modified preview output: ${r.id}`,
      );
    } catch (e) {
      check(false, `Missing/invalid build fingerprint: ${r.id}: ${e.message}`);
    }
  } else check(r.build === null, `Unexpected build settings ${r.id}`);
}
unique(
  catalog.guides.map((g) => g.slug),
  "guide slugs",
);
for (const g of catalog.guides) {
  check(
    typeof g.title === "string" &&
      !!g.title &&
      typeof g.type === "string" &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.slug),
    `Invalid guide metadata ${g.slug}`,
  );
  check(exists(g.document), `Missing guide ${g.document}`);
  check(exists(g.example), `Missing example ${g.example}`);
}
for (const [file, content] of generatedFiles(catalog))
  check(
    exists(file) && read(file) === content,
    `Stale generated file ${file}; run npm run generate`,
  );
// Check maintained Markdown links, not historical prose/code samples.
const generated = generatedFiles(catalog);
for (const [file, content] of generated) {
  if (!file.endsWith(".md")) continue;
  const current =
    file === "Readme.md" || file.split("/").length === 3
      ? content
      : content.split("<!-- archive:start -->")[1];
  for (const match of current.matchAll(/\]\(([^\s)]+)\)/g)) {
    const href = match[1];
    if (/^(?:https?:|#)/.test(href)) continue;
    const target = path.posix.normalize(
      path.posix.join(path.posix.dirname(file), href.split(/[?#]/)[0]),
    );
    check(exists(target), `Broken maintained link in ${file}: ${href}`);
  }
}
// Catch missing static assets (including template favicon references) before publishing.
for (const file of [
  "index.html",
  "topic.html",
  "compare.html",
  ...catalog.runs
    .filter((r) => r.preview.kind === "build")
    .flatMap((r) => r.preview.pages.map((p) => p.href)),
]) {
  if (!exists(file)) continue;
  for (const match of read(file).matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|data:|#)/.test(href)) continue;
    const target = path.posix.normalize(
      path.posix.join(path.posix.dirname(file), href.split(/[?#]/)[0]),
    );
    check(
      !href.startsWith("/") && exists(target),
      `Missing/non-portable HTML target ${file}: ${href}`,
    );
  }
}
for (const m of readJSON("catalog/migration-v2.json").records)
  check(
    !fs.existsSync(resolveLocal(m.oldPath)),
    `Old directory remains: ${m.oldPath}`,
  );
for (const file of [
  "index.html",
  "topic.html",
  "compare.html",
  "404.html",
  "assets/site.css",
  "assets/core.js",
  "index.js",
  "assets/topic.js",
  "assets/compare.js",
])
  check(exists(file), `Missing site file ${file}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Valid: ${catalog.topics.length} topics, ${catalog.runs.length} runs, ${catalog.guides.length} guides; committed site is current.`,
  );
