(function (global) {
  "use strict";
  const U = global.ArchiveUI;
  const modelKey = (run) =>
    JSON.stringify([run.topicId, run.promptId, run.modelId]);
  const toolLabel = (data, run) =>
    data.tools?.find((tool) => tool.id === run.environment?.toolId)?.label ||
    run.environment?.tool ||
    "工具未记录";
  const conditionKey = (run) =>
    JSON.stringify([
      run.topicId,
      run.promptId,
      run.modelId,
      run.effort,
      run.environment?.toolId || run.environment?.tool || null,
      U.executionMode(run),
    ]);
  function recent(a, b) {
    return (
      (b.date || "").localeCompare(a.date || "") ||
      b.runId.localeCompare(a.runId, undefined, { numeric: true }) ||
      a.id.localeCompare(b.id)
    );
  }
  function group(data, runs, sort = "model") {
    const groups = new Map();
    for (const run of runs) {
      const key = modelKey(run);
      if (!groups.has(key))
        groups.set(key, {
          key,
          modelId: run.modelId,
          promptId: run.promptId,
          runs: [],
          conditions: new Map(),
        });
      const model = groups.get(key);
      model.runs.push(run);
      const condition = conditionKey(run);
      if (!model.conditions.has(condition))
        model.conditions.set(condition, { key: condition, runs: [] });
      model.conditions.get(condition).runs.push(run);
    }
    return [...groups.values()]
      .map((model) => {
        model.runs.sort(recent);
        model.latest = model.runs[0];
        model.latestPreview = model.runs.find(
          (run) =>
            run.status === "ready" &&
            run.preview.kind !== "none" &&
            U.previewURL(run),
        );
        model.efforts = [...new Set(model.runs.map((run) => run.effort))].sort(
          U.compareEfforts,
        );
        model.conditions = [...model.conditions.values()]
          .map((condition) => {
            condition.runs.sort(recent);
            condition.latest = condition.runs[0];
            return condition;
          })
          .sort(
            (a, b) =>
              U.compareEfforts(a.latest.effort, b.latest.effort) ||
              toolLabel(data, a.latest).localeCompare(
                toolLabel(data, b.latest),
              ) ||
              U.executionMode(a.latest).localeCompare(
                U.executionMode(b.latest),
              ),
          );
        return model;
      })
      .sort(
        (a, b) =>
          b.promptId.localeCompare(a.promptId, undefined, { numeric: true }) ||
          (sort === "recent" ? recent(a.latest, b.latest) : 0) ||
          U.compareModels(
            data.models.find((m) => m.id === a.modelId),
            data.models.find((m) => m.id === b.modelId),
          ),
      );
  }
  function durationSummary(run) {
    const billing = run.billing;
    if (!billing?.duration) return "耗时未记录";
    const scope = billing.type === "batch" ? "批次耗时" : "单次耗时";
    return scope + " " + billing.duration.text;
  }
  global.ArchiveTopicRecords = {
    group,
    modelKey,
    conditionKey,
    toolLabel,
    durationSummary,
  };
})(typeof window !== "undefined" ? window : globalThis);
