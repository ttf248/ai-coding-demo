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
 * 展示用图片全部来自 public/images，随编译自动拷贝到 dist/images。
 * 不引入任何外部图床或远程图片数据。
 */
const LOCAL_IMAGES: Array<{ file: string; width: number; height: number }> = [
  { file: "note-bb01.jpg", width: 600, height: 800 },
  { file: "note-bb02.jpg", width: 600, height: 1000 },
  { file: "note-bb03.jpg", width: 600, height: 600 },
  { file: "note-bb04.jpg", width: 600, height: 900 },
  { file: "note-bb05.jpg", width: 600, height: 750 },
  { file: "note-bb06.jpg", width: 600, height: 1100 },
  { file: "note-bb07.jpg", width: 600, height: 820 },
  { file: "note-bb08.jpg", width: 600, height: 640 },
  { file: "note-bb09.jpg", width: 600, height: 960 },
  { file: "note-bb10.jpg", width: 600, height: 780 },
  { file: "note-bb11.jpg", width: 600, height: 880 },
  { file: "note-bb12.jpg", width: 600, height: 700 },
  { file: "note-bb13.jpg", width: 600, height: 1050 },
  { file: "note-bb14.jpg", width: 600, height: 840 },
  { file: "note-bb15.jpg", width: 600, height: 920 },
  { file: "note-bb16.jpg", width: 600, height: 760 },
  { file: "note-bb17.jpg", width: 600, height: 1000 },
  { file: "note-bb18.jpg", width: 600, height: 860 },
  { file: "note-bb19.jpg", width: 600, height: 720 },
  { file: "note-bb20.jpg", width: 600, height: 940 },
];

const TITLES = [
  "清晨六点的海，风比闹钟先醒",
  "把秋天的第一杯热饮拍成了画",
  "老巷子里的光影，下午四点最好",
  "一个人也可以很认真地野餐",
  "雨停了之后的城市，安静得像被按下暂停",
  "山里的云比我先到一步",
  "周末去看了展，颜色比想象中更饱和",
  "楼下的猫已经认识我了",
  "把喜欢的颜色都穿在了身上",
  "夜跑十公里，风是甜的",
  "旧书店的第二排，藏着整个秋天",
  "第一次露营，天幕比想象中更暖",
  "窗台上的多肉终于开花了",
  "这碗面的热气值得一张照片",
  "骑车穿过隧道的那一刻，风在耳边",
  "咖啡店的光影打卡位被我找到了",
  "公园的银杏黄得很认真",
  "把周末调成慢速播放",
  "小院子的下午，适合发一会儿呆",
  "在陌生城市找到的同款天空",
];

const AUTHORS = [
  "林深见鹿",
  "阿绿不绿",
  "小满同学",
  "陈皮糖",
  "拍照的鹿先生",
  "南风",
  "有只猫叫四月",
  "苏苏",
  "老周的镜头",
  "橘子汽水",
  "林小满",
  "夏天的风",
];

const TAGS = ["日常", "风景", "美食", "城市漫步", "摄影", "露营", "手账", "宠物"];

const AVATAR_GRADIENTS: Array<[string, string]> = [
  ["#fe2c55", "#ff7a95"],
  ["#ff9a3d", "#ffd36e"],
  ["#36cfc9", "#69e0c8"],
  ["#597ef7", "#85a5ff"],
  ["#9254de", "#b37feb"],
  ["#13c2c2", "#5cdbd3"],
  ["#f759ab", "#ff85c0"],
  ["#fa8c16", "#ffc069"],
];

const pick = <T,>(list: T[], index: number): T => list[index % list.length];

/** 生成 60 条 mock 笔记，覆盖 20 张本地图片的不同高度组合。 */
export const ALL_NOTES: Note[] = Array.from({ length: 60 }, (_, index) => {
  const image = pick(LOCAL_IMAGES, index);
  const name = pick(AUTHORS, index * 5 + 1);
  const [from, to] = pick(AVATAR_GRADIENTS, index * 3);
  return {
    id: `note-${index + 1}`,
    title: pick(TITLES, index),
    author: name,
    // 文字头像：取昵称首字，配合渐变底色
    avatar: name.slice(0, 1),
    avatarFrom: from,
    avatarTo: to,
    image: `./images/${image.file}`,
    width: image.width,
    height: image.height,
    likes: 120 + ((index * 137) % 5400),
    tags: [pick(TAGS, index * 3), pick(TAGS, index * 3 + 5)],
  };
});

/** 首次加载 20 条，之后每次追加 20 条。 */
export const PAGE_SIZE = 20;
