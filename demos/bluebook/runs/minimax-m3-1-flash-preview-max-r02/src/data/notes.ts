export interface Note {
  id: string;
  title: string;
  author: string;
  avatar: string;
  avatarFrom: string;
  avatarTo: string;
  image: string;
  width: number;
  height: number;
  likes: number;
  tags: string[];
}

/**
 * Mock 数据：20 张本地图片，高度 600–1100 不等，
 * 用于构造真实的瀑布流错落效果。
 */
const IMAGES: Array<[string, number, number]> = [
  ["note-bb03.jpg", 600, 600],
  ["note-bb19.jpg", 600, 720],
  ["note-bb16.jpg", 600, 760],
  ["note-bb10.jpg", 600, 780],
  ["note-bb07.jpg", 600, 820],
  ["note-bb18.jpg", 600, 860],
  ["note-bb11.jpg", 600, 880],
  ["note-bb04.jpg", 600, 900],
  ["note-bb15.jpg", 600, 920],
  ["note-bb20.jpg", 600, 940],
  ["note-bb09.jpg", 600, 960],
  ["note-bb02.jpg", 600, 1000],
  ["note-bb17.jpg", 600, 1000],
  ["note-bb13.jpg", 600, 1050],
  ["note-bb06.jpg", 600, 1100],
  ["note-bb01.jpg", 600, 800],
  ["note-bb05.jpg", 600, 750],
  ["note-bb08.jpg", 600, 640],
  ["note-bb12.jpg", 600, 700],
  ["note-bb14.jpg", 600, 840],
];

const TITLES = [
  "把周末调成慢速播放",
  "雨天路过天桥，随手拍了一张",
  "今天的光线很适合拍照",
  "一个人的晚餐也要好好摆盘",
  "巷子尽头有一家很旧的唱片店",
  "早起十分钟，看到了不一样的日出",
  "山里的雾散得很慢",
  "楼下咖啡店的第二杯半价",
  "把喜欢的东西都搬到了阳台上",
  "夜里的城市像一块没睡醒的屏幕",
  "周末在家复刻了一部老电影",
  "地铁上遇到一只很困的猫",
  "这碗牛肉面的汤底值得夸一次",
  "公园长椅上晒到的第一束光",
  "骑到半山腰的时候，整座城都在脚下",
  "旧书店的猫比我先找到位置",
  "晒了一下午的被子，有太阳的味道",
  "傍晚的湖边，风把烦恼吹散了",
  "今天煮的咖啡比昨天好喝",
  "拍下了今天最喜欢的一个瞬间",
];

const AUTHORS = [
  "白桃汽水",
  "沈知野",
  "Kiki",
  "周一不加班",
  "路过的摄影师",
  "棠梨",
  "小满今天也在",
  "阿汤",
  "是栀子呀",
  "游木",
  "林深见鹿",
  "不吃香菜",
];

const TAGS = ["日常", "风景", "美食", "猫", "咖啡", "街拍", "旅行", "手作"];

const GRADIENTS: Array<[string, string]> = [
  ["#fe2c55", "#ffa3b5"],
  ["#ff9a3d", "#ffd36e"],
  ["#36cfc9", "#85e8dc"],
  ["#597ef7", "#9db6ff"],
  ["#9254de", "#c39bff"],
  ["#13c2c2", "#6ce4dd"],
  ["#f759ab", "#ff9ccc"],
  ["#fa8c16", "#ffcb85"],
];

const take = <T,>(list: T[], index: number): T => list[index % list.length];

export const ALL_NOTES: Note[] = Array.from({ length: 60 }, (_, index) => {
  const [file, width, height] = take(IMAGES, index);
  const author = take(AUTHORS, index * 7 + 3);
  const [from, to] = take(GRADIENTS, index * 5 + 2);
  return {
    id: `m31-${index + 1}`,
    title: take(TITLES, index),
    author,
    avatar: author.slice(0, 1),
    avatarFrom: from,
    avatarTo: to,
    image: `./images/${file}`,
    width,
    height,
    likes: 86 + ((index * 271) % 9200),
    tags: [take(TAGS, index * 2), take(TAGS, index * 2 + 3)],
  };
});

export const PAGE_SIZE = 20;
