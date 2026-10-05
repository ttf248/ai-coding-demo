(function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI,
    e = U.escape;
  const root = document.getElementById("topic-content");
  const params = new URLSearchParams(location.search);
  const topic = data.topics.find((t) => t.id === params.get("id"));
  if (!topic) {
    root.innerHTML =
      '<h1>未找到这个主题</h1><p>目录已经更新，请返回首页重新选择。</p><a class="button" href="index.html">返回实验目录</a>';
    return;
  }
  document.title = topic.title + " · AI Coding Demo";
  const runs = U.filterRuns(data, {}).filter((r) => r.topicId === topic.id);
  const prompts = data.prompts.filter((p) => p.topicId === topic.id);
  const models = data.models
    .filter((m) => runs.some((r) => r.modelId === m.id))
    .sort(U.compareModels);
  const efforts = [
    "default",
    "low",
    "medium",
    "high",
    "xhigh",
    "max",
    "ultra",
    "unknown",
  ].filter((effort) => runs.some((r) => r.effort === effort));
  let promptId = prompts.some((p) => p.id === params.get("prompt"))
    ? params.get("prompt")
    : "";
  let view = ["matrix", "list", "prompt"].includes(params.get("view"))
    ? params.get("view")
    : "list";
  let modelId = models.some((m) => m.id === params.get("model"))
    ? params.get("model")
    : "";
  let effort = efforts.includes(params.get("effort"))
    ? params.get("effort")
    : "";
  let query = params.get("q") || "";
  let sort = params.get("sort") === "model" ? "model" : "recent";
  root.innerHTML =
    '<a class="back" href="index.html">← 全部主题</a><div class="page-heading"><span class="eyebrow">实验主题 · ' +
    runs.length +
    " 条记录 · " +
    models.length +
    " 个模型</span><h1>" +
    e(topic.title) +
    "</h1><p>" +
    e(topic.description) +
    "</p></div>" +
    '<div class="topic-toolbar"><label>提示词版本<select id="topic-prompt"><option value="">全部版本</option>' +
    prompts
      .map(
        (p) =>
          '<option value="' +
          e(p.id) +
          '">' +
          e(p.id + " · " + p.title) +
          "</option>",
      )
      .join("") +
    '</select></label><div class="segments" aria-label="主题内容"><button data-topic-view="list">浏览实验</button><button data-topic-view="matrix">档位覆盖</button><button data-topic-view="prompt">任务正文</button></div></div>' +
    '<section class="topic-context" aria-label="当前任务范围"><div><span class="eyebrow">任务与输入</span><h2 id="topic-context-title"></h2><p id="topic-context-description"></p></div><button data-read-task>阅读任务正文 →</button></section>' +
    '<div class="topic-filters" id="topic-filters"><label class="topic-search">搜索实验<input id="topic-search" type="search" placeholder="模型、档位或实验描述" autocomplete="off"></label><label>模型<select id="topic-model"><option value="">全部模型</option>' +
    U.groupedOptions(
      models,
      (m) => m.provider || "厂商未记录",
      (m) => '<option value="' + e(m.id) + '">' + e(m.label) + "</option>",
    ) +
    '</select></label><label>推理档位<select id="topic-effort"><option value="">全部档位</option>' +
    efforts
      .map(
        (v) =>
          '<option value="' + e(v) + '">' + e(U.effortLabel(v)) + "</option>",
      )
      .join("") +
    '</select></label><label id="topic-sort-field">版本内排序<select id="topic-sort"><option value="recent">日期从新到旧</option><option value="model">厂商 / 模型</option></select></label><button id="topic-reset">清除筛选</button></div>' +
    '<div class="topic-results-heading"><p id="topic-count" role="status"></p><p id="topic-results-help"></p></div><section id="topic-matrix" aria-label="模型与档位实验矩阵" hidden></section><section id="topic-list"><div class="topic-run-groups"></div></section><section id="topic-prompts" class="prompt-library" hidden><h2>任务与版本</h2><div></div></section>';
  const refreshSelection = U.setupSelection(data);
  function entries(items) {
    return items
      .map((r) => {
        const href = U.previewURL(r);
        return (
          '<div class="matrix-record" data-matrix-run="' +
          e(r.id) +
          '"><strong>' +
          e(U.roundLabel(r)) +
          "</strong><small>提示词 " +
          e(r.promptId) +
          " · " +
          e(r.date || "日期未记录") +
          " · " +
          (r.preview.kind === "none" ? "无预览" : "可预览") +
          '</small><div class="card-actions">' +
          (href
            ? '<a href="' +
              e(href) +
              '" target="_blank" rel="noopener">打开预览 ↗</a>'
            : "") +
          '<a href="' +
          e(r.document) +
          '">记录</a><button data-compare="' +
          e(r.id) +
          '">加入对比</button></div></div>'
        );
      })
      .join("");
  }
  function render() {
    const matched = runs
      .filter(
        (r) =>
          (!promptId || r.promptId === promptId) &&
          (!modelId || r.modelId === modelId) &&
          (!effort || r.effort === effort) &&
          (!query ||
            [
              U.modelLabel(data, r),
              U.modelProvider(data, r),
              r.modelId,
              r.effort,
              U.effortLabel(r.effort),
              r.description,
              r.title,
              r.id,
            ]
              .join(" ")
              .toLowerCase()
              .includes(query.trim().toLowerCase())),
      )
      .sort(
        (a, b) =>
          (sort === "recent"
            ? (b.date || "").localeCompare(a.date || "")
            : 0) || U.compareModelRuns(data, a, b),
      );
    const visibleModels = models.filter((m) =>
      matched.some((r) => r.modelId === m.id),
    );
    const visibleEfforts = efforts.filter((v) =>
      matched.some((r) => r.effort === v),
    );
    document.getElementById("topic-prompt").value = promptId;
    document.getElementById("topic-model").value = modelId;
    document.getElementById("topic-effort").value = effort;
    document.getElementById("topic-sort").value = sort;
    document.getElementById("topic-search").value = query;
    document.getElementById("topic-filters").hidden = view === "prompt";
    document.getElementById("topic-sort-field").hidden = view !== "list";
    document.querySelector(".topic-context").hidden = view === "prompt";
    document.getElementById("topic-reset").disabled =
      !modelId && !effort && !query;
    const task = prompts.find((p) => p.id === promptId);
    document.getElementById("topic-context-title").textContent = task
      ? task.title + " · " + task.id
      : prompts.length + " 个任务版本，实验按版本分组";
    document.getElementById("topic-context-description").textContent = task
      ? task.text.slice(0, 180) + (task.text.length > 180 ? "…" : "")
      : "先浏览实现，或选择一个提示词版本缩小范围。同一任务正文的实验也可能有不同原始输入与上下文。";
    document.getElementById("topic-count").textContent =
      view === "prompt"
        ? prompts.filter((p) => !promptId || p.id === promptId).length +
          " 个任务版本"
        : matched.length +
          " / " +
          runs.length +
          " 条实验 · " +
          visibleModels.length +
          " 个模型";
    document.getElementById("topic-results-help").textContent =
      view === "matrix"
        ? "空白档位表示未归档实验，不代表能力评价。"
        : view === "list"
          ? "打开预览查看实现，加入对比查看输入与结果差异。"
          : "保留历史任务版本，完整原始输入在各条实验记录中。";
    for (const key of ["matrix", "list", "prompt"]) {
      document.getElementById(
        key === "prompt" ? "topic-prompts" : "topic-" + key,
      ).hidden = view !== key;
      root
        .querySelectorAll('[data-topic-view="' + key + '"]')
        .forEach((button) =>
          button.setAttribute("aria-pressed", String(view === key)),
        );
    }
    const cells = (model, effort) =>
      matched
        .filter((r) => r.modelId === model.id && r.effort === effort)
        .sort((a, b) => U.compareModelRuns(data, a, b));
    document.getElementById("topic-matrix").innerHTML =
      '<div class="matrix-desktop table-scroll" tabindex="0" aria-label="实验矩阵，可横向滚动"><table class="archive-table"><caption>' +
      e(topic.title) +
      " · " +
      e(promptId || "全部版本") +
      '</caption><thead><tr><th scope="col">模型 / 推理档位</th>' +
      visibleEfforts
        .map(
          (effort) => '<th scope="col">' + e(U.effortLabel(effort)) + "</th>",
        )
        .join("") +
      "</tr></thead><tbody>" +
      visibleModels
        .map(
          (m) =>
            '<tr><th scope="row"><small>' +
            e(m.provider || "厂商未记录") +
            "</small>" +
            e(m.label) +
            "</th>" +
            visibleEfforts
              .map((effort) => {
                const items = cells(m, effort);
                return (
                  '<td data-model="' +
                  e(m.id) +
                  '" data-effort="' +
                  e(effort) +
                  '">' +
                  (items.length
                    ? "<details" +
                      (items.length === 1 ? " open" : "") +
                      "><summary>" +
                      items.length +
                      " 条实验</summary>" +
                      entries(items) +
                      "</details>"
                    : '<span class="missing-record">无记录</span>') +
                  "</td>"
                );
              })
              .join("") +
            "</tr>",
        )
        .join("") +
      "</tbody></table></div>" +
      '<div class="matrix-mobile">' +
      visibleModels
        .map(
          (m) =>
            '<details class="matrix-model"><summary>' +
            e(m.label) +
            " · " +
            matched.filter((r) => r.modelId === m.id).length +
            " 条实验</summary>" +
            visibleEfforts
              .filter((v) => cells(m, v).length)
              .map((effort) => {
                const items = cells(m, effort);
                return (
                  '<div class="mobile-effort"><h3>' +
                  e(U.effortLabel(effort)) +
                  "</h3>" +
                  (items.length
                    ? entries(items)
                    : '<span class="missing-record">无记录</span>') +
                  "</div>"
                );
              })
              .join("") +
            "</details>",
        )
        .join("") +
      "</div>";
    document.querySelector("#topic-list .topic-run-groups").innerHTML =
      prompts
        .slice()
        .reverse()
        .filter((p) => matched.some((r) => r.promptId === p.id))
        .map((p) => {
          const items = matched.filter((r) => r.promptId === p.id);
          return (
            '<section class="topic-run-group"><header><div><span class="version-badge">' +
            e(p.id) +
            "</span><h2>" +
            e(p.title) +
            '</h2><span class="topic-group-count">' +
            items.length +
            ' 条实验</span></div><a href="compare.html?group=' +
            encodeURIComponent(topic.id + "/" + p.id) +
            '&tab=prompt">比较此版本 →</a></header><div class="topic-run-grid">' +
            items
              .map((r) => {
                const href = U.previewURL(r);
                return (
                  '<article class="topic-run-card" id="run-' +
                  e(r.id) +
                  '"><div class="topic-run-top"><span class="eyebrow">' +
                  e(U.modelProvider(data, r)) +
                  '</span><span class="pill">' +
                  e(
                    r.preview.kind === "none"
                      ? "无预览"
                      : r.preview.kind === "external"
                        ? "外部预览"
                        : "可预览",
                  ) +
                  "</span></div><h3>" +
                  e(U.modelLabel(data, r)) +
                  '</h3><div class="topic-run-meta"><span>' +
                  e(U.effortLabel(r.effort)) +
                  "</span><span>" +
                  e(U.roundLabel(r)) +
                  "</span><time>" +
                  e(r.date || "日期未记录") +
                  "</time></div><p>" +
                  e(r.description) +
                  '</p><div class="topic-run-input">' +
                  e(
                    r.input.completeness === "recorded"
                      ? "原始输入已记录"
                      : "输入或上下文不完整",
                  ) +
                  (r.changes.length ? " · 有修改记录" : "") +
                  '</div><div class="card-actions">' +
                  (href
                    ? '<a class="button primary" href="' +
                      e(href) +
                      '" target="_blank" rel="noopener">打开预览 ↗</a>'
                    : "") +
                  '<button data-compare="' +
                  e(r.id) +
                  '" aria-pressed="false">加入对比</button><a href="' +
                  e(r.document) +
                  '">实验记录</a></div></article>'
                );
              })
              .join("") +
            "</div></section>"
          );
        })
        .join("") ||
      '<div class="topic-empty"><h2>没有符合条件的实验</h2><p>试试其他模型、档位或搜索词，也可以清除筛选。</p><button data-reset-filters>清除筛选</button></div>';
    if (!matched.length)
      document.getElementById("topic-matrix").innerHTML =
        '<p class="topic-empty">没有符合条件的实验，请调整筛选。</p>';
    document.querySelector("#topic-prompts > div").innerHTML = prompts
      .filter((p) => !promptId || p.id === promptId)
      .map(
        (p) =>
          "<details><summary>" +
          e(p.title + " · " + p.id) +
          " · " +
          runs.filter((r) => r.promptId === p.id).length +
          " 条记录</summary><p>" +
          e(p.extraction) +
          "</p><pre>" +
          e(p.text) +
          '</pre><a href="' +
          e(p.directory) +
          '/prompt.md">原始文件 ↗</a> · <a href="compare.html?group=' +
          encodeURIComponent(topic.id + "/" + p.id) +
          '">比较此提示词的全部实验 →</a></details>',
      )
      .join("");
    refreshSelection();
  }
  function updateURL(replace = false) {
    const p = new URLSearchParams({ id: topic.id, view });
    if (promptId) p.set("prompt", promptId);
    if (modelId) p.set("model", modelId);
    if (effort) p.set("effort", effort);
    if (query) p.set("q", query);
    if (sort !== "recent") p.set("sort", sort);
    history[replace ? "replaceState" : "pushState"](
      null,
      "",
      "?" + p.toString(),
    );
  }
  root.addEventListener("change", (event) => {
    switch (event.target.id) {
      case "topic-prompt":
        promptId = event.target.value;
        break;
      case "topic-model":
        modelId = event.target.value;
        break;
      case "topic-effort":
        effort = event.target.value;
        break;
      case "topic-sort":
        sort = event.target.value;
        break;
      default:
        return;
    }
    updateURL();
    render();
  });
  root.addEventListener("input", (event) => {
    if (event.target.id !== "topic-search") return;
    query = event.target.value;
    updateURL(true);
    render();
  });
  root.addEventListener("click", (event) => {
    if (event.target.closest("#topic-reset, [data-reset-filters]")) {
      modelId = effort = query = "";
      updateURL();
      render();
      return;
    }
    const button = event.target.closest("[data-topic-view], [data-read-task]");
    if (!button) return;
    view = button.dataset.topicView || "prompt";
    updateURL();
    render();
  });
  window.addEventListener("popstate", () => {
    const p = new URLSearchParams(location.search);
    promptId = prompts.some((item) => item.id === p.get("prompt"))
      ? p.get("prompt")
      : "";
    view = ["matrix", "list", "prompt"].includes(p.get("view"))
      ? p.get("view")
      : "list";
    modelId = models.some((m) => m.id === p.get("model")) ? p.get("model") : "";
    effort = efforts.includes(p.get("effort")) ? p.get("effort") : "";
    query = p.get("q") || "";
    sort = p.get("sort") === "model" ? "model" : "recent";
    render();
  });
  render();
  if (location.hash.startsWith("#run-"))
    document
      .getElementById(decodeURIComponent(location.hash.slice(1)))
      ?.scrollIntoView();
})();
