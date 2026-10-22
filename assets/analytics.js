(function () {
  "use strict";
  if (window.__archiveAnalyticsInitialized) return;
  window.__archiveAnalyticsInitialized = true;

  const measurementId = "G-8E54P1HX3G";
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag("js", new Date());
  const pageLocation = location.origin + location.pathname;
  const referrer = document.referrer ? new URL(document.referrer) : null;
  window.gtag("config", measurementId, {
    page_location: pageLocation,
    page_referrer: referrer ? referrer.origin + referrer.pathname : "",
  });

  // 只接受已定义的业务事件和参数；不采集搜索原文、提示词或个人备注。
  const events = new Set([
    "archive_recommendation",
    "archive_pick",
    "archive_preview_open",
    "archive_compare_start",
    "archive_evidence_view",
    "archive_prompt_view",
    "archive_search",
    "archive_filter",
    "archive_share",
  ]);
  function track(name, params = {}) {
    if (!events.has(name)) return;
    const safe = {};
    for (const key of [
      "kind",
      "run_id",
      "topic_id",
      "mode",
      "result_count",
      "query_length",
      "field",
      "outcome",
    ]) {
      const value = params[key];
      if (typeof value === "number" && Number.isFinite(value))
        safe[key] = value;
      else if (
        typeof value === "string" &&
        /^[a-zA-Z0-9_-]{1,160}$/.test(value)
      )
        safe[key] = value;
    }
    try {
      window.gtag("event", name, { ...safe, page_location: pageLocation });
    } catch {}
  }
  window.ArchiveAnalytics = { track };
  document.addEventListener("archive-metric", (event) =>
    track(event.detail?.name, event.detail?.params),
  );
  for (const event of window.archiveMetricQueue || [])
    track(event.name, event.params);
  window.archiveMetricQueue = [];
  document.addEventListener("click", (event) => {
    const el = event.target.closest("button, a");
    if (!el) return;
    if (el.dataset.recommendation)
      track("archive_recommendation", { kind: el.dataset.recommendation });
    if (el.dataset.compare || el.dataset.choice)
      track("archive_pick", {
        run_id: el.dataset.compare || el.dataset.choice,
      });
    if (el.dataset.preview)
      track("archive_evidence_view", {
        run_id: el.dataset.preview,
        mode: "cover",
      });
    if (
      el.dataset.tab === "snapshot" ||
      el.closest(".screenshot-link") ||
      el.getAttribute("href")?.startsWith("screenshots.html?")
    )
      track("archive_evidence_view", { mode: "collection" });
    if (el.dataset.tab === "prompt") track("archive_prompt_view");
    const href = el.getAttribute("href");
    if (
      (href &&
        window.ARCHIVE?.runs.some(
          (r) => window.ArchiveUI?.previewURL(r) === href,
        )) ||
      el.dataset.previewMode === "live"
    )
      track("archive_preview_open", { mode: "open" });
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
  document.head.append(script);
})();
