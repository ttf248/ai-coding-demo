export interface MockPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  image: string;
  imageHeight: number;
  likes: number;
  tags: string[];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TITLE_HEADS = [
  "秋日限定",
  "氛围感",
  "极简",
  "复古胶片",
  "城市漫步",
  "海边日落",
  "山间晨雾",
  "深夜食堂",
  "早餐企划",
  "周末露营",
  "书桌改造",
  "小阳台花园",
  "手作陶艺",
  "旧书摊寻宝",
  "雨天窗景",
  "夜市小吃",
  "古镇青石板",
  "雪后初晴",
  "咖啡馆角落",
  "公园野餐",
];

const TITLE_TAILS = [
  "穿搭分享",
  "旅行攻略",
  "摄影教程",
  "生活记录",
  "好物推荐",
  "食谱复刻",
  "roomtour",
  "vlog 日常",
  "灵感合集",
  "治愈瞬间",
  "探店报告",
  "改造日记",
];

const AUTHORS = [
  "小满",
  "阿澄",
  "柚子茶",
  "拾光记",
  "林间有鹿",
  "晚风信箱",
  "芝士奶盖",
  "半糖主义",
  "橘子汽水",
  "云边便利店",
  "木子",
  "青柠",
  "夏目",
  "南栀",
  "北辰",
];

const TAG_POOL = [
  "生活",
  "旅行",
  "美食",
  "穿搭",
  "摄影",
  "家居",
  "手绘",
  "宠物",
  "健身",
  "读书",
];

const HEIGHTS = [200, 240, 280, 320, 375, 420, 480, 540, 600];

function svgImage(seed: number, height: number): string {
  const rnd = mulberry32(seed);
  const h1 = Math.floor(rnd() * 360);
  const h2 = (h1 + 40 + Math.floor(rnd() * 120)) % 360;
  const cx = 40 + rnd() * 220;
  const cy = 40 + rnd() * (height - 80);
  const r = 40 + rnd() * 80;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="${height}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="hsl(${h1},70%,82%)"/>` +
    `<stop offset="1" stop-color="hsl(${h2},65%,68%)"/></linearGradient></defs>` +
    `<rect width="300" height="${height}" fill="url(#g)"/>` +
    `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="hsl(${h2},80%,92%)" opacity="0.55"/>` +
    `<circle cx="${(300 - cx).toFixed(0)}" cy="${(height - cy).toFixed(0)}" r="${(r * 0.45).toFixed(0)}" fill="hsl(${h1},80%,96%)" opacity="0.5"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function svgAvatar(seed: number): string {
  const rnd = mulberry32(seed);
  const h = Math.floor(rnd() * 360);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">` +
    `<rect width="48" height="48" rx="24" fill="hsl(${h},60%,80%)"/>` +
    `<circle cx="24" cy="19" r="8" fill="hsl(${h},45%,97%)"/>` +
    `<path d="M8 44c2-10 8-13 16-13s14 3 16 13z" fill="hsl(${h},45%,97%)"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 生成 mock 数据。page 从 0 开始；不同 page、不同 seed 得到稳定但多样的结果。
 * 约每 13 条穿插一张“加载失败”的图片，用于演示默认图兜底。
 */
export function generatePage(page: number, seed: number, size = 20): MockPost[] {
  const list: MockPost[] = [];
  for (let i = 0; i < size; i++) {
    const n = page * size + i;
    const rnd = mulberry32((seed + 1) * 100003 + n);
    const title = `${TITLE_HEADS[Math.floor(rnd() * TITLE_HEADS.length)]}的${TITLE_TAILS[Math.floor(rnd() * TITLE_TAILS.length)]}`;
    const author = AUTHORS[Math.floor(rnd() * AUTHORS.length)];
    const imageHeight = HEIGHTS[Math.floor(rnd() * HEIGHTS.length)];
    const image =
      n % 13 === 5
        ? `./images/deleted-${n}.jpg`
        : svgImage(seed * 7 + n, imageHeight);
    const tagCount = 1 + Math.floor(rnd() * 2);
    const tags: string[] = [];
    while (tags.length < tagCount) {
      const t = TAG_POOL[Math.floor(rnd() * TAG_POOL.length)];
      if (!tags.includes(t)) tags.push(t);
    }
    list.push({
      id: `p${seed}-${page}-${i}`,
      title,
      author,
      avatar: svgAvatar(seed * 11 + n),
      image,
      imageHeight,
      likes: Math.floor(rnd() * 3000),
      tags,
    });
  }
  return list;
}

/** 模拟网络延迟的分页请求 */
export function fetchPosts(
  page: number,
  seed: number,
  size = 20,
): Promise<MockPost[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generatePage(page, seed, size)), 550);
  });
}

/** 发布按钮生成的本地帖子（mock） */
export function makeUserPost(title: string, tags: string[]): MockPost {
  const n = Math.floor(Math.random() * 1e6);
  const imageHeight = HEIGHTS[Math.floor(Math.random() * HEIGHTS.length)];
  return {
    id: `u${n}`,
    title: title || "新的分享",
    author: "我",
    avatar: svgAvatar(n),
    image: svgImage(n, imageHeight),
    imageHeight,
    likes: 0,
    tags: tags.length ? tags.slice(0, 3) : ["生活"],
  };
}
