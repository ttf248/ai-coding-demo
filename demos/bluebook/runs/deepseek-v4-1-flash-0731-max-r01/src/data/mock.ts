/** 数据 mock：本地图片 + 变化高度，离线可用 */

export interface Post {
  id: number;
  title: string;
  img: string;
  author: string;
  avatarColor: string;
  likes: number;
  liked: boolean;
  /** 预估高度，用于 react-lazyload 占位，避免布局抖动 */
  height: number;
}

const TITLES = [
  "周末去走了山海步道，风把云吹成了棉花糖",
  "深夜食堂：一碗治愈系的葱油拌面教程",
  "阳台绿植第三年，终于被我养成了小森林",
  "露营装备清单（新手友好版）附实际体验",
  "巷口新开的咖啡店，手冲只要 18 块",
  "换季穿搭：三件基础款搭出十套造型",
  "城市书店巡礼·藏在二楼的老书店",
  "第一次做陶艺，捏了个歪歪扭扭的杯子",
  "晨跑五公里的正确打开方式",
  "追到了今天的日落，天空烧起来了",
  "复古相机入手报告：胶片感真的会上瘾",
  "春日野餐完全指南：从菜单到拍照机位",
  "黑胶唱片入坑一个月，钱包和耳朵都很快乐",
  "十二平米出租屋的改造记录",
  "猫主子今天也很努力地在睡觉",
  "花市随拍：二十块钱买到一整天的好心情",
  "骑车去看海，来回四十公里也值得",
  "冬日暖锅：一人食也可以很丰盛",
  "咖啡拉花练习第 30 天，终于有形状了",
  "爬楼记录：在天台看整座城市亮起来",
  "面包出炉的瞬间，整个屋子都是香气",
  "给自己的手写信：今年也要好好生活",
  "雨天在家拼图，安静得能听见时间",
  "楼下的樱花开了，早八人也有春天",
];

const AUTHORS = [
  "阿禾", "南风", "栗子同学", "Momo", "山雀儿",
  "小满", "Kiwi酱", "阿寻", "一颗桃", "十七号",
];

const AVATAR_COLORS = [
  "#fda4af", "#fdba74", "#fcd34d", "#86efac",
  "#67e8f9", "#93c5fd", "#c4b5fd", "#f0abfc",
];

const IMAGE_COUNT = 24;

/** 生成 count 条帖子；seed 决定内容与图片组合，保证可重复 */
export function makePosts(seed: number, count: number): Post[] {
  const base = `${import.meta.env.BASE_URL}images/`;
  return Array.from({ length: count }, (_, i) => {
    const n = seed + i;
    const imgIndex = ((n * 7) % IMAGE_COUNT) + 1;
    // 与图片实际高度成比例（300–560px 宽 400），保证占位高度接近真实
    const h = 300 + ((imgIndex - 1) * 37) % 260;
    return {
      id: n,
      title: TITLES[n % TITLES.length],
      img: `${base}img-${String(imgIndex).padStart(2, "0")}.svg`,
      author: AUTHORS[n % AUTHORS.length],
      avatarColor: AVATAR_COLORS[n % AVATAR_COLORS.length],
      likes: 120 + ((n * 37 + i * 97) % 9800),
      liked: false,
      height: h,
    };
  });
}

/** 图片加载失败时的默认图（内联 SVG，不依赖网络） */
export const FALLBACK_IMG =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="360">
      <rect width="400" height="360" fill="#f0f0f0"/>
      <circle cx="200" cy="150" r="46" fill="#dcdcdc"/>
      <rect x="120" y="215" width="160" height="14" rx="7" fill="#dcdcdc"/>
      <rect x="150" y="243" width="100" height="12" rx="6" fill="#e4e4e4"/>
      <text x="200" y="320" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#b8b8b8">图片加载失败</text>
    </svg>`,
  );
