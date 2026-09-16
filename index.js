(function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI,
    $ = (id) => document.getElementById(id),
    e = U.escape;
  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get("q") || "",
    category: params.get("category") || "",
    model: params.get("model") || "",
    type: params.get("type") || "",
    prompt: params.get("prompt") || "",
    preview: params.get("preview") || "",
    sort: params.get("sort") || "latest",
    group: ["topics", "runs"].includes(params.get("group"))
      ? params.get("group")
      : "topics",
    view: ["grid", "list"].includes(params.get("view"))
      ? params.get("view")
      : "grid",
  };
  const filterKeys = [
      "q",
      "category",
      "model",
      "type",
      "prompt",
      "preview",
      "sort",
    ],
    filterDefaults = {
      q: "",
      category: "",
      model: "",
      type: "",
      prompt: "",
      preview: "",
      sort: "latest",
    },
    filterLabels = {
      q: "搜索",
      category: "分类",
      model: "模型",
      type: "产物",
      prompt: "提示词",
      preview: "预览",
      sort: "排序",
    };
  let visible = 9;

  const latestFirst = (a, b) =>
    (b.date || "").localeCompare(a.date || "") ||
    b.id.localeCompare(a.id, "en");
  const previewCount = data.runs.filter(
    (r) => r.preview.kind !== "none",
  ).length;

  function renderHero() {
    $("hero-run-count").textContent = data.runs.length;
    $("hero-topic-count").textContent = data.topics.length;
    $("hero-preview-count").textContent = previewCount;
    $("hero-guide-count").textContent = data.guides.length;
    $("recent-runs").innerHTML = [...data.runs]
      .sort(latestFirst)
      .slice(0, 3)
      .map(
        (r, index) =>
          '<a class="signal-item" href="' +
          e(r.document) +
          '"><span class="signal-number">0' +
          (index + 1) +
          '</span><span class="signal-copy"><strong>' +
          e(r.title) +
          "</strong><small>" +
          e(U.modelLabel(data, r)) +
          " · " +
          e(r.date || "未记录") +
          '</small></span><span class="signal-arrow">↗</span></a>',
      )
      .join("");
  }

  $("stats").innerHTML = [
    [data.topics.length, "实验主题", "TOPICS", "按主题归档"],
    [data.runs.length, "实验记录", "RUNS", "独立保存"],
    [previewCount, "可预览", "LIVE", "可直接打开"],
    [data.guides.length, "技术主题", "NOTES", "可运行示例"],
  ]
    .map(
      ([n, label, code, hint], index) =>
        '<div class="stat-item"><span class="stat-index">0' +
        (index + 1) +
        "</span><div><strong>" +
        n +
        "</strong><span>" +
        e(label) +
        "</span></div><small>" +
        code +
        " · " +
        hint +
        "</small></div>",
    )
    .join("");
  renderHero();

  const options = (id, items) =>
    $(id).insertAdjacentHTML(
      "beforeend",
      items
        .map(
          ([value, label]) =>
            '<option value="' + e(value) + '">' + e(label) + "</option>",
        )
        .join(""),
    );
  options(
    "category",
    data.categories.map((c) => [c.id, c.label]),
  );
  options(
    "model",
    data.models.map((m) => [m.id, m.label]),
  );
  options(
    "type",
    [...new Set(data.runs.map((r) => r.type))].map((t) => [t, t]),
  );
  options(
    "prompt",
    data.prompts.map((p) => [
      p.topicId + "/" + p.id,
      data.topics.find((t) => t.id === p.topicId).title + " / " + p.id,
    ]),
  );
  const selection = U.setupSelection(data);

  function selectedLabel(key) {
    if (key === "q") return state.q;
    return $(key).selectedOptions[0]?.textContent || state[key];
  }
  function renderFilterMeta() {
    const active = filterKeys.filter(
      (key) => state[key] && !(key === "sort" && state[key] === "latest"),
    );
    $("filter-summary").textContent = active.length
      ? active.length + " 个筛选条件生效"
      : state.group === "runs"
        ? "全部实验记录 · 可直接搜索"
        : "全部主题 · 可直接搜索";
    $("active-filters").innerHTML = active
      .map(
        (key) =>
          '<button type="button" data-clear-filter="' +
          e(key) +
          '" aria-label="清除' +
          e(filterLabels[key]) +
          '筛选">' +
          e(filterLabels[key]) +
          " · " +
          e(selectedLabel(key)) +
          " ×</button>",
      )
      .join("");
  }

  function topicCard(t, runs, all, index) {
    const first = runs[0],
      category = data.categories.find((c) => c.id === t.category),
      previewTotal = runs.filter((r) => r.preview.kind !== "none").length,
      models = [...new Set(runs.map((r) => U.modelLabel(data, r)))],
      recommended =
        runs.find(
          (r) =>
            r.id !== first.id &&
            U.promptFor(data, r)?.hash === U.promptFor(data, first)?.hash,
        ) || runs[1],
      countLabel =
        runs.length === all.length
          ? runs.length + " 个版本"
          : runs.length + " / " + all.length + " 个版本";
    return (
      '<article class="card topic-card"><div class="card-glow"></div><div class="card-top"><span class="topic-label"><b>0' +
      (index + 1) +
      "</b> " +
      e(category?.label || "未分类") +
      '</span><span class="pill"><i></i>' +
      countLabel +
      '</span></div><h3><a href="topic.html?id=' +
      e(t.id) +
      '">' +
      e(t.title) +
      "</a></h3><p>" +
      e(t.description) +
      '</p><div class="topic-meta"><span><b>' +
      previewTotal +
      "</b> 个可预览</span><span><b>" +
      models.length +
      "</b> 个模型</span><span>" +
      e(first.date || "未记录") +
      '</span></div><div class="tags">' +
      models
        .slice(0, 4)
        .map((m) => "<span>" + e(m) + "</span>")
        .join("") +
      '</div><div class="card-actions"><a href="topic.html?id=' +
      e(t.id) +
      '">查看实验 <span>→</span></a>' +
      (recommended
        ? '<a class="button" href="compare.html?left=' +
          encodeURIComponent(first.id) +
          "&right=" +
          encodeURIComponent(recommended.id) +
          '">双栏对比 <span>↗</span></a>'
        : '<span class="card-date">最近 ' +
          e(first.date || "未记录") +
          "</span>") +
      "</div></article>"
    );
  }

  function render(reset = false) {
    if (reset) visible = 9;
    const matched = U.filterRuns(data, state);
    let items;
    if (state.group === "runs") items = matched.map((r) => U.runCard(data, r));
    else {
      const topics = [...new Set(matched.map((r) => r.topicId))].map((id) =>
        data.topics.find((t) => t.id === id),
      );
      if (state.sort === "title")
        topics.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
      items = topics.map((t, index) =>
        topicCard(
          t,
          matched.filter((r) => r.topicId === t.id),
          data.runs.filter((r) => r.topicId === t.id),
          index,
        ),
      );
    }
    $("project-grid").className =
      "cards " + (state.view === "list" ? "list" : "");
    $("project-grid").innerHTML = items.slice(0, visible).join("");
    $("result-count").textContent =
      items.length +
      " 个" +
      (state.group === "runs" ? "实验" : "主题") +
      " · " +
      matched.length +
      " 条匹配记录";
    $("range").textContent = items.length
      ? "显示 " + Math.min(visible, items.length) + " / " + items.length
      : "";
    $("empty").hidden = !!items.length;
    $("load-more").hidden = visible >= items.length;
    if (items.length > visible)
      $("load-more").innerHTML =
        "继续加载 " +
        Math.min(9, items.length - visible) +
        " 个 <span>↓</span>";
    document
      .querySelectorAll("[data-group]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.group === state.group)),
      );
    document
      .querySelectorAll("[data-view]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.view === state.view)),
      );
    for (const key of filterKeys) $(key).value = state[key];
    renderFilterMeta();
    const search = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => {
      if (v) search.set(k, v);
    });
    history.replaceState(null, "", "?" + search.toString());
    selection();
  }

  filterKeys.forEach((key) =>
    $(key).addEventListener(key === "q" ? "input" : "change", (ev) => {
      state[key] = ev.target.value;
      render(true);
    }),
  );
  document.querySelectorAll("[data-group]").forEach((b) =>
    b.addEventListener("click", () => {
      state.group = b.dataset.group;
      render(true);
    }),
  );
  document.querySelectorAll("[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      state.view = b.dataset.view;
      render();
    }),
  );
  $("load-more").addEventListener("click", () => {
    visible += 9;
    render();
  });
  document.querySelectorAll("[data-reset]").forEach((b) =>
    b.addEventListener("click", () => {
      Object.assign(state, filterDefaults);
      render(true);
    }),
  );
  document.addEventListener("click", (event) => {
    const clear = event.target.closest("[data-clear-filter]");
    if (!clear) return;
    const key = clear.dataset.clearFilter;
    if (!(key in filterDefaults)) return;
    state[key] = filterDefaults[key];
    render(true);
  });

  function guides() {
    const q = $("guide-search").value.toLowerCase();
    const list = data.guides.filter((g) =>
      [g.title, g.type, g.search].join(" ").toLowerCase().includes(q),
    );
    $("guide-count").textContent = q
      ? list.length + " / " + data.guides.length + " 项"
      : data.guides.length + " 项技术主题";
    $("guide-grid").innerHTML = list
      .map(
        (g, index) =>
          '<article class="guide"><div class="guide-top"><span class="guide-index">0' +
          (index + 1) +
          "</span><span>" +
          e(g.type) +
          "</span></div><h3>" +
          e(g.title) +
          '</h3><div class="guide-links"><a href="' +
          e(g.document) +
          '">说明 <span>↗</span></a><a href="' +
          e(g.example) +
          '">运行示例 <span>↗</span></a></div></article>',
      )
      .join("");
    $("guide-empty").hidden = !!list.length;
  }
  $("guide-search").addEventListener("input", guides);

  function focusSearch() {
    $("q").focus();
    $("q").select();
  }
  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    if (
      (event.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(tag)) ||
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")
    ) {
      event.preventDefault();
      focusSearch();
    } else if (event.key === "Escape" && document.activeElement === $("q")) {
      if ($("q").value) {
        state.q = "";
        render(true);
      }
      $("q").blur();
    }
  });

  guides();
  render();
})();
