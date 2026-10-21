(function (global) {
  "use strict";
  const sides = ["left", "right", "third", "fourth"];
  function homeFromURL(search) {
    const params = new URLSearchParams(search);
    return {
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
        : "",
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
  }
  function compareFromURL(search, data) {
    const p = new URLSearchParams(search);
    const state = {
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
      viewport: ["adaptive", "desktop", "tablet", "mobile"].includes(
        p.get("viewport"),
      )
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
      const run = data.runs.find((run) => run.id === state[side]);
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
    return state;
  }
  global.ArchiveState = { homeFromURL, compareFromURL };
})(typeof window !== "undefined" ? window : globalThis);
