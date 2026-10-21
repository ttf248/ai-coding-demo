export interface Note {
  id: number;
  title: string;
  image: string;
  /** 图片宽高比（宽 / 高），用于占位，避免加载时跳动 */
  ratio: number;
  author: string;
  avatar: string;
  likes: number;
  liked: boolean;
  tag: string;
}

const IMAGE_COUNT = 16;
const TITLES = [
  "清晨的薄雾散在山谷之间",
  "老城区的傍晚，灯一盏盏亮起来",
  "午后花园里的光影",
  "海边的落日把云染成橘色",
  "穿过林间小路",
  "胶片质感的一百张",
  "薄荷绿的下午茶",
  "樱花开的时候",
  "城市漫步指南",
  "抽象的光影练习",
  "蓝调时刻的城市",
  "秋日转角的咖啡店",
  "薄荷绿的工作台",
  "蜜桃气泡水与夏天",
  "今天也是晴空",
  "黄昏海岸线",
  "白墙与爬山虎",
  "灯下的书桌",
  "窗台的多肉",
  "雨后的石板路",
  "骑行去看海",
  "街角的旧书店",
  "山里的信号塔",
  "夜跑的路灯",
  "广场上的鸽子",
  "开往郊区的列车",
  "陶艺工作室的下午",
  "冰箱贴收集册",
  "屋顶上的黄昏",
  "宠物店的小柯基",
  "周末的旧货市场",
];

const AUTHORS = [
  "林一",
  "阿树",
  "小满",
  "柚子茶",
  "路野",
  "沈知白",
  "南风",
  "木子",
  "三分甜",
  "陈拾柒",
  "北岛",
  "柠檬不酸",
];

const TAGS = ["风景", "生活", "手记", "美食", "旅行", "设计"];

/** 简单可复现的伪随机，保证每次刷新 mock 数据一致 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TOTAL = 60;
export const PAGE_SIZE = 20;

export function createNotes(count: number, offset = 0): Note[] {
  const rand = mulberry32(20240718 + offset);
  const list: Note[] = [];
  for (let i = 0; i < count; i++) {
    const id = offset + i + 1;
    const imageIndex = ((id - 1) % IMAGE_COUNT) + 1;
    const ratioPool = [0.75, 1, 0.8, 0.66, 0.89, 0.5, 1.15, 0.72];
    const author = AUTHORS[Math.floor(rand() * AUTHORS.length)];
    list.push({
      id,
      title: TITLES[(id - 1) % TITLES.length],
      image: `images/note-${String(imageIndex).padStart(2, "0")}.svg`,
      ratio: ratioPool[(id - 1) % ratioPool.length],
      author,
      avatar: author.slice(0, 1),
      likes: Math.floor(rand() * 4200) + 120,
      liked: false,
      tag: TAGS[Math.floor(rand() * TAGS.length)],
    });
  }
  return list;
}
