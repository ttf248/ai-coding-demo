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
    tool: params.get("tool") || "",
    model: params.get("model") || "",
    type: params.get("type") || "",
    prompt: params.get("prompt") || "",
    preview: params.get("preview") || "",
    testing: ["active", "archived", "all"].includes(params.get("testing"))
      ? params.get("testing")
      : "active",
    sort: ["score", "complexity", "recent", "title"].includes(
      params.get("sort"),
    )
      ? params.get("sort")
      : "complexity",
    group: ["topics", "runs"].includes(params.get("group"))
      ? params.get("group")
      : "topics",
    view: ["compact", "grid", "list"].includes(params.get("view"))
      ? params.get("view")
      : "compact",
    screenshot: params.get("screenshot") === "yes" ? "yes" : "",
    comparable: params.get("comparable") === "yes" ? "yes" : "",
    runGrouping: params.get("runGrouping") === "topic" ? "topic" : "",
    pick: params.get("pick") || "",
    pickPrompt: params.get("pickPrompt") || "",
    pickSort: params.get("pickSort") === "recent" ? "recent" : "score",
    pickAnchor: params.get("pickAnchor") || "",
  };
  if (state.group === "topics") state.sort = "complexity";
  let visible = 9;
  let restoredScroll = 0;
  let lastViewed = "";
  try {
    const saved = JSON.parse(
      sessionStorage.getItem("archive-home-return") || "null",
    );
    const navigation = performance.getEntriesByType("navigation")[0];
    if (saved?.url === location.href && navigation?.type === "back_forward") {
      visible = saved.visible;
      restoredScroll = saved.scroll;
      lastViewed = saved.lastItem || "";
    }
  } catch {}
  addEventListener("pagehide", () => {
    try {
      sessionStorage.setItem(
        "archive-home-return",
        JSON.stringify({
          url: location.href,
          visible,
          scroll: scrollY,
          lastItem: lastViewed,
        }),
      );
    } catch {}
  });
  $("project-grid").addEventListener("click", (event) => {
    if (event.target.closest("a, [data-preview]"))
      lastViewed =
        event.target.closest("[data-item]")?.dataset.item || lastViewed;
  });
  function markVisited() {
    document
      .querySelectorAll("[data-item]")
      .forEach((card) =>
        card.classList.toggle("last-visited", card.dataset.item === lastViewed),
      );
  }
  addEventListener("pageshow", markVisited);
  $("stats").innerHTML = [
    [data.topics.length, "实验主题"],
    [data.runs.length, "实验记录"],
    [data.runs.filter((r) => r.preview.kind !== "none").length, "可预览"],
  ]
    .map(
      ([n, label]) =>
        "<div><strong>" + n + "</strong><span>" + label + "</span></div>",
    )
    .join("");
  $("guide-count").textContent =
    data.guides.length + " 个技术主题 · 说明与可运行示例";
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
  $("model").insertAdjacentHTML("beforeend", U.modelFilterOptions(data.models));
  options(
    "type",
    [...new Set(data.runs.map((r) => r.type))].map((t) => [t, t]),
  );
  options("tool", [
    ...data.tools.map((tool) => [tool.id, tool.label]),
    ["unknown", "未记录工具"],
  ]);
  options(
    "prompt",
    data.prompts.map((p) => [
      p.topicId + "/" + p.id,
      data.topics.find((t) => t.id === p.topicId).title + " / " + p.id,
    ]),
  );
  const selection = U.setupSelection(data);
  const previewScopes = new Map();
  // 封面实际显示宽度随视图变化，按视图声明 sizes，浏览器才不会多取大图。
  const COVER_SIZES = {
    compact: "(max-width: 700px) calc(100vw - 34px), (max-width: 1100px) 46vw, 400px",
    grid: "(max-width: 700px) calc(100vw - 34px), (max-width: 1100px) 46vw, 610px",
    list: "(max-width: 700px) 76px, (max-width: 1100px) 64px, 88px",
  };
  const coverSizes = () =>
    COVER_SIZES[
      state.group === "runs" && state.view === "list" ? "list" : state.view
    ] || COVER_SIZES.compact;
  function galleryFigure(run, className, source = U.screenshotURL(run)) {
    if (!source) return "";
    const isShot = source === U.screenshotURL(run);
    // 竖版整页截图用派生的 16:10 顶部裁剪封面，原始长图仍可放大查看。
    const covers = isShot ? U.screenshotCoverVariants(run) : [];
    const variants = isShot && !covers.length ? U.screenshotVariants(run) : [];
    const thumbnail =
      (covers.length ? U.screenshotCoverURL(run, 240) : variants[0]?.path) ||
      source;
    const responsive = covers.length
      ? '"' + U.screenshotCoverSrcset(run) + ' sizes="' + e(coverSizes()) + '"'
      : variants.length
        ? '" srcset="' +
          e(
            variants
              .map((variant) => variant.path + " " + variant.width + "w")
              .join(", "),
          ) +
          '" sizes="' +
          e(coverSizes()) +
          '"'
        : "";
    const dims = covers.length
      ? covers[0]
      : {
          width: run.screenshotInfo?.width || 1440,
          height: run.screenshotInfo?.height || 1050,
        };
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
      e(thumbnail) +
      responsive +
      '" data-original="' +
      e(source) +
      '" alt="' +
      e(run.title + " 实际运行截图") +
      '" loading="lazy" decoding="async"' +
      (covers.length ? ' class="cover-image"' : "") +
      ' width="' +
      dims.width +
      '" height="' +
      dims.height +
      '">' +
      '<span class="cover-hint" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><path d="m8 8-5-5m13 5 5-5M8 16l-5 5m13-5 5 5"/></svg></span></button>' +
      '<div class="image-feedback" role="status"><span>截图加载中…</span><button data-retry-image hidden>重试</button></div>' +
      "<figcaption><span>" +
      (covers.length ? "实际截图 · 首屏" : "实际截图") +
      "</span><strong>" +
      e(U.modelLabel(data, run) + " · " + U.effortLabel(run.effort)) +
      "</strong></figcaption></figure>"
    );
  }
  function placeholder(title) {
    return (
      '<div class="topic-placeholder"><span>' +
      e(title) +
      "</span><small>暂无截图</small></div>"
    );
  }
  function setupGalleryImages() {
    $("project-grid")
      .querySelectorAll("figure[data-screenshot-run]")
      .forEach((figure, index) => {
        const img = figure.querySelector("img");
        const feedback = figure.querySelector(".image-feedback");
        if (!img || !feedback) return;
        const retry = feedback.querySelector("button");
        const update = () => {
          const failed = img.complete && !img.naturalWidth;
          feedback.hidden = img.complete && !failed;
          feedback.querySelector("span").textContent = failed
            ? "截图加载失败"
            : "截图加载中…";
          retry.hidden = !failed;
          figure.classList.toggle("image-failed", failed);
        };
        img.addEventListener("load", update);
        img.addEventListener("error", update);
        retry.addEventListener("click", () => {
          feedback.querySelector("span").textContent = "截图加载中…";
          retry.hidden = true;
          figure.classList.remove("image-failed");
          const source = img.getAttribute("src");
          const srcset = img.getAttribute("srcset");
          img.removeAttribute("srcset");
          img.removeAttribute("src");
          img.setAttribute("src", source);
          if (srcset) img.setAttribute("srcset", srcset);
        });
        if (index < 2) {
          img.loading = "eager";
          img.fetchPriority = "high";
        }
        update();
      });
  }
  function render(reset = false) {
    if (state.group === "topics") state.sort = "complexity";
    if (reset) visible = 9;
    const matched = U.filterRuns(data, state);
    previewScopes.clear();
    let items;
    if (state.group === "runs")
      items = matched.map((r) => {
        previewScopes.set(r.id, { runs: [r], source: U.screenshotURL(r) });
        const html = U.runCard(data, r)
          .replace(U.executionModeBadge(r), "")
          .replace(
            /(<div class="card-top"><span class="eyebrow">[\s\S]*?<\/span>)([\s\S]*?)(<\/div><h3>)/,
            '$1<div class="card-badges">' +
              U.executionModeBadge(r) +
              U.scoreBadge(r).replace(">评分 ", ">截图评分 ") +
              U.complexityBadge(data.topics.find((t) => t.id === r.topicId)) +
              "$2</div>$3",
          )
          .replace(
            U.screenshotFigure(data, r, "run-card-screenshot"),
            galleryFigure(r, "run-card-screenshot"),
          )
          .replace(
            '<div class="card-top">',
            '<div class="run-body"><div class="card-top">',
          )
          .replace(
            '<a href="' + e(U.previewURL(r)) + '"',
            '<a class="preview-link" href="' + e(U.previewURL(r)) + '"',
          )
          .replace(
            '<article class="card run-card">',
            '<article class="card run-card" data-item="' +
              e(r.id) +
              '" data-topic="' +
              e(r.topicId) +
              '">',
          )
          .replace(
            "</article>",
            '<div class="run-list-score">' +
              U.scoreBadge(r).replaceAll("score-chip", "list-score") +
              '</div><time class="run-list-date">' +
              e(r.date || "日期未记录") +
              "</time></div></article>",
          );
        return r.screenshot
          ? html
          : html.replace(
              '<div class="run-body">',
              placeholder(r.title) + '<div class="run-body">',
            );
      });
    else {
      const topics = [...new Set(matched.map((r) => r.topicId))].map((id) =>
        data.topics.find((t) => t.id === id),
      );
      if (
        !state.provider &&
        !state.tool &&
        !state.model &&
        !state.type &&
        !state.prompt &&
        !state.preview &&
        !state.screenshot &&
        !state.comparable
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
        const topRated = U.bestScoredRun(runs);
        const summaryRun = topRated || latest;
        const summaryLabel =
          U.scoreValue(summaryRun) !== null
            ? "最高评分截图 · 当前筛选范围"
            : "最新实验 · " + (summaryRun?.date || "日期未记录");
        let previewRun =
          latest && U.previewURL(latest)
            ? latest
            : runs.find((r) => U.previewURL(r));
        const screenshotRun =
          U.bestScoredRun(runs.filter((r) => U.screenshotURL(r))) ||
          [...runs]
            .filter((r) => U.screenshotURL(r))
            .sort(U.compareRunScores)[0];
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
        return (
          '<article class="card topic-card' +
          (cover ? " has-cover" : "") +
          '" data-item="' +
          e(t.id) +
          '">' +
          (cover || placeholder(t.title)) +
          '<div class="topic-body"><div class="card-top"><span class="eyebrow">' +
          "实验主题" +
          '</span><div class="card-badges">' +
          (U.isTopicArchived(t) ? '<span class="pill">已归档</span>' : "") +
          U.executionModeBadge(previewRun) +
          (displayedRun
            ? U.scoreBadge(displayedRun).replace(">评分 ", ">截图评分 ")
            : "") +
          '</div></div><h3><a href="topic.html?id=' +
          t.id +
          '">' +
          e(t.title) +
          "</a></h3><p>" +
          e(t.description) +
          '</p><div class="topic-metadata"><button class="topic-metrics" data-pick-topic="' +
          e(t.id) +
          '" aria-haspopup="dialog" title="快速挑选同主题实验">' +
          new Set(runs.map((r) => r.modelId)).size +
          " 个模型 · " +
          (runs.length !== all.length ? "匹配 " : "") +
          runs.length +
          " 条实验" +
          (runs.length !== all.length ? " / 共 " + all.length + " 个" : "") +
          ' ▾</button><details class="experiment-info"><summary>实验信息</summary><p class="topic-secondary">' +
          e(data.categories.find((c) => c.id === t.category).label) +
          " · " +
          U.complexityBadge(t) +
          '</p><div class="latest-run"><span>' +
          e(summaryLabel) +
          "</span><strong>" +
          e(
            summaryRun
              ? U.modelLabel(data, summaryRun) +
                  " · " +
                  U.effortLabel(summaryRun.effort)
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
          '</details></div><div class="card-actions">' +
          (previewRun
            ? '<a class="preview-link" href="' +
              e(U.previewURL(previewRun)) +
              '" target="_blank" rel="noopener" aria-label="打开预览：' +
              e(t.title + " · " + U.runSummary(data, previewRun)) +
              '">运行体验 ↗</a>'
            : '<span class="no-preview">仅档案</span>') +
          '<a href="topic.html?id=' +
          t.id +
          '">查看实验 →</a>' +
          (inspectRun
            ? '<button data-compare="' +
              e(inspectRun.id) +
              '" aria-pressed="false">加入对比</button>'
            : "") +
          "</div></div></article>"
        );
      });
    }
    $("project-grid").className =
      "cards " +
      state.view +
      (state.group === "runs" && state.view === "list" ? " run-ledger" : "");
    let displayed = items.slice(0, visible);
    const ledger = state.group === "runs" && state.view === "list";
    if (ledger && state.runGrouping === "topic") {
      const groups = [
        ...new Set(matched.slice(0, visible).map((r) => r.topicId)),
      ];
      displayed = groups.flatMap((id) => [
        '<h3 class="run-group-title">' +
          e(data.topics.find((t) => t.id === id).title) +
          "</h3>",
        ...displayed.filter((html, i) => matched[i].topicId === id),
      ]);
    }
    $("project-grid").innerHTML =
      (ledger
        ? '<div class="run-list-heading" aria-hidden="true"><span>作品</span><span>主题 / 实验</span><span>模型 / 档位</span><span>截图评分</span><span>日期</span><span>操作</span></div>'
        : "") + displayed.join("");
    $("run-grouping-control").hidden = !ledger;
    $("run-grouping").checked = state.runGrouping === "topic";
    markVisited();
    setupGalleryImages();
    $("result-count").textContent =
      "当前范围：" +
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
    $("sort").closest("label").hidden = state.group !== "runs";
    document
      .querySelectorAll("[data-view]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.view === state.view)),
      );
    for (const key of [
      "q",
      "category",
      "provider",
      "tool",
      "model",
      "type",
      "prompt",
      "preview",
      "testing",
      "sort",
    ])
      $(key).value = state[key];
    if (!state.model && state.provider && state.provider !== "unknown")
      $("model").value = "provider:" + state.provider;
    $("preview-only").setAttribute(
      "aria-pressed",
      String(state.preview === "yes"),
    );
    document
      .querySelectorAll("[data-quick]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(state[button.dataset.quick] === "yes"),
        ),
      );
    const filterCount = [
      "provider",
      "tool",
      "type",
      "prompt",
      "preview",
    ].filter((key) => state[key]).length;
    $("filter-count").textContent = filterCount ? "· " + filterCount : "";
    const mobileCount = [
      "category",
      "model",
      "provider",
      "tool",
      "type",
      "prompt",
      "preview",
    ].filter((key) => state[key]).length;
    $("mobile-filter-toggle").textContent =
      "筛选" + (mobileCount ? " · " + mobileCount : "");
    $("active-filters").innerHTML = [
      "q",
      "category",
      "provider",
      "tool",
      "model",
      "type",
      "prompt",
      "preview",
      "testing",
      "sort",
      "screenshot",
      "comparable",
    ]
      .filter(
        (key) =>
          state[key] &&
          !(key === "sort" && state[key] === "complexity") &&
          !(key === "testing" && state[key] === "active"),
      )
      .map((key) => {
        const label = ["screenshot", "comparable"].includes(key)
          ? { screenshot: "有截图", comparable: "多模型可对比" }[key]
          : key === "q"
            ? "搜索：" + state[key]
            : key === "testing"
              ? { active: "参与测试", archived: "已归档", all: "全部案例" }[
                  state[key]
                ]
              : $(key).selectedOptions?.[0]?.textContent.trim() || state[key];
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
    updateFacetCounts();
    selection();
  }
  function updateFacetCounts() {
    for (const key of [
      "category",
      "model",
      "provider",
      "tool",
      "type",
      "prompt",
      "preview",
    ]) {
      const candidates = U.filterRuns(data, {
        ...state,
        ...(key === "model" || key === "provider"
          ? { model: "", provider: "" }
          : { [key]: "" }),
      });
      for (const option of $(key).options) {
        option.dataset.label ||= option.textContent;
        const count = candidates.filter((run) => {
          if (!option.value) return true;
          if (key === "model" && option.dataset.provider)
            return U.modelProviderId(data, run) === option.dataset.provider;
          const topic = data.topics.find((topic) => topic.id === run.topicId);
          return (
            {
              category: topic.category,
              model: run.modelId,
              provider:
                data.models.find((model) => model.id === run.modelId)
                  ?.provider || "unknown",
              tool: run.environment.toolId || "unknown",
              type: run.type,
              prompt: run.topicId + "/" + run.promptId,
              preview: run.preview.kind === "none" ? "no" : "yes",
            }[key] === option.value
          );
        }).length;
        option.textContent =
          (option.hasAttribute("data-indent") ? "　" : "") +
          option.dataset.label +
          " · " +
          count;
      }
    }
  }
  [
    "q",
    "category",
    "provider",
    "tool",
    "model",
    "type",
    "prompt",
    "preview",
    "testing",
    "sort",
  ].forEach((key) =>
    $(key).addEventListener(key === "q" ? "input" : "change", (ev) => {
      state[key] = ev.target.value;
      if (key === "model") {
        const provider = ev.target.selectedOptions[0]?.dataset.provider;
        if (provider) {
          state.provider = provider;
          state.model = "";
        } else if (
          !state.model ||
          U.modelProviderId(data, { modelId: state.model }) !== state.provider
        ) {
          state.provider = "";
        }
      } else if (
        key === "provider" &&
        state.provider &&
        state.model &&
        U.modelProviderId(data, { modelId: state.model }) !== state.provider
      ) {
        state.model = "";
      }
      render(true);
    }),
  );
  document.querySelectorAll("[data-group]").forEach((b) =>
    b.addEventListener("click", () => {
      state.group = b.dataset.group;
      if (state.group === "topics") state.sort = "complexity";
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
  $("mobile-filter-toggle").addEventListener("click", () => {
    const expanded =
      $("mobile-filter-toggle").getAttribute("aria-expanded") !== "true";
    $("mobile-filter-toggle").setAttribute("aria-expanded", String(expanded));
    $("filter-layout").classList.toggle("filters-expanded", expanded);
  });
  $("load-more").addEventListener("click", () => {
    visible += 9;
    render();
  });
  $("run-grouping").addEventListener("change", (event) => {
    state.runGrouping = event.target.checked ? "topic" : "";
    render();
  });
  document.querySelectorAll("[data-quick]").forEach((button) =>
    button.addEventListener("click", () => {
      const key = button.dataset.quick;
      state[key] = state[key] ? "" : "yes";
      render(true);
    }),
  );
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
        tool: "",
        model: "",
        type: "",
        prompt: "",
        preview: "",
        screenshot: "",
        comparable: "",
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
    state.tool ||
    state.category ||
    state.type ||
    state.prompt ||
    state.preview
  );
  const quickDialog = $("quick-picker");
  let quickRuns = [],
    quickVisible = 6,
    quickTrigger = null;
  function syncQuickURL() {
    const query = new URLSearchParams(location.search);
    for (const key of ["pick", "pickPrompt", "pickSort", "pickAnchor"]) {
      if (state.pick && state[key]) query.set(key, state[key]);
      else query.delete(key);
    }
    history.replaceState(null, "", "?" + query.toString() + location.hash);
  }
  function quickSelection() {
    let ids = [];
    try {
      ids = JSON.parse(sessionStorage.getItem("archive-selection") || "[]");
    } catch {}
    ids = Array.isArray(ids)
      ? [...new Set(ids)]
          .filter((id) => data.runs.some((r) => r.id === id))
          .slice(0, 4)
      : [];
    $("quick-selection").textContent = `已选 ${ids.length}/4 条实验`;
    $("quick-start").hidden = ids.length < 2;
    const query = new URLSearchParams();
    ids.forEach((id, i) =>
      query.set(["left", "right", "third", "fourth"][i], id),
    );
    if (ids.length > 2) query.set("layout", "quad");
    $("quick-start").href = "compare.html?" + query;
  }
  function renderQuick() {
    const runs = quickRuns.filter((r) => r.promptId === state.pickPrompt);
    const rules = [
      ...new Set(
        runs.map((r) => r.score?.rubricVersion).filter(Number.isInteger),
      ),
    ].sort((a, b) => b - a);
    const previousRule = $("quick-rule").value;
    $("quick-rule").innerHTML = rules
      .map((v) => `<option value="${v}">v${v}</option>`)
      .join("");
    if (rules.includes(Number(previousRule)))
      $("quick-rule").value = previousRule;
    $("quick-rule-control").hidden =
      state.pickSort !== "score" || rules.length < 2;
    const rule = Number($("quick-rule").value);
    const candidates = runs
      .filter(
        (r) =>
          state.pickSort !== "score" ||
          !rules.length ||
          r.score?.rubricVersion === rule,
      )
      .sort(
        state.pickSort === "score"
          ? U.compareRunScores
          : (a, b) =>
              (b.date || "").localeCompare(a.date || "") ||
              a.id.localeCompare(b.id),
      );
    $("quick-sort").value = state.pickSort;
    $("quick-prompt").value = state.pickPrompt;
    $("quick-scope").textContent =
      (state.pickAnchor
        ? "全部同任务实验 · 未应用首页筛选"
        : "当前首页筛选范围") +
      " · 同任务版本" +
      (state.pickSort === "score" && rules.length
        ? " · 评分规则 v" + rule
        : "") +
      "。截图评分只反映可见成果，输入与执行条件仍需核对。";
    $("quick-count").textContent =
      `${candidates.length} 条候选 · 显示 ${Math.min(quickVisible, candidates.length)} 条`;
    $("quick-candidates").innerHTML =
      candidates
        .slice(0, quickVisible)
        .map((run) => {
          const cover = U.screenshotCoverVariants(run),
            image =
              (cover.length
                ? U.screenshotCoverURL(run, 96)
                : U.screenshotThumbnailURL(run, 96)) || U.screenshotURL(run),
            srcset = cover.length
              ? U.screenshotCoverSrcset(run)
              : U.screenshotSrcset(run),
            info = cover.length ? cover[0] : run.screenshotInfo || {};
          return (
            '<article class="quick-candidate"><div class="quick-image">' +
            (image
              ? '<a href="' +
                e(U.screenshotURL(run)) +
                '" target="_blank" rel="noopener" aria-label="查看 ' +
                e(U.runSummary(data, run)) +
                ' 截图"><img src="' +
                e(image) +
                '"' +
                srcset +
                ' sizes="96px" width="' +
                (info.width || 1440) +
                '" height="' +
                (info.height || 1050) +
                '" alt="' +
                e(run.title) +
                ' 实际截图" loading="lazy" decoding="async"></a>'
              : "<span>无截图</span>") +
            '</div><div class="quick-identity"><strong>' +
            e(U.modelLabel(data, run)) +
            "</strong><span>" +
            e(U.effortLabel(run.effort) + " · " + U.roundLabel(run)) +
            "</span><small>" +
            e(run.date || "日期未记录") +
            " · " +
            e(U.completenessLabel(run.input.completeness)) +
            "</small>" +
            U.executionModeBadge(run) +
            '</div><div class="quick-score">' +
            U.scoreBadge(run).replace(">评分 ", ">截图评分 ") +
            '</div><button data-compare="' +
            e(run.id) +
            '" aria-pressed="false">加入对比</button></article>'
          );
        })
        .join("") ||
      '<p class="empty">当前范围没有候选，请切换任务版本或清除首页筛选。</p>';
    $("quick-more").hidden = quickVisible >= candidates.length;
    $("quick-all").href =
      "topic.html?id=" +
      encodeURIComponent(state.pick) +
      "&prompt=" +
      encodeURIComponent(state.pickPrompt) +
      "&view=list";
    selection();
    quickSelection();
    syncQuickURL();
  }
  document.addEventListener("archive-find-related", (event) => {
    const run = data.runs.find((r) => r.id === event.detail.runId);
    if (!run) return;
    event.preventDefault();
    openQuick(run.topicId, run.promptId, run.id);
  });
  function openQuick(topicId, promptId = "", anchorId = "") {
    const topic = data.topics.find((t) => t.id === topicId);
    if (!topic) return;
    quickTrigger = document.activeElement;
    state.pick = topicId;
    state.pickAnchor = anchorId;
    quickRuns = (anchorId ? data.runs : U.filterRuns(data, state)).filter(
      (r) => r.topicId === topicId,
    );
    const prompts = data.prompts.filter(
      (p) =>
        p.topicId === topicId && quickRuns.some((r) => r.promptId === p.id),
    );
    state.pickPrompt = prompts.some((p) => p.id === promptId)
      ? promptId
      : prompts.at(-1)?.id || "";
    $("quick-prompt").innerHTML = prompts
      .map(
        (p) =>
          '<option value="' +
          e(p.id) +
          '">' +
          e(p.title + " · " + p.id) +
          "</option>",
      )
      .join("");
    $("quick-title").textContent = topic.title;
    quickVisible = 6;
    renderQuick();
    if (!quickDialog.open) quickDialog.showModal();
    $("quick-prompt").focus();
  }
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-pick-topic]");
    if (trigger) openQuick(trigger.dataset.pickTopic);
    if (
      event.target.closest(
        "[data-compare], [data-remove], [data-clear], [data-slot]",
      )
    )
      requestAnimationFrame(quickSelection);
  });
  $("quick-close").addEventListener("click", () => quickDialog.close());
  quickDialog.addEventListener("close", () => {
    state.pick = state.pickPrompt = state.pickAnchor = "";
    syncQuickURL();
    quickTrigger?.focus();
  });
  $("quick-prompt").addEventListener("change", (event) => {
    state.pickPrompt = event.target.value;
    quickVisible = 6;
    renderQuick();
  });
  $("quick-sort").addEventListener("change", (event) => {
    state.pickSort = event.target.value;
    quickVisible = 6;
    renderQuick();
  });
  $("quick-rule").addEventListener("change", () => {
    quickVisible = 6;
    renderQuick();
  });
  $("quick-more").addEventListener("click", () => {
    quickVisible += 6;
    renderQuick();
  });
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
  function recent(mode = "experiment") {
    document
      .querySelectorAll("[data-recent]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.recent === mode),
        ),
      );
    const dateField = mode === "archive" ? "archivedAt" : "date";
    const recentRuns = U.filterRuns(data, { testing: "active" })
      .filter((run) => run[dateField])
      .sort((a, b) => b[dateField].localeCompare(a[dateField]));
    $("recent-list").innerHTML =
      recentRuns
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
            e(r[dateField]) +
            "</time></small></a>",
        )
        .join("") ||
      '<p class="muted">归档日期尚未留存；新增记录可登记归档日期。</p>';
  }
  document
    .querySelectorAll("[data-recent]")
    .forEach((button) =>
      button.addEventListener("click", () => recent(button.dataset.recent)),
    );
  recent();
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
          g.reader +
          '">说明</a> · <a href="' +
          g.example +
          '">运行示例 ↗</a><small>' +
          (g.network === "offline" ? "离线可用" : "外部素材需要联网") +
          "</small></article>",
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
  U.initNavMore();
  if (location.hash === "#guides") $("guides").open = true;
  guides();
  render();
  if (state.pick) openQuick(state.pick, state.pickPrompt, state.pickAnchor);
  if (restoredScroll) requestAnimationFrame(() => scrollTo(0, restoredScroll));
})();
