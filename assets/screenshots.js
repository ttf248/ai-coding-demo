(function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI,
    $ = (id) => document.getElementById(id);
  let run = null,
    frames = [],
    selected = "",
    generation = 0;
  const params = new URLSearchParams(location.search);
  $("captures-device").value = ["desktop", "mobile"].includes(
    params.get("device"),
  )
    ? params.get("device")
    : "all";
  const allRuns = data.runs.filter(
    (item) => U.captureCount(item) > 0 || item.id === params.get("run"),
  );
  $("captures-run").innerHTML =
    '<option value="">选择实验</option>' +
    U.groupedOptions(
      allRuns,
      (item) =>
        data.topics.find((t) => t.id === item.topicId)?.title || item.topicId,
      (item) =>
        '<option value="' +
        U.escape(item.id) +
        '">' +
        U.escape(U.runSummary(data, item)) +
        "</option>",
    );
  function visible() {
    return frames.filter(
      (frame) =>
        $("captures-device").value === "all" ||
        U.captureDevice(frame) === $("captures-device").value,
    );
  }
  function updateURL() {
    const p = new URLSearchParams();
    if (run) p.set("run", run.id);
    if (selected) p.set("frame", selected);
    if ($("captures-device").value !== "all")
      p.set("device", $("captures-device").value);
    history.replaceState(null, "", location.pathname + (p.size ? "?" + p : ""));
  }
  function render() {
    const items = visible();
    if (!items.some((frame) => frame.id === selected))
      selected =
        items.find((frame) => frame.file === U.screenshotURL(run))?.id ||
        items[0]?.id ||
        "";
    const index = items.findIndex((frame) => frame.id === selected),
      frame = items[index];
    $("captures-frame").innerHTML = items.length
      ? items
          .map(
            (item) =>
              '<option value="' +
              U.escape(item.id) +
              '">' +
              U.escape(U.captureFrameLabel(item, run)) +
              "</option>",
          )
          .join("")
      : '<option value="">暂无对应取景</option>';
    $("captures-frame").value = selected;
    $("captures-frame").disabled = !items.length;
    $("captures-previous").disabled = index <= 0;
    $("captures-next").disabled = index < 0 || index >= items.length - 1;
    $("captures-position").textContent = items.length
      ? index + 1 + " / " + items.length + " 张 · 共 " + frames.length + " 张"
      : "0 张截图";
    const img = $("captures-image");
    img.hidden = !frame;
    $("captures-compare").hidden = !frame;
    $("captures-share").disabled = !frame;
    document.querySelectorAll("[data-capture-scale]").forEach((button) => {
      button.disabled = !frame;
    });
    $("captures-original").hidden = !frame;
    $("captures-stage").scrollTo(0, 0);
    $("captures-image-caption").textContent = frame
      ? U.captureFrameLabel(frame, run) +
        (frame.viewport
          ? " · 视口 " + frame.viewport.width + " × " + frame.viewport.height
          : "") +
        " · 图片 " +
        frame.width +
        " × " +
        frame.height
      : "";
    $("captures-status").textContent = frame
      ? ""
      : run
        ? "此实验没有所选取景的真实截图。"
        : "选择一个实验查看截图。";
    if (frame) {
      img.alt =
        U.runSummary(data, run) + " · " + U.captureFrameLabel(frame, run);
      img.src = frame.file;
      $("captures-original").href = frame.file;
      $("captures-compare").href =
        "compare.html?left=" +
        encodeURIComponent(run.id) +
        "&tab=snapshot&leftCapture=" +
        encodeURIComponent(frame.id);
    } else {
      img.removeAttribute("src");
      $("captures-original").removeAttribute("href");
    }
    updateURL();
  }
  async function load(id, frameId = "") {
    const token = ++generation;
    run = data.runs.find((item) => item.id === id) || null;
    frames = [];
    selected = frameId;
    $("captures-image").hidden = true;
    $("captures-image").removeAttribute("src");
    $("captures-original").hidden = true;
    $("captures-share").disabled = true;
    $("captures-frame").disabled = true;
    $("captures-previous").disabled = true;
    $("captures-next").disabled = true;
    $("captures-image-caption").textContent = "";
    $("captures-run").value = run?.id || "";
    $("captures-retry").hidden = true;
    for (const key of ["captures-topic", "captures-record", "captures-compare"])
      $(key).hidden = !run;
    $("captures-compare").hidden = true;
    if (!run) {
      $("captures-title").textContent = "实验截图集";
      $("captures-caption").textContent = "查看桌面、手机与操作后的实际画面。";
      render();
      if (id)
        $("captures-status").textContent =
          "没有找到这个实验，请从列表重新选择。";
      return;
    }
    $("captures-title").textContent =
      (data.topics.find((t) => t.id === run.topicId)?.title || run.title) +
      " · 截图集";
    $("captures-caption").textContent =
      U.runSummary(data, run) + " · 实验日期 " + (run.date || "未记录");
    $("captures-topic").href =
      "topic.html?id=" +
      encodeURIComponent(run.topicId) +
      "&view=list#run-" +
      encodeURIComponent(run.id);
    $("captures-record").href = U.documentURL(run);
    $("captures-status").textContent = "正在加载截图资料…";
    try {
      await U.ensureDetails(data, [run], { individual: true });
      if (token !== generation) return;
      frames = U.captureFrames(run);
      render();
      document.title = U.runSummary(data, run) + " · 截图集";
    } catch {
      if (token !== generation) return;
      $("captures-image").hidden = true;
      $("captures-image").removeAttribute("src");
      $("captures-status").textContent = "截图资料加载失败，请重试。";
      $("captures-retry").hidden = false;
    }
  }
  $("captures-run").addEventListener("change", (event) =>
    load(event.target.value),
  );
  $("captures-device").addEventListener("change", render);
  $("captures-frame").addEventListener("change", (event) => {
    selected = event.target.value;
    render();
  });
  function step(direction) {
    const items = visible(),
      index = items.findIndex((frame) => frame.id === selected),
      frame = items[index + direction];
    if (frame) {
      selected = frame.id;
      render();
    }
  }
  $("captures-previous").addEventListener("click", () => step(-1));
  $("captures-next").addEventListener("click", () => step(1));
  $("captures-stage").addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      step(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  document.querySelectorAll("[data-capture-scale]").forEach((button) =>
    button.addEventListener("click", () => {
      $("captures-stage").dataset.scale = button.dataset.captureScale;
      document
        .querySelectorAll("[data-capture-scale]")
        .forEach((item) =>
          item.setAttribute("aria-pressed", String(item === button)),
        );
    }),
  );
  $("captures-image").addEventListener("error", () => {
    $("captures-status").textContent = "截图加载失败，可以重试或打开原图。";
    $("captures-retry").hidden = false;
  });
  $("captures-retry").addEventListener("click", () => load(run?.id, selected));
  $("captures-share").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      $("captures-status").textContent = "当前截图链接已复制";
      $("captures-share-fallback").hidden = true;
    } catch {
      $("captures-share-fallback").hidden = false;
      $("captures-share-fallback").value = location.href;
      $("captures-share-fallback").select();
    }
  });
  load(params.get("run") || "", params.get("frame") || "");
})();
