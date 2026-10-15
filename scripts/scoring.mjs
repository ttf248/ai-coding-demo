import crypto from "node:crypto";

export const criteriaHash = (definition) =>
  crypto.createHash("sha256").update(JSON.stringify(definition)).digest("hex");

export function rubricErrors(rubric, catalog, schema) {
  const errors = [];
  if (rubric.version !== schema.$defs.caseScore.properties.rubricVersion.const)
    errors.push("Scoring rubric and run schema versions differ");
  const maxima = rubric.dimensionMaximums || {};
  const schemaDimensions = schema.$defs.scoreDimensions;
  if (
    Object.values(maxima).reduce((sum, value) => sum + value, 0) !== 100 ||
    JSON.stringify(Object.keys(maxima).sort()) !==
      JSON.stringify([...schemaDimensions.required].sort()) ||
    Object.entries(maxima).some(
      ([key, value]) => value !== schemaDimensions.properties[key]?.maximum,
    )
  )
    errors.push("Scoring weights must match schema and sum to 100");
  if (rubric.taskCheckMaximum !== 10 || maxima.taskCoverage !== 40)
    errors.push(
      "Task coverage must contain four independent checks worth 10 each",
    );
  if (
    JSON.stringify(rubric.stateCeilings) !==
    JSON.stringify({ result: 100, initial: 100, partial: 100, blocked: 39 })
  )
    errors.push(
      "Unexpected screenshot state ceilings; update rubric version and validation together",
    );
  for (const [key, definition] of Object.entries(rubric.tasks || {})) {
    const prompt = catalog.prompts.find((p) => `${p.topicId}/${p.id}` === key);
    if (!prompt || prompt.hash !== definition.promptHash)
      errors.push(`Scoring task definition is missing or stale: ${key}`);
    const checks = definition.checks || [];
    if (
      checks.length !== 4 ||
      new Set(checks.map((check) => check.id)).size !== 4 ||
      checks.some(
        (check) =>
          !/^[a-z][a-zA-Z]*$/.test(check.id) ||
          !check.label ||
          !check.description,
      )
    )
      errors.push(`Scoring task needs four distinct documented checks: ${key}`);
  }
  return errors;
}

export function scoreErrors(run, rubric) {
  const errors = [],
    score = run.score || {};
  const fail = (message) => errors.push(`${message}: ${run.id}`);
  if (score.rubricVersion !== rubric.version)
    fail("Reassess with current scoring rubric");
  if (run.screenshot) {
    if (!["rated", "insufficient"].includes(score.status))
      fail("Screenshot requires a completed visual review");
    const definition = rubric.tasks?.[`${run.topicId}/${run.promptId}`];
    if (!definition)
      fail("Register task-specific scoring checks before rating");
    if (definition && score.criteriaHash !== criteriaHash(definition))
      fail("Scoring checks changed; reassess");
    if (score.screenshotHash !== run.screenshotInfo?.hash)
      fail("Screenshot changed; reassess score");
    if (score.inputHash !== run.rawHash)
      fail("Original input changed; reassess score");
    if (typeof score.evidence !== "string" || score.evidence.trim().length < 24)
      fail("Explain visible evidence and the principal limitation");
    if (score.status === "rated") {
      const expected = definition?.checks.map((check) => check.id).sort() || [];
      if (
        JSON.stringify(Object.keys(score.taskChecks || {}).sort()) !==
        JSON.stringify(expected)
      )
        fail("Task scoring checks do not match this prompt");
      if (
        Object.values(score.taskChecks || {}).some(
          (value) =>
            !Number.isInteger(value) ||
            value < 0 ||
            value > rubric.taskCheckMaximum,
        )
      )
        fail("Invalid task check points");
      if (
        Object.values(score.taskChecks || {}).reduce(
          (sum, value) => sum + value,
          0,
        ) !== score.dimensions?.taskCoverage
      )
        fail("Task coverage differs from its four checks");
      const ceiling = rubric.stateCeilings?.[score.captureState];
      if (!Number.isInteger(ceiling) || score.ceiling !== ceiling)
        fail("Screenshot state ceiling differs from rubric");
      const sum = Object.values(score.dimensions || {}).reduce(
        (total, value) => total + value,
        0,
      );
      if (score.total !== Math.min(sum, ceiling))
        fail("Score total differs from dimensions and state ceiling");
    }
  } else if (
    score.status !== "unavailable" &&
    !(
      score.status === "pending" &&
      run.status === "draft" &&
      run.preview.kind === "none"
    )
  ) {
    fail("Missing screenshot must be unavailable or an unfinished draft");
  }
  return errors;
}
