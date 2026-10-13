import type { Note } from "../types";

/** 与提示词一致：首屏一次 20 条，滚到底部再追加 20 条 */
export const PAGE_SIZE = 20;

const TITLES = [
  "秋天的第一杯手冲，水温真的差很多",
  "出租屋 8 平米改造，房东看了想涨租",
  "三年手帐复盘：坚持下来的是这一本",
  "这家开了二十年的早餐铺，只有本地人知道",
  "把 2015 年的旧笔记本救回来了全过程",
  "独居第 400 天，我的厨房收纳清单",
  "周末徒步 15 公里，装备清单和踩坑记录",
  "胶片摄影第一卷，废片比成片多",
  "用一周时间戒掉短视频，发生了什么",
  "预算 800 元，怎么搭出舒服的桌面",
  "阳台种菜第 60 天，第一次吃到自己的番茄",
  "整理衣柜扔掉 200 件之后的真实感受",
  "一个人的年夜饭，也可以很丰盛",
  "通勤路上听完 30 本书，这是我的方法",
  "养了三年的多肉，从一盆变成一窗台",
  "把旧木门改成书架，邻居都来问链接",
  "夜骑 30 公里，城市另一面的样子",
  "手冲入门第 100 杯，终于稳定了",
  "把家里最乱的一个抽屉彻底清空了",
  "露营第一次带够装备，教训记下来了",
  "给阳台做了一面绿植墙，邻居以为我搬了棵树",
  "复刻外婆的腌菜坛，一年就成功这一次",
  "通勤包十年进化史，从双肩到单肩",
  "手写周计划本，用之前先拍给我妈看",
  "预算有限怎么装出租屋，家具清单来了",
  "凌晨四点的菜市场，是这座城最早醒来的地方",
  "把旧毛衣改成宠物窝，猫先替你验收了",
  "一个人住之后，我对家务的理解全变了",
  "骑行通勤一个月，省下的钱够换三个轮组",
  "整理了 800 张照片，最后只留了 30 张",
  "厨房小白的第一周：刀工比厨艺重要",
  "把阳台改成工作区，效率意外地高",
  "旧毛衣编织教程，第五次终于成功",
  "城市里的免费展览地图，我走了 12 个",
  "早餐吃了 100 天，结论是不用每天都做",
  "给家里做了一次断舍离，清出了 6 箱",
  "手冲壶、磨豆机、称：一套够用的入门",
  "把书桌搬进飘窗，冬天这件事特别值",
  "骑了 500 公里之后，我的公路车选购笔记",
];

const NICKNAMES = [
  "木木的窗台",
  "慢慢来也快",
  "小满不满",
  "住在六楼",
  "今天也早睡",
  "拾光工作室",
  "阿吱吱",
  "半糖去冰",
  "一只柚子",
  "山野来信",
  "光合作用中",
  "深夜面包房",
  "第七格抽屉",
  "风起时想你",
  "不吃香菜",
  "把日子过慢",
];

/** 定长伪随机，保证每次刷新页面的 mock 数据完全一致 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 一组跨度较大的宽高比，让瀑布流出现真实的参差感 */
const SHAPES: Array<[number, number]> = [
  [400, 560],
  [400, 400],
  [400, 640],
  [400, 460],
  [400, 720],
  [400, 520],
  [400, 380],
  [400, 600],
  [400, 480],
  [400, 660],
];

const TOTAL = 120;

/**
 * 头像用本地生成的 SVG data URI，不依赖第三方头像服务：
 * i.pravatar.cc 会返回带跨源资源策略的响应，在浏览器里直接被拦掉。
 * 这里按昵称取色，同一昵称的头像稳定不变。
 */
const AVATAR_PALETTE: Array<[string, string]> = [
  ["#ffd9e0", "#ff7a94"],
  ["#d8ecff", "#6aa9ff"],
  ["#e2f7e6", "#5cc98c"],
  ["#fff0d1", "#f5ad4e"],
  ["#ece0ff", "#a98bff"],
  ["#ffe6d6", "#ff9a6b"],
  ["#d7f2f0", "#49b8ae"],
  ["#ffe0ee", "#f46fa8"],
];

function hashOf(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 几何剪影头像，不依赖字体，任何环境下渲染结果一致 */
function avatarFor(nickname: string): string {
  const [light, dark] = AVATAR_PALETTE[hashOf(nickname) % AVATAR_PALETTE.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/>` +
    `</linearGradient></defs>` +
    `<rect width="64" height="64" rx="32" fill="url(#g)"/>` +
    `<circle cx="32" cy="25" r="11" fill="#fff" fill-opacity=".92"/>` +
    `<path d="M32 39c-10.5 0-19 6.4-19 14.3V64h38V53.3C51 45.4 42.5 39 32 39Z" fill="#fff" fill-opacity=".92"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** 生成完整 mock 数据集（下拉刷新只是换起点，不重新生成长度） */
function buildDataset(): Note[] {
  const rand = mulberry32(20260913);
  return Array.from({ length: TOTAL }, (_, i) => {
    const [w, h] = SHAPES[Math.floor(rand() * SHAPES.length)];
    const nickname = NICKNAMES[Math.floor(rand() * NICKNAMES.length)];
    const id = `n${String(i + 1).padStart(3, "0")}`;
    return {
      id,
      title: TITLES[i % TITLES.length],
      nickname,
      avatar: avatarFor(nickname),
      image: `https://picsum.photos/seed/bluebook${id}/${w}/${h}`,
      imgW: w,
      imgH: h,
      likes: Math.floor(rand() * 9800) + 12,
    };
  });
}

const DATASET = buildDataset();

/** 首屏或下拉刷新后返回从 offset 开始的一页数据 */
export function page(offset: number): Note[] {
  return DATASET.slice(offset, offset + PAGE_SIZE);
}

export const DATASET_SIZE = DATASET.length;

/** 下拉刷新时整体挪动一个不固定的偏移，让内容看起来确实换了 */
export function refreshOffset(round: number): number {
  return (round * 37) % Math.max(1, DATASET_SIZE - PAGE_SIZE);
}

export function searchNotes(keyword: string): Note[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return [];
  return DATASET.filter(
    (n) =>
      n.title.toLowerCase().includes(kw) ||
      n.nickname.toLowerCase().includes(kw),
  );
}
