export interface FeedItem {
  id: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  image: string;
  ratio: number;
  category: string;
  liked?: boolean;
}

export const CATEGORIES = [
  "全部",
  "旅行",
  "美食",
  "穿搭",
  "家居",
  "摄影",
  "手绘",
  "露营"
];

const TITLES = [
  "秋天的第一杯奶茶｜附做法",
  "城市天台看日落，治愈打工人的一天",
  "手冲咖啡豆清单，附冲煮参数",
  "周末露营装备清单｜一次买齐",
  "小户型改造，房东看了都想涨租",
  "胶片感照片调色参数分享",
  "手绘插画练习第 30 天",
  "拍照姿势大全，闭眼都能出片",
  "这件外套穿了一整个秋天",
  "深夜食堂：十分钟番茄意面",
  "海边民宿推荐｜房间自带浴缸",
  "养了三年的绿萝终于爆盆了",
  "通勤包开箱｜每天背 8 小时不累",
  "一个人的生日，我做了六道菜",
  "雨天的博物馆，人少又安静",
  "旧衬衫改造的三种穿法"
];

const AUTHORS = [
  "林小满",
  "阿野",
  "一颗甜栗",
  "周末不加班",
  "苏苏",
  "山海不可平",
  "橘子汽水",
  "拾光机",
  "今天也要好好吃饭",
  "木木夕",
  "半糖去冰",
  "阿布同学"
];

const CATEGORY_TAGS = ["旅行", "美食", "穿搭", "家居", "摄影", "手绘", "露营"];

/** 线性同余伪随机数，保证 mock 数据稳定可复现 */
function createRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

/**
 * 生成本地 SVG 占位图（data URI），不依赖任何外部图片资源。
 * 不同条目使用不同色相与高度，模拟真实瀑布流中的图片比例差异。
 */
function makeCover(hue: number, ratio: number, seed: number): string {
  const width = 400;
  const height = Math.round(width * ratio);
  const random = createRandom(seed);
  const shapes: string[] = [];
  for (let i = 0; i < 5; i += 1) {
    const cx = Math.round(random() * width);
    const cy = Math.round(random() * height);
    const r = Math.round(40 + random() * 110);
    const opacity = (0.12 + random() * 0.22).toFixed(2);
    shapes.push(
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="${opacity}"/>`
    );
  }
  for (let i = 0; i < 4; i += 1) {
    const y = Math.round(random() * height);
    shapes.push(
      `<rect x="0" y="${y}" width="${width}" height="${Math.round(6 + random() * 18)}" fill="#ffffff" opacity="0.10"/>`
    );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue}, 78%, 72%)"/>
      <stop offset="100%" stop-color="hsl(${(hue + 48) % 360}, 72%, 52%)"/>
    </linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
    ${shapes.join("")}
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** 图片加载失败时的兜底图 */
export const FALLBACK_IMAGE = makeCover(210, 1.2, 7);

const RATIOS = [0.75, 1, 1.25, 1.33, 1.5, 0.66, 1.6, 0.8];

/** 生成分页 mock 数据 */
export function createFeed(page: number, size = 20): FeedItem[] {
  const random = createRandom(page * 7919 + 13);
  const items: FeedItem[] = [];
  for (let i = 0; i < size; i += 1) {
    const seed = page * size + i;
    const ratio = RATIOS[Math.floor(random() * RATIOS.length)];
    const hue = Math.floor(random() * 360);
    items.push({
      id: `note-${page}-${i}`,
      title: TITLES[(seed + page) % TITLES.length],
      author: AUTHORS[Math.floor(random() * AUTHORS.length)],
      avatar: AUTHORS[Math.floor(random() * AUTHORS.length)].slice(0, 1),
      likes: 120 + Math.floor(random() * 9800),
      image: makeCover(hue, ratio, seed + 1),
      ratio,
      category: CATEGORY_TAGS[Math.floor(random() * CATEGORY_TAGS.length)]
    });
  }
  return items;
}
