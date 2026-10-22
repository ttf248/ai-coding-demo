import fs from "node:fs";
import path from "node:path";

// 所有日期取自记录正文；不从文件名、文件时间或当前日期补造历史。
export function productUpdates(catalog, root) {
  const events = new Map(),
    ids = new Set(catalog.runs.map((run) => run.id));
  const add = (kind, runId, date, source) => {
    if (
      !ids.has(runId) ||
      typeof date !== "string" ||
      !/^\d{4}-\d{2}(?:-\d{2})?(?:T.*Z)?$/.test(date)
    )
      return;
    const key = [kind, runId, date, source].join("/");
    events.set(key, { kind, runId, date, source });
  };
  for (const run of catalog.runs) {
    const source = `${run.directory}/run.json`;
    add("added", run.id, run.archivedAt, source);
    if (["rated", "insufficient"].includes(run.score?.status))
      add("review", run.id, run.score.assessedAt, source);
  }
  const files = (relative) => {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) return [];
    return fs
      .readdirSync(absolute, { withFileTypes: true })
      .flatMap((entry) =>
        entry.isDirectory()
          ? files(`${relative}/${entry.name}`)
          : entry.name.endsWith(".json")
            ? [`${relative}/${entry.name}`]
            : [],
      );
  };
  for (const file of files("catalog/screenshot-captures")) {
    const capture = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
    add("capture", capture.runId, capture.capturedAt, file);
  }
  for (const file of files("catalog/score-reviews")) {
    const review = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
    for (const record of review.records || review.runs || []) {
      // 仅旧分存档是证据快照，不冒充当日发生的新复核。
      if (record.newScore)
        add(
          "review",
          record.id,
          record.newScore.assessedAt || review.assessedAt,
          file,
        );
    }
  }
  return [...events.values()].sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      a.kind.localeCompare(b.kind) ||
      a.runId.localeCompare(b.runId) ||
      a.source.localeCompare(b.source),
  );
}
