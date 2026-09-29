// v2 数据：mock 数据包含不同高度的图片，不再要求 images 文件夹。
// 使用一组 inline SVG 资源保持页面无外部依赖。

const palettes = [
  ["#fde68a", "#fb7185", "#f97316"],
  ["#a7f3d0", "#22d3ee", "#2563eb"],
  ["#fbcfe8", "#a78bfa", "#7c3aed"],
  ["#fef3c7", "#f59e0b", "#92400e"],
  ["#bae6fd", "#38bdf8", "#0c4a6e"],
  ["#fecaca", "#ef4444", "#7f1d1d"],
  ["#d9f99d", "#65a30d", "#365314"],
  ["#c4b5fd", "#8b5cf6", "#4c1d95"],
  ["#99f6e4", "#14b8a6", "#134e4a"],
  ["#fcd5ce", "#fb923c", "#9a3412"],
  ["#e9d5ff", "#c084fc", "#581c87"],
  ["#fef08a", "#eab308", "#713f12"],
];

const titles = [
  "夏日海岛周末",
  "城市天台的咖啡",
  "露营早餐计划",
  "雨后的阳台多肉",
  "手冲咖啡笔记",
  "秋日的稻城亚丁",
  "周末骑行路线",
  "深夜便利店日常",
  "冬天的热可可",
  "胡同里的旧书店",
  "一个人的散步地图",
  "下雨天的猫",
  "海边公路自驾",
  "下午茶烘焙日记",
  "健身房训练日记",
  "城市夜景随拍",
  "夏日穿搭灵感",
  "搬家的第一天",
  "清晨的菜市场",
  "周末厨房实验",
  "植物园散步",
  "夜市小吃地图",
  "深夜追剧清单",
  "咖啡馆里的猫",
  "夏日冰品合集",
];

const nicknames = [
  "蓝蓝",
  "小宇",
  "栗子",
  "阿森",
  "木木",
  "九九",
  "Kitty",
  "Mia",
  "阿白",
  "可可",
  "兜兜",
  "鹿野",
  "小满",
  "饼干",
  "船长",
  "北辰",
  "老陈",
  "丹丹",
  "阿宽",
  "十一",
];

export type Post = {
  id: number;
  title: string;
  nickname: string;
  avatarColor: string;
  likes: number;
  width: number;
  height: number;
  image: string;
  palette: string[];
};

// v2 显式要求“包含不同高度的图片”，因此高度集合有意识地跨越多种比例。
const HEIGHTS = [320, 380, 440, 480, 520, 560, 600, 660];

function buildPost(id: number): Post {
  const palette = palettes[id % palettes.length];
  const width = 600;
  const height = HEIGHTS[id % HEIGHTS.length];
  const title = titles[id % titles.length];
  const nickname = nicknames[id % nicknames.length];
  const avatarColor = palette[1];
  const likes = 23 + ((id * 7) % 980);

  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' preserveAspectRatio='xMidYMid slice'>
  <defs>
    <linearGradient id='g${id}' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='${palette[0]}'/>
      <stop offset='50%' stop-color='${palette[1]}'/>
      <stop offset='100%' stop-color='${palette[2]}'/>
    </linearGradient>
    <radialGradient id='b${id}' cx='30%' cy='25%' r='60%'>
      <stop offset='0%' stop-color='rgba(255,255,255,0.55)'/>
      <stop offset='100%' stop-color='rgba(255,255,255,0)'/>
    </radialGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g${id})'/>
  <circle cx='${(id * 73) % width}' cy='${(id * 113) % height}' r='${30 + (id % 50)}' fill='rgba(255,255,255,0.25)'/>
  <rect x='${(id * 47) % (width - 100)}' y='${(id * 89) % (height - 80)}' width='120' height='90' rx='16' fill='rgba(255,255,255,0.18)'/>
  <rect width='100%' height='100%' fill='url(#b${id})'/>
  <text x='50%' y='52%' font-size='${Math.round(width / 11)}' fill='rgba(255,255,255,0.85)' text-anchor='middle' font-family='system-ui' font-weight='700'>
    ${title}
  </text>
  <text x='50%' y='${height - 24}' font-size='18' fill='rgba(255,255,255,0.7)' text-anchor='middle' font-family='system-ui'>
    #${id.toString().padStart(3, "0")}
  </text>
</svg>`;
  const image = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return {
    id,
    title,
    nickname,
    avatarColor,
    likes,
    width,
    height,
    image,
    palette,
  };
}

const TOTAL = 220;
const POSTS: Post[] = Array.from({ length: TOTAL }, (_, i) => buildPost(i + 1));

export function loadInitial(count = 20): Post[] {
  return POSTS.slice(0, count);
}

export function loadMore(loaded: number, step = 10): Post[] {
  return POSTS.slice(loaded, loaded + step);
}