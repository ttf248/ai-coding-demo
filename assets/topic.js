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
    : "matrix";
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
    '</select></label><div class="segments" aria-label="主题内容"><button data-topic-view="matrix">实验矩阵</button><button data-topic-view="list">实验列表</button><button data-topic-view="prompt">任务正文</button></div></div>' +
    '<p id="topic-count" role="status"></p><section id="topic-matrix" aria-label="模型与档位实验矩阵"></section><section id="topic-list" hidden><div class="cards"></div></section><section id="topic-prompts" class="prompt-library" hidden><h2>任务与版本</h2><div></div></section>';
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
    const matched = runs.filter((r) => !promptId || r.promptId === promptId);
    document.getElementById("topic-prompt").value = promptId;
    document.getElementById("topic-count").textContent =
      matched.length +
      " 条实验 · " +
      (promptId || "全部提示词版本") +
      " · 无记录不代表能力评价";
    for (const key of ["matrix", "list", "prompt"]) {
      document.getElementById(
        key === "prompt" ? "topic-prompts" : "topic-" + key,
      ).hidden = view !== key;
      root
        .querySelector('[data-topic-view="' + key + '"]')
        .setAttribute("aria-pressed", String(view === key));
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
      efforts
        .map(
          (effort) => '<th scope="col">' + e(U.effortLabel(effort)) + "</th>",
        )
        .join("") +
      "</tr></thead><tbody>" +
      models
        .map(
          (m) =>
            '<tr><th scope="row"><small>' +
            e(m.provider || "厂商未记录") +
            "</small>" +
            e(m.label) +
            "</th>" +
            efforts
              .map((effort) => {
                const items = cells(m, effort);
                return (
                  '<td data-model="' +
                  e(m.id) +
                  '" data-effort="' +
                  e(effort) +
                  '">' +
                  (items.length
                    ? "<details><summary>" +
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
      models
        .map(
          (m) =>
            '<details class="matrix-model"><summary>' +
            e(m.label) +
            " · " +
            matched.filter((r) => r.modelId === m.id).length +
            " 条实验</summary>" +
            efforts
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
    document.querySelector("#topic-list .cards").innerHTML =
      matched
        .map((r) =>
          U.runCard(data, r).replace(
            '<article class="card"',
            '<article class="card" id="run-' + e(r.id) + '"',
          ),
        )
        .join("") || "<p>此版本暂无实验记录。</p>";
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
  function updateURL() {
    const p = new URLSearchParams({ id: topic.id, view });
    if (promptId) p.set("prompt", promptId);
    history.pushState(null, "", "?" + p.toString());
  }
  root.addEventListener("change", (event) => {
    if (event.target.id !== "topic-prompt") return;
    promptId = event.target.value;
    updateURL();
    render();
  });
  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic-view]");
    if (!button) return;
    view = button.dataset.topicView;
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
      : "matrix";
    render();
  });
  render();
  if (location.hash.startsWith("#run-"))
    document
      .getElementById(decodeURIComponent(location.hash.slice(1)))
      ?.scrollIntoView();
})();
