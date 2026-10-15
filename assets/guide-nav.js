(function () {
  const slug = document.body.dataset.guide;
  const bar = document.createElement("nav");
  bar.className = "guide-sitebar";
  bar.setAttribute("aria-label", "实验档案导航");
  const root = new URL(
    "../",
    document.currentScript?.src ||
      [...document.scripts].find((script) =>
        script.src.includes("guide-nav.js"),
      ).src,
  );
  const link = (label, file) => {
    const a = document.createElement("a");
    a.textContent = label;
    a.href = new URL(file, root);
    bar.append(a);
  };
  link("AI CODING / DEMO", "index.html");
  bar.firstElementChild.className = "guide-archive-brand";
  link("← 技术索引", "index.html#guides");
  link("阅读技术说明", `assets/generated/readers/docs/${slug}/Readme.html`);
  const note = document.createElement("span");
  note.textContent = ["unsplash", "skeleton"].includes(slug)
    ? "页面脚本可离线运行 · 外部图片需要联网"
    : "本地资源 · 可离线运行";
  bar.append(note);
  document.body.prepend(bar);
})();
