import fs from "node:fs";
import path from "node:path";

// 样式结构检查：统计同一选择器在多个文件或同一文件里被重复声明的情况。
// 目标不是消灭重复，而是让重复可量化、并且不再继续增加。
export const CSS_BASELINE = {
  // 跨文件重复的选择器数量上限
  acrossFiles: 57,
  // 同一文件里重复三次以上的选择器数量上限
  repeated: 4,
};

export function parseCss(text) {
  const rules = [];
  const stack = [];
  const pattern = /(@media[^{]*\{)|([^{}]*\{)|(\})/g;
  let match;
  while ((match = pattern.exec(text))) {
    if (match[1]) {
      stack.push(
        match[1]
          .trim()
          .replace(/\s+/g, " ")
          .replace(/\{\s*$/, ""),
      );
      continue;
    }
    if (match[2]) {
      stack.push(
        match[2]
          .trim()
          .replace(/\s+/g, " ")
          .replace(/\{\s*$/, ""),
      );
      let depth = 1;
      let index = pattern.lastIndex;
      while (depth > 0 && index < text.length) {
        const char = text[index];
        if (char === "{") depth += 1;
        else if (char === "}") depth -= 1;
        index += 1;
      }
      const body = text.slice(pattern.lastIndex, index - 1);
      const media = stack
        .slice(0, -1)
        .filter((entry) => entry.startsWith("@media"))
        .join(" && ");
      const selector = stack[stack.length - 1];
      // 内层扫描已经消费了这条规则的右花括号，选择器随即出栈。
      stack.pop();
      rules.push({
        selector,
        media,
        declarations: body.trim(),
      });
      pattern.lastIndex = index;
      continue;
    }
    stack.pop();
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
    const counts = new Map();
    for (const rule of parseCss(fs.readFileSync(file, "utf8")))
      counts.set(rule.selector, (counts.get(rule.selector) || 0) + 1);
    for (const [selector, count] of counts)
      if (count >= 3)
        repeated.push({ selector, count, file: path.basename(file) });
  }
  acrossFiles.sort((a, b) => a.selector.localeCompare(b.selector));
  repeated.sort((a, b) => a.selector.localeCompare(b.selector));
  return {
    acrossFiles,
    repeated,
    acrossFilesCount: acrossFiles.length,
    repeatedCount: repeated.length,
  };
}
