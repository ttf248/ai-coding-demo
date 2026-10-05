(async function () {
  "use strict";
  const data = window.ARCHIVE,
    U = window.ArchiveUI;
  const topic = data.topics.find(
    (t) => t.id === new URLSearchParams(location.search).get("id"),
  );
  const heading = document.querySelector(".page-heading");
  if (!topic || !heading) return;
  const archived = U.isTopicArchived(topic);
  heading.insertAdjacentHTML(
    "beforeend",
    '<div class="topic-testing-status"><span>' +
      (archived ? "已归档 · 不再参与后续测试" : "参与后续测试") +
      '</span><button id="topic-testing-action" hidden>' +
      (archived ? "恢复测试" : "归档主题") +
      "</button></div>",
  );
  if (topic.testingHistory?.length) {
    heading.insertAdjacentHTML(
      "beforeend",
      '<details class="topic-testing-history"><summary>查看状态记录</summary><ul>' +
        topic.testingHistory
          .map(
            (entry) =>
              "<li>" +
              U.escape(
                entry.date +
                  " · " +
                  (entry.status === "archived" ? "归档" : "恢复测试") +
                  " · " +
                  entry.reason,
              ) +
              "</li>",
          )
          .join("") +
        "</ul></details>",
    );
  }
  if (!["127.0.0.1", "localhost"].includes(location.hostname)) return;
  try {
    const response = await fetch("__archive/capabilities");
    if (!response.ok || !(await response.json()).editable) return;
  } catch {
    return;
  }
  const button = document.getElementById("topic-testing-action");
  button.hidden = false;
  document.body.insertAdjacentHTML(
    "beforeend",
    '<dialog id="topic-testing-dialog" aria-labelledby="topic-testing-title"><form><h2 id="topic-testing-title">' +
      (archived ? "恢复该主题的后续测试" : "归档整个主题") +
      "</h2><p>" +
      (archived
        ? "恢复后，该主题重新进入默认测试清单。"
        : "归档后，默认测试清单跳过该主题。已有实验、输入与预览继续保留。") +
      '</p><label>原因<textarea id="topic-testing-reason" required maxlength="1000" rows="3"></textarea></label><p id="topic-testing-error" role="alert"></p><div class="actions"><button type="submit">' +
      (archived ? "恢复测试" : "保存归档") +
      '</button><button type="button" data-testing-cancel>取消</button></div></form></dialog>',
  );
  const dialog = document.getElementById("topic-testing-dialog");
  button.addEventListener("click", () => dialog.showModal());
  dialog
    .querySelector("[data-testing-cancel]")
    .addEventListener("click", () => dialog.close());
  dialog.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = dialog.querySelector('[type="submit"]');
    const error = document.getElementById("topic-testing-error");
    error.textContent = "";
    submit.disabled = true;
    try {
      const response = await fetch(
        "__archive/topics/" + encodeURIComponent(topic.id),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: archived ? "active" : "archived",
            reason: document.getElementById("topic-testing-reason").value,
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw Error(result.error || "保存失败");
      location.reload();
    } catch (failure) {
      error.textContent = failure.message || "保存失败，请重试。";
      submit.disabled = false;
    }
  });
})();
