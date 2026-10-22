(function () {
  "use strict";
  const N = window.ArchiveNotebook,
    U = window.ArchiveUI,
    data = window.ARCHIVE,
    e = U.escape;
  const saved = document.getElementById("saved-items"),
    recent = document.getElementById("recent-items"),
    status = document.getElementById("notebook-status");
  function render() {
    const value = N.read();
    saved.innerHTML =
      value.saved
        .map(
          (item, index) =>
            `<article class="saved-item" data-saved-index="${index}"><h3><a href="${e(N.href(item))}">${e(N.label(item))}</a></h3><form><label>个人备注<textarea maxlength="2000">${e(item.note || "")}</textarea></label><button type="submit">保存备注</button><button type="button" data-remove-saved>移除收藏</button></form></article>`,
        )
        .join("") ||
      "<p>还没有收藏。在作品预览中收藏实验，或在对比页保存当前组合。</p>";
    recent.innerHTML =
      value.recent
        .map(
          (item) =>
            `<a class="notebook-recent" href="${e(N.href(item))}">${e(N.label(item))}</a>`,
        )
        .join("") || "<p>还没有最近浏览记录。</p>";
    document.getElementById("clear-recent").disabled = !value.recent.length;
    if (N.problem()) status.textContent = N.problem();
    saved.querySelectorAll(".saved-item").forEach((card) => {
      const item = value.saved[Number(card.dataset.savedIndex)];
      card.querySelector("form").onsubmit = (event) => {
        event.preventDefault();
        const note = card.querySelector("textarea").value;
        status.textContent = N.save(item, note)
          ? "备注已保存在当前浏览器。"
          : N.problem();
      };
      card.querySelector("[data-remove-saved]").onclick = () => {
        status.textContent = N.remove(item) ? "已移除收藏。" : N.problem();
      };
    });
  }
  document.getElementById("clear-recent").onclick = () => {
    status.textContent = N.clearRecent()
      ? "最近浏览已清空，收藏保留。"
      : N.problem();
  };
  addEventListener("archive-notebook-change", () => {
    const editor = document.activeElement;
    const card = editor?.closest(".saved-item");
    if (editor?.tagName === "TEXTAREA" && card) {
      const current = N.read().saved.find(
        (item) =>
          N.href(item) === card.querySelector("h3 a").getAttribute("href"),
      );
      if (current?.note !== editor.value) {
        status.textContent =
          "收藏已在其他位置更新；当前未保存备注已保留，保存时会合并最新资料。";
        return;
      }
    }
    render();
  });
  render();
  let updates = [],
    limit = 20;
  const holder = document.getElementById("update-items"),
    more = document.getElementById("more-updates"),
    kind = document.getElementById("update-kind");
  function showUpdates() {
    const filtered = updates.filter(
      (update) => kind.value === "all" || update.kind === kind.value,
    );
    holder.innerHTML =
      filtered
        .slice(0, limit)
        .map((update) => {
          const run = data.runs.find((run) => run.id === update.runId);
          if (!run) return "";
          return `<article class="archive-update"><time>${e(update.date)}</time> · ${e({ added: "实验新增", capture: "截图采集 / 补拍", review: "评分复核" }[update.kind])} · <a href="${e(U.documentURL(run))}">${e(run.title)} · ${e(U.runSummary(data, run))}</a>${update.source ? ` · <a href="${e(update.source)}">来源记录</a>` : ""}</article>`;
        })
        .join("") || "<p>没有已登记的此类更新。</p>";
    more.hidden = limit >= filtered.length;
  }
  async function loadUpdates() {
    holder.textContent = "正在读取档案更新…";
    try {
      const response = await fetch("assets/generated/updates.json");
      if (!response.ok) throw Error("http");
      updates = await response.json();
      showUpdates();
    } catch {
      holder.innerHTML =
        "<p>更新资料暂时无法加载，本地收藏仍可使用。</p><button>重试加载更新</button>";
      holder.querySelector("button").onclick = loadUpdates;
    }
  }
  kind.onchange = () => {
    limit = 20;
    showUpdates();
  };
  more.onclick = () => {
    limit += 20;
    showUpdates();
  };
  loadUpdates();
})();
