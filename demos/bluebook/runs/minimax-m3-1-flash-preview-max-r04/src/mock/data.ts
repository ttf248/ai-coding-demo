import type { Note, Tab } from "../types";

/**
 * 图片资源全部来自本地 images 目录，构建时由 Vite 自动拷贝到产物根目录。
 * 这里必须走 import.meta.env.BASE_URL 拼接：产物用 base: './' 输出，
 * 而 public 目录里的文件不会被 Vite 改写引用。写成 "/photo-01.svg" 时
 * 它会被浏览器解析成站点根路径，嵌入 /previews/bluebook/... 下时全部 404。
 */
const FILES = Array.from(
  { length: 24 },
  (_, i) => `${import.meta.env.BASE_URL}photo-${String(i + 1).padStart(2, "0")}.svg`,
);

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

/** 依据文件名计算一个稳定但互不相同的高度比例，避免 mock 图片全部等高 */
function ratioFor(i: number) {
  const ratios = [0.75, 1.0, 1.33, 0.8, 1.5, 1.2, 0.9, 1.4];
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
    return {
      id: String(i),
      title: TITLES[i % TITLES.length],
      image: FILES[i % FILES.length],
      ratio: ratioFor(i),
      author: AUTHORS[i % AUTHORS.length],
      likes: 120 + ((i * 137) % 8800),
    };
  });
}

export const TOTAL_ITEMS = TOTAL;
