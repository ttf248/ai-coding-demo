import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { productUpdates } from "../scripts/product-updates.mjs";
test("activity dates come from evidence and old score snapshots are not invented revisions", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-updates-"));
  try {
    for (const folder of ["score-reviews", "screenshot-captures/batch"])
      fs.mkdirSync(path.join(root, "catalog", folder), { recursive: true });
    const save = (file, value) =>
      fs.writeFileSync(path.join(root, file), JSON.stringify(value));
    save("catalog/screenshot-captures/batch/a.json", {
      runId: "a",
      capturedAt: "2026-10-21T16:00:00Z",
    });
    save("catalog/score-reviews/2099-unknown.json", {
      runs: [{ id: "a", score: { assessedAt: "2020-01-01" } }],
    });
    save("catalog/score-reviews/review.json", {
      assessedAt: "2026-10-20",
      records: [
        { id: "a", oldScore: {}, newScore: { assessedAt: "2026-10-20" } },
      ],
    });
    const updates = productUpdates(
      {
        runs: [
          {
            id: "a",
            directory: "demos/t/runs/a",
            archivedAt: null,
            score: { status: "rated", assessedAt: "2026-10-22" },
          },
        ],
      },
      root,
    );
    assert.equal(updates.length, 3);
    assert.deepEqual(
      updates.map((update) => update.kind),
      ["review", "capture", "review"],
    );
    assert.ok(updates.every((update) => !update.date.startsWith("2099")));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
