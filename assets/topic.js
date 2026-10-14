(async function () {
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
  try {
    await U.ensureDetails(
      data,
      data.runs.filter((run) => run.topicId === topic.id),
    );
  } catch (error) {
    root.innerHTML =
      "<h1>主题资料暂时无法加载</h1><p>" +
      e(error.message) +
      '</p><button onclick="location.reload()">重试</button><a href="index.html">返回目录</a>';
    return;
  }
  document.title = topic.title + " · AI Coding Demo";
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", topic.description);
  const runs = U.filterRuns(data, {}).filter((r) => r.topicId === topic.id);
  const prompts = data.prompts.filter((p) => p.topicId === topic.id);
  const models = data.models
    .filter((m) => runs.some((r) => r.modelId === m.id))
    .sort(U.compareModels);
  const efforts = U.effortOrder.filter((effort) =>
    runs.some((r) => r.effort === effort),
  );
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
  let sort = params.get("sort") === "recent" ? "recent" : "model";
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
    '<section class="topic-context" aria-label="当前任务范围"><h2 id="topic-context-title"></h2><button data-read-task>阅读任务正文 →</button></section>' +
    '<section class="pricing-context" id="pricing-context" aria-label="供应商与费用口径"><h2>模型厂商、接入供应商与费用</h2><p>实验行分别标出模型厂商与实际接入/计费供应商。订阅展示套餐额度，API 按实际 token 和工具用量计费；批次金额不会拆算成单案例费用。</p><details><summary>公开价格示例（美元，查阅于 2026-10-14）</summary><div class="pricing-examples"><p><strong>OpenAI：</strong>ChatGPT Plus 为 $20/月，Codex 使用包含在计划额度内且受使用限制；GPT-6 Astra 标准 API 为输入 $10、输出 $50 / 百万 token。假设一次任务恰好使用 100 万输入 + 100 万输出 token，API 约 $60，是 Plus 月费的 3 倍。</p><p><strong>Anthropic：</strong>Claude Pro 为 $20/月，Max 5x / 20x 为 $100 / $200 每月；Claude Opus 5.5 标准 API 为输入 $4、输出 $20 / 百万 token。同样假设 100 万输入 + 100 万输出，API 约 $24，是 Pro 月费的 1.2 倍。</p><p>这些是不同产品的公开标价量级示例，不代表本项目任一案例的 token 用量或真实账单。订阅有额度与速率限制，和 API token 账单不是等价服务；第三方价格也由实际平台决定，不能套用统一加价倍数。例如 OpenCode 当前把 Nemotron 3 Ultra Free 列为免费模型。</p><ul><li><a href="https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus" target="_blank" rel="noopener">ChatGPT Plus 月费与 API 单独计费</a> · <a href="https://openai.com/codex/" target="_blank" rel="noopener">OpenAI Codex 计划说明</a> · <a href="https://developers.openai.com/api/docs/models/gpt-6-astra" target="_blank" rel="noopener">GPT-6 Astra API 价格</a></li><li><a href="https://support.anthropic.com/en/articles/11049762-choosing-a-claude-ai-plan" target="_blank" rel="noopener">Claude 计划价格</a> · <a href="https://www.anthropic.com/claude/opus" target="_blank" rel="noopener">Opus 5.5 API 价格</a></li><li><a href="https://opencode.ai/v2/docs/console/models/" target="_blank" rel="noopener">OpenCode 模型及免费档位</a></li></ul></div></details></section>' +
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
    '</select></label><label id="topic-sort-field">版本内排序<select id="topic-sort"><option value="model">模型 / 档位从高到低</option><option value="recent">日期从新到旧</option></select></label><button id="topic-reset">清除筛选</button></div>' +
    '<div class="topic-results-heading"><p id="topic-count" role="status"></p><p id="topic-results-help"></p></div><section id="topic-matrix" aria-label="模型与档位实验矩阵" hidden></section><section id="topic-list"><div class="topic-run-groups"></div></section><section id="topic-prompts" class="prompt-library" hidden><h2>任务与版本</h2><div></div></section>';
  const refreshSelection = U.setupSelection(data);
  function billingSummary(run) {
    const billing = run.billing;
    if (!billing) return "费用未记录";
    const plan = billing.plan ? `${billing.plan} · ` : "";
    if (billing.type === "batch") {
      const amount =
        billing.amount == null
          ? "金额未记录"
          : billing.unit === "USD"
            ? `$${Number(billing.amount).toFixed(2)} USD`
            : `${billing.amount} ${billing.unit}`;
      const source =
        billing.sourceAmount != null
          ? `；原始消耗 ${billing.sourceAmount} ${billing.sourceUnit}`
          : "";
      return `批次总额：${amount}（${billing.caseCount == null ? "案例数未记录" : billing.caseCount + " 个案例"}${source}）`;
    }
    if (billing.type === "subscription")
      return `${plan}订阅额度（单案例金额未记录）`;
    if (billing.amount === 0) return `${plan}免费`;
    if (billing.amount != null) {
      const amount =
        billing.unit === "USD"
          ? `$${Number(billing.amount).toFixed(2)} USD`
          : `${billing.amount} ${billing.unit || ""}`.trim();
      return `${plan}单次费用：${amount}`;
    }
    return `${plan}费用口径未记录`;
  }
  function billingMarkup(run) {
    const note = run.billing?.note || "";
    const billing = run.billing;
    const provider = billing?.provider || "供应商未记录";
    return (
      '<details class="billing-summary"><summary>' +
      e(billingSummary(run)) +
      "</summary><p>" +
      e(billingSummary(run)) +
      "<br>模型厂商：" +
      e(U.modelProvider(data, run)) +
      "；接入/付费供应商：" +
      e(provider) +
      "。" +
      (note ? "<br>" + e(note) : "") +
      "</p></details>"
    );
  }
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
          " " +
          U.executionModeBadge(r) +
          "</small>" +
          billingMarkup(r) +
          '<div class="card-actions">' +
          (U.screenshotURL(r)
            ? '<a href="' +
              e(U.screenshotURL(r)) +
              '" target="_blank" rel="noopener">截图 ↗</a>'
            : "") +
          (href
            ? '<a href="' +
              e(href) +
              '" target="_blank" rel="noopener">打开预览 ↗</a>'
            : "") +
          '<a href="' +
          e(U.documentURL(r)) +
          '">记录</a><button data-compare="' +
          e(r.id) +
          '">加入对比</button></div></div>'
        );
      })
      .join("");
  }
  let renderGeneration = 0;
  async function render() {
    const generation = ++renderGeneration;
    if (view === "prompt") {
      try {
        await U.ensureTexts(
          data,
          runs.filter((run) => !promptId || run.promptId === promptId),
          false,
        );
      } catch (error) {
        document.getElementById("topic-results-help").textContent =
          "任务正文加载失败，请再次点击任务正文重试。";
        return;
      }
    }
    if (generation !== renderGeneration) return;
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
              r.billing?.provider,
              r.billing?.plan,
              r.billing?.note,
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
    document.getElementById("pricing-context").hidden = view === "prompt";
    document.getElementById("topic-sort-field").hidden = view !== "list";
    document.querySelector(".topic-context").hidden = view === "prompt";
    document.getElementById("topic-reset").disabled =
      !modelId && !effort && !query;
    const task = prompts.find((p) => p.id === promptId);
    document.getElementById("topic-context-title").textContent = task
      ? task.title + " · " + task.id
      : "任务正文 · " + prompts.length + " 个版本";
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
          ? "查看模型厂商、接入供应商和费用口径；打开预览查看实现。"
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
            '&tab=prompt">比较此版本 →</a></header><p class="topic-table-hint">表格可横向滚动查看供应商、日期、费用与操作 →</p><div class="topic-table-scroll" tabindex="0" aria-label="实验记录表，包含模型、模型厂商、接入供应商与费用，可横向滚动"><table class="topic-runs-table"><caption class="sr-only">' +
            e(p.title) +
            '的实验记录</caption><thead><tr><th scope="col">模型</th><th scope="col">模型厂商</th><th scope="col">接入/付费供应商</th><th scope="col">推理档位</th><th scope="col">轮次</th><th scope="col">日期</th><th scope="col">费用记录</th><th scope="col">操作</th></tr></thead><tbody>' +
            items
              .map((r) => {
                const href = U.previewURL(r);
                return (
                  '<tr class="topic-run-row" id="run-' +
                  e(r.id) +
                  '"><th scope="row" class="topic-run-model">' +
                  e(U.modelLabel(data, r)) +
                  U.executionModeBadge(r) +
                  '</th><td class="topic-run-model-maker"><span class="mobile-cell-label" aria-hidden="true">模型厂商</span>' +
                  e(U.modelProvider(data, r)) +
                  '</td><td class="topic-run-provider"><span class="mobile-cell-label" aria-hidden="true">接入/付费供应商</span>' +
                  e(r.billing?.provider || "未记录") +
                  '</td><td class="topic-run-effort">' +
                  e(U.effortLabel(r.effort)) +
                  '</td><td class="topic-run-round">' +
                  e(U.roundLabel(r)) +
                  '</td><td class="topic-run-date" id="date-' +
                  e(r.id) +
                  '"><time>' +
                  e(r.date || "日期未记录") +
                  '</time></td><td class="topic-run-billing" id="billing-' +
                  e(r.id) +
                  '">' +
                  billingMarkup(r) +
                  '</td><td class="topic-run-actions"><div class="topic-row-actions">' +
                  (U.screenshotURL(r)
                    ? '<a href="' +
                      e(U.screenshotURL(r)) +
                      '" target="_blank" rel="noopener">截图 ↗</a>'
                    : "") +
                  (href
                    ? '<a href="' +
                      e(href) +
                      '" target="_blank" rel="noopener">' +
                      (r.preview.kind === "external"
                        ? "外部预览 ↗"
                        : "预览 ↗") +
                      "</a>"
                    : '<span class="missing-record">无预览</span>') +
                  '<button data-compare="' +
                  e(r.id) +
                  '" aria-pressed="false">加入对比</button><a href="' +
                  e(U.documentURL(r)) +
                  '">记录</a><button class="row-details-toggle" data-row-details aria-expanded="false" aria-controls="date-' +
                  e(r.id) +
                  " billing-" +
                  e(r.id) +
                  '">日期、供应商与费用明细</button></div></td></tr>'
                );
              })
              .join("") +
            "</tbody></table></div></section>"
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
          e(p.text || "点击任务正文后加载内容。") +
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
    if (sort !== "model") p.set("sort", sort);
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
    const details = event.target.closest("[data-row-details]");
    if (details) {
      const expanded = details.getAttribute("aria-expanded") !== "true";
      details.setAttribute("aria-expanded", String(expanded));
      details.closest("tr").classList.toggle("details-expanded", expanded);
      details.textContent = expanded ? "收起详情" : "日期与费用";
      return;
    }
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
    sort = p.get("sort") === "recent" ? "recent" : "model";
    render();
  });
  await render();
  root.dispatchEvent(new Event("archive:topic-ready", { bubbles: true }));
  if (location.hash.startsWith("#run-"))
    document
      .getElementById(decodeURIComponent(location.hash.slice(1)))
      ?.scrollIntoView();
})();
