import { parseArgs } from "node:util";
import { loadCatalog } from "./lib.mjs";
import { isTopicArchived, saveTestingStatus } from "./topic-lifecycle.mjs";
const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    topic: { type: "string" },
    reason: { type: "string" },
    all: { type: "boolean" },
    json: { type: "boolean" },
  },
});
const action = positionals[0] || "list";
if (positionals.length > 1) throw Error("Only one action is allowed");
if (action === "list") {
  const topics = loadCatalog().topics.filter(
    (t) => values.all || !isTopicArchived(t),
  );
  console.log(
    values.json
      ? JSON.stringify(topics.map((t) => t.id))
      : topics
          .map(
            (t) =>
              `${t.id}\t${isTopicArchived(t) ? "archived" : "active"}\t${t.title}`,
          )
          .join("\n"),
  );
} else if (["archive", "restore"].includes(action) && values.topic) {
  const topic = saveTestingStatus(
    values.topic,
    action === "archive" ? "archived" : "active",
    values.reason,
  );
  console.log(
    `${topic.id}: ${topic.testingStatus || "active"}. Metadata and generated site updated; no commit or push performed.`,
  );
} else
  throw Error(
    'Usage: npm run topic:status -- list [--all --json] | archive|restore --topic ID --reason "Reason"',
  );
