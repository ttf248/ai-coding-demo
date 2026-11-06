// 生成演示用本地 SVG 图片资源（构建时随 public 自动拷贝）
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(out, { recursive: true });

const palettes = [
  ["#ffd6e0", "#ff8fab", "#fe2c55"],
  ["#d6f0ff", "#7cc6f5", "#2b6cb0"],
  ["#e6ffd9", "#8fe388", "#2f855a"],
  ["#fff3cd", "#ffd166", "#b7791f"],
  ["#e8ddff", "#b79cff", "#6b46c1"],
  ["#ffe0cc", "#ffab73", "#c05621"],
  ["#d9fff3", "#6ee7cf", "#0f766e"],
  ["#ffe6f2", "#f9a8d4", "#be185d"],
  ["#e0f2fe", "#93c5fd", "#1d4ed8"],
  ["#fef9c3", "#fde047", "#a16207"],
];

const motifs = ["waves", "bubbles", "grid", "arcs", "dots"];

function svg(i, w, h) {
  const p = palettes[i % palettes.length];
  const motif = motifs[i % motifs.length];
  let extra = "";
  if (motif === "waves") {
    extra = Array.from({ length: 5 }, (_, k) =>
      `<path d="M0 ${h * (0.25 + k * 0.15)} Q ${w * 0.25} ${h * (0.15 + k * 0.15)} ${w * 0.5} ${h * (0.25 + k * 0.15)} T ${w} ${h * (0.25 + k * 0.15)}" stroke="${p[2]}" stroke-opacity="0.28" stroke-width="${h * 0.02}" fill="none"/>`).join("");
  } else if (motif === "bubbles") {
    extra = Array.from({ length: 14 }, (_, k) => {
      const r = h * (0.03 + ((k * 37) % 10) / 90);
      const cx = ((k * 83) % 100) / 100 * w;
      const cy = ((k * 53) % 100) / 100 * h;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p[1]}" fill-opacity="0.35"/>`;
    }).join("");
  } else if (motif === "grid") {
    extra = Array.from({ length: 8 }, (_, k) =>
      `<line x1="0" y1="${(h / 8) * k}" x2="${w}" y2="${(h / 8) * k}" stroke="${p[2]}" stroke-opacity="0.18" stroke-width="2"/>` +
      `<line x1="${(w / 8) * k}" y1="0" x2="${(w / 8) * k}" y2="${h}" stroke="${p[2]}" stroke-opacity="0.18" stroke-width="2"/>`).join("");
  } else if (motif === "arcs") {
    extra = Array.from({ length: 6 }, (_, k) =>
      `<circle cx="${w * 0.85}" cy="${h * 0.9}" r="${h * (0.15 + k * 0.13)}" stroke="${p[1]}" stroke-opacity="0.4" stroke-width="${h * 0.015}" fill="none"/>`).join("");
  } else {
    extra = Array.from({ length: 60 }, (_, k) => {
      const cx = ((k * 37) % 100) / 100 * w;
      const cy = ((k * 71) % 100) / 100 * h;
      return `<circle cx="${cx}" cy="${cy}" r="2.5" fill="${p[2]}" fill-opacity="0.25"/>`;
    }).join("");
  }
  const label = `No.${String(i + 1).padStart(2, "0")}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/>
</linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
${extra}
<text x="${w / 2}" y="${h / 2}" font-family="Segoe UI, sans-serif" font-size="${Math.min(w, h) * 0.14}" font-weight="700" fill="${p[2]}" fill-opacity="0.75" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`;
}

const ratios = [[600, 800], [600, 600], [600, 450], [480, 800], [600, 750]];
for (let i = 0; i < 24; i++) {
  const [w, h] = ratios[i % ratios.length];
  writeFileSync(join(out, `img-${String(i + 1).padStart(2, "0")}.svg`), svg(i, w, h));
}
console.log("generated 24 images to", out);
