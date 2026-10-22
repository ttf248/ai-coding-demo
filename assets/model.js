(function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI,
    e = U.escape;
  const picker = document.getElementById("overview-model"),
    root = document.getElementById("model-overview");
  let generation = 0;
  picker.innerHTML =
    '<option value="">选择一个模型</option>' +
    [...data.models]
      .sort(U.compareModels)
      .map(
        (model) =>
          `<option value="${e(model.id)}">${e(model.provider || "未记录")} · ${e(model.label)}</option>`,
      )
      .join("");
  function render() {
    generation++;
    const model = data.models.find(
      (item) => item.id === new URLSearchParams(location.search).get("id"),
    );
    picker.value = model?.id || "";
    if (!model) {
      document.title = "模型实验概览 · AI Coding Demo";
      root.innerHTML =
        "<p>选择一个模型，查看任务覆盖、重复实验及已登记的修改记录。</p>";
      return;
    }
    document.title = model.label + " · 模型实验概览";
    const runs = data.runs.filter((run) => run.modelId === model.id);
    root.innerHTML = `<h2>${e(model.label)}</h2><p>${runs.length} 条实验 · 覆盖 ${new Set(runs.map((run) => run.topicId)).size} / ${data.topics.length} 个主题。包含已归档主题的历史记录。</p><p>各任务分别观察，不汇总跨任务总分。日期保留原始精度，轮次与日期先后不代表存在迭代继承关系。</p>${data.topics
      .map((topic) => {
        const subset = runs.filter((run) => run.topicId === topic.id);
        return subset.length
          ? `<details class="model-topic" data-model-topic="${e(topic.id)}"><summary>${e(topic.title)} · ${subset.length} 条实验${U.isTopicArchived(topic) ? " · 已归档" : ""}</summary><div class="model-topic-content"></div></details>`
          : `<p class="model-missing">${e(topic.title)}：尚无该模型的实验记录${U.isTopicArchived(topic) ? "（主题已归档）" : ""}</p>`;
      })
      .join("")}`;
    root.querySelectorAll(".model-topic").forEach((details) =>
      details.addEventListener("toggle", () => {
        if (details.open && !details.dataset.loaded)
          loadTopic(details, model, generation);
      }),
    );
  }
  async function loadTopic(details, model, expectedGeneration) {
    if (details.dataset.loading) return;
    details.dataset.loading = "true";
    const holder = details.querySelector(".model-topic-content");
    holder.textContent = "正在加载评分依据与修改记录…";
    const runs = data.runs.filter(
      (run) =>
        run.modelId === model.id && run.topicId === details.dataset.modelTopic,
    );
    try {
      await U.ensureDetails(data, runs);
      if (expectedGeneration !== generation) return;
      const tasks = new Map();
      for (const run of runs) {
        const key = JSON.stringify([
          U.promptFor(data, run)?.hash || run.id,
          run.score?.rubricVersion,
          run.score?.rubricHash || run.id,
          run.score?.criteriaHash || run.id,
        ]);
        if (!tasks.has(key)) tasks.set(key, []);
        tasks.get(key).push(run);
      }
      const taskDistributions = [...tasks.values()]
        .map((items) => {
          const scores = items
            .map(U.scoreValue)
            .filter((value) => value !== null)
            .sort((a, b) => a - b);
          const middle = Math.floor(scores.length / 2);
          const median =
            scores.length % 2
              ? scores[middle]
              : (scores[middle - 1] + scores[middle]) / 2;
          return `<p class="task-distribution">任务 ${e(items[0].promptId)} · 规则 v${e(items[0].score?.rubricVersion || "未记录")}：${scores.length < 2 ? `已评分 ${scores.length} 条，样本不足。` : `已评分 ${scores.length} 条，最低 ${scores[0]} / 中位 ${median} / 最高 ${scores.at(-1)}。`} 包含不同档位、输入或运行条件，仅描述已有样本，不作为同条件复跑结论。</p>`;
        })
        .join("");
      const groups = new Map();
      for (const run of runs) {
        const key = JSON.stringify([
          U.promptFor(data, run)?.hash || run.id,
          run.effort === "unknown" ? run.id : run.effort,
          run.environment?.toolId || run.environment?.tool || run.id,
          U.executionMode(run) === "unknown" ? run.id : U.executionMode(run),
          run.input?.completeness === "recorded" ? run.rawHash : run.id,
          run.score?.rubricVersion,
          run.score?.rubricHash || run.id,
          run.score?.criteriaHash || run.id,
        ]);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(run);
      }
      holder.innerHTML =
        taskDistributions +
        "<p>按任务正文、档位、已记录输入、工具、执行模式和评分依据分组；缺失信息不视作条件相同。上下文仍可能不同，样本波动不能证明模型稳定性。</p>" +
        [...groups.values()]
          .map((items) => {
            items.sort(
              (a, b) =>
                Number(!a.date) - Number(!b.date) ||
                (a.date || "").localeCompare(b.date || "") ||
                a.id.localeCompare(b.id),
            );
            const first = items[0],
              scores = items
                .map(U.scoreValue)
                .filter((value) => value !== null)
                .sort((a, b) => a - b);
            const middle = Math.floor(scores.length / 2),
              median =
                scores.length % 2
                  ? scores[middle]
                  : (scores[middle - 1] + scores[middle]) / 2;
            const distribution =
              scores.length >= 2
                ? `已评分 ${scores.length} 次：最低 ${scores[0]} / 中位 ${median} / 最高 ${scores.at(-1)}；分差 ${scores.at(-1) - scores[0]}。`
                : `已评分 ${scores.length} 次，样本不足以观察重复实验波动。`;
            return `<section class="model-series"><h3>${e(first.promptId)} · ${e(U.effortLabel(first.effort))} · ${e(U.toolLabel(data, first))}</h3><p>${e(U.executionModeText(first))} · ${e(U.completenessLabel(first.input?.completeness))} · 规则 v${e(first.score?.rubricVersion || "未记录")}</p><p>${distribution}</p>${items.length >= 2 ? `<a href="compare.html?${e(new URLSearchParams({ left: items[0].id, right: items.at(-1).id, tab: "snapshot" }).toString())}">比较本组首末记录 →</a>` : ""}<ol class="model-history">${items.map((run) => `<li data-model-run="${e(run.id)}"><div><time>${e(run.date || "日期未记录")}</time> · ${e(U.roundLabel(run))} · <a href="${e(U.documentURL(run))}">${e(run.title)}</a></div>${U.scoreValue(run) === null ? "<span>没有可计数截图评分</span>" : `<div class="model-score"><meter min="0" max="100" value="${U.scoreValue(run)}" aria-label="${e(U.roundLabel(run))}截图评分"></meter><span>${U.scoreValue(run)}/100</span></div>`}${U.captureCount(run) ? `<a href="${e(U.captureURL(run))}">查看截图证据</a>` : "<span>没有截图证据</span>"}${run.sourceRunId ? `<p>登记来源：${data.runs.some((item) => item.id === run.sourceRunId) ? `<a href="${e(U.documentURL(data.runs.find((item) => item.id === run.sourceRunId)))}">${e(run.sourceRunId)}</a>` : e(run.sourceRunId)}</p>` : ""}<details><summary>运行条件与修改记录</summary><p>${e(run.environment?.notes || "运行条件补充信息未记录")}</p><ul>${run.changes?.length ? run.changes.map((change) => `<li>${e(change)}</li>`).join("") : "<li>未登记修改记录</li>"}</ul></details></li>`).join("")}</ol></section>`;
          })
          .join("");
      details.dataset.loaded = "true";
    } catch {
      holder.innerHTML =
        "<p>资料加载失败，已保留覆盖统计。</p><button data-retry-model>重试加载</button>";
      holder.querySelector("button").onclick = () =>
        loadTopic(details, model, expectedGeneration);
    } finally {
      delete details.dataset.loading;
    }
  }
  picker.addEventListener("change", () => {
    const params = new URLSearchParams();
    if (picker.value) params.set("id", picker.value);
    history.pushState(
      null,
      "",
      "model.html" + (params.size ? "?" + params : ""),
    );
    render();
  });
  addEventListener("popstate", render);
  render();
})();
