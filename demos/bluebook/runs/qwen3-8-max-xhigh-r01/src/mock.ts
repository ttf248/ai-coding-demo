export interface MockItem {
  id: number;
  title: string;
  author: string;
  hue: number;
  likes: number;
  img: string;
  /** 图片原始高度（宽固定 300），用于瀑布流不等高 */
  h: number;
}

const TITLES = [
  "山间清晨的第一杯手冲，雾气还没散",
  "把阳台改成了 3㎡ 的小书房",
  "周末Citywalk：老街的新涂鸦墙",
  "极简通勤穿搭｜一衣多穿的第七天",
  "在家复刻了巷口那碗葱油拌面",
  "秋招上岸后，我把简历删了",
  "露营装备清单：新手别乱买",
  "用胶片记录下雨天的窗",
  "独居第三年，我学会了修水管",
  "海边日落收集计划 · 第 42 天",
  "低成本改造出租屋桌面",
  "晨跑 5km 的第 100 天打卡",
  "手作陶碗开窑记录",
  "雪山徒步全攻略（含轨迹）",
  "一周便当不重样 Vol.3",
  "旧毛衣改成了猫窝",
  "citynight｜霓虹下的天桥",
  "自制桂花乌龙冷萃",
  "毕业五年，回到母校拍了一组照片",
  "多肉度夏存活报告",
  "把通勤路画成了小地图",
  "深夜食堂：一人食寿喜烧",
  "银杏大道的最佳机位分享",
  "零基础学水彩的第 30 天",
  "租房改造：不打孔的收纳方案",
  "带猫去看海 Vlog 截帧",
  "冬日热红酒配方抄作业",
  "工位绿植 survival guide",
  "骑行 30km 去看一场日出",
  "手账排版灵感：留白的力量",
];
const AUTHORS = [
  "阿岚", "栗子酱", "Momo", "山下风", "七七", "老周", "南瓜车", "Suki",
  "大林", "柚子茶", "Kiki", "白鹭", "薄荷糖", "阿澄", "桃子", "Nana",
];

/** 60 条 mock 数据：图片为本地 public/images 下的不等高 SVG */
export const POOL: MockItem[] = Array.from({ length: 60 }, (_, i) => {
  const imgNo = (i % 48) + 1;
  return {
    id: i + 1,
    title: TITLES[i % TITLES.length] + (i >= TITLES.length ? ` · ${Math.floor(i / TITLES.length) + 1}` : ""),
    author: AUTHORS[i % AUTHORS.length],
    hue: (i * 47) % 360,
    likes: 37 + ((i * 137) % 4200),
    img: `images/p${String(imgNo).padStart(2, "0")}.svg`,
    h: 300 + ((imgNo * 37) % 5) * 100,
  };
});

export const PLACEHOLDER = "images/placeholder.svg";

export function shuffled<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
