(function () {
  const status = document.querySelector(".document-copy-status");
  if (matchMedia("(max-width:700px)").matches)
    document.querySelector(".document-sidebar details").open = false;
  const tocLinks = [...document.querySelectorAll(".document-sidebar nav a")];
  const sections = tocLinks
    .map((link) => ({
      link,
      heading: document.getElementById(decodeURIComponent(link.hash.slice(1))),
    }))
    .filter((item) => item.heading);
  document
    .querySelector(".document-toc-return")
    ?.addEventListener("click", () => {
      const toc = document.querySelector(".document-sidebar details");
      toc.open = true;
      toc.querySelector("summary").focus();
    });
  let scheduled = false;
  function updateSection() {
    scheduled = false;
    const current =
      sections
        .filter((item) => item.heading.getBoundingClientRect().top <= 140)
        .at(-1) || sections[0];
    for (const item of sections) {
      if (item === current) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    }
  }
  addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateSection);
      }
    },
    { passive: true },
  );
  addEventListener("resize", updateSection);
  updateSection();
  document.querySelectorAll(".document-content pre").forEach((pre) => {
    const button = document.createElement("button");
    button.className = "code-copy";
    button.textContent = "复制代码";
    pre.before(button);
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(pre.textContent);
        status.textContent = "代码已复制";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = "代码已选中，可手动复制。";
      }
    });
  });
})();
