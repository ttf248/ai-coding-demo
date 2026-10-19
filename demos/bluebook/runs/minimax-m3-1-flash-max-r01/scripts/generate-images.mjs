/**
 * 生成本地示例图片（SVG），构建时由 Vite 的 public 目录自动拷贝到产物中。
 * 运行：npm run gen:images
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../public/images");
fs.mkdirSync(outDir, { recursive: true });

const PALETTES = [
  ["#ff9a8b", "#ff6a88", "#ff99ac"],
  ["#a18cd1", "#fbc2eb", "#8fd3f4"],
  ["#f6d365", "#fda085", "#f093fb"],
  ["#84fab0", "#8fd3f4", "#96e6a1"],
  ["#ffecd2", "#fcb69f", "#ff9a9e"],
  ["#43e97b", "#38f9d7", "#4facfe"],
  ["#30cfd0", "#330867", "#5b86e5"],
  ["#f093fb", "#f5576c", "#c471f5"],
  ["#d4fc79", "#96e6a1", "#ffd3a5"],
  ["#30cfd0", "#330867", "#4b79a1"],
];

const SHAPES = ["circle", "wave", "mountain", "grid"];

let seed = 20240620;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

function shapeMarkup(kind, w, h, colors) {
  const [a, b, c] = colors;
  if (kind === "circle")
    return `<circle cx="${(w * 0.72).toFixed(0)}" cy="${(h * 0.28).toFixed(0)}" r="${(
      w * 0.26
    ).toFixed(0)}" fill="${a}" opacity="0.55"/>
    <circle cx="${(w * 0.24).toFixed(0)}" cy="${(h * 0.74).toFixed(0)}" r="${(
      w * 0.3
    ).toFixed(0)}" fill="${b}" opacity="0.45"/>`;
  if (kind === "wave")
    return `<path d="M0 ${(h * 0.68).toFixed(0)} Q ${(w * 0.3).toFixed(0)} ${(
      h * 0.42
    ).toFixed(0)} ${(w * 0.55).toFixed(0)} ${(h * 0.66).toFixed(0)} T ${w} ${(
      h * 0.58
    ).toFixed(0)} L ${w} ${h} L 0 ${h} Z" fill="${b}" opacity="0.5"/>
      <circle cx="${(w * 0.32).toFixed(0)}" cy="${(h * 0.26).toFixed(0)}" r="${(
      w * 0.12
    ).toFixed(0)}" fill="${a}" opacity="0.6"/>`;
  if (kind === "mountain")
    return `<path d="M0 ${h} L ${(w * 0.28).toFixed(0)} ${(h * 0.42).toFixed(0)} L ${(
      w * 0.46
    ).toFixed(0)} ${(h * 0.72).toFixed(0)} L ${(w * 0.68).toFixed(0)} ${(h * 0.3).toFixed(
      0,
    )} L ${w} ${h} Z" fill="${a}" opacity="0.55"/>
      <circle cx="${(w * 0.78).toFixed(0)}" cy="${(h * 0.2).toFixed(0)}" r="${(
      w * 0.09
    ).toFixed(0)}" fill="${c}" opacity="0.8"/>`;
  let cells = "";
  for (let y = 0; y < 6; y++)
    for (let x = 0; x < 5; x++)
      cells += `<rect x="${(x * (w / 5)).toFixed(0)}" y="${(y * (h / 6)).toFixed(
        0,
      )}" width="${(w / 5 - 3).toFixed(0)}" height="${(h / 6 - 3).toFixed(
        0,
      )}" fill="${x % 2 ? b : a}" opacity="${(0.16 + rnd() * 0.22).toFixed(2)}"/>`;
  return cells;
}

const HEIGHTS = [520, 660, 780, 640, 900, 580, 720, 840];
const count = 24;
for (let i = 0; i < count; i++) {
  const w = 480;
  const h = HEIGHTS[i % HEIGHTS.length];
  const colors = PALETTES[i % PALETTES.length];
  const shape = SHAPES[i % SHAPES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="55%" stop-color="${colors[1]}"/>
      <stop offset="100%" stop-color="${colors[2]}"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="42%" r="75%">
      <stop offset="60%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.28)"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${shapeMarkup(shape, w, h, colors)}
  <rect width="${w}" height="${h}" fill="url(#v)"/>
  <g opacity="0.22" fill="#ffffff">
    ${Array.from({ length: 26 }, () => {
      const cx = rnd() * w,
        cy = rnd() * h,
        r = 1 + rnd() * 2.4;
      return `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(1)}"/>`;
    }).join("")}
  </g>
</svg>`;
  fs.writeFileSync(path.join(outDir, `note-${String(i + 1).padStart(2, "0")}.svg`), svg);
}

/* 图片加载失败时的默认占位图 */
const fallback = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
  <rect width="480" height="480" fill="#eef0f4"/>
  <g fill="none" stroke="#c3c8d2" stroke-width="10" stroke-linecap="round">
    <rect x="140" y="150" width="200" height="150" rx="12"/>
    <path d="M150 280 L220 210 L268 258 L300 228 L330 250"/>
  </g>
  <circle cx="200" cy="188" r="14" fill="#c3c8d2"/>
  <text x="240" y="360" font-family="sans-serif" font-size="26" fill="#9aa2b1" text-anchor="middle">图片加载失败</text>
</svg>`;
fs.writeFileSync(path.join(outDir, "fallback.svg"), fallback);
console.log(`generated ${count + 1} images in ${outDir}`);
