(async function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI,
    R = window.ArchiveTopicRecords,
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
  let view = ["models", "matrix", "list", "prompt"].includes(params.get("view"))
    ? params.get("view")
    : "list";
  let modelId = models.some((m) => m.id === params.get("model"))
    ? params.get("model")
    : "";
  let provider = models.some((m) => m.provider === params.get("provider"))
    ? params.get("provider") || ""
    : "";
  let effort = efforts.includes(params.get("effort"))
    ? params.get("effort")
    : "";
  let query = params.get("q") || "";
  let sort = ["recent", "score"].includes(params.get("sort"))
    ? params.get("sort")
    : "model";
  const allGroups = R.group(data, runs);
  const groupKeys = new Set(allGroups.map((group) => group.key));
  const conditionKeys = new Set(
    allGroups.flatMap((group) =>
      group.conditions.map((condition) => condition.key),
    ),
  );
  let openGroups = new Set(
    params.getAll("open").filter((key) => groupKeys.has(key)),
  );
  let openHistory = new Set(
    params.getAll("history").filter((key) => conditionKeys.has(key)),
  );
  let explicitExpansion = params.has("expanded");
  let visibleGroups = [];
  function anchorRun() {
    try {
      return location.hash.startsWith("#run-")
        ? runs.find(
            (run) => run.id === decodeURIComponent(location.hash.slice(5)),
          )
        : null;
    } catch {
      return null;
    }
  }
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
    '<div class="topic-toolbar"><label' +
    (prompts.length === 1 ? " hidden" : "") +
    '>提示词版本<select id="topic-prompt"><option value="">全部版本</option>' +
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
    '</select></label><div class="segments" aria-label="主题内容"><button data-topic-view="list">全部记录</button><button data-topic-view="models">按模型</button><button data-topic-view="matrix">档位覆盖</button></div></div>' +
    '<section class="topic-context" aria-label="当前任务范围"><h2 id="topic-context-title"></h2><button data-read-task>阅读任务正文 →</button></section>' +
    '<details class="pricing-context" id="pricing-context" aria-label="供应商与费用口径"><summary>费用口径 <span>厂商、接入供应商与计费说明</span></summary><h2>模型厂商、接入供应商与费用</h2><p>实验行分别标出模型厂商与实际接入/计费供应商。订阅展示套餐额度，API 按实际 token 和工具用量计费；批次金额不会拆算成单案例费用。</p><details><summary>公开价格示例（美元，查阅于 2026-10-14）</summary><div class="pricing-examples"><p><strong>OpenAI：</strong>ChatGPT Plus 为 $20/月，Codex 使用包含在计划额度内且受使用限制；GPT-6 Astra 标准 API 为输入 $10、输出 $50 / 百万 token。假设一次任务恰好使用 100 万输入 + 100 万输出 token，API 约 $60，是 Plus 月费的 3 倍。</p><p><strong>Anthropic：</strong>Claude Pro 为 $20/月，Max 5x / 20x 为 $100 / $200 每月；Claude Opus 5.5 标准 API 为输入 $4、输出 $20 / 百万 token。同样假设 100 万输入 + 100 万输出，API 约 $24，是 Pro 月费的 1.2 倍。</p><p>这些是不同产品的公开标价量级示例，不代表本项目任一案例的 token 用量或真实账单。订阅有额度与速率限制，和 API token 账单不是等价服务；第三方价格也由实际平台决定，不能套用统一加价倍数。例如 OpenCode 当前把 Nemotron 3 Ultra Free 列为免费模型。</p><ul><li><a href="https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus" target="_blank" rel="noopener">ChatGPT Plus 月费与 API 单独计费</a> · <a href="https://openai.com/codex/" target="_blank" rel="noopener">OpenAI Codex 计划说明</a> · <a href="https://developers.openai.com/api/docs/models/gpt-6-astra" target="_blank" rel="noopener">GPT-6 Astra API 价格</a></li><li><a href="https://support.anthropic.com/en/articles/11049762-choosing-a-claude-ai-plan" target="_blank" rel="noopener">Claude 计划价格</a> · <a href="https://www.anthropic.com/claude/opus" target="_blank" rel="noopener">Opus 5.5 API 价格</a></li><li><a href="https://opencode.ai/v2/docs/console/models/" target="_blank" rel="noopener">OpenCode 模型及免费档位</a></li></ul></div></details></details>' +
    '<div class="topic-filters" id="topic-filters"><label class="topic-search">搜索实验<input id="topic-search" type="search" placeholder="模型、档位或实验描述" autocomplete="off"></label><label>模型 / 厂商<select id="topic-model"><option value="">全部模型</option>' +
    U.modelFilterOptions(models) +
    '</select></label><details id="topic-more-filters" class="topic-more-filters"><summary>更多筛选</summary><div><label>推理档位<select id="topic-effort"><option value="">全部档位</option>' +
    efforts
      .map(
        (v) =>
          '<option value="' + e(v) + '">' + e(U.effortLabel(v)) + "</option>",
      )
      .join("") +
    '</select></label><label id="topic-sort-field">排序<select id="topic-sort"><option value="model">模型 / 档位从高到低</option><option value="recent">日期从新到旧</option><option value="score">截图评分（同任务内）</option></select></label></div></details><button id="topic-reset">清除筛选</button></div>' +
    '<div class="topic-results-heading"><p id="topic-count" role="status"></p><p id="topic-results-help"></p></div><section id="topic-matrix" aria-label="模型与档位实验矩阵" hidden></section><section id="topic-models" aria-label="按模型浏览实验"></section><section id="topic-list" hidden><div class="topic-run-groups"></div></section><section id="topic-prompts" class="prompt-library" hidden><h2>任务与版本</h2><div></div></section>';
  root.append(document.getElementById("pricing-context"));
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
      e(compactBilling(run)) +
      "</summary><p>" +
      e(billingSummary(run)) +
      "<br>" +
      e(R.durationSummary(run)) +
      "<br>模型厂商：" +
      e(U.modelProvider(data, run)) +
      "；接入/付费供应商：" +
      e(provider) +
      "。" +
      (note ? "<br>" + e(note) : "") +
      "</p></details>"
    );
  }
  function compactBilling(run) {
    const b = run.billing;
    if (!b) return "费用未记录";
    if (b.type === "subscription") return "订阅额度";
    const amount =
      b.amount == null
        ? "金额未记录"
        : b.unit === "USD"
          ? "$" + Number(b.amount).toFixed(2)
          : `${b.amount} ${b.unit || ""}`.trim();
    if (b.type === "batch")
      return `批次总额 ${amount} · ${b.caseCount == null ? "案例数未记录" : b.caseCount + " 案例"}`;
    if (b.amount === 0) return "免费";
    return b.amount == null ? "费用未记录" : "单次 " + amount;
  }
  function toolLabel(run) {
    return R.toolLabel(data, run);
  }
  function durationMarkup(run) {
    const duration = run.billing?.duration;
    if (!duration) return '<span class="missing-record">耗时未记录</span>';
    const batch = run.billing.type === "batch";
    return (
      '<strong title="' +
      e(R.durationSummary(run)) +
      '">' +
      e(duration.text) +
      "</strong><small>" +
      (batch
        ? "批次耗时 · " +
          (run.billing.caseCount == null
            ? "案例数未记录"
            : run.billing.caseCount + " 案例")
        : "单次耗时") +
      "</small>"
    );
  }
  const visibleConditionRecords = 3;
  function modelRecord(run, latest, historical = false) {
    const href = U.previewURL(run);
    const mode =
      U.executionModeBadge(run) ||
      '<span class="model-record-mode">' +
        e(U.executionModeText(run)) +
        "</span>";
    return (
      '<tr class="model-run-record" id="run-' +
      e(run.id) +
      '">' +
      '<th scope="row" class="model-record-identity"><strong class="model-record-effort">' +
      e(U.effortLabel(run.effort)) +
      '</strong><small class="model-record-round">' +
      e(U.roundLabel(run)) +
      '</small></th><td class="model-record-date"><time>' +
      e(run.date || "日期未记录") +
      '</time></td><td class="model-record-facts"><span class="model-record-provider">' +
      e(run.billing?.provider || "供应商未记录") +
      '</span><small class="model-record-tool">' +
      e(toolLabel(run)) +
      '</small></td><td class="model-record-fee" title="' +
      e([billingSummary(run), run.billing?.note].filter(Boolean).join("；")) +
      '">' +
      e(compactBilling(run)) +
      (run.billing?.plan ? "<small>" + e(run.billing.plan) + "</small>" : "") +
      '</td><td class="model-record-duration">' +
      durationMarkup(run) +
      '</td><td class="model-record-input"><span class="model-input-state" title="' +
      e(run.input?.notes || "") +
      '">' +
      e(U.completenessLabel(run.input?.completeness)) +
      "</span><small>" +
      mode +
      "</small>" +
      (historical
        ? '<small class="model-record-relation">与本组最近记录：' +
          e(U.relation(data, latest, run)) +
          "</small>"
        : "") +
      '</td><td class="model-record-operation">' +
      '<div class="model-record-actions">' +
      (href
        ? '<a class="model-preview" href="' +
          e(href) +
          '" target="_blank" rel="noopener">' +
          (run.preview.kind === "external" ? "外部预览 ↗" : "预览 ↗") +
          "</a>"
        : '<span class="missing-record">无预览</span>') +
      (U.screenshotURL(run)
        ? '<a class="model-record-screenshot" href="' +
          e(U.screenshotURL(run)) +
          '" target="_blank" rel="noopener">截图 ↗</a>'
        : "") +
      '<button data-compare="' +
      e(run.id) +
      '" aria-pressed="false">加入对比</button>' +
      '<a class="model-record-reader" href="' +
      e(U.documentURL(run)) +
      '">完整明细 →</a></div></td></tr>'
    );
  }
  function modelsMarkup(groups) {
    return (
      '<div class="model-overview-toolbar"><span>按模型分组，记录按列对齐；更早轮次可展开查看。</span><button data-expand-models>' +
      (groups.every((group) => openGroups.has(group.key))
        ? "收起全部"
        : "展开全部") +
      "</button></div>" +
      groups
        .map((group, index) => {
          const latest = group.latest,
            preview = group.latestPreview;
          const bodyId = "model-records-" + index;
          return (
            '<section class="topic-model-group" data-model-group="' +
            e(group.modelId) +
            '" data-prompt="' +
            e(group.promptId) +
            '"><header><button class="model-group-toggle" data-model-toggle="' +
            e(group.key) +
            '" aria-expanded="' +
            openGroups.has(group.key) +
            '" aria-controls="' +
            bodyId +
            '"><span class="model-heading"><strong>' +
            e(U.modelLabel(data, latest)) +
            '</strong><span class="model-record-count">' +
            group.runs.length +
            " 条记录</span>" +
            (prompts.length > 1
              ? '<span class="model-version">' + e(group.promptId) + "</span>"
              : "") +
            '</span><span class="model-group-meta">' +
            e(U.modelProvider(data, latest)) +
            " · " +
            e(latest.date ? "最近 " + latest.date : "日期未记录") +
            '</span><span class="model-efforts">' +
            group.efforts
              .map((value) => "<span>" + e(U.effortLabel(value)) + "</span>")
              .join("") +
            '</span><span class="model-toggle-label">' +
            (openGroups.has(group.key) ? "收起记录 ↑" : "查看记录 ↓") +
            "</span></button>" +
            (preview
              ? '<a class="model-quick-preview" href="' +
                e(U.previewURL(preview)) +
                '" target="_blank" rel="noopener" title="' +
                e(
                  U.effortLabel(preview.effort) +
                    " · " +
                    U.roundLabel(preview) +
                    " · " +
                    (preview.date || "日期未记录") +
                    " · " +
                    U.executionModeText(preview),
                ) +
                '">' +
                (preview.date ? "最近可用预览 ↗" : "可用预览 ↗") +
                "<small>" +
                e(preview.effort + " · " + U.roundLabel(preview)) +
                U.executionModeBadge(preview) +
                "</small></a>"
              : "") +
            '</header><div class="model-group-records" id="' +
            bodyId +
            '"' +
            (openGroups.has(group.key) ? "" : " hidden") +
            '><p class="model-table-hint">左右滑动查看费用、耗时与操作 →</p><div class="model-table-scroll" tabindex="0" aria-label="模型实验记录，可横向滚动"><table class="model-records-table"><caption class="sr-only">' +
            e(
              U.modelLabel(data, latest) +
                " · " +
                group.promptId +
                " 的实验记录",
            ) +
            '</caption><thead><tr><th scope="col">档位 / 轮次</th><th scope="col">日期</th><th scope="col">接入供应商 / 工具</th><th scope="col">费用记录</th><th scope="col">执行耗时</th><th scope="col">输入 / 执行模式</th><th scope="col">操作</th></tr></thead>' +
            group.conditions
              .map((condition, ci) => {
                const recent = condition.runs.slice(0, visibleConditionRecords);
                const older = condition.runs.slice(visibleConditionRecords);
                const historyId = bodyId + "-history-" + ci;
                const comparison =
                  condition.runs.length > 1
                    ? '<a href="compare.html?left=' +
                      encodeURIComponent(condition.latest.id) +
                      "&right=" +
                      encodeURIComponent(condition.runs[1].id) +
                      '">比较最近两条 →</a>'
                    : "";
                return (
                  '<tbody class="model-condition" data-condition="' +
                  e(condition.key) +
                  '" aria-label="' +
                  e(
                    U.effortLabel(condition.latest.effort) +
                      " · " +
                      toolLabel(condition.latest) +
                      " · " +
                      U.executionModeText(condition.latest),
                  ) +
                  '">' +
                  recent
                    .map((run, index) =>
                      modelRecord(run, condition.latest, index > 0),
                    )
                    .join("") +
                  (older.length || comparison
                    ? '<tr class="model-history-controls"><td colspan="7">' +
                      (older.length
                        ? '<button data-history-toggle="' +
                          e(condition.key) +
                          '" aria-expanded="' +
                          openHistory.has(condition.key) +
                          '" aria-controls="' +
                          historyId +
                          '">' +
                          (openHistory.has(condition.key)
                            ? "收起更早记录"
                            : "查看更早记录") +
                          " · " +
                          older.length +
                          " 条</button>"
                        : "") +
                      comparison +
                      "</td></tr>"
                    : "") +
                  "</tbody>" +
                  (older.length
                    ? '<tbody class="model-history" id="' +
                      historyId +
                      '"' +
                      (openHistory.has(condition.key) ? "" : " hidden") +
                      ">" +
                      older
                        .map((run) => modelRecord(run, condition.latest, true))
                        .join("") +
                      "</tbody>"
                    : "")
                );
              })
              .join("") +
            "</table></div></div></section>"
          );
        })
        .join("")
    );
  }
  const mobileFilters = matchMedia("(max-width: 700px)");
  function syncAdvancedFilters() {
    document.getElementById("topic-more-filters").open =
      !mobileFilters.matches || !!effort || sort !== "model";
  }
  mobileFilters.addEventListener("change", syncAdvancedFilters);
  syncAdvancedFilters();
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
          '</small><small class="matrix-duration">' +
          e(R.durationSummary(r)) +
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
          (!provider || U.modelProviderId(data, r) === provider) &&
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
              toolLabel(r),
              U.executionModeText(r),
              r.date,
              r.promptId,
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
          (sort === "score" ? U.compareRunScores(a, b) : 0) ||
          (sort === "recent"
            ? (b.date || "").localeCompare(a.date || "")
            : 0) ||
          U.compareModelRuns(data, a, b),
      );
    const visibleModels = models.filter((m) =>
      matched.some((r) => r.modelId === m.id),
    );
    const visibleEfforts = efforts.filter((v) =>
      matched.some((r) => r.effort === v),
    );
    visibleGroups = R.group(data, matched, sort);
    if (!explicitExpansion) {
      openGroups = new Set(
        modelId || effort || query.trim()
          ? visibleGroups.map((group) => group.key)
          : [],
      );
    }
    const anchor = anchorRun();
    if (anchor && matched.some((run) => run.id === anchor.id)) {
      openGroups.add(R.modelKey(anchor));
      const condition = visibleGroups
        .flatMap((group) => group.conditions)
        .find((item) => item.key === R.conditionKey(anchor));
      if (condition?.latest.id !== anchor.id)
        openHistory.add(R.conditionKey(anchor));
    }
    document.getElementById("topic-prompt").value = promptId;
    document.getElementById("topic-model").value =
      modelId || (provider ? "provider:" + provider : "");
    document.getElementById("topic-effort").value = effort;
    document.getElementById("topic-sort").value = sort;
    document.getElementById("topic-search").value = query;
    document.getElementById("topic-filters").hidden = view === "prompt";
    document.getElementById("pricing-context").hidden = view === "prompt";
    document.getElementById("topic-sort-field").hidden = view === "matrix";
    document.querySelector(".topic-context").hidden = view === "prompt";
    document.getElementById("topic-reset").disabled =
      !modelId &&
      !provider &&
      !effort &&
      !query &&
      !promptId &&
      sort === "model";
    const task = prompts.find((p) => p.id === promptId);
    document.getElementById("topic-context-title").textContent = task
      ? task.title + " · " + task.id
      : prompts.length === 1
        ? "任务版本 " + prompts[0].id
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
          ? "费用与耗时标明单次或批次口径；批次数据不拆算为单案例。"
          : view === "models"
            ? "保留工具与执行模式差异；完整说明从明细入口查看。"
            : "保留历史任务版本，完整原始输入在各条实验记录中。";
    for (const key of ["models", "matrix", "list", "prompt"]) {
      document.getElementById(
        key === "prompt" ? "topic-prompts" : "topic-" + key,
      ).hidden = view !== key;
      root
        .querySelectorAll('[data-topic-view="' + key + '"]')
        .forEach((button) =>
          button.setAttribute("aria-pressed", String(view === key)),
        );
    }
    document.getElementById("topic-models").innerHTML =
      view === "models"
        ? matched.length
          ? modelsMarkup(visibleGroups)
          : '<div class="topic-empty"><h2>没有符合条件的实验</h2><p>请调整模型、档位或搜索词。</p><button data-reset-filters>清除筛选</button></div>'
        : "";
    const cells = (model, effort) =>
      matched
        .filter((r) => r.modelId === model.id && r.effort === effort)
        .sort((a, b) => U.compareModelRuns(data, a, b));
    document.getElementById("topic-matrix").innerHTML =
      view === "matrix"
        ? '<div class="matrix-desktop table-scroll" tabindex="0" aria-label="实验矩阵，可横向滚动"><table class="archive-table"><caption>' +
          e(topic.title) +
          " · " +
          e(promptId || "全部版本") +
          '</caption><thead><tr><th scope="col">模型 / 推理档位</th>' +
          visibleEfforts
            .map(
              (effort) =>
                '<th scope="col">' + e(U.effortLabel(effort)) + "</th>",
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
                        ? "<details><summary>" +
                          items.length +
                          " 条实验 · " +
                          (U.bestScoredRun(items)
                            ? "截图 " + U.scoreValue(U.bestScoredRun(items))
                            : "未评分") +
                          "</summary>" +
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
          "</div>"
        : "";
    document.querySelector("#topic-list .topic-run-groups").innerHTML =
      view === "list"
        ? prompts
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
                '">比较此版本 →</a></header><div class="topic-table-scroll" tabindex="0" aria-label="实验记录表，包含作品、模型、截图评分、费用与耗时"><table class="topic-runs-table"><caption class="sr-only">' +
                e(p.title) +
                '的实验记录</caption><thead><tr><th scope="col">作品</th><th scope="col">模型 / 档位</th><th scope="col">截图评分</th><th scope="col">费用记录</th><th scope="col">执行耗时</th><th scope="col">操作</th></tr></thead><tbody>' +
                items
                  .map((r) => {
                    const href = U.previewURL(r),
                      image = U.screenshotThumbnailURL(r) || U.screenshotURL(r);
                    return `<tr class="topic-run-row" id="run-${e(r.id)}">
                    <td class="topic-run-art">${image ? `<a href="${e(U.screenshotURL(r))}" target="_blank" rel="noopener" aria-label="查看 ${e(U.runSummary(data, r))} 截图"><img loading="lazy" src="${e(image)}" alt="${e(r.title)} 实际截图"></a>` : '<span class="missing-record">无截图</span>'}</td>
                    <th scope="row" class="topic-run-model">${e(U.modelLabel(data, r))}
                      <small class="topic-run-condition"><span class="topic-run-effort">${e(U.effortLabel(r.effort))}</span> · <span class="topic-run-round">${e(U.roundLabel(r))}</span></small>
                      <span class="topic-run-input"><span>${e(U.completenessLabel(r.input?.completeness))}</span><small>${U.executionModeBadge(r)}</small></span>
                      <details class="run-context"><summary>执行条件</summary><dl>
                        <dt>模型厂商</dt><dd class="topic-run-model-maker">${e(U.modelProvider(data, r))}</dd>
                        <dt>接入/付费供应商</dt><dd class="topic-run-provider">${e(r.billing?.provider || "未记录")}</dd>
                        <dt>运行工具</dt><dd class="topic-run-tool">${e(toolLabel(r))}</dd>
                        <dt>实验日期</dt><dd class="topic-run-date" id="date-${e(r.id)}">${e(r.date || "日期未记录")}</dd>
                        <dt>执行模式</dt><dd>${e(U.executionModeText(r))}</dd>
                      </dl></details>
                    </th>
                    <td class="topic-run-score">${U.scoreDetails(r)}</td>
                    <td class="topic-run-billing" id="billing-${e(r.id)}">${billingMarkup(r)}${r.billing?.plan ? `<small class="topic-run-plan">${e(r.billing.plan)}</small>` : ""}</td>
                    <td class="topic-run-duration">${durationMarkup(r)}</td>
                    <td class="topic-run-actions"><div class="topic-row-actions">
                      <button data-compare="${e(r.id)}" aria-pressed="false">加入对比</button>
                      ${href ? `<a href="${e(href)}" target="_blank" rel="noopener">${r.preview.kind === "external" ? "外部预览 ↗" : "预览 ↗"}</a>` : '<span class="missing-record">无预览</span>'}
                      <a href="${e(U.documentURL(r))}">记录</a>
                    </div></td></tr>`;
                  })
                  .join("") +
                "</tbody></table></div></section>"
              );
            })
            .join("") ||
          '<div class="topic-empty"><h2>没有符合条件的实验</h2><p>试试其他模型、档位或搜索词，也可以清除筛选。</p><button data-reset-filters>清除筛选</button></div>'
        : "";
    if (!matched.length && view === "matrix")
      document.getElementById("topic-matrix").innerHTML =
        '<p class="topic-empty">没有符合条件的实验，请调整筛选。</p>';
    document.querySelector("#topic-prompts > div").innerHTML =
      view === "prompt"
        ? prompts
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
            .join("")
        : "";
    refreshSelection();
  }
  function updateURL(replace = false, clearAnchor = false) {
    const p = new URLSearchParams({ id: topic.id, view });
    if (promptId) p.set("prompt", promptId);
    if (modelId) p.set("model", modelId);
    if (provider) p.set("provider", provider);
    if (effort) p.set("effort", effort);
    if (query) p.set("q", query);
    if (sort !== "model") p.set("sort", sort);
    if (explicitExpansion) p.set("expanded", "1");
    for (const key of openGroups) p.append("open", key);
    for (const key of openHistory) p.append("history", key);
    history[replace ? "replaceState" : "pushState"](
      null,
      "",
      "?" + p.toString() + (clearAnchor ? "" : location.hash),
    );
  }
  function resetExpansion() {
    explicitExpansion = false;
    openGroups.clear();
    openHistory.clear();
  }
  function toggleGroup(button, set, label) {
    const key = button.dataset.modelToggle || button.dataset.historyToggle;
    const expanded = !set.has(key);
    expanded ? set.add(key) : set.delete(key);
    explicitExpansion = true;
    button.setAttribute("aria-expanded", String(expanded));
    document.getElementById(button.getAttribute("aria-controls")).hidden =
      !expanded;
    if (button.dataset.modelToggle)
      button.querySelector(".model-toggle-label").textContent = expanded
        ? "收起记录 ↑"
        : "查看记录 ↓";
    else
      button.textContent = (expanded ? "收起更早记录" : "查看更早记录") + label;
    const allButton = root.querySelector("[data-expand-models]");
    if (allButton)
      allButton.textContent = visibleGroups.every((group) =>
        openGroups.has(group.key),
      )
        ? "收起全部"
        : "展开全部";
    updateURL(false, true);
  }
  root.addEventListener("change", (event) => {
    switch (event.target.id) {
      case "topic-prompt":
        promptId = event.target.value;
        break;
      case "topic-model":
        provider = event.target.selectedOptions[0]?.dataset.provider || "";
        modelId = provider ? "" : event.target.value;
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
    const filtering = event.target.id !== "topic-sort";
    if (filtering) resetExpansion();
    syncAdvancedFilters();
    updateURL(false, filtering);
    render();
  });
  root.addEventListener("input", (event) => {
    if (event.target.id !== "topic-search") return;
    query = event.target.value;
    resetExpansion();
    updateURL(true, true);
    render();
  });
  root.addEventListener("click", (event) => {
    const modelToggle = event.target.closest("[data-model-toggle]");
    if (modelToggle) {
      toggleGroup(modelToggle, openGroups, "");
      return;
    }
    const historyToggle = event.target.closest("[data-history-toggle]");
    if (historyToggle) {
      const condition = visibleGroups
        .flatMap((group) => group.conditions)
        .find((item) => item.key === historyToggle.dataset.historyToggle);
      toggleGroup(
        historyToggle,
        openHistory,
        " · " + (condition.runs.length - visibleConditionRecords) + " 条",
      );
      return;
    }
    if (event.target.closest("[data-expand-models]")) {
      const collapse = visibleGroups.every((group) =>
        openGroups.has(group.key),
      );
      for (const group of visibleGroups)
        collapse ? openGroups.delete(group.key) : openGroups.add(group.key);
      explicitExpansion = true;
      updateURL(false, true);
      render();
      return;
    }
    if (event.target.closest("#topic-reset, [data-reset-filters]")) {
      modelId = provider = effort = query = "";
      promptId = "";
      sort = "model";
      resetExpansion();
      syncAdvancedFilters();
      updateURL(false, true);
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
    view = ["models", "matrix", "list", "prompt"].includes(p.get("view"))
      ? p.get("view")
      : "list";
    modelId = models.some((m) => m.id === p.get("model")) ? p.get("model") : "";
    provider = models.some((m) => m.provider === p.get("provider"))
      ? p.get("provider") || ""
      : "";
    effort = efforts.includes(p.get("effort")) ? p.get("effort") : "";
    query = p.get("q") || "";
    sort = ["recent", "score"].includes(p.get("sort"))
      ? p.get("sort")
      : "model";
    openGroups = new Set(p.getAll("open").filter((key) => groupKeys.has(key)));
    openHistory = new Set(
      p.getAll("history").filter((key) => conditionKeys.has(key)),
    );
    explicitExpansion = p.has("expanded");
    syncAdvancedFilters();
    render().then(scrollToAnchor);
  });
  function scrollToAnchor() {
    const run = anchorRun();
    if (run) document.getElementById("run-" + run.id)?.scrollIntoView();
  }
  window.addEventListener("hashchange", () => {
    if (anchorRun()) render().then(scrollToAnchor);
  });
  await render();
  root.dispatchEvent(new Event("archive:topic-ready", { bubbles: true }));
  scrollToAnchor();
})();
