import crypto from "node:crypto";

export const evidenceSetHash = (capture) =>
  crypto.createHash("sha256").update(JSON.stringify(capture)).digest("hex");

export function v3RubricErrors(rubric, catalog) {
  const errors = [];
  if (
    rubric.version !== 3 ||
    rubric.taskCheckMaximum !== 5 ||
    rubric.taskCheckCount !== 8
  )
    errors.push(
      "v3 requires eight separately observed task checks worth five points each",
    );
  if (rubric.dimensionMaximums.taskCoverage !== 40)
    errors.push("Task coverage must total forty points");
  const visualIds = Object.values(rubric.visualChecks || {})
    .flat()
    .map(([id]) => id);
  if (
    visualIds.length !== 12 ||
    new Set(visualIds).size !== 12 ||
    rubric.visualCheckMaximum !== 5
  )
    errors.push(
      "v3 requires twelve independent visual checks worth five points each",
    );
  for (const [dimension, checks] of Object.entries(rubric.visualChecks || {})) {
    if (checks.length * 5 !== rubric.dimensionMaximums[dimension])
      errors.push(
        "Visual dimension maximum differs from subchecks: " + dimension,
      );
  }
  for (const prompt of catalog.prompts) {
    const key = prompt.topicId + "/" + prompt.id,
      task = rubric.tasks[key];
    if (!task || task.promptHash !== prompt.hash)
      errors.push("Missing or stale task: " + key);
    if (
      task?.checks.length !== 8 ||
      new Set(task?.checks.map((c) => c.id)).size !== 8 ||
      task?.checks.some((c) => !c.label || !c.description)
    )
      errors.push("Task must have eight distinct documented checks: " + key);
  }
  return errors;
}

export function captureErrors(capture, run) {
  const errors = [];
  if (
    capture.runId !== run.id ||
    capture.topicId !== run.topicId ||
    capture.promptId !== run.promptId ||
    capture.inputHash !== run.rawHash
  )
    errors.push("Capture identity or original input changed");
  if (
    !capture.environment?.browser ||
    capture.environment.deviceScaleFactor !== 1 ||
    capture.environment.analytics !== "blocked"
  )
    errors.push("Capture must record browser, DPR and isolated analytics");
  if (
    !/^\d{4}-\d{2}-\d{2}T/.test(capture.capturedAt || "") ||
    !Array.isArray(capture.actions) ||
    !Array.isArray(capture.failedRequests) ||
    !Array.isArray(capture.errors)
  )
    errors.push("Capture requires timestamp, operations and runtime limits");
  if (capture.status === "unavailable") {
    if (capture.frames.length || run.preview.kind !== "none" || !capture.reason)
      errors.push("Unavailable captures must not invent screenshots");
    return errors;
  }
  if (!capture.frames.length) errors.push("Capture has no real screenshot");
  const frameIds = new Set();
  for (const frame of capture.frames) {
    if (frameIds.has(frame.id)) errors.push("Duplicate frame ID");
    frameIds.add(frame.id);
    if (
      !frame.file.startsWith(run.directory + "/captures/") ||
      frame.file.split("/").includes("..") ||
      !frame.file.endsWith(".png")
    )
      errors.push("Capture frame must belong to its experiment");
    if (
      !/^[a-f0-9]{64}$/.test(frame.sha256 || "") ||
      !Number.isInteger(frame.width) ||
      frame.width <= 0 ||
      !Number.isInteger(frame.height) ||
      frame.height <= 0
    )
      errors.push("Capture frame requires real dimensions and PNG fingerprint");
    if (!frame.viewport?.width || !frame.viewport?.height || !frame.observation)
      errors.push("Capture frame needs viewport and document observations");
  }
  if (
    capture.status === "captured" &&
    (!frameIds.has("desktop-initial") || !frameIds.has("mobile-initial"))
  )
    errors.push("Completed capture requires desktop and mobile evidence");
  return errors;
}

export function v3ReviewErrors(score, rubric, capture) {
  const errors = [];
  if (score.evidenceSetHash !== evidenceSetHash(capture))
    errors.push("Evidence set changed; visually reassess all frames");
  if (score.status === "unavailable") {
    if (capture.status !== "unavailable" || score.total !== null)
      errors.push("Unavailable review cannot invent a score");
    return errors;
  }
  if (!capture.frames?.length)
    errors.push("Review needs actual captured frames");
  if (
    !Array.isArray(score.reviewedFrames) ||
    JSON.stringify([...score.reviewedFrames].sort()) !==
      JSON.stringify(capture.frames.map((f) => f.id).sort())
  )
    errors.push("Review every recorded frame, not only the selected cover");
  if (
    !score.limitations?.length ||
    score.limitations.some(
      (note) => typeof note !== "string" || note.length < 8,
    )
  )
    errors.push("Record specific evidence limitations");
  if (!["high", "medium", "low"].includes(score.confidence))
    errors.push("Record evidence confidence separately from points");
  if (score.status !== "rated") return errors;
  const tasks =
    rubric.tasks[capture.topicId + "/" + capture.promptId]?.checks.map(
      (c) => c.id,
    ) || [];
  const visual = Object.values(rubric.visualChecks)
    .flat()
    .map(([id]) => id);
  for (const [field, keys] of [
    ["taskChecks", tasks],
    ["visualChecks", visual],
  ]) {
    const values = score[field] || {};
    if (
      JSON.stringify(Object.keys(values).sort()) !==
      JSON.stringify([...keys].sort())
    )
      errors.push("Review criteria missing or duplicated: " + field);
    if (
      Object.values(values).some((v) => !Number.isInteger(v) || v < 0 || v > 5)
    )
      errors.push("Subcheck must use the independent 0–5 anchor");
  }
  if (
    Object.values(score.taskChecks || {}).reduce((s, v) => s + v, 0) !==
    score.dimensions?.taskCoverage
  )
    errors.push("Task coverage differs from eight observed checks");
  for (const [dimension, checks] of Object.entries(rubric.visualChecks)) {
    if (
      checks.reduce((sum, [id]) => sum + (score.visualChecks?.[id] || 0), 0) !==
      score.dimensions?.[dimension]
    )
      errors.push(
        "Visual dimension differs from observed subchecks: " + dimension,
      );
  }
  const notes = Object.keys(rubric.dimensionMaximums).map(
    (key) => score.observations?.[key],
  );
  if (
    notes.some((note) => typeof note !== "string" || note.trim().length < 8) ||
    new Set(notes).size !== notes.length
  )
    errors.push(
      "Write distinct observations for each dimension before assigning points",
    );
  return errors;
}
