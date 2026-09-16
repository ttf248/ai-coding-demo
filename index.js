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
      items = topics.map((t) => {
        const runs = matched.filter((r) => r.topicId === t.id),
          all = data.runs.filter((r) => r.topicId === t.id),
          first = runs[0];
        const recommended =
          runs.find(
            (r) =>
              r.id !== first.id &&
              U.promptFor(data, r)?.hash === U.promptFor(data, first)?.hash,
          ) || runs[1];
        return (
          '<article class="card topic-card"><div class="card-top"><span class="eyebrow">' +
          e(data.categories.find((c) => c.id === t.category).label) +
          '</span><span class="pill">' +
          runs.length +
          (runs.length !== all.length ? " / " + all.length : "") +
          ' 个版本</span></div><h3><a href="topic.html?id=' +
          t.id +
          '">' +
          e(t.title) +
          "</a></h3><p>" +
          e(t.description) +
          '</p><div class="tags">' +
          [...new Set(runs.map((r) => U.modelLabel(data, r)))]
            .map((m) => "<span>" + e(m) + "</span>")
            .join("") +
          '</div><div class="card-actions"><a href="topic.html?id=' +
          t.id +
          '">查看实验 →</a>' +
          (recommended
            ? '<a class="button" href="compare.html?left=' +
              encodeURIComponent(first.id) +
              "&right=" +
              encodeURIComponent(recommended.id) +
              '">双栏对比</a>'
            : "<span>最近 " + e(first.date || "未记录") + "</span>") +
          "</div></article>"
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
      "model",
      "type",
      "prompt",
      "preview",
      "sort",
    ])
      $(key).value = state[key];
    const search = new URLSearchParams();
    Object.entries(state).forEach(([k, v]) => {
      if (v) search.set(k, v);
    });
    history.replaceState(null, "", "?" + search.toString());
    selection();
  }
  ["q", "category", "model", "type", "prompt", "preview", "sort"].forEach(
    (key) =>
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
      Object.assign(state, {
        q: "",
        category: "",
        model: "",
        type: "",
        prompt: "",
        preview: "",
        sort: "latest",
      });
      render(true);
    }),
  );
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
  guides();
  render();
})();
