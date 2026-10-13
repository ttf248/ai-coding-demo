export interface NoteItem {
  id: string;
  title: string;
  cover: string;
  height: number;
  author: string;
  avatar: string;
  likes: number;
  failed?: boolean;
}

const TITLES = [
  "周末去海边的一天，风超舒服",
  "十分钟搞定的早餐燕麦碗",
  "出租屋改造：白墙也能很高级",
  "新手也能画好的眼妆教程",
  "城市骑行路线分享｜沿途都是树",
  "手冲咖啡入门器具清单",
  "三步做出奶油风书桌收纳",
  "露营装备避坑指南",
  "旧牛仔裤改成托特包",
  "下班后的低成本快乐：拼图",
  "阳台种菜第 30 天，出芽了",
  "极简通勤穿搭一周不重样",
  "猫咪第一次见雪的反应",
  "书单分享：最近在读的 5 本书",
  "低成本拍出氛围感照片",
  "厨房小白的番茄牛腩教程",
  "登山看日出，凌晨四点出发",
  "DIY 香薰蜡烛失败与成功",
  "小户型客厅动线怎么布局",
  "雨天宅家片单，配热可可",
  "跑步 100 天的身体变化",
  "干花保存的三个小技巧",
  "阳台花园的浇水时间表",
  "第一次做陶艺，歪但可爱",
];

const AUTHORS = [
  "生活观察员",
  "奶油可可",
  "阿蓝要早睡",
  "山与海之间",
  "柚子不加冰",
  "小满的日常",
  "深夜面包房",
  "风把云吹散",
  "半糖去冰",
  "苔藓小姐",
];

const PALETTES: Array<[string, string]> = [
  ["#ffd6e0", "#ff8fab"],
  ["#d0f0c0", "#7bc47f"],
  ["#cde7ff", "#6ea8ff"],
  ["#ffe8c2", "#ffb15c"],
  ["#e6dcff", "#9d7bff"],
  ["#d8f7ff", "#57c7e3"],
  ["#ffe0e0", "#ff6b6b"],
  ["#e0ffe9", "#4fd18b"],
  ["#fff3c4", "#f7b731"],
  ["#e8e8e8", "#9aa5b1"],
];

/** 用代码生成 SVG data URI，保证离线可预览且包含不同高度图片 */
function cover(seed: number, height: number): string {
  const [from, to] = PALETTES[seed % PALETTES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="${height}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient></defs>
  <rect width="300" height="${height}" fill="url(#g)"/>
  <circle cx="${60 + (seed * 37) % 180}" cy="${40 + (seed * 53) % Math.max(60, height - 80)}" r="${24 + (seed * 7) % 26}" fill="rgba(255,255,255,.55)"/>
  <rect x="${20 + (seed * 11) % 100}" y="${height - 70}" width="${90 + (seed * 13) % 90}" height="14" rx="7" fill="rgba(255,255,255,.6)"/>
  <rect x="${20 + (seed * 11) % 100}" y="${height - 46}" width="${60 + (seed * 17) % 70}" height="10" rx="5" fill="rgba(255,255,255,.4)"/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function avatarUri(seed: number): string {
  const [, to] = PALETTES[(seed + 3) % PALETTES.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
  <rect width="48" height="48" rx="24" fill="${to}"/>
  <circle cx="24" cy="19" r="9" fill="rgba(255,255,255,.85)"/>
  <path d="M8 46c3-10 10-15 16-15s13 5 16 15" fill="rgba(255,255,255,.85)"/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const HEIGHTS = [180, 240, 300, 220, 340, 260, 200, 280, 320, 210];

export function makeBatch(page: number, size: number): NoteItem[] {
  const items: NoteItem[] = [];
  for (let i = 0; i < size; i++) {
    const seed = page * size + i;
    const height = HEIGHTS[seed % HEIGHTS.length];
    items.push({
      id: `note-${seed}`,
      title: TITLES[seed % TITLES.length] + (page > 0 ? ` · ${page + 1}` : ""),
      cover: cover(seed, height),
      height,
      author: AUTHORS[seed % AUTHORS.length],
      avatar: avatarUri(seed),
      likes: 20 + ((seed * 137) % 4800),
      // 留一条必然失败的图，用于验证“加载失败显示默认图”
      failed: seed === 7,
    });
  }
  return items;
}

export function defaultCover(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
  <rect width="300" height="200" fill="#eeeeee"/>
  <rect x="110" y="70" width="80" height="60" rx="8" fill="#cccccc"/>
  <circle cx="135" cy="92" r="8" fill="#f5f5f5"/>
  <path d="M118 122l24-24 16 16 12-10 16 18z" fill="#f5f5f5"/>
  <text x="150" y="165" font-size="14" text-anchor="middle" fill="#999999">图片加载失败</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
