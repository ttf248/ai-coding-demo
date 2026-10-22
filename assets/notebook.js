(function (global) {
  "use strict";
  const key = "archive-notebook-v1",
    data = global.ARCHIVE,
    U = global.ArchiveUI;
  const blank = () => ({ version: 1, saved: [], recent: [] });
  let problem = "",
    readable = true;
  function normalize(item) {
    if (!item || typeof item !== "object") return null;
    if (item.type === "run" && data.runs.some((run) => run.id === item.id))
      return { type: "run", id: item.id };
    if (
      item.type === "topic" &&
      data.topics.some((topic) => topic.id === item.id)
    )
      return { type: "topic", id: item.id };
    if (
      item.type === "comparison" &&
      typeof item.search === "string" &&
      item.search.length < 6000
    ) {
      const params = new URLSearchParams(item.search),
        clean = new URLSearchParams();
      const allowed = [
        "left",
        "right",
        "third",
        "fourth",
        "group",
        "scope",
        "layout",
        "focus",
        "viewport",
        "tab",
        "source",
        "related",
        "differencesOnly",
        "mobile",
        ...["left", "right", "third", "fourth"].flatMap((side) => [
          side + "Page",
          side + "Capture",
          side + "Model",
          side + "Effort",
        ]),
      ];
      for (const name of allowed)
        if (params.has(name)) clean.set(name, params.get(name));
      const sides =
        clean.get("layout") === "quad"
          ? ["left", "right", "third", "fourth"]
          : ["left", "right"];
      if (
        new Set(
          sides
            .map((side) => clean.get(side))
            .filter((id) => data.runs.some((run) => run.id === id)),
        ).size < 2
      )
        return null;
      clean.sort();
      return { type: "comparison", search: clean.toString() };
    }
    return null;
  }
  const identity = (item) => item.type + ":" + (item.id || item.search);
  const recentIdentity = (item) =>
    item.type === "comparison"
      ? "comparison:" +
        ["left", "right", "third", "fourth"]
          .map((side) => new URLSearchParams(item.search).get(side) || "")
          .join("/")
      : identity(item);
  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || "null");
      readable = true;
      if (!raw) return blank();
      if (
        raw.version !== 1 ||
        !Array.isArray(raw.saved) ||
        !Array.isArray(raw.recent)
      )
        throw Error("format");
      const clean = (items) =>
        items.slice(0, 200).flatMap((item) => {
          const valid = normalize(item);
          return valid
            ? [
                {
                  ...valid,
                  note:
                    typeof item.note === "string"
                      ? item.note.slice(0, 2000)
                      : "",
                  at: typeof item.at === "string" ? item.at : "",
                },
              ]
            : [];
        });
      return {
        version: 1,
        saved: clean(raw.saved),
        recent: clean(raw.recent).slice(0, 12),
      };
    } catch {
      readable = false;
      problem = "本地资料不可读取，已保留原存储内容；浏览功能仍可使用。";
      return blank();
    }
  }
  function write(value) {
    if (!readable) return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      problem = "";
      global.dispatchEvent(new Event("archive-notebook-change"));
      return true;
    } catch {
      problem = "浏览器未能保存资料，请检查存储权限或空间；本次内容尚未保存。";
      return false;
    }
  }
  function save(item, note) {
    const valid = normalize(item);
    if (!valid) {
      problem = "请先选择有效实验；对比组合需要至少两条不同实验。";
      return false;
    }
    const state = read(),
      existing = state.saved.find(
        (entry) => identity(entry) === identity(valid),
      );
    if (!existing && state.saved.length >= 200) {
      problem = "已保存 200 项，请移除不再需要的收藏后重试。";
      return false;
    }
    state.saved = [
      {
        ...valid,
        note:
          typeof note === "string" ? note.slice(0, 2000) : existing?.note || "",
        at: new Date().toISOString(),
      },
      ...state.saved.filter((entry) => identity(entry) !== identity(valid)),
    ];
    return write(state);
  }
  function visit(item) {
    const valid = normalize(item);
    if (!valid) return;
    const state = read();
    state.recent = [
      { ...valid, at: new Date().toISOString() },
      ...state.recent.filter(
        (entry) => recentIdentity(entry) !== recentIdentity(valid),
      ),
    ].slice(0, 12);
    write(state);
  }
  function remove(item) {
    const state = read();
    state.saved = state.saved.filter(
      (entry) => identity(entry) !== identity(item),
    );
    return write(state);
  }
  function clearRecent() {
    const state = read();
    state.recent = [];
    return write(state);
  }
  function href(item) {
    if (item.type === "run")
      return U.documentURL(data.runs.find((run) => run.id === item.id));
    return item.type === "topic"
      ? "topic.html?id=" + encodeURIComponent(item.id)
      : "compare.html?" + item.search;
  }
  function label(item) {
    if (item.type === "run") {
      const run = data.runs.find((run) => run.id === item.id);
      return run.title + " · " + U.runSummary(data, run);
    }
    if (item.type === "topic")
      return data.topics.find((topic) => topic.id === item.id).title;
    const p = new URLSearchParams(item.search);
    return ["left", "right", "third", "fourth"]
      .map((side) => data.runs.find((run) => run.id === p.get(side)))
      .filter(Boolean)
      .map(
        (run) =>
          data.topics.find((topic) => topic.id === run.topicId).title +
          " · " +
          U.runSummary(data, run),
      )
      .join(" / ");
  }
  global.ArchiveNotebook = {
    read,
    save,
    visit,
    remove,
    clearRecent,
    href,
    label,
    identity,
    problem: () => problem,
  };
  addEventListener("storage", (event) => {
    if (event.key === key || event.key === null)
      global.dispatchEvent(new Event("archive-notebook-change"));
  });
  document.addEventListener("click", (event) => {
    const button = event.target.closest(
      "[data-save-run], #save-comparison, #save-preview",
    );
    if (button) {
      const item =
        button.id === "save-comparison"
          ? {
              type: "comparison",
              search: button.dataset.search || location.search,
            }
          : {
              type: "run",
              id:
                button.dataset.saveRun ||
                document.getElementById("preview-version")?.value,
            };
      const success = save(item);
      const status = document.getElementById("notebook-status");
      if (status) {
        status.hidden = false;
        status.textContent = success
          ? "已保存到本地收藏，可在收藏页添加备注。"
          : problem;
      }
      button.textContent = success ? "已收藏" : "保存失败，可重试";
    }
    const link = event.target.closest("a[href]");
    if (link) {
      const run = data.runs.find(
        (run) =>
          U.previewURL(run) === link.getAttribute("href") ||
          U.documentURL(run) === link.getAttribute("href"),
      );
      if (run) visit({ type: "run", id: run.id });
    }
  });
  const page = location.pathname.split("/").at(-1),
    params = new URLSearchParams(location.search);
  if (page === "topic.html") visit({ type: "topic", id: params.get("id") });
  if (page === "compare.html")
    visit({ type: "comparison", search: location.search });
})(window);
