import fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import { isDeepStrictEqual } from "node:util";
import { siteResourceOutputs } from "./site-assets.mjs";
import { rubricErrors, scoreErrors } from "./scoring.mjs";
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
  ["topic", "prompt", "run", "modelOrdering"].map((k) => [
    k,
    ajv.compile({ ...schema, $ref: `#/$defs/${k}` }),
  ]),
);
const catalog = loadCatalog();
const scoringRubric = readJSON("catalog/scoring-rubric.json");
errors.push(...rubricErrors(scoringRubric, catalog, schema));
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
for (const model of catalog.models) {
  check(
    schemas.modelOrdering(model.ordering),
    `Invalid model ordering metadata: ${model.id}; run npm run models:pending: ${ajv.errorsText(schemas.modelOrdering.errors)}`,
  );
  check(
    (model.ordering?.status === "not-applicable") === (model.id === "unknown"),
    `Only the unknown model may omit release research: ${model.id}`,
  );
  check(
    (model.id === "unknown"
      ? model.provider === null
      : typeof model.provider === "string" && model.provider.length > 0) &&
      Array.isArray(model.version) &&
      (model.id === "unknown"
        ? model.version.length === 0
        : model.version.length > 0) &&
      model.version.every((part) => Number.isInteger(part) && part >= 0) &&
      typeof model.variant === "string",
    `Invalid model display metadata: ${model.id}`,
  );
}
unique(
  catalog.tools.map((tool) => tool.id),
  "tool IDs",
);
unique(
  catalog.tools.flatMap((tool) => tool.aliases),
  "tool aliases",
);
for (const tool of catalog.tools)
  check(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.id) &&
      !!tool.label &&
      Array.isArray(tool.aliases) &&
      tool.aliases.every((alias) => typeof alias === "string" && !!alias),
    `Invalid tool ${tool.id}`,
  );
unique(
  catalog.batches.map((batch) => batch.batchId),
  "billing batches",
);
const billingSchema = ajv.compile({ ...schema, $ref: "#/$defs/billing" });
for (const batch of catalog.batches)
  check(
    billingSchema({ type: "batch", ...batch }),
    `Invalid billing batch ${batch.batchId}: ${ajv.errorsText(billingSchema.errors)}`,
  );
for (const t of catalog.topics) {
  if (t.testingStatus === "archived")
    check(
      t.testingHistory?.length > 0,
      `Archived topic requires history ${t.id}`,
    );
  if (t.testingHistory?.length) {
    check(
      t.testingHistory.at(-1).status === (t.testingStatus || "active"),
      `Testing history status mismatch ${t.id}`,
    );
    for (const entry of t.testingHistory)
      check(
        !Number.isNaN(Date.parse(entry.date)) &&
          new Date(entry.date).toISOString().slice(0, 10) === entry.date,
        `Invalid testing history date ${t.id}`,
      );
  }
  check(t.directory === `demos/${t.id}`, `Topic directory mismatch ${t.id}`);
  if (t.thumbnail) {
    check(exists(t.thumbnail.path), `Missing topic thumbnail ${t.id}`);
    check(
      catalog.runs.some(
        (r) => r.id === t.thumbnail.sourceRunId && r.topicId === t.id,
      ),
      `Invalid topic thumbnail source ${t.id}`,
    );
  }
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
  if (r.environment.toolId)
    check(
      catalog.tools.some((tool) => tool.id === r.environment.toolId),
      `Unknown tool ${r.id}`,
    );
  for (const field of ["archivedAt", "screenshotCapturedAt"])
    if (r[field])
      check(
        !Number.isNaN(Date.parse(r[field])) &&
          new Date(r[field]).toISOString().slice(0, 10) === r[field],
        `Invalid ${field}: ${r.id}`,
      );
  if (r.sourceRunId) {
    check(
      r.sourceRunId !== r.id &&
        catalog.runs.some((run) => run.id === r.sourceRunId),
      `Invalid source run ${r.id}`,
    );
    let current = r,
      seen = new Set();
    while (current?.sourceRunId) {
      if (seen.has(current.id)) {
        check(false, `Source run cycle ${r.id}`);
        break;
      }
      seen.add(current.id);
      current = catalog.runs.find((run) => run.id === current.sourceRunId);
    }
  }
  if (r.billing?.type === "batch") {
    const batch = catalog.batches.find(
      (batch) => batch.batchId === r.billing.batchId,
    );
    check(!!batch, `Unknown billing batch ${r.id}`);
    check(
      isDeepStrictEqual(r.billing, { type: "batch", ...batch }),
      `Billing batch snapshot differs from dictionary ${r.id}`,
    );
  }
  for (const variant of r.screenshotInfo?.variants || [])
    check(
      exists(variant.path),
      `Missing generated thumbnail ${r.id}: ${variant.path}`,
    );
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
  if (r.screenshot)
    check(
      exists(`${r.directory}/${r.screenshot}`),
      `Missing run screenshot ${r.id}`,
    );
  const score = r.score || {};
  errors.push(...scoreErrors(r, scoringRubric));
  if (score.assessedAt) {
    const d = new Date(`${score.assessedAt}T00:00:00Z`);
    check(
      !Number.isNaN(d.valueOf()) &&
        d.toISOString().slice(0, 10) === score.assessedAt,
      `Invalid score assessment date ${r.id}`,
    );
  }
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
    g.status === "ready" && ["offline", "required"].includes(g.network),
    `Invalid guide status/network ${g.slug}`,
  );
  check(
    typeof g.title === "string" &&
      !!g.title &&
      typeof g.type === "string" &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.slug),
    `Invalid guide metadata ${g.slug}`,
  );
  check(exists(g.document), `Missing guide ${g.document}`);
  check(exists(g.example), `Missing example ${g.example}`);
  if (exists(g.example))
    check(
      !/\$dir|\$\{dir\^\}|cdn\.tailwindcss\.com|unpkg\.com|type="text\/babel"/.test(
        read(g.example),
      ),
      `Guide still contains placeholder/remote runtime ${g.slug}`,
    );
}
for (const [file, content] of generatedFiles(catalog))
  check(
    exists(file) && read(file) === content,
    `Stale generated file ${file}; run npm run generate`,
  );
for (const [file, content] of await siteResourceOutputs(catalog))
  check(
    exists(file) &&
      fs.readFileSync(resolveLocal(file)).equals(Buffer.from(content)),
    `Stale site resource ${file}; run npm run generate`,
  );
// Check maintained Markdown links, not historical prose/code samples.
const generated = generatedFiles(catalog);
for (const [file, content] of generated) {
  if (!file.endsWith(".md")) continue;
  const current = catalog.runs.some((run) => run.document === file)
    ? content.split("<!-- archive:start -->")[1]
    : content;
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
  "404.html",
  ...catalog.guides.map((guide) => guide.example),
  ...[...generated.keys()].filter((file) => file.endsWith(".html")),
  ...catalog.runs
    .filter((r) => r.preview.kind === "build")
    .flatMap((r) => r.preview.pages.map((p) => p.href)),
]) {
  if (!exists(file)) continue;
  for (const match of read(file).matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|data:|#)/.test(href) || href.includes("${"))
      continue;
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
  "assets/analytics.js",
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
