import type { Note, Tab } from "../types";

/**
 * 任务正文 v2：直接使用 mock 数据并包含不同高度的图片。
 * 这里不依赖本地 images 目录，而是在运行时用 SVG data URL 生成占位图，
 * 图片高度按内容变化，形成真正的瀑布流错落。
 */
const AUTHORS = [
  "山野拾光", "城市漫游者", "小满的日常", "橘子汽水", "阿布与猫",
  "晚风旅人", "一只柯基", "木木手作", "海边的西西弗", "慢半拍",
  "光影记录者", "小满妈妈", "三点的风", "不打烊的书店", "拾光旅行",
];

const TITLES = [
  "在老城区走了三小时，发现了这条宝藏小巷",
  "周末露营清单｜这些装备真的用得上",
  "把阳台改成了小花园，成本不到 300 元",
  "一个人的深夜食堂，简单但很治愈",
  "city walk 路线分享：从江边到美术馆",
  "拍了一下午的云，这张最满意",
  "10 分钟快手晚餐，打工人友好",
  "新买的咖啡豆，手冲记录第 12 天",
  "图书馆的午后，安静得刚刚好",
  "换季了，收纳柜这样整理最省心",
  "和朋友的周末骑行，沿江 20 公里",
  "雨天在家做的三道菜",
  "新买的绿植怎么养才不蔫",
  "看了部很长的电影，笔记写了两页",
  "早起三点的城市，比想象中好看",
];

const THEMES: [string, string][] = [
  ["#ff6b6b", "#ffa94d"], ["#4dabf7", "#22b8cf"], ["#51cf66", "#94d82d"],
  ["#b197fc", "#da77f2"], ["#ff922b", "#fcc419"], ["#20c997", "#63e6be"],
  ["#f783ac", "#faa2c1"], ["#4c6ef5", "#748ffc"], ["#e64980", "#f783ac"],
  ["#37b24d", "#69db7c"], ["#5f3dc4", "#845ef7"], ["#f76707", "#ffc078"],
];

/** mock 图片：高度随比例变化，圆形与山形只是占位装饰，颜色与内容索引绑定 */
function mockImage(i: number, ratio: number) {
  const [a, b] = THEMES[i % THEMES.length];
  const w = 480;
  const h = Math.round(w / ratio);
  const cx = 90 + ((i * 53) % 300);
  const cy = 60 + ((i * 37) % Math.max(60, h - 140));
  const r = 34 + (i % 4) * 14;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,.26)"/>` +
    `<path d="M0 ${h - 70 - (i % 5) * 14} Q ${Math.round(w * 0.3)} ${h - 120 - (i % 3) * 20} ${Math.round(w * 0.55)} ${h - 64} T ${w} ${h - 96 - (i % 4) * 10} L${w} ${h} L0 ${h} Z" fill="rgba(0,0,0,.2)"/>` +
    `<path d="M0 ${h - 42} Q ${Math.round(w * 0.35)} ${h - 78} ${Math.round(w * 0.68)} ${h - 40} T ${w} ${h - 56} L${w} ${h} L0 ${h} Z" fill="rgba(0,0,0,.3)"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** 不同高度的图片比例：高图 / 方图 / 宽图混合 */
function ratioFor(i: number) {
  const ratios = [0.72, 1.0, 1.33, 0.8, 1.5, 1.25, 0.9, 1.4, 0.75, 1.1];
  return ratios[(i * 3) % ratios.length];
}

const PAGE_SIZE = 20;
const TOTAL = 120;

export const TABS: Tab[] = [
  { key: "recommend", label: "推荐" },
  { key: "following", label: "关注" },
  { key: "nearby", label: "附近" },
];

/* ------------------------------------------------------------------
 * 第 4 轮：频道过滤规则。
 * 原先切频道只是弹一句「原型演示：关注频道」，列表内容纹丝不动，
 * 看不出三个频道到底有什么区别。现在每个频道有写在数据层的纯函数规则：
 *   recommend  全部内容
 *   following  作者序号能被 4 整除（模拟「你订阅的作者」）
 *   nearby     作者序号除以 4 余 1（模拟「同城作者」）
 * 两条规则互不重叠，且在第一屏就能命中若干条——如果按点赞数筛，
 * 第一页的点赞上限只有 2700 左右，阈值稍高就会整个频道空白。
 * 规则是纯函数而不是散在组件里，便于单独测试与替换。
 * ------------------------------------------------------------------ */
export function authorIndex(author: string): number {
  // 刷新后的作者名会带上 "-时间戳" 后缀，先剥掉再取序号
  const base = author.split("-")[0];
  const i = AUTHORS.indexOf(base);
  return i < 0 ? 0 : i;
}

export function filterByTab(items: Note[], tab: string): Note[] {
  if (tab === "following") return items.filter((n) => authorIndex(n.author) % 4 === 0);
  if (tab === "nearby") return items.filter((n) => authorIndex(n.author) % 4 === 1);
  return items;
}

export const TAB_EMPTY_TEXT: Record<string, string> = {
  recommend: "还没有内容",
  following: "关注频道里还没有内容：当前规则是「作者序号能被 4 整除」，继续下滑加载看看。",
  nearby: "附近频道里还没有内容：当前规则是「作者序号除以 4 余 1」，继续下滑加载看看。",
};


export function buildPage(page: number): Note[] {
  const start = page * PAGE_SIZE;
  const size = Math.min(PAGE_SIZE, TOTAL - start);
  return Array.from({ length: Math.max(0, size) }, (_, k) => {
    const i = start + k;
    const ratio = ratioFor(i);
    return {
      id: String(i),
      title: TITLES[i % TITLES.length],
      image: mockImage(i, ratio),
      ratio,
      author: AUTHORS[i % AUTHORS.length],
      likes: 120 + ((i * 137) % 8800),
    };
  });
}

export const TOTAL_ITEMS = TOTAL;