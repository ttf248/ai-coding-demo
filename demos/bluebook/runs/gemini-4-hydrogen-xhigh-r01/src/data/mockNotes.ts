export interface NoteItem {
  id: string;
  title: string;
  author: string;
  avatarColor: string;
  likes: number;
  liked: boolean;
  category: string;
  imageUrl: string;
  aspectRatio: number; // height / width, 控制不同卡片高度
  description: string;
  tags: string[];
}

const PALETTES: Array<[string, string, string]> = [
  ["#ff9a9e", "#fecfef", "#8c1d40"],
  ["#a1c4fd", "#c2e9fb", "#1e3a8a"],
  ["#d4fc79", "#96e6a1", "#14532d"],
  ["#fbc2eb", "#a6c1ee", "#4c1d95"],
  ["#fddb92", "#d1fdff", "#78350f"],
  ["#84fab0", "#8fd3f4", "#0f766e"],
  ["#ffecd2", "#fcb69f", "#9a3412"],
  ["#cfd9df", "#e2ebf0", "#334155"],
];

export const DEFAULT_FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320">
      <rect width="400" height="320" fill="#eceff3"/>
      <rect x="148" y="102" width="104" height="78" rx="10" fill="#cbd5e1"/>
      <circle cx="176" cy="128" r="10" fill="#f8fafc"/>
      <path d="M158 170 L192 138 L218 160 L232 146 L246 170 Z" fill="#94a3b8"/>
      <text x="200" y="218" text-anchor="middle" font-size="16" fill="#64748b" font-family="sans-serif">图片加载失败 · 已切换默认图</text>
    </svg>`
  );

function buildArtSvg(
  idx: number,
  label: string,
  subtitle: string,
  ratio: number
): string {
  const w = 400;
  const h = Math.round(w * ratio);
  const [c1, c2, ink] = PALETTES[idx % PALETTES.length];
  const waveY = Math.round(h * 0.62);
  const sunX = 90 + ((idx * 53) % 220);
  const sunY = Math.round(h * 0.28);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g${idx}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g${idx})"/>
    <circle cx="${sunX}" cy="${sunY}" r="${34 + (idx % 3) * 10}" fill="rgba(255,255,255,0.45)"/>
    <path d="M0 ${waveY} Q 110 ${waveY - 36}, 210 ${waveY + 12} T ${w} ${waveY - 14} L ${w} ${h} L 0 ${h} Z" fill="rgba(255,255,255,0.28)"/>
    <path d="M0 ${waveY + 26} Q 150 ${waveY + 6}, 270 ${waveY + 34} T ${w} ${waveY + 22} L ${w} ${h} L 0 ${h} Z" fill="rgba(255,255,255,0.2)"/>
    <rect x="24" y="${h - 86}" width="${w - 48}" height="62" rx="12" fill="rgba(255,255,255,0.78)"/>
    <text x="40" y="${h - 56}" font-size="18" font-weight="700" fill="${ink}" font-family="sans-serif">${label}</text>
    <text x="40" y="${h - 34}" font-size="12" fill="#475569" font-family="sans-serif">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const TITLES = [
  "周末杭州西湖早起散步指南｜清晨光线太治愈了",
  "租房改造 300 元搞定奶油风桌面，超实用收纳清单",
  "零失败手冲冰拿铁配方：在家复刻咖啡馆风味",
  "秋日微凉城市漫游穿搭分享，松弛感针织开衫",
  "富士直出胶片色彩参数记录：阴天也能拍出通透感",
  "15 分钟快手减脂便当｜高蛋白鸡胸肉彩椒碗",
  "极简书桌改造：双屏布线与氛围台灯位置建议",
  "青岛海边小众观景台整理，避开人潮看橘子海日落",
  "iPad 无纸化学习笔记排版模板，效率提升一倍",
  "阳台的 6 盆耐阴绿植养护日记：新手也能养爆盆",
  "南京梧桐大道骑行路线图，秋风和光影刚刚好",
  "把旧衣柜改成开放式展示架，小户型客厅瞬间变大",
  "在家做日式厚蛋烧和味增汤，治愈系一人食早餐",
  "轻量化露营装备评测：两公斤以内搞定周末过夜",
  "初学水彩风景画的 4 个常见误区与叠色技巧",
  "成都巷子里的老茶馆半日发呆记录",
  "适合通勤听的 5 张独立电子与爵士纯音乐专辑",
  "机械键盘客制化润轴心得：闷响麻将音调校方案",
  "雨天宅家看书清单：3 本让人静下心来的散文集",
  "重庆夜色机位分享，山城立体感摄影构图技巧",
];

const AUTHORS = [
  "林小柚", "阿泽慢生活", "橘子汽水", "程屿摄影", "糖炒栗子",
  "木木家居", "周同学在路上", "早安煎蛋", "屿风手帐", "拾光日记",
];

const CATEGORIES = ["推荐", "穿搭", "美食", "旅行", "居家", "摄影", "数码"];
const RATIOS = [1.28, 0.86, 1.42, 1.0, 1.35, 0.92, 1.48, 1.15];
const AVATAR_COLORS = ["#fe2c55", "#fb7185", "#f97316", "#0ea5e9", "#10b981", "#8b5cf6", "#eab308"];

export const CATEGORIES_LIST = CATEGORIES;

export function createMockBatch(startIndex: number, count: number): NoteItem[] {
  const items: NoteItem[] = [];
  for (let i = 0; i < count; i++) {
    const seq = startIndex + i;
    const title = TITLES[seq % TITLES.length] + (seq >= TITLES.length ? ` #${seq + 1}` : "");
    const author = AUTHORS[seq % AUTHORS.length];
    const category = CATEGORIES[1 + (seq % (CATEGORIES.length - 1))];
    const ratio = RATIOS[seq % RATIOS.length];
    const isBrokenDemo = seq === 14; // 保留1条故障图片示例，直观验证图片加载失败默认图回退
    items.push({
      id: `note-${seq + 1}`,
      title,
      author,
      avatarColor: AVATAR_COLORS[seq % AVATAR_COLORS.length],
      likes: 42 + ((seq * 73) % 1800),
      liked: false,
      category,
      imageUrl: isBrokenDemo
        ? "invalid-local-broken-image://fallback-test"
        : buildArtSvg(seq, category, `${author} · 笔记 #${seq + 1}`, ratio),
      aspectRatio: ratio,
      description: `${title}。这是一条用于展示小蓝书瀑布流布局、图片懒加载及点赞交互的图文笔记内容，包含完整的标签与作者信息。`,
      tags: [category, "生活记录", "好物分享"],
    });
  }
  return items;
}
