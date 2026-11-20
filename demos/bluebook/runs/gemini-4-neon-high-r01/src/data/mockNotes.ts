import type { NoteCategory, NoteItem } from "../types/note";

export const CATEGORIES: NoteCategory[] = [
  "推荐",
  "穿搭",
  "美食",
  "旅行",
  "家居",
  "数码",
  "摄影",
];

// Clean fallback SVG image shown whenever an image fails to load
export const DEFAULT_FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480">
      <rect width="400" height="480" fill="#f1f5f9"/>
      <circle cx="200" cy="200" r="46" fill="#e2e8f0"/>
      <path d="M135 290 L185 230 L225 270 L255 245 L290 290 Z" fill="#cbd5e1"/>
      <text x="200" y="340" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="18">图片加载失败 · 默认封面</text>
    </svg>`,
  );

function makeArtworkSvg(
  width: number,
  height: number,
  c1: string,
  c2: string,
  accent: string,
  badge: string,
  motif: number,
): string {
  const cx1 = Math.round(width * (0.25 + (motif % 3) * 0.25));
  const cy1 = Math.round(height * (0.28 + ((motif * 2) % 3) * 0.16));
  const r1 = Math.round(Math.min(width, height) * (0.24 + (motif % 4) * 0.05));
  const cx2 = width - cx1 + 20;
  const cy2 = Math.round(height * 0.68);
  const r2 = Math.round(r1 * 0.72);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g${motif}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g${motif})"/>
    <circle cx="${cx1}" cy="${cy1}" r="${r1}" fill="${accent}" fill-opacity="0.28"/>
    <circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="#ffffff" fill-opacity="0.2"/>
    <path d="M0 ${Math.round(height * 0.78)} Q ${Math.round(width * 0.45)} ${Math.round(height * 0.62)} ${width} ${Math.round(height * 0.84)} L ${width} ${height} L 0 ${height} Z" fill="#0f172a" fill-opacity="0.12"/>
    <rect x="24" y="${height - 62}" width="116" height="34" rx="17" fill="#ffffff" fill-opacity="0.88"/>
    <text x="82" y="${height - 40}" text-anchor="middle" fill="#1e293b" font-family="sans-serif" font-weight="700" font-size="16">${badge}</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const TEMPLATES: Array<{
  title: string;
  content: string;
  category: Exclude<NoteCategory, "推荐">;
  ratio: number;
  colors: [string, string, string];
  badge: string;
  author: string;
  avatarBg: string;
  tags: string[];
}> = [
  {
    title: "秋日法式松弛感穿搭｜米白针织配咖色大衣太显气质了",
    content: "周末散步随手拍的搭配，低饱和大地色系在午后阳光下格外温柔，保暖又轻盈。",
    category: "穿搭",
    ratio: 1.38,
    colors: ["#f5d0c5", "#d99b82", "#fff1e6"],
    badge: "OOTD 穿搭",
    author: "林小桃",
    avatarBg: "#fe2c55",
    tags: ["秋日穿搭", "法式风", "温柔配色"],
  },
  {
    title: "在家 5 分钟复刻网红海盐焦糖拿铁，绵密奶泡秘诀公开",
    content: "冰博克加一点点海盐焦糖酱，浓缩液顺着冰块淋下分层超级治愈。",
    category: "美食",
    ratio: 1.15,
    colors: ["#f6bd60", "#c67d3b", "#fff8eb"],
    badge: "居家咖啡",
    author: "阿宇手冲",
    avatarBg: "#d97706",
    tags: ["手冲咖啡", "早八必备", "生活仪式感"],
  },
  {
    title: "独自去大理环洱海 3 天攻略｜避开人潮的日出机位收藏",
    content: "清晨六点半的龙龛码头薄雾未散，红杉树倒映在水面像一幅油画。",
    category: "旅行",
    ratio: 1.48,
    colors: ["#48cae4", "#023e8a", "#caf0f8"],
    badge: "洱海日出",
    author: "川野日记",
    avatarBg: "#0284c7",
    tags: ["大理旅行", "摄影机位", "独自出发"],
  },
  {
    title: "45㎡ 老破小爆改奶油原木风，低成本软装提升幸福感",
    content: "拆掉多余隔断后整个客厅通透了一倍，暖白纱帘配原木餐桌每天回家都好治愈。",
    category: "家居",
    ratio: 0.92,
    colors: ["#e9d8a6", "#b08968", "#fefae0"],
    badge: "租房改造",
    author: "栖居记",
    avatarBg: "#65a30d",
    tags: ["奶油风", "小户型", "软装灵感"],
  },
  {
    title: "极简无线桌面 Setup 分享｜程序员的沉浸式编码角落",
    content: "用理线槽把所有电源隐藏在桌板下方，搭配 4000K 屏幕挂灯晚上写代码不累眼。",
    category: "数码",
    ratio: 1.05,
    colors: ["#6366f1", "#1e1b4b", "#a5b4fc"],
    badge: "桌搭灵感",
    author: "极客阿哲",
    avatarBg: "#4f46e5",
    tags: ["桌面改造", "效率工具", "外设清单"],
  },
  {
    title: "阴天怎么拍出电影感蓝调人像？3 个手机调色参数直接抄",
    content: "色温微调冷色调，高光压低保留天空细节，阴影轻轻加一点青蓝瞬间出片。",
    category: "摄影",
    ratio: 1.42,
    colors: ["#38bdf8", "#312e81", "#e0f2fe"],
    badge: "蓝调调色",
    author: "光影漫游",
    avatarBg: "#0891b2",
    tags: ["手机摄影", "调色教程", "氛围感"],
  },
  {
    title: "减脂期也能炫的泰式青柠虾仁沙拉，酸辣清爽 10 分钟搞定",
    content: "鱼露加青柠汁和小米辣调出灵魂料汁，低卡高蛋白夏天冬天都爱吃。",
    category: "美食",
    ratio: 1.24,
    colors: ["#84cc16", "#15803d", "#fef08a"],
    badge: "轻食减脂",
    author: "小满厨房",
    avatarBg: "#16a34a",
    tags: ["减脂餐", "快手菜", "沙拉"],
  },
  {
    title: "京都岚山秋日红叶漫步｜竹林小径与百年抹茶甜品店打卡",
    content: "赶在清晨第一班小火车进山，阳光透过枫叶洒在石板路上美到失语。",
    category: "旅行",
    ratio: 1.32,
    colors: ["#fb7185", "#9f1239", "#ffe4e6"],
    badge: "红叶季",
    author: "橘子汽水",
    avatarBg: "#e11d48",
    tags: ["京都红叶", "旅行vlog", "治愈风景"],
  },
  {
    title: "小个子显高显瘦神裤测评｜高腰微喇牛仔裤 4 套实穿示范",
    content: "精选四条不同水洗色的微喇版型，拉长腿部比例的同时对梨形身材非常友好。",
    category: "穿搭",
    ratio: 1.46,
    colors: ["#93c5fd", "#1d4ed8", "#eff6ff"],
    badge: "显瘦神裤",
    author: "可可穿搭",
    avatarBg: "#2563eb",
    tags: ["小个子穿搭", "牛仔裤", "通勤日常"],
  },
  {
    title: "阳台打造 3㎡ 迷你植物园：新手养不死的 6 种室内绿植清单",
    content: "琴叶榕、龟背竹和空气凤梨组合在一起，每周浇水一次就能绿意盎然。",
    category: "家居",
    ratio: 1.18,
    colors: ["#34d399", "#065f46", "#d1fae5"],
    badge: "阳台绿植",
    author: "森系慢活",
    avatarBg: "#059669",
    tags: ["绿植养护", "阳台花园", "居家美学"],
  },
];

export function generateMockBatch(page: number, count = 20): NoteItem[] {
  const items: NoteItem[] = [];
  for (let i = 0; i < count; i++) {
    const seq = (page - 1) * count + i;
    const tpl = TEMPLATES[seq % TEMPLATES.length];
    const ratioJitter = ((seq * 17) % 5 - 2) * 0.05;
    const aspectRatio = Number(Math.max(0.82, Math.min(1.55, tpl.ratio + ratioJitter)).toFixed(2));
    const width = 400;
    const height = Math.round(width * aspectRatio);

    items.push({
      id: `note-${page}-${i}-${seq}`,
      title: page === 1 ? tpl.title : `${tpl.title} · 灵感集 #${seq + 1}`,
      content: tpl.content,
      category: tpl.category,
      imageUrl: makeArtworkSvg(
        width,
        height,
        tpl.colors[0],
        tpl.colors[1],
        tpl.colors[2],
        tpl.badge,
        seq + 1,
      ),
      aspectRatio,
      author: {
        name: tpl.author,
        initial: tpl.author.slice(0, 1),
        avatarBg: tpl.avatarBg,
      },
      likes: 120 + ((seq * 97 + 43) % 4800),
      liked: false,
      tags: tpl.tags,
      createdAt: `${(seq % 12) + 1}小时前`,
    });
  }
  return items;
}
