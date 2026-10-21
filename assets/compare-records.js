(function (global) {
  "use strict";
  const U = global.ArchiveUI,
    e = U.escape;
  function conditions({
    fields,
    columns,
    selected,
    labels,
    differencesOnly,
    data,
  }) {
    const rows = fields.map(([label, value]) => ({
      label,
      values: selected.map((r) => (r ? value(r) : "实验不存在")),
    }));
    const filtered =
      differencesOnly && selected.filter(Boolean).length >= 2
        ? rows.filter((row) => new Set(row.values).size > 1)
        : rows;
    const summaryFields = new Set([
      "主题",
      "模型",
      "推理档位",
      "轮次",
      "提示词版本",
      "输入关系（与 A）",
      "输入留存",
      "执行模式",
      "平台与工具",
      "人工修改与部署适配",
    ]);
    const resultFields = new Set(["截图评分", "费用", "耗时"]);
    const groups = [
      ["比较摘要", filtered.filter((row) => summaryFields.has(row.label))],
      ["结果与消耗", filtered.filter((row) => resultFields.has(row.label))],
      [
        "完整证据",
        filtered.filter(
          (row) =>
            !summaryFields.has(row.label) && !resultFields.has(row.label),
        ),
      ],
    ];
    const mobile = groups
      .map(
        ([
          title,
          items,
        ]) => `<details class="condition-section"${title === "完整证据" ? "" : " open"}>
        <summary>${title} · ${items.length} 项</summary>
        ${
          items.length
            ? items
                .map(
                  (row) =>
                    `<section class="condition-field"><h3>${e(row.label)}</h3><dl>${row.values
                      .map(
                        (value, i) =>
                          `<dt>${labels[columns[i]]}${columns[i] === "left" ? " · 基准" : ""}</dt><dd>${e(value).replaceAll("\n", "<br>")}</dd>`,
                      )
                      .join("")}</dl></section>`,
                )
                .join("")
            : "<p>当前范围没有不同的已记录值。</p>"
        }
      </details>`,
      )
      .join("");
    const table = columns.length
      ? '<table class="archive-table conditions-table"><caption>所选实验的已知运行条件</caption><thead><tr><th scope="col">条件</th>' +
        columns
          .map(
            (side, i) =>
              '<th scope="col">' +
              labels[side] +
              (side === "left" ? " · 基准" : "") +
              "<small>" +
              e(selected[i] ? U.runSummary(data, selected[i]) : "实验不存在") +
              "</small></th>",
          )
          .join("") +
        "</tr></thead><tbody>" +
        groups
          .map(
            ([title, items]) =>
              `<tr class="conditions-group"><th colspan="${columns.length + 1}">${title}</th></tr>` +
              items
                .map(
                  (row) =>
                    '<tr><th scope="row">' +
                    e(row.label) +
                    "</th>" +
                    row.values
                      .map(
                        (value) =>
                          "<td>" + e(value).replaceAll("\n", "<br>") + "</td>",
                      )
                      .join("") +
                    "</tr>",
                )
                .join(""),
          )
          .join("") +
        "</tbody></table>"
      : '<p class="frame-placeholder">请选择实验开始查看运行条件。</p>';
    return {
      mobile: columns.length ? mobile : "<p>请选择实验开始查看运行条件。</p>",
      table,
    };
  }
  global.ArchiveCompareRecords = { conditions };
})(typeof window !== "undefined" ? window : globalThis);
