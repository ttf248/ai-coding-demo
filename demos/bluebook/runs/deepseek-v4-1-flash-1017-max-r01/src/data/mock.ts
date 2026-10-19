import type { Post } from "../types";

const TITLES = [
  "周末去了趟海边，把夏天装进了相机里",
  "出租屋改造第 3 天：一面墙的变化有多大",
  "第一次做可颂，失败三次后终于起层了",
  "这件白衬衫的 5 种通勤搭法",
  "在旧书店待了一下午，淘到一本绝版",
  "城市散步｜从老街走到江边的 6 公里",
  "极简书桌布置，效率真的会变高",
  "用胶片记录外婆的菜园",
  "新手也能成功的抹茶巴斯克",
  "租来的房子，也要认真过夏天",
  "把阳台改成小花园的完整清单",
  "凌晨四点的日出，值得早起一次",
  "一只猫和一张地毯的午后",
  "最近在用的 6 件厨房小物",
  "手冲咖啡入门：参数与风味笔记",
  "外婆的针线盒里，藏着旧时光",
  "周末露营｜轻量化装备真实体验",
  "给房间换一盏灯，氛围完全不同",
  "一周通勤穿搭，简单但不无聊",
  "在雨天读完了《人间草木》",
  "把喜欢的颜色穿在身上",
  "第一次尝试蓝染，成品有点惊喜",
  "小户型收纳：垂直空间的 8 个思路",
  "山野徒步｜雨后云雾像一幅水墨",
  "自制柚子酱，留住秋天的味道",
  "一个人的晚餐，也要有仪式感",
  "拍立得相册｜今年的 24 个瞬间",
  "旧木桌翻新记录，花了两个周末",
  "关于早起的第 21 天",
  "把春天晒成干花，夹进书里",
  "城市里的 10 家安静咖啡馆",
  "一件亚麻衬衫的整个夏天",
  "租房党的免打孔收纳方案",
  "第一次做陶，手忙脚乱但很快乐",
  "在菜市场找到了生活的答案",
  "周末不加班，去公园发呆",
  "给朋友做了一顿生日晚餐",
  "窗台上的薄荷又长高了",
  "记录一场温柔日落",
  "把旧牛仔裤改成了托特包",
  "清晨六点的面包房",
  "独居第三年，我的冰箱常备清单",
  "去山里住两天，信号很差但睡得很好",
  "用一杯咖啡的时间做完周计划",
  "小猫第一次看到雪",
  "春天适合重新开始",
  "给生活加一点蓝色",
  "把周末过成喜欢的样子",
];

const AUTHORS = [
  "山野小满",
  "一颗青柠",
  "阿圆的家",
  "晚风慢慢",
  "栗子同学",
  "小岛日记",
  "木木手作",
  "春日便当",
  "半糖生活",
  "岛屿来信",
  "南瓜与猫",
  "温水煮茶",
  "一只北北",
  "林间有风",
  "橘子和海",
  "苏打气泡",
];

const CATEGORIES = [
  "旅行",
  "家居",
  "美食",
  "穿搭",
  "阅读",
  "摄影",
  "手作",
  "日常",
];

