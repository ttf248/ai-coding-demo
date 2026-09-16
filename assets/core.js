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
    if (promptFor(data, a)?.hash === promptFor(data, b)?.hash)
      return "任务正文一致 · 原始输入不同";
    return "同主题 · 不同输入";
  }
  function filterRuns(data, state) {
    const query = (state.q || "").trim().toLocaleLowerCase();
    return data.runs
      .filter((r) => {
        const t = data.topics.find((t) => t.id === r.topicId);
        return (
          (!state.category || t.category === state.category) &&
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
  function setupSelection(data) {
    let selected = [];
    try {
      selected = JSON.parse(sessionStorage.getItem("archive-selection") || "[]")
        .filter((id) => data.runs.some((r) => r.id === id))
        .slice(0, 2);
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
      tray.innerHTML =
        "<div><strong>对比栏 · " +
        selected.length +
        "/2</strong><span>" +
        selected
          .map((id) => escape(data.runs.find((r) => r.id === id).title))
          .join(" / ") +
        '</span></div><div class="actions"><button data-clear>清空</button>' +
        (selected.length === 2
          ? '<a class="button primary" href="compare.html?left=' +
            encodeURIComponent(selected[0]) +
            "&right=" +
            encodeURIComponent(selected[1]) +
            '">开始对比 ↗</a>'
          : "<span>再选一个实验</span>") +
        "</div>";
      document.querySelectorAll("[data-compare]").forEach((b) => {
        const on = selected.includes(b.dataset.compare);
        b.setAttribute("aria-pressed", String(on));
        b.textContent = on ? "移出对比" : "加入对比";
      });
    }
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-compare]");
      if (b) {
        const id = b.dataset.compare;
        if (selected.includes(id)) selected = selected.filter((v) => v !== id);
        else if (selected.length < 2) selected.push(id);
        else {
          pending = id;
          dialog.querySelector('[data-slot="0"]').textContent =
            "替换左侧：" + data.runs.find((r) => r.id === selected[0]).title;
          dialog.querySelector('[data-slot="1"]').textContent =
            "替换右侧：" + data.runs.find((r) => r.id === selected[1]).title;
          dialog.showModal();
          return;
        }
        save();
      }
      if (e.target.closest("[data-clear]")) {
        selected = [];
        save();
      }
      const slot = e.target.closest("[data-slot]");
      if (slot && pending) {
        selected[Number(slot.dataset.slot)] = pending;
        pending = null;
        dialog.close();
        save();
      }
      if (e.target.closest("[data-cancel]")) dialog.close();
    });
    render();
    return render;
  }
  function runCard(data, r) {
    const href = previewURL(r);
    return (
      '<article class="card"><div class="card-top"><span class="eyebrow">' +
      escape(r.type) +
      " / " +
      escape(r.date || "未记录") +
      '</span><span class="pill">' +
      escape(r.preview.kind === "none" ? "档案" : "可预览") +
      "</span></div><h3>" +
      escape(r.title) +
      "</h3><p>" +
      escape(r.description) +
      '</p><div class="tags"><span>' +
      escape(modelLabel(data, r)) +
      "</span><span>" +
      escape(r.effort) +
      "</span><span>提示词 " +
      escape(r.promptId) +
      '</span></div><div class="card-actions">' +
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
    promptFor,
    relation,
    filterRuns,
    diff,
    previewURL,
    setupSelection,
    runCard,
  };
})(typeof window !== "undefined" ? window : globalThis);
