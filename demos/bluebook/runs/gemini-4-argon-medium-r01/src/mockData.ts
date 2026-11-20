export interface PostItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspectRatio: number; // height / width ratio for varying heights
  authorName: string;
  authorInitial: string;
  authorColor: string;
  likes: number;
  liked: boolean;
  simulateBroken?: boolean;
}

export const CATEGORIES = [
  { id: 'all', label: '推荐' },
  { id: 'travel', label: '旅行风景' },
  { id: 'food', label: '治愈美食' },
  { id: 'design', label: '美学家居' },
  { id: 'tech', label: '数码极客' },
  { id: 'ootd', label: '穿搭灵感' }
];

// 生成不同高度和主题插画的 SVG Data URL，保证离线/静态部署 100% 高清秒开且高度丰富多变
export function createArtworkDataUrl(
  seed: number,
  width: number,
  height: number,
  themeTitle: string,
  subtitle: string
): string {
  const palettes = [
    ['#ff9a9e', '#fecfef', '#7f1d1d'],
    ['#a1c4fd', '#c2e9fb', '#1e3a8a'],
    ['#ffecd2', '#fcb69f', '#7c2d12'],
    ['#84fab0', '#8fd3f4', '#064e3b'],
    ['#fccb90', '#d57eeb', '#581c87'],
    ['#e0c3fc', '#8ec5fc', '#312e81'],
    ['#f6d365', '#fda085', '#78350f']
  ];
  const [c1, c2, textCol] = palettes[seed % palettes.length];
  const cx = Math.round(width * (0.35 + ((seed * 17) % 35) / 100));
  const cy = Math.round(height * (0.35 + ((seed * 23) % 30) / 100));
  const r = Math.round(Math.min(width, height) * 0.28);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g${seed})" />
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(255,255,255,0.38)" />
    <circle cx="${width - cx * 0.6}" cy="${height - cy * 0.6}" r="${Math.round(r * 0.7)}" fill="rgba(255,255,255,0.24)" />
    <rect x="24" y="${height - 115}" width="${width - 48}" height="86" rx="16" fill="rgba(255,255,255,0.78)" />
    <text x="42" y="${height - 72}" fill="${textCol}" font-family="-apple-system,BlinkMacSystemFont,PingFang SC,sans-serif" font-size="22" font-weight="bold">${themeTitle}</text>
    <text x="42" y="${height - 44}" fill="${textCol}" opacity="0.75" font-family="-apple-system,BlinkMacSystemFont,PingFang SC,sans-serif" font-size="15">${subtitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 图片加载失败时显示的默认占位图 Data URL
export const FALLBACK_IMAGE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 420" width="400" height="420">
  <rect width="100%" height="100%" fill="#f1f5f9"/>
  <circle cx="200" cy="175" r="52" fill="#e2e8f0"/>
  <path d="M140 265 L185 215 L220 250 L245 225 L275 265 Z" fill="#94a3b8"/>
  <text x="200" y="315" text-anchor="middle" fill="#64748b" font-family="-apple-system,PingFang SC,sans-serif" font-size="16" font-weight="bold">图片加载失败 · 已展示默认占位图</text>
  <text x="200" y="340" text-anchor="middle" fill="#94a3b8" font-family="-apple-system,PingFang SC,sans-serif" font-size="13">BlueBook Default Fallback</text>
</svg>`)}`;

const SAMPLE_NOTES = [
  {
    title: '周末逃离城市计划｜藏在山谷里的绝美玻璃木屋咖啡馆，随手一拍都是电影感大片',
    category: 'travel',
    theme: '山谷秘境咖啡',
    sub: 'Weekend Escape · 胶片色彩',
    author: '林深见鹿',
    likes: 1284
  },
  {
    title: '低卡高蛋白早餐合集！10分钟搞定牛油果滑蛋恰巴塔，开启元气满满的一天',
    category: 'food',
    theme: '早安恰巴塔',
    sub: 'Healthy Brunch · 10min食谱',
    author: '甜椒厨房',
    likes: 842
  },
  {
    title: '独居女孩的 45㎡ 原木风小家改造，只花了三千元就把客厅变成温柔奶油色画廊',
    category: 'design',
    theme: '45㎡奶油原木宅',
    sub: 'Home Decor · 软装灵感',
    author: '木子家居志',
    likes: 3510
  },
  {
    title: '程序员桌面改造 3.0｜极简无线双屏工作台与客制化机械键盘搭配指南',
    category: 'tech',
    theme: '极简桌面美学',
    sub: 'Desk Setup 2026 · 生产力',
    author: '极客阿泽',
    likes: 2190
  },
  {
    title: '早秋美拉德风穿搭公式｜焦糖色风衣配复古牛仔，显高显瘦的通勤模板',
    category: 'ootd',
    theme: '早秋美拉德OOTD',
    sub: 'Autumn Lookbook · 通勤穿搭',
    author: '苏苏穿搭笔记',
    likes: 965
  },
  {
    title: '京都岚山雨后漫步｜避开人群的小众苔寺竹林机位分享，安静得只听见水滴声',
    category: 'travel',
    theme: '岚山雨后苔庭',
    sub: 'Kyoto Travel · 治愈系风景',
    author: '风物摄影师',
    likes: 4320
  },
  {
    title: '在家复刻街角人气桂花酒酿拿铁！绵密奶泡配清甜桂花冻，秋日幸福感拉满',
    category: 'food',
    theme: '桂花酒酿拿铁',
    sub: 'Home Cafe · 手冲特调',
    author: '阿茶的饮品店',
    likes: 1530
  },
  {
    title: '中古包豪斯台灯与绿植角落｜给卧室加一盏暖光，夜晚阅读的氛围感神器',
    category: 'design',
    theme: '包豪斯光影角',
    sub: 'Lighting Design · 氛围感',
    author: '光影收集者',
    likes: 718
  },
  {
    title: '随身携带的胶片数码相机实测｜直出色彩太惊艳，扫街党的口袋新宠',
    category: 'tech',
    theme: '口袋胶片街拍',
    sub: 'Camera Review · 扫街直出',
    author: '快门日记',
    likes: 1860
  },
  {
    title: '法式松弛感周末穿搭｜白衬衫+亚麻阔腿裤，去美术馆看展怎么拍都好看',
    category: 'ootd',
    theme: '美术馆看展穿搭',
    sub: 'Effortless Chic · 法式极简',
    author: 'Celine看展',
    likes: 1120
  }
];

const AVATAR_COLORS = [
  '#fe2c55',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6'
];

// 不同卡片高度序列，营造错落有致的真实瀑布流视觉
const HEIGHTS = [420, 540, 360, 500, 460, 580, 390, 520];

export function generateMockPosts(page: number, count = 20): PostItem[] {
  const list: PostItem[] = [];
  for (let i = 0; i < count; i++) {
    const globalIdx = (page - 1) * count + i;
    const tpl = SAMPLE_NOTES[globalIdx % SAMPLE_NOTES.length];
    const h = HEIGHTS[globalIdx % HEIGHTS.length];
    const w = 400;
    const isBrokenDemo = globalIdx === 7; // 第8张卡片特意模拟图片加载失败自动回退默认图，也可以由用户手动切换

    list.push({
      id: `post_${page}_${i}_${globalIdx}`,
      title: `${tpl.title}${page > 1 ? `（第 ${page} 辑 · #${i + 1}）` : ''}`,
      category: tpl.category,
      imageUrl: isBrokenDemo
        ? 'invalid-image://simulate-broken-image.png'
        : createArtworkDataUrl(globalIdx + 1, w, h, tpl.theme, tpl.sub),
      aspectRatio: h / w,
      authorName: tpl.author,
      authorInitial: tpl.author.slice(0, 1),
      authorColor: AVATAR_COLORS[globalIdx % AVATAR_COLORS.length],
      likes: tpl.likes + ((globalIdx * 37) % 400),
      liked: false,
      simulateBroken: isBrokenDemo
    });
  }
  return list;
}
