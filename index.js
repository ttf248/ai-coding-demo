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
    provider: params.get("provider") || "",
    model: params.get("model") || "",
    type: params.get("type") || "",
    prompt: params.get("prompt") || "",
    preview: params.get("preview") || "",
    testing: ["active", "archived", "all"].includes(params.get("testing"))
      ? params.get("testing")
      : "active",
    sort: params.get("sort") || "latest",
    group: params.get("group") || "topics",
    view: params.get("view") || "grid",
  };
  let visible = 9;
  $("stats").innerHTML = [
    [data.topics.length, "实验主题"],
    [data.runs.length, "实验记录"],
    [data.runs.filter((r) => r.preview.kind !== "none").length, "可预览"],
    [data.guides.length, "技术主题"],
  ]
    .map(
      ([n, label]) =>
        "<div><strong>" + n + "</strong><span>" + label + "</span></div>",
    )
    .join("");
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
  const providers = [
    ...new Set(data.models.map((model) => model.provider || "unknown")),
  ].sort((a, b) => {
    if (a === b) return 0;
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return a.localeCompare(b, "en");
  });
  options(
    "provider",
    providers.map((provider) => [
      provider,
      provider === "unknown" ? "未记录 / 多轮混合" : provider,
    ]),
  );
  $("model").insertAdjacentHTML(
    "beforeend",
    U.groupedOptions(
      [...data.models].sort(U.compareModels),
      (m) => m.provider || "未记录 / 多轮混合",
      (m) => '<option value="' + e(m.id) + '">' + e(m.label) + "</option>",
    ),
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
  function render(reset = false) {
    if (reset) visible = 9;
    const matched = U.filterRuns(data, state);
    let items;
    if (state.group === "runs") items = matched.map((r) => U.runCard(data, r));
    else {
      const topics = [...new Set(matched.map((r) => r.topicId))].map((id) =>
        data.topics.find((t) => t.id === id),
      );
      if (
        !state.provider &&
        !state.model &&
        !state.type &&
        !state.prompt &&
        !state.preview
      ) {
        topics.push(
          ...data.topics.filter(
            (t) =>
              !data.runs.some((r) => r.topicId === t.id) &&
              (state.testing === "all" ||
                U.isTopicArchived(t) === (state.testing === "archived")) &&
              (!state.category || t.category === state.category) &&
              (!state.q ||
                [t.title, t.description, t.id]
                  .join(" ")
                  .toLowerCase()
                  .includes(state.q.toLowerCase())),
          ),
        );
      }
      if (state.sort === "title")
        topics.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
      items = topics.map((t) => {
        const runs = matched.filter((r) => r.topicId === t.id),
          all = data.runs.filter((r) => r.topicId === t.id),
          first = runs[0];
        const latest = [...runs].sort(
          (a, b) =>
            (b.date || "").localeCompare(a.date || "") ||
            U.compareModelRuns(data, a, b),
        )[0];
        const previewRun =
          latest && U.previewURL(latest)
            ? latest
            : runs.find((r) => U.previewURL(r));
        const screenshotRun = [...runs]
          .filter((r) => U.screenshotURL(r))
          .sort(
            (a, b) =>
              (b.date || "").localeCompare(a.date || "") ||
              U.compareModelRuns(data, a, b),
          )[0];
        const coverRun =
          t.thumbnail &&
          data.runs.find((r) => r.id === t.thumbnail.sourceRunId);
        const cover = screenshotRun
          ? U.screenshotFigure(data, screenshotRun, "topic-cover")
          : coverRun && runs.some((r) => r.id === coverRun.id)
            ? '<figure class="topic-cover"><img src="' +
              e(t.thumbnail.path) +
              '" alt="' +
              e(
                t.title +
                  " · " +
                  U.runSummary(data, coverRun) +
                  " 实际预览截图",
              ) +
              '" loading="lazy" width="720" height="420"><figcaption>实际截图 · ' +
              e(
                U.modelLabel(data, coverRun) +
                  " · " +
                  U.effortLabel(coverRun.effort),
              ) +
              "</figcaption></figure>"
            : "";
        const recommended =
          runs.find(
            (r) =>
              r.id !== first.id &&
              U.promptFor(data, r)?.hash === U.promptFor(data, first)?.hash,
          ) || runs[1];
        return (
          '<article class="card topic-card' +
          (cover ? " has-cover" : "") +
          '">' +
          cover +
          '<div class="topic-body"><div class="card-top"><span class="eyebrow">' +
          e(data.categories.find((c) => c.id === t.category).label) +
          '</span><span class="pill">' +
          runs.length +
          (runs.length !== all.length ? " / " + all.length : "") +
          " 个版本</span>" +
          (U.isTopicArchived(t) ? '<span class="pill">已归档</span>' : "") +
          '</div><h3><a href="topic.html?id=' +
          t.id +
          '">' +
          e(t.title) +
          "</a></h3><p>" +
          e(t.description) +
          '</p><p class="topic-metrics">' +
          new Set(runs.map((r) => r.modelId)).size +
          " 个模型 · " +
          e(latest?.date || "日期未记录") +
          '</p><div class="latest-run"><span>最新实验</span><strong>' +
          e(
            latest
              ? U.modelLabel(data, latest) +
                  " · " +
                  U.effortLabel(latest.effort)
              : "尚无实验记录",
          ) +
          '</strong></div><details class="topic-models"><summary>全部模型</summary><div class="tags">' +
          [
            ...new Set(
              [...runs]
                .sort((a, b) => U.compareModelRuns(data, a, b))
                .map((r) => U.modelLabel(data, r)),
            ),
          ]
            .map((m) => "<span>" + e(m) + "</span>")
            .join("") +
          '</div></details><div class="card-actions">' +
          (previewRun
            ? '<a class="preview-link" href="' +
              e(U.previewURL(previewRun)) +
              '" target="_blank" rel="noopener" aria-label="打开预览：' +
              e(t.title + " · " + U.runSummary(data, previewRun)) +
              '">打开预览 ↗</a>'
            : '<span class="no-preview">暂无可用预览</span>') +
          '<a href="topic.html?id=' +
          t.id +
          '">查看实验 →</a>' +
          (recommended
            ? '<a class="button" href="compare.html?left=' +
              encodeURIComponent(first.id) +
              "&right=" +
              encodeURIComponent(recommended.id) +
              '" title="' +
              e(
                U.runSummary(data, first) +
                  " / " +
                  U.runSummary(data, recommended),
              ) +
              '">对比版本</a>'
            : "") +
          "</div></div></article>"
        );
      });
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
    for (const key of [
      "q",
      "category",
      "provider",
      "model",
      "type",
      "prompt",
      "preview",
      "testing",
      "sort",
    ])
      $(key).value = state[key];
    $("active-filters").innerHTML = [
      "q",
      "category",
      "provider",
      "model",
      "type",
      "prompt",
      "preview",
      "testing",
      "sort",
    ]
      .filter(
        (key) =>
          state[key] &&
          !(key === "sort" && state[key] === "latest") &&
          !(key === "testing" && state[key] === "active"),
      )
      .map((key) => {
        const label =
          key === "q"
            ? "搜索：" + state[key]
            : key === "testing"
              ? { active: "参与测试", archived: "已归档", all: "全部案例" }[
                  state[key]
                ]
              : $(key).selectedOptions?.[0]?.textContent || state[key];
        return (
          '<button data-remove-filter="' +
          key +
          '" aria-label="移除筛选 ' +
          e(label) +
          '">' +
          e(label) +
          " ×</button>"
        );
      })
      .join("");
    document.querySelectorAll("[data-testing]").forEach((link) => {
      const key = link.dataset.testing;
      const count = data.topics.filter(
        (t) => key === "all" || U.isTopicArchived(t) === (key === "archived"),
      ).length;
      link.textContent =
        { active: "参与测试", archived: "已归档", all: "全部案例" }[key] +
        " · " +
        count;
      if (key === state.testing) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    const search = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => {
      if (v) search.set(k, v);
    });
    history.replaceState(null, "", "?" + search.toString() + location.hash);
    selection();
  }
  [
    "q",
    "category",
    "provider",
    "model",
    "type",
    "prompt",
    "preview",
    "testing",
    "sort",
  ].forEach((key) =>
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
  document.querySelectorAll("[data-testing]").forEach((link) =>
    link.addEventListener("click", (event) => {
      event.preventDefault();
      state.testing = link.dataset.testing;
      render(true);
    }),
  );
  $("load-more").addEventListener("click", () => {
    visible += 9;
    render();
  });
  document.querySelectorAll("[data-reset]").forEach((b) =>
    b.addEventListener("click", () => {
      Object.assign(state, {
        q: "",
        category: "",
        provider: "",
        model: "",
        type: "",
        prompt: "",
        preview: "",
        testing: "active",
        sort: "latest",
      });
      render(true);
    }),
  );
  $("active-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-filter]");
    if (!button) return;
    const key = button.dataset.removeFilter;
    state[key] = key === "sort" ? "latest" : key === "testing" ? "active" : "";
    render(true);
  });
  $("advanced-filters").open = !!(
    state.category ||
    state.type ||
    state.prompt ||
    state.preview
  );
  $("recent-list").innerHTML = U.filterRuns(data, { testing: "active" })
    .slice(0, 5)
    .map(
      (r) =>
        '<a href="topic.html?id=' +
        e(r.topicId) +
        "&prompt=" +
        e(r.promptId) +
        "&view=list#run-" +
        e(r.id) +
        '"><span>' +
        e(data.topics.find((t) => t.id === r.topicId).title) +
        '</span><strong class="recent-model">' +
        e(U.modelLabel(data, r)) +
        "</strong><small><span>" +
        e(U.effortLabel(r.effort)) +
        " · " +
        e(U.roundLabel(r)) +
        "</span><time>" +
        e(r.date || "日期未记录") +
        "</time></small></a>",
    )
    .join("");
  function guides() {
    const q = $("guide-search").value.toLowerCase();
    const list = data.guides.filter((g) =>
      [g.title, g.type, g.search].join(" ").toLowerCase().includes(q),
    );
    $("guide-grid").innerHTML = list
      .map(
        (g) =>
          '<article class="guide"><span>' +
          e(g.type) +
          "</span><h3>" +
          e(g.title) +
          '</h3><a href="' +
          g.document +
          '">说明</a> · <a href="' +
          g.example +
          '">运行示例 ↗</a></article>',
      )
      .join("");
    $("guide-empty").hidden = !!list.length;
  }
  $("guide-search").addEventListener("input", guides);
  document
    .querySelector('nav a[href="#guides"]')
    .addEventListener("click", () => {
      $("guides").open = true;
    });
  if (location.hash === "#guides") $("guides").open = true;
  guides();
  render();
})();
