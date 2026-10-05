import {
  readJSON,
  writeJSON,
  loadCatalog,
  generatedFiles,
  write,
} from "./lib.mjs";

export const isTopicArchived = (topic) => topic.testingStatus === "archived";

export function updateTestingStatus(
  topic,
  status,
  reason,
  date = new Date().toISOString().slice(0, 10),
) {
  if (!["active", "archived"].includes(status))
    throw Error("Unknown testing status");
  if (typeof reason !== "string" || !reason.trim() || reason.length > 1000)
    throw Error("A reason of 1–1000 characters is required");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    throw Error("Invalid operation date");
  if ((topic.testingStatus || "active") === status) return topic;
  return {
    ...topic,
    testingStatus: status,
    testingHistory: [
      ...(topic.testingHistory || []),
      { status, date, reason: reason.trim() },
    ],
  };
}

export function saveTestingStatus(id, status, reason) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw Error("Invalid topic ID");
  const file = `demos/${id}/topic.json`;
  const original = readJSON(file);
  const topic = updateTestingStatus(original, status, reason);
  if (topic !== original) {
    const catalog = loadCatalog();
    const index = catalog.topics.findIndex((t) => t.id === id);
    catalog.topics[index] = {
      ...topic,
      directory: catalog.topics[index].directory,
    };
    const outputs = generatedFiles(catalog);
    writeJSON(file, topic);
    for (const [file, content] of outputs) write(file, content);
  }
  return topic;
}
