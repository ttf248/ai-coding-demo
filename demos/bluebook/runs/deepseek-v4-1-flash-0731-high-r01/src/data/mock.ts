import type { Note } from "../types";

/** 24 张本地图片的实际像素尺寸（离线可用，不引用任何外部图片数据） */
const IMAGE_SIZES: Array<[number, number]> = [
  [800, 1217], [800, 850], [800, 1453], [800, 1481], [800, 968], [900, 620],
  [800, 1090], [800, 1330], [800, 762], [800, 1604], [800, 1015], [900, 620],
  [800, 1245], [800, 890], [800, 1720], [800, 1120], [800, 985], [900, 620],
  [800, 1382], [800, 1040], [800, 1560], [800, 815], [800, 1298], [900, 620],
];

const TITLES = [
  "周末去了趟山里，云海比想象中厚得多",
  "把阳台重新收拾了一遍，终于能坐下来了",
  "旧书店里翻到一本 1987 年的摄影集",
  "第一次做陶，手抖得厉害但是很好玩",
  "雨后的街道像被打磨过一样",
  "夜航时窗外的城市像一块发光的电路板",
  "咖啡馆的角落适合写一整个下午",
  "沿着梧桐大道走了两个小时",
  "露营那晚看到了银河，手机拍不出来",
  "胶片洗出来了，颗粒感很上头",
  "湖心小岛只有一家小卖部",
  "雪后的松林安静到能听见雪落",
  "玻璃温室里的植物长得比人还高",
  "木工房的第一件成品：一张小板凳",
  "晨间瑜伽第 30 天，柔韧性肉眼可见变好",
  "春日野餐清单：三明治、气泡水和一只风筝",
  "地铁速写，12 站画了 9 个人",
  "老街糖水铺开了四十多年",
  "陶艺体验课，捏坏三个才成一个",
  "阳台绿植搬家，多肉换了大盆",
  "周末夜市的小摊灯串很好看",
  "公园里下棋的爷爷们很有意思",
  "把房间刷成了浅杏色，光线好了一整档",
  "海边坐了一下午，什么也没干",
];

const AUTHORS = [
  "林小满", "陆野", "阿树", "Nina", "陈也", "三七",
  "沈迟", "白露", "小舟", "K.", "周未", "橘子酱",
];

const AVATAR_COLORS = [
  "#fe2c55", "#ff7a45", "#36cfc9", "#597ef7", "#9254de",
  "#f759ab", "#13c2c2", "#faad14",
];

/** 第一张备用底图：内联 SVG，不依赖网络，图片加载失败时使用 */
export const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#eef0f4"/><circle cx="200" cy="214" r="46" fill="#d3d8e0"/><path d="M120 300l52-56 40 40 34-28 54 62z" fill="#d3d8e0"/><text x="200" y="372" text-anchor="middle" font-family="-apple-system,PingFang SC,sans-serif" font-size="20" fill="#9aa2ae">图片加载失败</text></svg>`,
  );

/** 生成第 page 页的 20 条 mock 数据（同一条数据内容稳定，便于复测） */
export function fetchNotes(page: number): Note[] {
  const perPage = 20;
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, i) => {
    const idx = start + i;
    const imgIdx = idx % IMAGE_SIZES.length;
    const [w, h] = IMAGE_SIZES[imgIdx];
    const seq = imgIdx + 1;
    return {
      id: `note-${page}-${i}-${seq}`,
      title: TITLES[idx % TITLES.length],
      author: AUTHORS[(idx * 5 + 3) % AUTHORS.length],
      avatarColor: AVATAR_COLORS[(idx * 3 + 1) % AVATAR_COLORS.length],
      likes: 120 + ((idx * 977) % 9800),
      image: `images/note-${String(seq).padStart(2, "0")}.svg`,
      ratio: w / h,
      fallback: FALLBACK_IMAGE,
    };
  });
}
