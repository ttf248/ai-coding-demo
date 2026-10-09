(function (global) {
  "use strict";
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const modelLabel = (data, run) =>
    data.models.find((m) => m.id === run.modelId)?.label || "未记录";
  const modelProviderId = (data, run) =>
    data.models.find((m) => m.id === run.modelId)?.provider || "unknown";
  const modelProvider = (data, run) =>
    data.models.find((m) => m.id === run.modelId)?.provider ||
    "未记录 / 多轮混合";
  const executionModeLabel = (mode) =>
    ({
      "design-enhanced": "自主设计授权",
      strict: "按原任务执行",
      unknown: "执行模式未记录",
    })[mode] || "执行模式未记录";
  const executionMode = (run) => run?.input?.executionMode || "unknown";
  const executionModeBadge = (run, className = "execution-mode-chip") =>
    executionMode(run) === "unknown"
      ? ""
      : '<span class="' +
        escape(className) +
        '" title="' +
        escape(
          run.input.authorization || executionModeLabel(executionMode(run)),
        ) +
        '">' +
        escape(executionModeLabel(executionMode(run))) +
        "</span>";
  const isTopicArchived = (topic) => topic?.testingStatus === "archived";
  function compareModels(x, y) {
    const providerOrder =
      Number(!x?.provider) - Number(!y?.provider) ||
      (x?.provider || "").localeCompare(y?.provider || "", "en");
    if (providerOrder) return providerOrder;
    for (
      let i = 0;
      i < Math.max(x?.version?.length || 0, y?.version?.length || 0);
      i++
    ) {
      const order = (y?.version?.[i] || 0) - (x?.version?.[i] || 0);
      if (order) return order;
    }
    return (
      (x?.variant || "").localeCompare(y?.variant || "", "en") ||
      (x?.id || "").localeCompare(y?.id || "", "en")
    );
  }
  const effortLabel = (effort) =>
    ({
      default: "default（默认）",
      low: "low（低）",
      medium: "medium（中）",
      high: "high（高）",
      xhigh: "xhigh（超高）",
      max: "max（最大）",
      ultra: "ultra（极高）",
      unknown: "档位未记录",
    })[effort] || effort;
  // Explicit levels first; default and nonstandard labels have no inferred strength.
  const effortOrder = Object.freeze([
    "max",
    "xhigh",
    "high",
    "medium",
    "low",
    "ultra",
    "default",
    "unknown",
  ]);
  function compareEfforts(a, b) {
    const rank = (value) => {
      const index = effortOrder.indexOf(value);
      return index < 0 ? effortOrder.indexOf("ultra") : index;
    };
    return rank(a) - rank(b) || String(a).localeCompare(String(b), "en");
  }
  function groupedOptions(items, groupFor, optionFor) {
    let previous = null;
    let html = "";
    for (const item of items) {
      const group = groupFor(item);
      if (group !== previous) {
        if (previous !== null) html += "</optgroup>";
        html += '<optgroup label="' + escape(group) + '">';
        previous = group;
      }
      html += optionFor(item);
    }
    return html + (previous !== null ? "</optgroup>" : "");
  }
  function compareModelRuns(data, a, b) {
    const order = compareModels(
      data.models.find((m) => m.id === a.modelId),
      data.models.find((m) => m.id === b.modelId),
    );
    if (order) return order;
    const round = (r) => Number((r.runId || r.id).match(/r(\d+)$/)?.[1] || 0);
    return (
      compareEfforts(a.effort, b.effort) ||
      (b.date || "").localeCompare(a.date || "") ||
      round(b) - round(a) ||
      a.id.localeCompare(b.id, "en", { numeric: true })
    );
  }
  const promptFor = (data, run) =>
    data.prompts.find(
      (p) => p.topicId === run.topicId && p.id === run.promptId,
    );
  function relation(data, a, b) {
    if (!a || !b) return "请选择两个实验";
    if (a.topicId !== b.topicId) return "跨主题对比";
    if (
      !a.raw.trim() ||
      !b.raw.trim() ||
      a.input.completeness === "unknown" ||
      b.input.completeness === "unknown"
    )
      return "输入信息不足";
    if (a.rawHash === b.rawHash) return "已记录的原始输入一致";
    if (promptFor(data, a)?.hash === promptFor(data, b)?.hash) {
      const modeA = executionMode(a),
        modeB = executionMode(b);
      if (modeA !== modeB && (modeA !== "unknown" || modeB !== "unknown"))
        return (
          "任务正文一致 · 执行模式不同（A：" +
          executionModeLabel(modeA) +
          "；B：" +
          executionModeLabel(modeB) +
          "）"
        );
      return "任务正文一致 · 原始输入不同";
    }
    return "同主题 · 不同输入";
  }
  function filterRuns(data, state) {
    const query = (state.q || "").trim().toLocaleLowerCase();
    return data.runs
      .filter((r) => {
        const t = data.topics.find((t) => t.id === r.topicId);
        return (
          (!state.testing ||
            state.testing === "all" ||
            (state.testing === "archived") === isTopicArchived(t)) &&
          (!state.category || t.category === state.category) &&
          (!state.provider || modelProviderId(data, r) === state.provider) &&
          (!state.model || r.modelId === state.model) &&
          (!state.type || r.type === state.type) &&
          (!state.prompt || `${r.topicId}/${r.promptId}` === state.prompt) &&
          (!state.preview ||
            (state.preview === "yes") === (r.preview.kind !== "none")) &&
          (!query ||
            [
              t.title,
              r.title,
              r.description,
              modelProvider(data, r),
              modelLabel(data, r),
              r.effort,
              ...r.tags,
              ...r.stack,
            ]
              .join(" ")
              .toLocaleLowerCase()
              .includes(query))
        );
      })
      .sort((a, b) =>
        state.sort === "title"
          ? a.title.localeCompare(b.title, "zh-CN") || a.id.localeCompare(b.id)
          : (b.date || "").localeCompare(a.date || "") ||
            a.id.localeCompare(b.id),
      );
  }
  function diff(a, b) {
    const tokenize = (s) =>
      s.match(/\s+|[\p{Script=Han}]|[\p{L}\p{N}_]+|[^\s]/gu) || [];
    const x = tokenize(a),
      y = tokenize(b);
    if (x.length * y.length > 1000000) {
      let start = 0,
        end = 0;
      while (start < a.length && start < b.length && a[start] === b[start])
        start++;
      while (
        end < a.length - start &&
        end < b.length - start &&
        a[a.length - 1 - end] === b[b.length - 1 - end]
      )
        end++;
      return {
        left:
          escape(a.slice(0, start)) +
          "<del>" +
          escape(a.slice(start, a.length - end)) +
          "</del>" +
          escape(a.slice(a.length - end)),
        right:
          escape(b.slice(0, start)) +
          "<ins>" +
          escape(b.slice(start, b.length - end)) +
          "</ins>" +
          escape(b.slice(b.length - end)),
      };
    }
    const rows = Array.from(
      { length: x.length + 1 },
      () => new Uint32Array(y.length + 1),
    );
    for (let i = x.length - 1; i >= 0; i--)
      for (let j = y.length - 1; j >= 0; j--)
        rows[i][j] =
          x[i] === y[j]
            ? 1 + rows[i + 1][j + 1]
            : Math.max(rows[i + 1][j], rows[i][j + 1]);
    let i = 0,
      j = 0,
      left = "",
      right = "";
    while (i < x.length || j < y.length) {
      if (i < x.length && j < y.length && x[i] === y[j]) {
        left += escape(x[i]);
        right += escape(y[j]);
        i++;
        j++;
      } else if (
        i < x.length &&
        (j === y.length || rows[i + 1][j] >= rows[i][j + 1])
      )
        left += "<del>" + escape(x[i++]) + "</del>";
      else right += "<ins>" + escape(y[j++]) + "</ins>";
    }
    return { left, right };
  }
  function previewURL(run, pageId) {
    if (!run) return null;
    if (run.preview.kind === "external")
      return /^https:\/\//.test(run.preview.externalUrl || "")
        ? run.preview.externalUrl
        : null;
    return (
      run.preview.pages.find(
        (p) => p.id === (pageId || run.preview.defaultPage),
      )?.href || null
    );
  }
  function screenshotURL(run) {
    return run?.screenshot ? `${run.directory}/${run.screenshot}` : null;
  }
  function screenshotFigure(data, run, className) {
    const src = screenshotURL(run);
    if (!src) return "";
    const topic = data.topics.find((item) => item.id === run.topicId);
    const label = runSummary(data, run);
    return (
      '<figure class="' +
      escape(className) +
      '" data-screenshot-run="' +
      escape(run.id) +
      '"><a href="' +
      escape(src) +
      '" target="_blank" rel="noopener" aria-label="打开截图：' +
      escape(topic.title + " · " + label) +
      '"><img src="' +
      escape(src) +
      '" alt="' +
      escape(topic.title + " · " + label + " 实际运行截图") +
      '" loading="lazy" decoding="async" width="1440" height="1050"></a><figcaption>实际截图 · ' +
      escape(label) +
      "</figcaption></figure>"
    );
  }
  const roundLabel = (run) => {
    const match = run.runId.match(/r(\d+)$/);
    return match ? "第 " + Number(match[1]) + " 轮" : "轮次未记录";
  };
  const runSummary = (data, run) =>
    modelLabel(data, run) +
    " · " +
    effortLabel(run.effort) +
    " · " +
    roundLabel(run);
  function setupSelection(data) {
    let selected = [];
    try {
      const stored = JSON.parse(
        sessionStorage.getItem("archive-selection") || "[]",
      );
      if (Array.isArray(stored))
        selected = [...new Set(stored)]
          .filter((id) => data.runs.some((r) => r.id === id))
          .slice(0, 4);
    } catch {}
    const tray = document.getElementById("compare-tray"),
      dialog = document.getElementById("replace-dialog");
    let pending = null;
    function save() {
      try {
        sessionStorage.setItem("archive-selection", JSON.stringify(selected));
      } catch {}
      render();
    }
    function render() {
      tray.hidden = !selected.length;
      document.body.classList.toggle("has-selection", !!selected.length);
      const params = new URLSearchParams();
      selected.forEach((id, i) =>
        params.set(["left", "right", "third", "fourth"][i], id),
      );
      if (selected.length > 2) params.set("layout", "quad");
      tray.innerHTML =
        '<div class="selection-items"><strong>对比栏 · ' +
        selected.length +
        "/4</strong>" +
        selected
          .map((id, i) => {
            const run = data.runs.find((r) => r.id === id);
            const topic = data.topics.find((t) => t.id === run.topicId);
            return (
              '<div class="selection-item"><div><strong>' +
              "ABCD"[i] +
              " · " +
              escape(runSummary(data, run)) +
              "</strong><small>" +
              escape(topic.title) +
              " · 提示词 " +
              escape(run.promptId) +
              '</small></div><button data-remove="' +
              escape(id) +
              '" aria-label="移除 ' +
              escape(runSummary(data, run)) +
              '">×</button></div>'
            );
          })
          .join("") +
        '</div><div class="actions"><button data-clear>清空</button>' +
        (selected.length >= 2
          ? '<a class="button primary" href="compare.html?' +
            escape(params.toString()) +
            '">开始对比 ↗</a>'
          : "<span>再选一个实验</span>") +
        "</div>";
      document.querySelectorAll("[data-compare]").forEach((b) => {
        const on = selected.includes(b.dataset.compare);
        b.setAttribute("aria-pressed", String(on));
        b.textContent = on ? "移出对比" : "加入对比";
      });
    }
    document.addEventListener("click", (event) => {
      const b = event.target.closest("[data-compare]");
      if (b) {
        const id = b.dataset.compare;
        if (!data.runs.some((r) => r.id === id)) return;
        if (selected.includes(id)) selected = selected.filter((v) => v !== id);
        else if (selected.length < 4) selected.push(id);
        else {
          pending = id;
          dialog.querySelector(".replacement-slots").innerHTML = selected
            .map(
              (id, i) =>
                '<button data-slot="' +
                i +
                '">替换 ' +
                "ABCD"[i] +
                "：" +
                escape(
                  runSummary(
                    data,
                    data.runs.find((r) => r.id === id),
                  ),
                ) +
                "</button>",
            )
            .join("");
          dialog.showModal();
          return;
        }
        save();
      }
      const remove = event.target.closest("[data-remove]");
      if (remove) {
        selected = selected.filter((id) => id !== remove.dataset.remove);
        save();
      }
      if (event.target.closest("[data-clear]")) {
        selected = [];
        save();
      }
      const slot = event.target.closest("[data-slot]");
      if (slot && pending) {
        selected[Number(slot.dataset.slot)] = pending;
        pending = null;
        dialog.close();
        save();
      }
      if (event.target.closest("[data-cancel]")) {
        pending = null;
        dialog.close();
      }
    });
    dialog.addEventListener("close", () => {
      pending = null;
    });
    render();
    return render;
  }
  function runCard(data, r) {
    const href = previewURL(r);
    return (
      '<article class="card run-card">' +
      screenshotFigure(data, r, "run-card-screenshot") +
      '<div class="card-top"><span class="eyebrow">' +
      escape(r.type) +
      " / " +
      escape(r.date || "未记录") +
      '</span><span class="pill">' +
      escape(
        (isTopicArchived(data.topics.find((t) => t.id === r.topicId))
          ? "已归档 · "
          : "") + (r.preview.kind === "none" ? "档案" : "可预览"),
      ) +
      "</span></div><h3>" +
      escape(r.title) +
      "</h3><p>" +
      escape(r.description) +
      '</p><div class="tags"><span>' +
      escape(modelLabel(data, r)) +
      "</span><span>" +
      escape(effortLabel(r.effort)) +
      "</span><span>提示词 " +
      escape(r.promptId) +
      "</span>" +
      executionModeBadge(r) +
      '</div><div class="card-actions">' +
      (href
        ? '<a href="' +
          escape(href) +
          '" target="_blank" rel="noopener">打开预览 ↗</a>'
        : "") +
      '<a href="' +
      escape(r.document) +
      '">记录</a><button data-compare="' +
      escape(r.id) +
      '" aria-pressed="false">加入对比</button></div></article>'
    );
  }
  global.ArchiveUI = {
    escape,
    modelLabel,
    modelProviderId,
    modelProvider,
    executionMode,
    executionModeLabel,
    executionModeBadge,
    isTopicArchived,
    compareModelRuns,
    compareModels,
    effortLabel,
    effortOrder,
    compareEfforts,
    groupedOptions,
    promptFor,
    relation,
    filterRuns,
    diff,
    previewURL,
    screenshotURL,
    screenshotFigure,
    setupSelection,
    roundLabel,
    runSummary,
    runCard,
  };
})(typeof window !== "undefined" ? window : globalThis);
