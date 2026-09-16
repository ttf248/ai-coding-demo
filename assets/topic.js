(function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI,
    e = U.escape,
    root = document.getElementById("topic-content");
  const topic = data.topics.find(
    (t) => t.id === new URLSearchParams(location.search).get("id"),
  );
  if (!topic) {
    root.innerHTML =
      '<h1>未找到这个主题</h1><p>目录已经更新，请返回首页重新选择。</p><a class="button" href="index.html">返回实验目录</a>';
    return;
  }
  document.title = topic.title + " · AI Coding Demo";
  const runs = U.filterRuns(data, {}).filter((r) => r.topicId === topic.id),
    prompts = data.prompts.filter((p) => p.topicId === topic.id);
  root.innerHTML =
    '<a class="back" href="index.html">← 全部主题</a><div class="page-heading"><span class="eyebrow">EXPERIMENT / ' +
    runs.length +
    " RECORDS</span><h1>" +
    e(topic.title) +
    "</h1><p>" +
    e(topic.description) +
    '</p></div><section class="prompt-library"><h2>任务与版本</h2>' +
    prompts
      .map(
        (p) =>
          "<details><summary>" +
          e(p.title) +
          " · " +
          e(p.id) +
          " · " +
          runs.filter((r) => r.promptId === p.id).length +
          " 条记录</summary><p>" +
          e(p.extraction) +
          "</p><pre>" +
          e(p.text) +
          '</pre><a href="' +
          e(p.directory) +
          '/prompt.md">原始文件 ↗</a></details>',
      )
      .join("") +
    '</section><section><div class="section-title"><h2>实验记录</h2><p>选择两个版本，并排查看实现与输入条件</p></div><div class="cards">' +
    runs.map((r) => U.runCard(data, r)).join("") +
    "</div></section>";
  U.setupSelection(data);
})();
