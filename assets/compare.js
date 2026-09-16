(function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI,
    e = U.escape,
    $ = (id) => document.getElementById(id);
  const sides = ["left", "right"],
    narrow = matchMedia("(max-width:700px)"),
    unloaded = { left: false, right: false };
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
      leftPage: p.get("leftPage") || "",
      rightPage: p.get("rightPage") || "",
      viewport: ["adaptive", ...Object.keys(sizes)].includes(p.get("viewport"))
        ? p.get("viewport")
        : "adaptive",
      tab: ["preview", "prompt", "info"].includes(p.get("tab"))
        ? p.get("tab")
        : "preview",
      source: p.get("source") === "raw" ? "raw" : "task",
      mobile: p.get("mobile") === "right" ? "right" : "left",
    };
  }
  const getRun = (side) => data.runs.find((r) => r.id === state[side]);
  function updateURL() {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(state)) if (v) p.set(k, v);
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
    const common = Math.min(...shells.map((el) => el.clientWidth));
    for (const shell of shells) {
      const frame = shell.querySelector("iframe");
      if (!frame) continue;
      const [width, height] = sizes[state.viewport] || [common, 580];
      const scale = Math.min(1, shell.clientWidth / width);
      frame.style.width = width + "px";
      frame.style.height = height + "px";
      frame.style.transform = `scale(${scale})`;
      shell.style.height = Math.ceil(height * scale) + "px";
      shell.closest(".compare-panel").querySelector("[data-size]").textContent =
        `${width} × ${height} · ${Math.round(scale * 100)}%`;
    }
  }
  function render() {
    const a = getRun("left"),
      b = getRun("right");
    $("relation").textContent =
      state.left && state.left === state.right
        ? "不能选择同一条实验，请更换一侧。"
        : U.relation(data, a, b);
    $("viewport").value = state.viewport;
    $("prompt-source").value = state.source;
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
      const key = [state.left, state.right, state.source].join("/");
      if (diffCache?.key !== key)
        diffCache = { key, ...U.diff(textFor(a), textFor(b)) };
    }
    for (const side of sides) {
      const panel = $("panel-" + side),
        run = getRun(side),
        other = getRun(side === "left" ? "right" : "left");
      const active = !narrow.matches || state.mobile === side;
      panel.classList.toggle("mobile-inactive", !active);
      const ordered = U.filterRuns(data, {}).sort((x, y) => {
        const rank = (r) =>
          other
            ? r.id === other.id
              ? 3
              : U.promptFor(data, r)?.hash === U.promptFor(data, other)?.hash
                ? 0
                : r.topicId === other.topicId
                  ? 1
                  : 2
            : 0;
        return rank(x) - rank(y);
      });
      const options =
        '<option value="">选择实验…</option>' +
        (state[side] && !run
          ? '<option value="' +
            e(state[side]) +
            '" selected>未找到：' +
            e(state[side]) +
            "</option>"
          : "") +
        ordered
          .map(
            (r) =>
              '<option value="' +
              e(r.id) +
              '"' +
              (r.id === state[side] ? " selected" : "") +
              (r.id === other?.id ? " disabled" : "") +
              ">" +
              e(r.title) +
              (other &&
              r.id !== other.id &&
              U.promptFor(data, r)?.hash === U.promptFor(data, other)?.hash
                ? " · 同正文"
                : "") +
              "</option>",
          )
          .join("");
      // Keep an untouched iframe in place: moving its DOM node would reload it.
      const viewKey = JSON.stringify([
        frameKey(side),
        state.tab,
        state.tab === "prompt" ? diffCache.key : "",
        active,
        unloaded[side],
        side === "right" && state.left === state.right,
      ]);
      if (panel.dataset.viewKey === viewKey) {
        panel.querySelector("[data-run]").innerHTML = options;
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
        '<div class="panel-header"><h2>' +
        (side === "left" ? "A · 左侧" : "B · 右侧") +
        '</h2><label for="run-' +
        side +
        '">实验版本</label><select id="run-' +
        side +
        '" data-run="' +
        side +
        '">' +
        options +
        "</select>" +
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
            '" target="_blank" rel="noopener">独立打开 ↗</a><button data-reload="' +
            side +
            '">重载</button><button data-unload="' +
            side +
            '">' +
            (unloaded[side] ? "加载此侧" : "卸载此侧") +
            "</button>"
          : "") +
        (run ? '<a href="' + e(run.document) + '">实验记录</a>' : "") +
        '</div><p class="panel-status">' +
        (run
          ? e(
              U.modelLabel(data, run) +
                " / " +
                run.effort +
                " · " +
                (run.environment.tool || "工具未记录"),
            )
          : "请选择实验") +
        '</p><p class="panel-status" data-size></p></div><div data-content></div>';
      const content = panel.querySelector("[data-content]");
      if (!run) {
        content.innerHTML =
          '<div class="frame-placeholder"><h3>' +
          (state[side] ? "实验不存在或已经迁移" : "选一个实验开始") +
          "</h3><p>上方可以选择任意主题的实验。另一侧会优先列出同正文版本。</p></div>";
        continue;
      }
      if (side === "right" && state.left === state.right) {
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
          e(run.input.notes) +
          "</p><pre>" +
          diffCache[side] +
          "</pre></div>";
        continue;
      }
      if (state.tab === "info") {
        const info = [
          ["模型 / 推理档位", U.modelLabel(data, run) + " / " + run.effort],
          ["日期", run.date || "未记录"],
          ["原始输入记录", run.input.completeness + " · " + run.input.notes],
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
      frame.setAttribute("allow", "fullscreen; autoplay; clipboard-write");
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
    requestAnimationFrame(resizeFrames);
  }
  document.addEventListener("change", (event) => {
    const el = event.target;
    if (el.dataset.run) {
      const side = el.dataset.run;
      state[side] = el.value;
      state[side + "Page"] = "";
      unloaded[side] = false;
    } else if (el.dataset.page) {
      state[el.dataset.page + "Page"] = el.value;
      unloaded[el.dataset.page] = false;
    } else if (el.id === "viewport") state.viewport = el.value;
    else if (el.id === "prompt-source") state.source = el.value;
    else return;
    updateURL();
    render();
  });
  document.addEventListener("click", (event) => {
    const el = event.target.closest("button");
    if (!el) return;
    if (el.dataset.tab) state.tab = el.dataset.tab;
    else if (el.dataset.mobile) state.mobile = el.dataset.mobile;
    else if (el.dataset.unload)
      unloaded[el.dataset.unload] = !unloaded[el.dataset.unload];
    else if (el.dataset.reload) {
      const side = el.dataset.reload;
      unloaded[side] = false;
      delete $("panel-" + side).dataset.viewKey;
    } else if (el.id === "swap") {
      [state.left, state.right] = [state.right, state.left];
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
    unloaded.left = unloaded.right = false;
    render();
  });
  narrow.addEventListener("change", render);
  window.addEventListener("resize", resizeFrames);
  fromURL();
  render();
})();
