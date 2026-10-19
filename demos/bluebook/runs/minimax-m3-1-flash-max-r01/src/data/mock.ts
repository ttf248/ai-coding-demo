export interface Note {
  id: string;
  title: string;
  author: string;
  image: string;
  likes: number;
  tags: string[];
  ratio: number;
}

const TITLES = [
  "周末在城市里走了 18 公里，整理了这条路线",
  "把出租屋改造成工作室，预算 3000 元",
  "新手也能烤成功的欧包，一次失败复盘",
  "10 分钟做一顿早餐，好吃到不想点外卖",
  "养了三年的绿萝终于爆盆，记录一下养护",
  "第一次露营，装备清单和踩坑总结",
  "极简书桌改造：扔掉了 80% 的东西",
  "在老城区找到的 5 家宝藏咖啡馆",
  "拍摄逆光人像的 3 个小技巧",
  "把阳台改成小花园，邻居都来问",
  "每天 20 分钟，我练了 90 天俯卧撑",
  "旧毛衣改造成了两个北欧风抱枕",
  "夜跑 30 公里，我记录了身体的反馈",
  "一个人住的第 365 天：我的收纳方案",
  "用胶带和纸箱做了一只猫窝",
  "雨季插花：只用三种材料",
  "搬家后第一顿下厨，做了四菜一汤",
  "把旧照片做成拼贴墙的完整过程",
  "通勤路上读完的 5 本书",
  "一个人旅行的行李清单，控制在 8 公斤",
  "阳台种薄荷，第一周就爆盆",
  "手冲咖啡的 12 次失败记录",
  "给房间做了一次软装换季",
  "深夜写下的 100 个小目标",
  "旧木门改造的 7 个步骤",
  "用一张纸折出收纳盒",
  "烘焙工作室的第一个周末",
  "给多肉植物换了新家",
  "公园野餐清单，附上最舒服的时间点",
  "厨房收纳：把调料全部标签化",
];

const AUTHORS = [
  "小满",
  "阿远",
  "林间有风",
  "柚子",
  "陈拾柒",
  "一只咕",
  "南岸",
  "半夏",
  "木木",
  "青柠不酸",
  "老周",
  "白露",
  "阿糖",
  "南风过境",
  "小鹿",
  "安生",
];

const TAGS = [
  "家居",
  "美食",
  "旅行",
  "摄影",
  "植物",
  "手作",
  "健身",
  "收纳",
  "咖啡",
  "好物",
];

/** 本地图片资源，构建时由 public 目录自动拷贝 */
const imageUrl = (index: number) =>
  `${import.meta.env.BASE_URL}images/note-${String((index % 24) + 1).padStart(2, "0")}.svg`;

export const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}images/fallback.svg`;

/** 首次加载 20 条，之后每次追加 20 条 */
export const PAGE_SIZE = 20;

let counter = 0;

/** 生成 mock 数据：同样的序号总是得到同样的内容 */
export function createMockNotes(start: number, size: number): Note[] {
  const list: Note[] = [];
  for (let i = 0; i < size; i++) {
    const index = start + i;
    const seed = (index * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const title = TITLES[index % TITLES.length];
    const author = AUTHORS[index % AUTHORS.length];
    const tag = TAGS[(index * 3) % TAGS.length];
    list.push({
      id: `note-${index}`,
      title: index < TITLES.length ? title : `${title}（续 ${Math.floor(index / TITLES.length) + 1}）`,
      author,
      image: imageUrl(index),
      likes: Math.floor(rnd * 4200) + 120,
      tags: [tag, TAGS[(index * 7 + 3) % TAGS.length]],
      ratio: [0.75, 0.8, 1, 1.25, 1.5][index % 5],
    });
  }
  counter += size;
  return list;
}

export function resetMockCursor() {
  counter = 0;
}
