import fs from "node:fs";
import path from "node:path";

// 样式结构检查：统计同一选择器在多个文件或同一文件里被重复声明的情况。
// 目标不是消灭重复，而是让重复可量化、并且不再继续增加。
export const CSS_BASELINE = {
  // 跨文件重复的选择器数量上限：样式已按页面拆分，共享规则集中在 polish.css
  acrossFiles: 0,
  // 同一文件里出现两次以上、且声明值完全相同的重复声明数量上限
  repeated: 0,
};

export function parseCss(text, media = "") {
  // 注释先剔除，否则注释里的花括号会干扰规则切分。
  const source = String(text).replace(/\/\*[\s\S]*?\*\//g, " ");
  const rules = [];
  let index = 0;
  while (index < source.length) {
    const open = source.indexOf("{", index);
    if (open === -1) break;
    const prelude = source.slice(index, open).trim();
    let depth = 1;
    let cursor = open + 1;
    while (depth > 0 && cursor < source.length) {
      if (source[cursor] === "{") depth += 1;
      else if (source[cursor] === "}") depth -= 1;
      cursor += 1;
    }
    const body = source.slice(open + 1, cursor - 1);
    if (prelude.startsWith("@media")) {
      const nested = media ? `${media} && ${prelude}` : prelude;
      rules.push(...parseCss(body, nested));
    } else if (!prelude.startsWith("@")) {
      rules.push({ selector: prelude, media, declarations: body.trim() });
    }
    index = cursor;
  }
  return rules;
}

export function cssReport(files) {
  const declarations = new Map();
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const rule of parseCss(text)) {
      const key = rule.media ? `${rule.selector} @${rule.media}` : rule.selector;
      if (!declarations.has(key))
        declarations.set(key, { selector: rule.selector, files: new Set() });
      declarations.get(key).files.add(path.basename(file));
    }
  }
  const acrossFiles = [];
  const repeated = [];
  for (const entry of declarations.values()) {
    if (entry.files.size > 1)
      acrossFiles.push({
        selector: entry.selector,
        files: [...entry.files].sort(),
      });
  }
  for (const file of files) {
    // 同一文件里「选择器 + 媒体条件 + 属性 + 取值」完全重复才算真重复；
    // 同选择器的渐进覆盖（取值不同）不算，避免把有意的层叠当成冗余。
    const seen = new Map();
    for (const rule of parseCss(fs.readFileSync(file, "utf8"))) {
      for (const declaration of rule.declarations.split(";")) {
        const text = declaration.trim();
        if (!text) continue;
        const colon = text.indexOf(":");
        if (colon === -1) continue;
        const property = text.slice(0, colon).trim();
        const value = text.slice(colon + 1).trim();
        if (!property || !value) continue;
        const key = `${rule.selector}\n${rule.media}\n${property}`;
        if (!seen.has(key)) seen.set(key, new Map());
        const values = seen.get(key);
        values.set(value, (values.get(value) || 0) + 1);
      }
    }
    for (const [key, values] of seen) {
      const [selector, media, property] = key.split("\n");
      for (const [value, count] of values)
        if (count > 1)
          repeated.push({
            selector,
            media,
            property,
            value,
            count,
            file: path.basename(file),
          });
    }
  }
  acrossFiles.sort((a, b) => a.selector.localeCompare(b.selector));
  repeated.sort((a, b) =>
    a.file.localeCompare(b.file) ||
    a.selector.localeCompare(b.selector) ||
    a.media.localeCompare(b.media) ||
    a.property.localeCompare(b.property),
  );
  return {
    acrossFiles,
    repeated,
    acrossFilesCount: acrossFiles.length,
    repeatedCount: repeated.length,
  };
}
