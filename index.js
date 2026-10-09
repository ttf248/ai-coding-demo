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
    sort: ["complexity", "latest", "title"].includes(params.get("sort"))
      ? params.get("sort")
      : "complexity",
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
  const previewScopes = new Map();
  function galleryFigure(run, className, source = U.screenshotURL(run)) {
    if (!source) return "";
    return (
      '<figure class="' +
      className +
      '" data-screenshot-run="' +
      e(run.id) +
      '"><button class="cover-preview" data-preview="' +
      e(run.id) +
      '" aria-label="放大预览：' +
      e(run.title + " · " + U.runSummary(data, run)) +
      '"><img src="' +
      e(source) +
      '" alt="' +
      e(run.title + " 实际运行截图") +
      '" loading="lazy" decoding="async" width="1440" height="1050">' +
      '<span class="cover-hint">放大预览 ↗</span></button>' +
      "<figcaption><span>实际截图</span><strong>" +
      e(U.modelLabel(data, run)) +
      "</strong><span> · " +
      e(U.effortLabel(run.effort)) +
      "</span></figcaption></figure>"
    );
  }
  function placeholder(title) {
    return (
      '<div class="topic-placeholder"><span>' +
      e(title) +
      "</span><small>暂无截图</small></div>"
    );
  }
  function render(reset = false) {
    if (reset) visible = 9;
    const matched = U.filterRuns(data, state);
    previewScopes.clear();
    let items;
    if (state.group === "runs")
      items = matched.map((r) => {
        previewScopes.set(r.id, { runs: [r], source: U.screenshotURL(r) });
        const html = U.runCard(data, r)
          .replace(
            '<div class="card-top">',
            '<div class="card-top">' +
              U.complexityBadge(data.topics.find((t) => t.id === r.topicId)),
          )
          .replace(
            U.screenshotFigure(data, r, "run-card-screenshot"),
            galleryFigure(r, "run-card-screenshot"),
          )
          .replace(
            '<div class="card-top">',
            '<div class="run-body"><div class="card-top">',
          )
          .replace("</article>", "</div></article>");
        return r.screenshot
          ? html
          : html.replace(
              '<article class="card run-card">',
              '<article class="card run-card">' + placeholder(r.title),
            );
      });
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
      topics.sort((a, b) => U.compareTopics(a, b, matched, state.sort));
      items = topics.map((t) => {
        const runs = matched.filter((r) => r.topicId === t.id),
          all = data.runs.filter((r) => r.topicId === t.id),
          first = runs[0];
        const latest = [...runs].sort(
          (a, b) =>
            (b.date || "").localeCompare(a.date || "") ||
            U.compareModelRuns(data, a, b),
        )[0];
        let previewRun =
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
        const displayedRun =
          screenshotRun ||
          (coverRun && runs.some((r) => r.id === coverRun.id)
            ? coverRun
            : null);
        const source = screenshotRun
          ? U.screenshotURL(screenshotRun)
          : displayedRun
            ? t.thumbnail.path
            : null;
        const cover = displayedRun
          ? galleryFigure(displayedRun, "topic-cover", source)
          : "";
        // The direct entry and the cover must refer to the same experiment.
        if (displayedRun)
          previewRun = U.previewURL(displayedRun) ? displayedRun : null;
        const inspectRun = displayedRun || previewRun || first;
        if (inspectRun) previewScopes.set(inspectRun.id, { runs, source });
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
          (cover || placeholder(t.title)) +
          '<div class="topic-body"><div class="card-top"><span class="eyebrow">' +
          e(data.categories.find((c) => c.id === t.category).label) +
          "</span>" +
          (U.isTopicArchived(t) ? '<span class="pill">已归档</span>' : "") +
          U.executionModeBadge(previewRun) +
          U.complexityBadge(t) +
          '</div><h3><a href="topic.html?id=' +
          t.id +
          '">' +
          e(t.title) +
          "</a></h3><p>" +
          e(t.description) +
          '</p><p class="topic-metrics">' +
          new Set(runs.map((r) => r.modelId)).size +
          " 个模型 · " +
          (runs.length !== all.length ? "匹配 " : "") +
          runs.length +
          " 个版本" +
          (runs.length !== all.length ? " / 共 " + all.length + " 个" : "") +
          '</p><details class="experiment-info"><summary>实验信息</summary><div class="latest-run"><span>最新实验 · ' +
          e(latest?.date || "日期未记录") +
          "</span><strong>" +
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
          "</div></details>" +
          (previewRun
            ? '<p class="preview-source">预览来源 · ' +
              e(U.runSummary(data, previewRun)) +
              "</p>"
            : "") +
          '</details><div class="card-actions">' +
          (previewRun
            ? '<a class="preview-link" href="' +
              e(U.previewURL(previewRun)) +
              '" target="_blank" rel="noopener" aria-label="打开预览：' +
              e(t.title + " · " + U.runSummary(data, previewRun)) +
              '">运行体验 ↗</a>'
            : '<span class="no-preview">仅档案</span>') +
          '<a href="topic.html?id=' +
          t.id +
          '">查看版本 →</a>' +
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
    $("preview-only").setAttribute(
      "aria-pressed",
      String(state.preview === "yes"),
    );
    const filterCount = ["provider", "type", "prompt", "preview"].filter(
      (key) => state[key],
    ).length;
    $("filter-count").textContent = filterCount ? "· " + filterCount : "";
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
          !(key === "sort" && ["complexity", "latest"].includes(state[key])) &&
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
  $("preview-only").addEventListener("click", () => {
    state.preview = state.preview === "yes" ? "" : "yes";
    render(true);
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
        sort: "complexity",
      });
      render(true);
    }),
  );
  $("active-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-filter]");
    if (!button) return;
    const key = button.dataset.removeFilter;
    state[key] =
      key === "sort" ? "complexity" : key === "testing" ? "active" : "";
    render(true);
  });
  $("advanced-filters").open = !!(
    state.provider ||
    state.group !== "topics" ||
    state.view !== "grid" ||
    state.category ||
    state.type ||
    state.prompt ||
    state.preview
  );
  const previewDialog = $("preview-dialog");
  let previewRuns = [],
    previewMode = "image",
    previewTrigger = null;
  let fallbackSource = null,
    fallbackRunId = null;
  function renderPreview() {
    const run = previewRuns.find(
      (item) => item.id === $("preview-version").value,
    );
    if (!run) return;
    const topic = data.topics.find((item) => item.id === run.topicId);
    const href = U.previewURL(run);
    const screenshot =
      U.screenshotURL(run) ||
      (run.id === fallbackRunId ? fallbackSource : null);
    $("preview-title").textContent = topic.title;
    $("preview-caption").textContent =
      U.runSummary(data, run) +
      " · " +
      (run.date || "日期未记录") +
      " · 提示词 " +
      run.promptId;
    $("preview-record").href =
      "topic.html?id=" +
      encodeURIComponent(run.topicId) +
      "&view=list#run-" +
      encodeURIComponent(run.id);
    $("preview-open").hidden = !href;
    if (href) $("preview-open").href = href;
    else $("preview-open").removeAttribute("href");
    $("preview-original").hidden = !screenshot || previewMode !== "image";
    if (screenshot) $("preview-original").href = screenshot;
    else $("preview-original").removeAttribute("href");
    document.querySelectorAll("[data-preview-mode]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.previewMode === previewMode),
      );
    });
    const stage = $("preview-stage");
    stage.replaceChildren();
    $("preview-status").textContent = "";
    if (previewMode === "image") {
      if (screenshot) {
        const img = document.createElement("img");
        img.alt =
          topic.title + " · " + U.runSummary(data, run) + " 实际运行截图";
        img.src = screenshot;
        img.addEventListener("error", () => {
          if (img.isConnected)
            $("preview-status").textContent =
              "截图加载失败，可查看原图或运行体验。";
        });
        stage.append(img);
        $("preview-status").textContent =
          "已记录的实际截图 · 点击运行体验可操作作品";
      } else
        stage.innerHTML =
          '<div class="preview-message"><h3>此版本暂无截图</h3><p>' +
          (href
            ? "可以切换到「运行体验」，或独立打开作品。"
            : "此实验仅保留档案，可查看实验记录与原始输入。") +
          "</p></div>";
      return;
    }
    if (!href || !run.preview.embed) {
      stage.innerHTML =
        '<div class="preview-message"><h3>' +
        (href ? "请独立打开此作品" : "此版本暂无在线预览") +
        "</h3><p>" +
        (href
          ? "此作品通过外部页面提供体验。"
          : "可查看实验记录中的源码、提示词与运行说明。") +
        "</p></div>";
      return;
    }
    const frame = document.createElement("iframe");
    frame.title = topic.title + " · " + U.runSummary(data, run);
    frame.setAttribute(
      "sandbox",
      "allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads allow-popups",
    );
    frame.setAttribute("allow", "fullscreen; autoplay; clipboard-write");
    frame.src = href;
    $("preview-status").textContent = "正在加载作品… 若未显示，可独立打开";
    frame.addEventListener("load", () => {
      if (frame.isConnected)
        $("preview-status").textContent =
          "可直接操作作品 · 切换版本或关闭将结束当前体验";
    });
    stage.append(frame);
  }
  $("project-grid").addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-preview]");
    if (!trigger) return;
    const scope = previewScopes.get(trigger.dataset.preview);
    if (!scope) return;
    previewTrigger = trigger;
    previewRuns = [...scope.runs].sort((a, b) =>
      U.compareModelRuns(data, a, b),
    );
    fallbackRunId = trigger.dataset.preview;
    fallbackSource = scope.source;
    previewMode = "image";
    $("preview-version").innerHTML = U.groupedOptions(
      previewRuns,
      (run) => U.modelProvider(data, run),
      (run) =>
        '<option value="' +
        e(run.id) +
        '">' +
        e(
          U.runSummary(data, run) +
            " · " +
            run.promptId +
            " · " +
            (run.date || "日期未记录"),
        ) +
        "</option>",
    );
    $("preview-version").value = trigger.dataset.preview;
    renderPreview();
    previewDialog.showModal();
    document.body.classList.add("preview-open");
  });
  $("preview-version").addEventListener("change", renderPreview);
  document.querySelectorAll("[data-preview-mode]").forEach((button) =>
    button.addEventListener("click", () => {
      if (previewMode === button.dataset.previewMode) return;
      previewMode = button.dataset.previewMode;
      renderPreview();
    }),
  );
  $("preview-close").addEventListener("click", () => previewDialog.close());
  previewDialog.addEventListener("click", (event) => {
    if (event.target !== previewDialog) return;
    const rect = previewDialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      previewDialog.close();
  });
  previewDialog.addEventListener("close", () => {
    $("preview-stage").replaceChildren();
    document.body.classList.remove("preview-open");
    previewTrigger?.focus({ preventScroll: true });
  });
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
        "</span>" +
        (U.executionMode(r) === "unknown" ? "" : U.executionModeBadge(r)) +
        "<time>" +
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
  const mobileNav = matchMedia("(max-width: 700px)");
  const navMore = document.querySelector(".nav-more");
  const updateNav = () => {
    navMore.open = !mobileNav.matches;
  };
  mobileNav.addEventListener("change", updateNav);
  updateNav();
  document.querySelectorAll(".nav-more a").forEach((link) =>
    link.addEventListener("click", () => {
      if (mobileNav.matches) navMore.open = false;
    }),
  );
  if (location.hash === "#guides") $("guides").open = true;
  guides();
  render();
})();
