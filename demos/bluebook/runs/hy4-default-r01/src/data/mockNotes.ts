import type { Note } from "../types";

/**
 * 全部展示图片由代码生成的 SVG data URI 提供，不依赖外部图片服务。
 * 其中两条故意指向不存在的本地文件，用于验证「图片加载失败显示默认图」。
 */
const PALETTES: [string, string, string][] = [
  ["#ffd9c7", "#ff8f9e", "#c04a6e"],
  ["#c8e7f0", "#7ab8d8", "#2c6c95"],
  ["#e5dcf7", "#b9a2e3", "#6c55a8"],
  ["#dff0d8", "#91c98a", "#477a51"],
  ["#ffe9bd", "#f4bd63", "#bb7429"],
  ["#dbe4f5", "#8fa6d8", "#3b5591"],
  ["#f7dbe4", "#e79ab4", "#a14e6d"],
  ["#d6f0ec", "#79c7bb", "#2f7f77"],
];

const TITLES = [
  "周末在家做了一顿慢慢吃的早午餐",
  "城市散步｜旧城区里那些被忽略的角落",
  "把阳台改成一个可以发呆的小花园",
  "最近在读的三本书，都很适合睡前",
  "通勤路上拍到的傍晚天空",
  "一人食也要认真摆盘呀",
  "开始学陶艺的第一个月，翻车合集",
  "整理房间之后，心情也跟着变轻了",
  "海边待了两天，什么都没做",
  "手冲咖啡的第六次尝试，终于不苦了",
  "给书桌换了一盏暖光台灯",
  "雨天最适合窝在家里听唱片",
  "第一次尝试自己烤面包，形状有点野",
  "林间步道，走了三个小时",
  "把旧牛仔裤改成了收纳袋",
  "今晚的月亮特别亮，随手记一下",
  "简单记录一下这个月的插花练习",
  "老城区的一家旧书店，进去就不想走",
  "晨跑第五周，配速慢慢稳下来了",
  "用剩下的布料拼了一个杯垫",
];

const AUTHORS = [
  "小满日记", "慢慢来", "阿岚", "一只柚子", "南风", "林间信",
  "七点半", "苏打水", "阿澈", "木木", "半糖", "晚风来信",
];

const TAGS = ["生活", "摄影", "手作", "读书", "美食", "旅行", "家居", "运动"];
const AVATAR_COLORS = ["#fe2c55", "#f08b4b", "#6a9c78", "#5b86c9", "#9b72c4", "#d1668f", "#3f9c9b"];

function svgImage(seed: number, w: number, h: number): string {
  const p = PALETTES[seed % PALETTES.length];
  const cx = 60 + ((seed * 37) % 280);
  const cy = 60 + ((seed * 53) % Math.max(80, h - 120));
  const r = 40 + ((seed * 17) % 90);
  const label = TAGS[seed % TAGS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${p[0]}"/><stop offset="100%" stop-color="${p[1]}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p[2]}" opacity="0.28"/>
<circle cx="${w - cx * 0.5}" cy="${h - cy * 0.45}" r="${r * 0.7}" fill="#ffffff" opacity="0.22"/>
<path d="M0 ${h * 0.72} Q ${w * 0.3} ${h * 0.58} ${w * 0.62} ${h * 0.76} T ${w} ${h * 0.7} L ${w} ${h} L 0 ${h} Z" fill="${p[2]}" opacity="0.16"/>
<text x="22" y="${h - 24}" font-family="sans-serif" font-size="20" fill="#ffffff" opacity="0.82">${label} · ${seed + 1}</text>
</svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

export const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="#eceff3"/><circle cx="200" cy="220" r="46" fill="#c8d0da"/><path d="M70 350 L160 265 L225 320 L290 255 L340 350 Z" fill="#c8d0da"/><text x="200" y="410" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#9aa5b3">图片暂不可用</text></svg>`,
  );

export const MOCK_NOTES: Note[] = Array.from({ length: 100 }, (_, i) => {
  const width = 400;
  const height = [420, 520, 360, 600, 480, 380, 560, 440][i % 8];
  const author = AUTHORS[i % AUTHORS.length];
  const broken = i === 17 || i === 63;
  return {
    id: i + 1,
    title: TITLES[i % TITLES.length] + (i >= TITLES.length ? ` · 第 ${Math.floor(i / TITLES.length) + 1} 辑` : ""),
    author,
    avatar: author.slice(0, 1),
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
    likes: 20 + ((i * 137) % 4800),
    image: broken ? `./images/not-found-${i}.jpg` : svgImage(i, width, height),
    width,
    height,
    tag: TAGS[i % TAGS.length],
  };
});
