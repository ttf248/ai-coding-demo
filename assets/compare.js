(function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI,
    e = U.escape,
    $ = (id) => document.getElementById(id);
  const sides = ["left", "right", "third", "fourth"],
    labels = { left: "A", right: "B", third: "C", fourth: "D" },
    seen = new Set(),
    narrow = matchMedia("(max-width:700px)"),
    unloaded = { left: false, right: false, third: false, fourth: false };
  const sizes = {
    desktop: [1440, 900],
    tablet: [768, 1024],
    mobile: [390, 844],
  };
  let state = {},
    diffCache = null;
  function fromURL() {
    const p = new URLSearchParams(location.search);
    state = {
      left: p.get("left") || "",
      right: p.get("right") || "",
      third: p.get("third") || "",
      fourth: p.get("fourth") || "",
      thirdPage: p.get("thirdPage") || "",
      fourthPage: p.get("fourthPage") || "",
      group: p.get("group") || "",
      scope: ["task", "raw", "topic", "all"].includes(p.get("scope"))
        ? p.get("scope")
        : "task",
      layout: ["dual", "quad", "single"].includes(p.get("layout"))
        ? p.get("layout")
        : "dual",
      focus: sides.includes(p.get("focus")) ? p.get("focus") : "",

      leftPage: p.get("leftPage") || "",
      rightPage: p.get("rightPage") || "",
      viewport: ["adaptive", ...Object.keys(sizes)].includes(p.get("viewport"))
        ? p.get("viewport")
        : "adaptive",
      tab: ["preview", "snapshot", "prompt", "info", "conditions"].includes(
        p.get("tab"),
      )
        ? p.get("tab")
        : "preview",
      source: p.get("source") === "raw" ? "raw" : "task",
      relatedOnly: p.get("related") !== "0",
      differencesOnly: p.get("differencesOnly") === "1",
      mobile: sides.includes(p.get("mobile")) ? p.get("mobile") : "left",
    };
    for (const side of sides) {
      const run = getRun(side);
      const model = p.get(side + "Model") || run?.modelId || "";
      state[side + "Model"] = run?.modelId || model;
      state[side + "Effort"] =
        (!run || model === run.modelId ? p.get(side + "Effort") : "") ||
        run?.effort ||
        "";
    }
    if (state.tab === "info") state.tab = "conditions";
    if (!state.group) {
      const initial = data.runs.find((r) => r.id === state.left);
      if (initial) state.group = initial.topicId + "/" + initial.promptId;
    }
    if (
      !sides.some((side) => state[side] || state[side + "Model"]) &&
      groupPrompt()
    )
      fillGroup();
  }
  function groupPrompt() {
    return data.prompts.find((p) => p.topicId + "/" + p.id === state.group);
  }
  function pool() {
    const anchor = data.runs.find((r) => r.id === state.left);
    const prompt = groupPrompt() || (anchor && U.promptFor(data, anchor));
    return U.filterRuns(data, {})
      .sort((a, b) => U.compareModelRuns(data, a, b))
      .filter((r) => {
        if (state.scope === "all") return true;
        if (state.scope === "raw")
          return (
            anchor &&
            U.hasRecordedInput(anchor) &&
            anchor.input.completeness !== "unknown" &&
            U.hasRecordedInput(r) &&
            r.rawHash === anchor.rawHash
          );
        if (!prompt) return true;
        if (state.scope === "topic") return r.topicId === prompt.topicId;
        return U.promptFor(data, r)?.hash === prompt.hash;
      });
  }
  function fillGroup(preserveModels = false) {
    state.scope = "task";
    const runs = groupPrompt() ? pool() : [];
    const keep =
      preserveModels &&
      groupPrompt() &&
      sides.some((side) => state[side + "Model"]);
    const selected = new Map(),
      used = new Set();
    if (keep) {
      // Reserve exact records and efforts across all slots before model fallbacks.
      for (const matches of [
        (r, side) => r.id === state[side],
        (r, side) =>
          r.modelId !== "unknown" &&
          r.modelId === state[side + "Model"] &&
          r.effort === state[side + "Effort"],
        (r, side) =>
          r.modelId !== "unknown" && r.modelId === state[side + "Model"],
      ]) {
        for (const side of slots()) {
          if (selected.has(side) || !state[side + "Model"]) continue;
          const run = runs.find((r) => !used.has(r.id) && matches(r, side));
          if (run) {
            selected.set(side, run);
            used.add(run.id);
          }
        }
      }
    }
    sides.forEach((side, i) => {
      const run = slots().includes(side)
        ? keep
          ? selected.get(side)
          : runs[i]
        : null;
      state[side] = run?.id || "";
      if (!keep) {
        state[side + "Model"] = run?.modelId || "";
        state[side + "Effort"] = run?.effort || "";
      }
      state[side + "Page"] = "";
      unloaded[side] = false;
    });
    state.mobile = "left";
    state.focus = "";
  }
  function runLabel(r) {
    return (
      (!state.group || state.scope === "all" || !state.relatedOnly
        ? (data.topics.find((t) => t.id === r.topicId)?.title || r.topicId) +
          " · "
        : "") + U.runSummary(data, r)
    );
  }
  const slots = () => (state.layout === "quad" ? sides : sides.slice(0, 2));
  function visibleSides() {
    const available = slots();
    const current = available.includes(state.mobile) ? state.mobile : "left";
    if (narrow.matches || state.layout === "single") return [current];
    return state.focus && available.includes(state.focus)
      ? [state.focus]
      : available;
  }
  function choose(side, id) {
    state[side] = id;
    const run = getRun(side);
    state[side + "Model"] = run?.modelId || "";
    state[side + "Effort"] = run?.effort || "";
    state[side + "Page"] = "";
    unloaded[side] = false;
  }
  function renderPicker() {
    $("scope").value = state.scope;
    const q = $("model-search").value.trim().toLocaleLowerCase();
    const runs = pool().filter((r) =>
      (
        runLabel(r) +
        " " +
        U.modelProvider(data, r) +
        " " +
        r.modelId +
        " " +
        r.effort +
        " " +
        r.title +
        " " +
        U.executionModeText(r) +
        " " +
        (r.date || "")
      )
        .toLocaleLowerCase()
        .includes(q),
    );
    const side = $("picker-side").value;
    $("picker-count").textContent =
      `${runs.length} 条实验 · 点击放入 ${labels[side]}`;
    $("model-list").innerHTML =
      runs
        .map((r, i) => {
          const provider = U.modelProvider(data, r);
          const heading =
            i === 0 || provider !== U.modelProvider(data, runs[i - 1])
              ? '<h3 class="model-provider">' +
                e(provider) +
                " <small>" +
                runs.filter((item) => U.modelProvider(data, item) === provider)
                  .length +
                " 条实验</small></h3>"
              : "";
          const occupied = slots()
            .filter((s) => state[s] === r.id)
            .map((s) => labels[s])
            .join(" / ");
          return (
            heading +
            `<button class="model-choice" data-choice="${e(r.id)}" ${slots().some((s) => s !== side && state[s] === r.id) ? "disabled" : ""}><strong>${e(runLabel(r))}</strong><span>${e(r.title)} · ${e(r.date || "日期未记录")}</span><small>${occupied ? "已选 " + occupied + " · " : ""}${seen.has(r.id) ? "已浏览 · " : ""}${r.preview.kind === "none" ? "无预览" : r.preview.embed ? "可预览" : "独立打开"} · ${e(U.completenessLabel(r.input.completeness))} · ${e(U.executionModeText(r))}</small></button>`
          );
        })
        .join("") ||
      '<p class="frame-placeholder">没有匹配实验，请调整范围或搜索。</p>';
    for (const option of $("picker-side").options)
      option.hidden =
        state.layout !== "quad" && ["third", "fourth"].includes(option.value);
  }
  const getRun = (side) => data.runs.find((r) => r.id === state[side]);
  function updateURL() {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(state))
      if (k !== "relatedOnly" && v) p.set(k, k === "differencesOnly" ? "1" : v);
    if (!state.relatedOnly) p.set("related", "0");
    history.pushState(null, "", "?" + p.toString());
  }
  function textFor(run) {
    return !run
      ? ""
      : state.source === "raw"
        ? run.raw
        : U.promptFor(data, run)?.text || "";
  }
  function frameKey(side) {
    return [
      state[side],
      state[side + "Page"] || getRun(side)?.preview.defaultPage,
    ].join("/");
  }
  function resizeFrames() {
    const shells = [...document.querySelectorAll(".viewport-shell")].filter(
      (el) => el.offsetWidth,
    );
    if (!shells.length) return;
    const common = Math.min(...shells.map((el) => el.clientWidth));
    for (const shell of shells) {
      const frame = shell.querySelector("iframe");
      if (!frame) continue;
      const availableHeight = shell.parentElement.clientHeight;
      const [width, height] = sizes[state.viewport] || [
        common,
        availableHeight,
      ];
      const scale = Math.min(
        1,
        shell.clientWidth / width,
        availableHeight / height,
      );
      frame.style.width = width + "px";
      frame.style.height = height + "px";
      frame.style.transform = `scale(${scale})`;
      shell.style.height = availableHeight + "px";
      frame.style.marginLeft =
        Math.max(0, (shell.clientWidth - width * scale) / 2) + "px";
      shell.closest(".compare-panel").querySelector("[data-size]").textContent =
        `${width} × ${height} · ${Math.round(scale * 100)}%`;
    }
  }
  let renderGeneration = 0;
  async function render() {
    const generation = ++renderGeneration;
    try {
      const selected = slots().map(getRun).filter(Boolean);
      await U.ensureDetails(data, selected);
      if (state.tab === "prompt")
        await U.ensureTexts(data, selected, state.source === "raw");
      if (generation !== renderGeneration) return;
      renderLoaded();
    } catch (error) {
      if (generation === renderGeneration) {
        $("relation").textContent = "资料加载失败：" + error.message;
        let retry = document.getElementById("data-retry");
        if (!retry) {
          retry = document.createElement("button");
          retry.id = "data-retry";
          retry.textContent = "重试加载资料";
          retry.onclick = render;
          $("relation").after(retry);
        }
      }
    }
  }
  function renderLoaded() {
    document.getElementById("data-retry")?.remove();
    const empty = !sides.some((side) => state[side] || state[side + "Model"]);
    document.body.dataset.contentMode = state.tab;
    document.body.classList.toggle("comparison-empty", empty);
    $("compare-start").hidden = !empty;
    $("viewport-control").hidden = state.tab !== "preview";
    document.querySelector(".mobile-layout-note").textContent =
      state.tab === "preview"
        ? "单屏轮看 · 切换实验会重新加载页面"
        : "单屏轮看 · 切换 A / B 查看截图与输入";
    const visible = state.tab === "conditions" ? [] : visibleSides();
    document.querySelector(".compare-grid").hidden =
      empty || state.tab === "conditions";
    $("conditions-view").hidden = state.tab !== "conditions";
    document.querySelector(".mobile-tabs").hidden = state.tab === "conditions";
    document.body.dataset.mode = state.layout;
    document.querySelector(".compare-grid").dataset.layout =
      visible.length === 1 ? "single" : state.layout;
    $("layout").value = state.layout;
    $("layout").hidden = narrow.matches;
    $("group").value = state.group;
    document
      .querySelector(".mobile-tabs")
      .classList.toggle("show-tabs", state.layout === "single");
    document.querySelectorAll("[data-mobile]").forEach((btn) => {
      btn.hidden =
        state.layout !== "quad" &&
        ["third", "fourth"].includes(btn.dataset.mobile);
      const run = getRun(btn.dataset.mobile);
      const model = state[btn.dataset.mobile + "Model"];
      const name = run
        ? U.modelLabel(data, run)
        : model
          ? U.modelLabel(data, { modelId: model }) + "（暂无实验）"
          : "未选择";
      btn.textContent = labels[btn.dataset.mobile] + " · " + name;
      btn.title = run ? runLabel(run) : name;
    });
    const a = getRun("left"),
      b = getRun("right");
    $("relation").textContent =
      state.left && state.left === state.right
        ? "不能选择同一条实验，请更换一侧。"
        : U.relation(data, a, b);
    $("viewport").value = state.viewport;
    $("prompt-source").value = state.source;
    $("related-only").checked = state.relatedOnly;
    $("source-control").hidden = state.tab !== "prompt";
    document
      .querySelectorAll("[data-tab]")
      .forEach((btn) =>
        btn.setAttribute("aria-pressed", String(btn.dataset.tab === state.tab)),
      );
    document
      .querySelectorAll("[data-mobile]")
      .forEach((btn) =>
        btn.setAttribute(
          "aria-pressed",
          String(btn.dataset.mobile === state.mobile),
        ),
      );
    if (state.tab === "prompt") {
      const key = [...sides.map((s) => state[s]), state.source].join("/");
      if (diffCache?.key !== key) {
        diffCache = { key, ...U.diff(textFor(a), textFor(b)) };
        for (const side of ["third", "fourth"])
          diffCache[side] = U.diff(textFor(a), textFor(getRun(side))).right;
      }
    }
    for (const side of sides) {
      const panel = $("panel-" + side),
        run = getRun(side),
        other = getRun(side === "left" ? "right" : "left");
      const active = visible.includes(side);
      panel.hidden = !active;
      if (active && run && state.tab === "preview" && !unloaded[side])
        seen.add(run.id);
      panel.classList.toggle("mobile-inactive", !active);
      const candidates = U.filterRuns(data, {}).filter(
        (r) =>
          !state.relatedOnly ||
          !other ||
          r.topicId === other.topicId ||
          r.id === state[side],
      );
      const ordered = candidates.sort((x, y) => U.compareModelRuns(data, x, y));
      const options =
        '<option value="">选择实验…</option>' +
        (state[side] && !run
          ? '<option value="' +
            e(state[side]) +
            '" selected>未找到：' +
            e(state[side]) +
            "</option>"
          : "") +
        U.groupedOptions(
          ordered,
          (r) => U.modelProvider(data, r),
          (r) =>
            '<option value="' +
            e(r.id) +
            '"' +
            (r.id === state[side] ? " selected" : "") +
            (slots().some((s) => s !== side && state[s] === r.id)
              ? " disabled"
              : "") +
            ">" +
            e(runLabel(r)) +
            (other &&
            r.id !== other.id &&
            U.promptFor(data, r)?.hash === U.promptFor(data, other)?.hash
              ? " · 同正文"
              : "") +
            (U.executionMode(r) === "unknown" && !r.input.executionModeNote
              ? ""
              : " · " + e(U.executionModeText(r))) +
            "</option>",
        );
      // Keep an untouched iframe in place: moving its DOM node would reload it.
      const viewKey = JSON.stringify([
        frameKey(side),
        !run && [state.group, state[side + "Model"], state[side + "Effort"]],
        state.tab,
        state.tab === "prompt"
          ? diffCache.key
          : state.tab === "info"
            ? other?.id
            : "",
        active,
        unloaded[side],
        Boolean(
          run &&
          slots().some(
            (s) =>
              sides.indexOf(s) < sides.indexOf(side) && state[s] === run.id,
          ),
        ),
      ]);
      if (panel.dataset.viewKey === viewKey) {
        panel.querySelector("[data-run]").innerHTML = options;
        panel.querySelector("[data-maximize]").textContent =
          state.focus === side ? "还原" : "放大";
        continue;
      }
      panel.dataset.viewKey = viewKey;
      const href = U.previewURL(run, state[side + "Page"]);
      const invalidPage = Boolean(
        run &&
        state[side + "Page"] &&
        !run.preview.pages.some((p) => p.id === state[side + "Page"]),
      );
      panel.innerHTML =
        '<div class="panel-header"><strong class="panel-identity">' +
        e(
          run
            ? U.modelLabel(data, run) +
                " · " +
                U.effortLabel(run.effort) +
                " · " +
                U.roundLabel(run)
            : state[side + "Model"]
              ? U.modelLabel(data, { modelId: state[side + "Model"] }) +
                " · 暂无实验"
              : "未选择实验",
        ) +
        "</strong><h2>" +
        (labels[side] + (side === "left" ? " · 基准" : "")) +
        '</h2><label for="run-' +
        side +
        '">实验版本</label><select id="run-' +
        side +
        '" data-run="' +
        side +
        '">' +
        options +
        "</select>" +
        `<div class="panel-navigation"><button data-step="-1" data-side="${side}" aria-label="${labels[side]} 上一版本">←</button><button data-step="1" data-side="${side}" aria-label="${labels[side]} 下一版本">→</button><button data-maximize="${side}" aria-label="放大或还原 ${labels[side]}">${state.focus === side ? "还原" : "放大"}</button></div>` +
        (run && (run.preview.pages.length > 1 || invalidPage)
          ? '<label for="page-' +
            side +
            '">页面模块</label><select id="page-' +
            side +
            '" data-page="' +
            side +
            '">' +
            (invalidPage
              ? '<option value="" disabled selected>页面无效，请重新选择</option>'
              : "") +
            run.preview.pages
              .map(
                (p) =>
                  '<option value="' +
                  e(p.id) +
                  '"' +
                  (p.id === (state[side + "Page"] || run.preview.defaultPage)
                    ? " selected"
                    : "") +
                  ">" +
                  e(p.label) +
                  "</option>",
              )
              .join("") +
            "</select>"
          : "") +
        '<div class="panel-actions">' +
        (href
          ? '<a class="button" href="' +
            e(href) +
            '" target="_blank" rel="noopener">独立打开 ↗</a>'
          : "") +
        (run
          ? '<details class="panel-more"><summary>更多</summary><div>'
          : "") +
        (href && state.tab === "preview"
          ? '<button data-reload="' +
            side +
            '">重载</button><button data-unload="' +
            side +
            '">' +
            (unloaded[side] ? "加载此侧" : "卸载此侧") +
            "</button>"
          : "") +
        (run ? '<a href="' + e(U.documentURL(run)) + '">实验记录</a>' : "") +
        (run ? "</div></details>" : "") +
        (run &&
        (U.executionMode(run) !== "unknown" || run.input.executionModeNote)
          ? '<span class="execution-mode-chip panel-execution-mode">' +
            e(U.executionModeText(run)) +
            "</span>"
          : "") +
        '</div><p class="panel-status">' +
        (run ? e(run.environment.tool || "工具未记录") : "请选择实验") +
        '</p><p class="panel-status" data-size></p></div><div data-content></div>';
      const content = panel.querySelector("[data-content]");
      if (!run) {
        const model = state[side + "Model"];
        content.innerHTML =
          '<div class="frame-placeholder"><h3>' +
          (state[side]
            ? "实验不存在或已经迁移"
            : model
              ? "此任务暂无所选模型的实验"
              : "选一个实验开始") +
          "</h3><p>" +
          (model && !state[side]
            ? e(U.modelLabel(data, { modelId: model })) +
              " · 已保留模型选择，可切换主题或手动更换实验。"
            : "先选择主题，系统会按现有模型排序填入实验；也可以分别选择 A / B。候选中的同正文版本会单独标注。") +
          "</p><button data-start-comparison>选择主题开始 →</button></div>";
        continue;
      }
      if (
        Boolean(
          run &&
          slots().some(
            (s) =>
              sides.indexOf(s) < sides.indexOf(side) && state[s] === run.id,
          ),
        )
      ) {
        content.innerHTML =
          '<div class="frame-placeholder">请选择不同的实验记录。</div>';
        continue;
      }
      if (state.tab === "prompt") {
        content.innerHTML =
          '<div class="panel-text"><p>' +
          e(
            state.source === "raw"
              ? "完整原始输入 · 已留存部分"
              : "可复用任务正文",
          ) +
          "</p><p>" +
          e(
            (side === "left" ? "与 B：" : "与基准 A：") +
              U.relation(data, side === "left" ? b : a, run),
          ) +
          "</p><p>" +
          e(run.input.notes) +
          "</p><pre>" +
          diffCache[side] +
          "</pre></div>";
        continue;
      }
      if (state.tab === "snapshot") {
        const screenshot = U.screenshotURL(run);
        content.innerHTML = screenshot
          ? '<a class="snapshot-preview" href="' +
            e(screenshot) +
            '" target="_blank" rel="noopener" aria-label="查看实际截图原图"><img src="' +
            e(U.screenshotThumbnailURL(run)) +
            '" alt="' +
            e(run.title + " · " + runLabel(run) + " 实际截图") +
            '"><span>已登记实际截图 · 打开原图 ↗</span></a>'
          : '<div class="frame-placeholder">此实验未登记截图，可查看记录或切换实时预览。</div>';
        continue;
      }
      if (state.tab === "info") {
        const info = [
          ["输入关系", U.relation(data, side === "left" ? b : a, run)],
          [
            "模型 / 推理档位",
            U.modelLabel(data, run) + " / " + U.effortLabel(run.effort),
          ],
          ["日期", run.date || "未记录"],
          ["执行模式", U.executionModeText(run)],
          ["自主优化授权原文", run.input.authorization || "未记录"],
          [
            "原始输入记录",
            U.completenessLabel(run.input.completeness) +
              " · " +
              run.input.notes,
          ],
          ["平台与工具", run.environment.tool || "未记录"],
          ["上下文说明", run.environment.notes],
          [
            "产物与运行",
            run.type +
              " / " +
              run.preview.kind +
              " / 网络：" +
              run.preview.network,
          ],
          ["技术栈", run.stack.join(" / ")],
          ["人工修改与部署适配", run.changes.join("\n") || "未记录新增改动"],
          ["实验 ID", run.id],
        ];
        content.innerHTML =
          '<dl class="panel-info">' +
          info
            .map(
              ([k, v]) =>
                "<dt>" +
                e(k) +
                "</dt><dd>" +
                e(v).replaceAll("\n", "<br>") +
                "</dd>",
            )
            .join("") +
          "</dl>";
        continue;
      }
      if (!active) continue;
      if (unloaded[side]) {
        content.innerHTML =
          '<div class="frame-placeholder"><h3>已卸载此侧</h3><p>已释放嵌入页面；再次加载会重置页面状态。</p></div>';
        continue;
      }
      if (!href || !run.preview.embed) {
        content.innerHTML =
          '<div class="frame-placeholder"><h3>' +
          (!href ? "没有可用静态预览" : "请独立打开这个项目") +
          "</h3><p>" +
          e(
            run.preview.kind === "none"
              ? "此记录保留源码或提示词，请查看实验说明。"
              : "子页面无效或外部站点未确认支持嵌入。可重新选择页面或独立打开。",
          ) +
          "</p></div>";
        continue;
      }
      const shell = document.createElement("div");
      shell.className = "viewport-shell";
      content.append(shell);
      const status = panel.querySelector("[data-size]");
      const frame = document.createElement("iframe");
      frame.title = run.title + " · " + side;
      frame.dataset.key = frameKey(side);
      frame.setAttribute(
        "allow",
        "camera; fullscreen; autoplay; clipboard-write",
      );
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-downloads allow-popups",
      );
      frame.src = href;
      shell.append(frame);
      status.textContent = "正在请求预览…";
      frame.addEventListener("load", () => {
        if (frame.isConnected) resizeFrames();
      });
      // HEAD validates local HTTP availability, not application initialization.
      if (run.preview.kind !== "external" && location.protocol !== "file:")
        fetch(href, { method: "HEAD" })
          .then((res) => {
            if (!res.ok && frame.isConnected) {
              frame.remove();
              shell.innerHTML =
                '<div class="frame-placeholder"><h3>预览文件不可用</h3><p>HTTP ' +
                res.status +
                "，请重试或独立打开。</p></div>";
              status.textContent = "加载失败";
            }
          })
          .catch(() => {
            if (frame.isConnected)
              status.textContent = "无法确认网络状态，请重试或独立打开。";
          });
      const timeout = setTimeout(() => {
        if (frame.isConnected) {
          const hint = document.createElement("p");
          hint.className = "panel-status";
          hint.textContent = "若画面为空或受浏览器限制，请重载或独立打开。";
          panel.querySelector(".panel-header").append(hint);
        }
      }, 10000);
      frame.addEventListener("load", () => clearTimeout(timeout), {
        once: true,
      });
    }
    renderPicker();
    renderSummary();
    if (state.tab === "conditions") renderConditions();
    requestAnimationFrame(resizeFrames);
  }
  function costSummary(run) {
    const b = run.billing;
    if (!b) return "费用未记录";
    if (b.type === "subscription")
      return (b.plan ? b.plan + " · " : "") + "订阅额度（单次金额未记录）";
    const amount =
      b.amount == null
        ? "金额未记录"
        : b.amount + " " + (b.unit || "单位未记录");
    return b.type === "batch"
      ? amount + " / " + (b.caseCount ?? "未记录") + " 案例批次"
      : amount + " · 单次";
  }
  function durationSummary(run) {
    const b = run.billing;
    return b?.duration
      ? b.duration.text +
          (b.type === "batch"
            ? " / " + (b.caseCount ?? "未记录") + " 案例批次"
            : " · 单次")
      : "耗时未记录";
  }
  function renderSummary() {
    const holder = $("comparison-summary");
    const selected = slots().filter((side) => getRun(side));
    holder.hidden = state.tab !== "snapshot" || !selected.length;
    if (holder.hidden) {
      holder.innerHTML = "";
      return;
    }
    const key = selected.map((side) => state[side]).join("/");
    if (holder.dataset.key === key && holder.children.length) return;
    holder.dataset.key = key;
    const base = getRun("left");
    holder.innerHTML =
      '<div class="summary-heading"><h2>截图与实验数据</h2><span>费用与耗时保留批次口径</span></div><div class="summary-columns">' +
      selected
        .map((side) => {
          const run = getRun(side);
          const comparable =
            base &&
            run.id !== base.id &&
            U.promptFor(data, base)?.hash === U.promptFor(data, run)?.hash &&
            base.score?.rubricVersion === run.score?.rubricVersion &&
            base.score?.criteriaHash &&
            base.score.criteriaHash === run.score?.criteriaHash &&
            U.scoreValue(base) !== null &&
            U.scoreValue(run) !== null;
          const delta = comparable
            ? U.scoreValue(run) - U.scoreValue(base)
            : null;
          return (
            '<article class="summary-record"><h3>' +
            labels[side] +
            " · " +
            e(U.runSummary(data, run)) +
            "</h3>" +
            U.scoreDetails(run) +
            (delta !== null
              ? '<p class="score-delta">与 A 截图分差 ' +
                (delta > 0 ? "+" : "") +
                delta +
                " · 同任务同规则，仅供参考</p>"
              : '<p class="score-delta">' +
                (run.id === base?.id
                  ? "A · 基准实验"
                  : "分数不作直接差值比较") +
                "</p>") +
            "<dl><dt>费用</dt><dd>" +
            e(costSummary(run)) +
            "</dd><dt>耗时</dt><dd>" +
            e(durationSummary(run)) +
            "</dd><dt>输入</dt><dd>" +
            e(
              run.id === base?.id
                ? U.completenessLabel(run.input.completeness)
                : U.relation(data, base, run),
            ) +
            '</dd></dl><a class="summary-record-link" href="' +
            e(U.documentURL(run)) +
            '">完整实验记录 →</a></article>'
          );
        })
        .join("") +
      "</div>";
  }
  function renderConditions() {
    const columns = slots().filter((side) => state[side]);
    const selected = columns.map(getRun);
    const valid = selected.filter(Boolean);
    $("differences-only").checked = state.differencesOnly;
    $("differences-only").disabled = valid.length < 2;
    $("conditions-notice").textContent =
      valid.length < 2
        ? "至少选择两个有效实验，才能筛选条件差异。"
        : new Set(valid.map((r) => r.id)).size !== valid.length
          ? "存在重复实验，请更换重复的一侧。"
          : "以 A 为基准查看输入关系。条件相同不代表公平性能评测，未知信息保持未记录。";
    const fields = [
      [
        "主题",
        (r) => data.topics.find((t) => t.id === r.topicId)?.title || "未记录",
      ],
      ["模型", (r) => U.modelLabel(data, r)],
      [
        "截图评分",
        (r) =>
          U.scoreValue(r) === null
            ? {
                insufficient: "证据不足",
                unavailable: "无截图",
                pending: "待评分",
              }[r.score?.status] || "待评分"
            : U.scoreValue(r) + "/100 · 规则 v" + r.score.rubricVersion,
      ],
      ["评分依据", (r) => r.score?.evidence || "未记录"],
      ["费用", costSummary],
      ["耗时", durationSummary],
      ["模型厂商", (r) => U.modelProvider(data, r)],
      ["接入供应商", (r) => r.billing?.provider || "未记录"],
      ["计费说明", (r) => r.billing?.note || "未记录"],
      ["推理档位", (r) => U.effortLabel(r.effort)],
      ["执行模式", (r) => U.executionModeText(r)],
      ["自主优化授权原文", (r) => r.input.authorization || "未记录"],
      ["轮次", (r) => U.roundLabel(r)],
      ["日期", (r) => r.date || "未记录"],
      ["归档日期", (r) => r.archivedAt || "未记录"],
      ["截图采集日期", (r) => r.screenshotInfo?.capturedAt || "未记录"],
      ["来源实验", (r) => r.sourceRunId || "未记录"],
      ["提示词版本", (r) => r.promptId],
      [
        "输入关系（与 A）",
        (r) =>
          r.id === state.left
            ? "基准实验"
            : U.relation(data, getRun("left"), r),
      ],
      ["原始输入指纹", (r) => (U.hasRecordedInput(r) ? r.rawHash : "未记录")],
      ["输入留存", (r) => U.completenessLabel(r.input.completeness)],
      ["输入说明", (r) => r.input.notes || "未记录"],
      ["平台与工具", (r) => r.environment.tool || "未记录"],
      ["上下文说明", (r) => r.environment.notes || "未记录"],
      ["产物类型", (r) => r.type],
      [
        "预览方式",
        (r) =>
          ({
            static: "静态页面",
            build: "构建预览",
            external: "外部部署",
            none: "无预览",
          })[r.preview.kind],
      ],
      [
        "网络要求",
        (r) =>
          ({ offline: "离线可用", required: "需要联网", unknown: "未记录" })[
            r.preview.network
          ] || r.preview.network,
      ],
      ["技术栈", (r) => r.stack.join(" / ") || "未记录"],
      ["人工修改与部署适配", (r) => r.changes.join("\n") || "未记录新增改动"],
    ];
    const rows = fields.map(([label, value]) => ({
      label,
      values: selected.map((r) => (r ? value(r) : "实验不存在")),
    }));
    const filtered =
      state.differencesOnly && valid.length >= 2
        ? rows.filter((row) => new Set(row.values).size > 1)
        : rows;
    $("conditions-table").innerHTML = columns.length
      ? '<table class="archive-table conditions-table"><caption>所选实验的已知运行条件</caption><thead><tr><th scope="col">条件</th>' +
        columns
          .map(
            (side, i) =>
              '<th scope="col">' +
              labels[side] +
              (side === "left" ? " · 基准" : "") +
              "<small>" +
              e(selected[i] ? U.runSummary(data, selected[i]) : "实验不存在") +
              "</small></th>",
          )
          .join("") +
        "</tr></thead><tbody>" +
        filtered
          .map(
            (row) =>
              '<tr><th scope="row">' +
              e(row.label) +
              "</th>" +
              row.values
                .map(
                  (value) =>
                    "<td>" + e(value).replaceAll("\n", "<br>") + "</td>",
                )
                .join("") +
              "</tr>",
          )
          .join("") +
        "</tbody></table>"
      : '<p class="frame-placeholder">请选择实验开始查看运行条件。</p>';
  }
  document.addEventListener("change", (event) => {
    const el = event.target;
    if (el.id === "picker-side" || el.id === "scope") {
      if (el.id === "scope") {
        state.scope = el.value;
        updateURL();
      }
      renderPicker();
      return;
    }
    if (el.id === "group") {
      state.group = el.value;
      fillGroup(true);
    } else if (el.id === "layout") {
      state.layout = el.value;
      state.focus = "";
      if (state.layout !== "quad" && ["third", "fourth"].includes(state.mobile))
        state.mobile = "left";
      if (state.layout === "quad") {
        const occupied = new Set([state.left, state.right]);
        for (const side of ["third", "fourth"]) {
          if (!state[side] || occupied.has(state[side])) {
            choose(side, pool().find((r) => !occupied.has(r.id))?.id || "");
          }
          occupied.add(state[side]);
        }
      }
    } else if (el.dataset.run) {
      const side = el.dataset.run;
      choose(side, el.value);
    } else if (el.dataset.page) {
      state[el.dataset.page + "Page"] = el.value;
      unloaded[el.dataset.page] = false;
    } else if (el.id === "viewport") state.viewport = el.value;
    else if (el.id === "prompt-source") state.source = el.value;
    else if (el.id === "related-only") state.relatedOnly = el.checked;
    else if (el.id === "differences-only") state.differencesOnly = el.checked;
    else return;
    updateURL();
    render();
  });
  document.addEventListener("click", (event) => {
    const el = event.target.closest("button");
    if (!el) return;
    if (el.hasAttribute("data-start-comparison")) {
      $("group").focus();
      try {
        $("group").showPicker?.();
      } catch {}
      return;
    }
    if (el.id === "pick-models") {
      $("picker-side").value =
        state.layout === "single" || narrow.matches
          ? visibleSides()[0]
          : "right";
      renderPicker();
      $("model-picker").showModal();
      $("model-search").focus();
      return;
    } else if (el.id === "close-picker") {
      $("model-picker").close();
      return;
    } else if (el.dataset.choice) {
      choose($("picker-side").value, el.dataset.choice);
      $("model-picker").close();
    } else if (el.dataset.step) {
      const side = el.dataset.side;
      const candidates = pool().filter(
        (r) =>
          !sides.some(
            (s) => s !== side && slots().includes(s) && state[s] === r.id,
          ),
      );
      if (!candidates.length) return;
      const index = candidates.findIndex((r) => r.id === state[side]);
      choose(
        side,
        candidates[
          (index + Number(el.dataset.step) + candidates.length) %
            candidates.length
        ].id,
      );
    } else if (el.dataset.maximize) {
      state.focus =
        state.focus === el.dataset.maximize ? "" : el.dataset.maximize;
    } else if (el.dataset.tab) state.tab = el.dataset.tab;
    else if (el.dataset.mobile) state.mobile = el.dataset.mobile;
    else if (el.dataset.unload)
      unloaded[el.dataset.unload] = !unloaded[el.dataset.unload];
    else if (el.dataset.reload) {
      const side = el.dataset.reload;
      unloaded[side] = false;
      delete $("panel-" + side).dataset.viewKey;
    } else if (el.id === "swap") {
      [state.left, state.right] = [state.right, state.left];
      [state.leftModel, state.rightModel] = [state.rightModel, state.leftModel];
      [state.leftEffort, state.rightEffort] = [
        state.rightEffort,
        state.leftEffort,
      ];
      [state.leftPage, state.rightPage] = [state.rightPage, state.leftPage];
      [unloaded.left, unloaded.right] = [unloaded.right, unloaded.left];
    } else return;
    updateURL();
    render();
  });
  $("share").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("share-message").textContent = "分享链接已复制";
      $("share-fallback").hidden = true;
    } catch {
      $("share-message").textContent = "请复制下方链接";
      $("share-fallback").hidden = false;
      $("share-fallback").value = location.href;
      $("share-fallback").select();
    }
  });
  window.addEventListener("popstate", () => {
    fromURL();
    sides.forEach((side) => (unloaded[side] = false));
    render();
  });
  narrow.addEventListener("change", render);
  document.addEventListener(
    "toggle",
    (event) => {
      if (event.target.matches?.(".panel-more"))
        requestAnimationFrame(resizeFrames);
    },
    true,
  );
  window.addEventListener("resize", resizeFrames);
  $("group").innerHTML =
    '<option value="">选择主题 / 提示词…</option>' +
    data.prompts
      .map((p) => {
        const topic = data.topics.find((t) => t.id === p.topicId);
        const count = data.runs.filter(
          (r) => U.promptFor(data, r)?.hash === p.hash,
        ).length;
        return `<option value="${e(p.topicId + "/" + p.id)}">${e(topic.title)} / ${e(p.id)} · ${count} 个实验</option>`;
      })
      .join("");
  $("model-search").addEventListener("input", renderPicker);
  new ResizeObserver(resizeFrames).observe(
    document.querySelector(".compare-grid"),
  );
  fromURL();
  render();
})();
