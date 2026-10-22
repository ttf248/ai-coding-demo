(function (global) {
  "use strict";
  const U = global.ArchiveUI,
    e = U.escape;
  const dimensions = [
    ["taskCoverage", "任务可见覆盖", 40],
    ["composition", "构图与层级", 20],
    ["readability", "可读性", 15],
    ["interactionClarity", "操作表达", 10],
    ["craft", "视觉精修", 15],
  ];
  function comparable(data, a, b) {
    return !!(
      a &&
      b &&
      a.id !== b.id &&
      U.promptFor(data, a)?.hash &&
      U.promptFor(data, a)?.hash === U.promptFor(data, b)?.hash &&
      a.score?.rubricVersion === b.score?.rubricVersion &&
      a.score?.rubricHash &&
      a.score.rubricHash === b.score?.rubricHash &&
      a.score?.criteriaHash &&
      a.score.criteriaHash === b.score?.criteriaHash &&
      U.scoreValue(a) !== null &&
      U.scoreValue(b) !== null
    );
  }
  function splitScore(run) {
    const s = run.score;
    if (s?.status !== "rated" || s.rubricVersion !== 3 || !s.dimensions)
      return "截图分项暂无可用数据";
    const visual = dimensions
      .slice(1)
      .reduce((sum, [key]) => sum + s.dimensions[key], 0);
    return `任务可见覆盖 ${s.dimensions.taskCoverage}/40 · 视觉表现 ${visual}/60`;
  }
  function verification(run) {
    const v = run.verification;
    if (!v)
      return '<p class="verification-note">功能验证：未登记。预览入口与截图评分不代表功能验收通过。</p>';
    return `<details class="verification-note"><summary>功能验证 · ${e(v.reviewedAt)} · 仅限已列项目</summary><p>${e(v.environment)}</p><ul>${v.checks.map((check) => `<li>${e(check.label)}：${e({ passed: "通过", failed: "未通过", untested: "未验证" }[check.status])}${check.evidence ? ` · <a href="${e(check.evidence)}">验证记录</a>` : ""}</li>`).join("")}</ul><p>未验证范围：${e(v.unverified)}</p></details>`;
  }
  function summary(data, runs, sideLabels = []) {
    if (runs.length < 2) return "";
    const base = runs[0],
      baseLabel = sideLabels[0] || "A";
    return `<section class="difference-summary" aria-label="差异摘要"><h2>差异摘要</h2><p>根据已有人工复核观察整理，仅评价截图可见成果。1–2 分差异不解释为模型能力差异。</p><div class="difference-records">${runs
      .map((run, index) => {
        const canCompare = comparable(data, base, run);
        const changes = canCompare
          ? dimensions
              .map(([key, label]) => ({
                key,
                label,
                delta:
                  run.score.dimensions?.[key] - base.score.dimensions?.[key],
              }))
              .filter((item) => Number.isFinite(item.delta) && item.delta !== 0)
              .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
          : [];
        const lead = changes[0];
        return `<article class="difference-record"><h3>${e(sideLabels[index] || "ABCD"[index])} · ${e(U.runSummary(data, run))}</h3><p>${e(splitScore(run))}</p><p>${index === 0 ? "作为本组观察基准" : e(U.relation(data, base, run))}</p><p>${lead ? `与 ${e(baseLabel)} 相差最多的维度：${e(lead.label)} ${lead.delta > 0 ? "+" : ""}${lead.delta} 分。` : canCompare ? "各维度分数相同，仍需查看具体观察。" : index ? "任务或评分依据不满足直接计算分差的条件。" : ""}</p><p class="difference-observation">已记录的${e(lead?.label || "任务覆盖")}观察：${e(run.score?.observations?.[lead?.key || "taskCoverage"] || "未记录具体观察")}</p><details><summary>查看五维观察与证据限制</summary>${dimensions.map(([key, label, max]) => `<section><h4>${label}${run.score?.status === "rated" && Number.isFinite(run.score.dimensions?.[key]) ? ` · ${run.score.dimensions[key]}/${max}` : ""}</h4><p>${e(run.score?.observations?.[key] || "未记录观察")}</p></section>`).join("")}<p>证据置信度：${e({ high: "高", medium: "中", low: "低" }[run.score?.confidence] || "未记录")}</p><ul>${(run.score?.limitations || []).map((note) => `<li>${e(note)}</li>`).join("")}</ul><p>以下为该实验完整复核证据；现有观察未逐项绑定特定取景。</p><ul>${
          U.captureFrames(run)
            .filter((frame) => run.score?.reviewedFrames?.includes(frame.id))
            .map(
              (frame) =>
                `<li><a href="${e(U.captureURL(run, frame.id))}">${e(U.captureFrameLabel(frame, run))}</a></li>`,
            )
            .join("") || "<li>没有已登记的复核帧</li>"
        }</ul></details>${verification(run)}</article>`;
      })
      .join("")}</div></section>`;
  }
  global.ArchiveEvidence = { comparable, splitScore, verification, summary };
})(window);
