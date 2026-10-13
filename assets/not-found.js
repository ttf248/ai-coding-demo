(function () {
  let requested;
  try {
    requested = decodeURIComponent(location.pathname);
  } catch {
    requested = location.pathname;
  }
  const candidates = (window.ARCHIVE_MIGRATIONS || []).filter(
    (record) =>
      requested.includes("/" + record.oldPath + "/") ||
      requested.endsWith("/" + record.oldPath),
  );
  if (!candidates.length) return;
  const section = document.getElementById("migration-match");
  section.hidden = false;
  const heading = document.createElement("h2");
  heading.textContent = "已找到迁移后的实验";
  section.append(heading);
  for (const record of candidates) {
    const link = document.createElement("a");
    link.href =
      "topic.html?id=" +
      encodeURIComponent(record.topicId) +
      "&view=list#run-" +
      encodeURIComponent(record.id);
    link.textContent = record.id + " →";
    const paragraph = document.createElement("p");
    paragraph.append(link);
    section.append(paragraph);
  }
})();
