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
  document.getElementById("missing-title").textContent = "已找到迁移后的实验。";
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
    link.textContent = (record.label || record.id) + " →";
    const paragraph = document.createElement("p");
    const identity = document.createElement("small");
    identity.textContent = record.id;
    identity.style.display = "block";
    paragraph.append(link, identity);
    section.append(paragraph);
  }
})();
