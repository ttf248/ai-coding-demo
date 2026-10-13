(function () {
  const status = document.querySelector(".document-copy-status");
  if (matchMedia("(max-width:700px)").matches)
    document.querySelector(".document-sidebar details").open = false;
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