const PALETTES = [
  ["#ffd7c9", "#ff9e8a", "#b94b5b"],
  ["#c8e4f4", "#8fc2d9", "#38667e"],
  ["#e9ddc4", "#c4aa7c", "#7c6243"],
  ["#d9e7cf", "#a4bd8b", "#5f7b51"],
  ["#f3d3e1", "#dda0ba", "#9a5b78"],
  ["#d6d0ee", "#a9a0d6", "#635b9c"],
  ["#f8e2b6", "#e8b96f", "#a57936"],
  ["#c9ddd6", "#8fb4aa", "#4e776d"],
  ["#ead9d2", "#cba79b", "#8b655c"],
  ["#cfd9e9", "#9cb0ce", "#566b8d"],
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function blob(
  random: () => number,
  cx: number,
  cy: number,
  r: number,
  fill: string,
  opacity: number,
) {
  const drift = (random() - 0.5) * 30;
  return `<circle cx="${(cx + drift).toFixed(1)}" cy="${(cy + drift).toFixed(
    1,
  )}" r="${(r * (0.75 + random() * 0.5)).toFixed(1)}" fill="${fill}" opacity="${opacity}"/>`;
}

function motif(category: string, w: number, h: number, light: string) {
  const cx = w / 2;
  switch (category) {
    case "旅行":
      return `<path d="M0 ${h * 0.78} L${w * 0.28} ${h * 0.5} L${w * 0.48} ${
        h * 0.68
      } L${w * 0.7} ${h * 0.42} L${w} ${h * 0.72} L${w} ${h} L0 ${h}Z" fill="${light}" opacity=".55"/>
      <circle cx="${w * 0.76}" cy="${h * 0.25}" r="${w * 0.075}" fill="#fff" opacity=".65"/>`;
    case "家居":
      return `<rect x="${w * 0.15}" y="${h * 0.2}" width="${w * 0.7}" height="${
        h * 0.58
      }" rx="${w * 0.02}" fill="none" stroke="${light}" stroke-width="${w * 0.012}" opacity=".65"/>
      <line x1="${w * 0.5}" y1="${h * 0.2}" x2="${w * 0.5}" y2="${
        h * 0.78
      }" stroke="${light}" stroke-width="${w * 0.012}" opacity=".65"/>
      <line x1="${w * 0.15}" y1="${h * 0.48}" x2="${w * 0.85}" y2="${
        h * 0.48
      }" stroke="${light}" stroke-width="${w * 0.012}" opacity=".65"/>`;
    case "美食":
      return `<circle cx="${cx}" cy="${h * 0.52}" r="${w * 0.26}" fill="none" stroke="${light}" stroke-width="${w * 0.018}" opacity=".7"/>
      <circle cx="${cx}" cy="${h * 0.52}" r="${w * 0.17}" fill="${light}" opacity=".35"/>
      <path d="M${w * 0.18} ${h * 0.78} Q${cx} ${h * 0.62} ${w * 0.82} ${
        h * 0.78
      }" fill="none" stroke="${light}" stroke-width="${w * 0.014}" opacity=".55"/>`;
    case "穿搭":
      return `<path d="M${w * 0.5} ${h * 0.18} L${w * 0.66} ${h * 0.28} L${w * 0.6} ${
        h * 0.78
      } L${w * 0.4} ${h * 0.78} L${w * 0.34} ${h * 0.28}Z" fill="${light}" opacity=".4"/>
      <path d="M${w * 0.42} ${h * 0.18} Q${w * 0.5} ${h * 0.3} ${w * 0.58} ${
        h * 0.18
      }" fill="none" stroke="${light}" stroke-width="${w * 0.012}" opacity=".7"/>`;
    case "阅读":
      return `<path d="M${w * 0.2} ${h * 0.32} L${w * 0.5} ${h * 0.4} L${w * 0.8} ${
        h * 0.32
      } L${w * 0.8} ${h * 0.72} L${w * 0.5} ${h * 0.8} L${w * 0.2} ${
        h * 0.72
      }Z" fill="${light}" opacity=".35"/>
      <line x1="${w * 0.5}" y1="${h * 0.4}" x2="${w * 0.5}" y2="${
        h * 0.8
      }" stroke="${light}" stroke-width="${w * 0.01}" opacity=".7"/>`;
    case "摄影":
      return `<rect x="${w * 0.2}" y="${h * 0.28}" width="${w * 0.6}" height="${
        h * 0.44
      }" rx="${w * 0.05}" fill="none" stroke="${light}" stroke-width="${w * 0.014}" opacity=".65"/>
      <circle cx="${cx}" cy="${h * 0.5}" r="${w * 0.13}" fill="none" stroke="${light}" stroke-width="${w * 0.014}" opacity=".65"/>
      <circle cx="${cx}" cy="${h * 0.5}" r="${w * 0.055}" fill="${light}" opacity=".6"/>`;
    case "手作":
      return `<g stroke="${light}" stroke-width="${w * 0.012}" opacity=".55" fill="none">
      <path d="M${w * 0.25} ${h * 0.28} L${w * 0.5} ${h * 0.5} L${w * 0.25} ${
        h * 0.72
      }"/><path d="M${w * 0.75} ${h * 0.28} L${w * 0.5} ${h * 0.5} L${w * 0.75} ${
        h * 0.72
      }"/></g>`;
    default:
      return `<circle cx="${cx}" cy="${h * 0.38}" r="${w * 0.12}" fill="${light}" opacity=".55"/>
      <path d="M0 ${h * 0.74} Q${w * 0.3} ${h * 0.6} ${w * 0.6} ${
        h * 0.76
      } T${w} ${h * 0.7} L${w} ${h} L0 ${h}Z" fill="${light}" opacity=".32"/>`;
  }
}

export function makeCover(
  seed: number,
  width: number,
  height: number,
  category: string,
) {
  const random = rng(seed);
  const palette = PALETTES[seed % PALETTES.length];
  const [base, mid, deep] = palette;
  const w = 480;
  const h = Math.round((width * 0) + height);
  const shapes = Array.from({ length: 4 }, () =>
    blob(
      random,
      w * (0.15 + random() * 0.7),
      h * (0.15 + random() * 0.7),
      w * (0.12 + random() * 0.3),
      random() > 0.55 ? "#ffffff" : deep,
      0.08 + random() * 0.14,
    ),
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${base}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${deep}"/>
    </linearGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".16"/></feComponentTransfer></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  ${shapes}
  ${motif(category, w, h, "#fffdf6")}
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity=".5"/>
  <rect width="${w}" height="${h}" fill="url(#g)" opacity=".08"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function makeAvatar(name: string, seed: number) {
  const palette = PALETTES[(seed + 3) % PALETTES.length];
  const letter = name.slice(0, 1);
  const initial = /[a-zA-Z]/.test(letter) ? letter.toUpperCase() : letter;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
  <defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette[0]}"/><stop offset="1" stop-color="${palette[2]}"/></linearGradient></defs>
  <circle cx="24" cy="24" r="24" fill="url(#a)"/>
  <text x="24" y="31" text-anchor="middle" font-family="-apple-system,PingFang SC,sans-serif" font-size="20" font-weight="600" fill="#fff">${initial}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const DEFAULT_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="480" height="360" fill="#ececec"/><circle cx="240" cy="158" r="54" fill="none" stroke="#c9c9c9" stroke-width="7"/><path d="M92 292l96-104 72 70 58-52 70 86z" fill="#d5d5d5"/><text x="240" y="332" text-anchor="middle" font-family="-apple-system,PingFang SC,sans-serif" font-size="18" fill="#999">图片暂时无法加载</text></svg>`,
)}`;

const RATIOS = [1.0, 1.25, 1.34, 0.78, 1.5, 1.12, 1.42, 0.92];

export const ALL_POSTS: Post[] = TITLES.map((title, index) => {
  const author = AUTHORS[index % AUTHORS.length];
  const category = CATEGORIES[index % CATEGORIES.length];
  const ratio = RATIOS[(index * 5 + 2) % RATIOS.length];
  const height = Math.round(480 * ratio);
  return {
    id: `note-${String(index + 1).padStart(3, "0")}`,
    title,
    author,
    avatar: makeAvatar(author, index * 7 + 1),
    image: makeCover(index * 37 + 11, 480, height, category),
    likes: 86 + ((index * 137) % 9400),
    ratio,
    category,
  };
});

export function makePost(title: string, index: number, body = ""): Post {
  const author = "我";
  const category = CATEGORIES[index % CATEGORIES.length];
  return {
    id: `note-published-${Date.now()}`,
    title: title.trim() || "新的小笔记",
    author,
    avatar: makeAvatar(author, index + 5),
    image: makeCover(Date.now() + index, 480, 560, category),
    likes: 0,
    ratio: 1.1667,
    category,
    body: body.trim(),
  };
}
