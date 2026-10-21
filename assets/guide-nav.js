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
  note.textContent = "正在读取联网要求…";
  const metadata = document.createElement("script");
  metadata.src = new URL("assets/generated/guides.js", root).href;
  metadata.onload = () => {
    const guide = (window.ARCHIVE_GUIDES || []).find(
      (item) => item.slug === slug,
    );
    note.textContent =
      guide?.network === "offline"
        ? "本地资源 · 可离线运行"
        : guide?.network === "required"
          ? "本地脚本 · 外部资源需要联网"
          : "联网要求未记录 · 查看技术说明";
  };
  metadata.onerror = () => {
    note.textContent = "联网要求未载入 · 查看技术说明";
  };
  document.head.append(metadata);
  bar.append(note);
  document.body.prepend(bar);
})();
