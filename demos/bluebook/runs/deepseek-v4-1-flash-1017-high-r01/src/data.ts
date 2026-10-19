export interface Note {
  id: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  image: string;
  height: number;
  tag: string;
  time: string;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 600;
const HEIGHTS = [380, 460, 540, 320, 500, 420, 580, 350, 620, 400, 480, 360, 560, 440];
const PALETTES = [
  ["#ff9a8b", "#ff6a88", "#ff99ac"],
  ["#8ec5fc", "#e0c3fc", "#a1c4fd"],
  ["#f6d365", "#fda085", "#ffcf7a"],
  ["#84fab0", "#8fd3f4", "#6ee7b7"],
  ["#a18cd1", "#fbc2eb", "#c4b5fd"],
  ["#fccb90", "#d57eeb", "#f0a6ca"],
  ["#0f2027", "#2c5364", "#4b6cb7"],
  ["#e8cbc0", "#636fa4", "#a3b1c6"],
  ["#ffecd2", "#fcb69f", "#ffb199"],
  ["#a1ffce", "#faffd1", "#8de4af"]
];

function cover(seed: number, index: number): { image: string; height: number } {
  const rng = mulberry32(seed);
  const height = HEIGHTS[index % HEIGHTS.length];
  const palette = PALETTES[index % PALETTES.length];
  const [c1, c2, c3] = palette;
  const id = `g${index}`;
  const blobs: string[] = [];
  const count = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < count; i++) {
    const cx = rng() * W;
    const cy = rng() * height;
    const r = 40 + rng() * (Math.min(W, height) * 0.42);
    const fill = [c1, c2, c3][Math.floor(rng() * 3)];
    const opacity = (0.16 + rng() * 0.42).toFixed(2);
    blobs.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="${fill}" opacity="${opacity}"/>`);
  }
  const waveY = height * (0.55 + rng() * 0.25);
  const wave = `<path d="M0 ${waveY.toFixed(0)} C ${W * 0.25} ${(waveY - 60).toFixed(0)}, ${W * 0.65} ${(waveY + 70).toFixed(0)}, ${W} ${(waveY - 10).toFixed(0)} L ${W} ${height} L 0 ${height} Z" fill="${c3}" opacity=".24"/>`;
  const bars = Array.from({ length: 7 }, (_, i) => {
    const bw = 8 + rng() * 18;
    return `<rect x="${(i * W) / 7 + 10}" y="${(height * 0.15 + rng() * height * 0.2).toFixed(0)}" width="${bw.toFixed(0)}" height="${(height * (0.2 + rng() * 0.5)).toFixed(0)}" rx="6" fill="#fff" opacity="${(0.08 + rng() * 0.14).toFixed(2)}"/>`;
  }).join("");
  const sun = rng() > 0.45
    ? `<circle cx="${(W * (0.62 + rng() * 0.24)).toFixed(0)}" cy="${(height * (0.16 + rng() * 0.2)).toFixed(0)}" r="${(24 + rng() * 34).toFixed(0)}" fill="#fff" opacity=".52"/>`
    : "";
  const arcs = `<path d="M-40 ${(height * 0.82).toFixed(0)} Q ${W * 0.35} ${(height * 0.5).toFixed(0)} ${W + 40} ${(height * 0.9).toFixed(0)}" stroke="#fff" stroke-width="2" opacity=".18" fill="none"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}">
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset=".58" stop-color="${c2}"/>
        <stop offset="1" stop-color="${c3}"/>
      </linearGradient>
      <radialGradient id="${id}r" cx=".5" cy=".35" r=".75">
        <stop offset="0" stop-color="#fff" stop-opacity=".3"/>
        <stop offset="1" stop-color="#000" stop-opacity=".16"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${height}" fill="url(#${id})"/>
    ${blobs.join("")}
    ${sun}
    ${bars}
    ${wave}
    ${arcs}
    <rect width="${W}" height="${height}" fill="url(#${id}r)"/>
  </svg>`;
  return { image: `data:image/svg+xml,${encodeURIComponent(svg)}`, height };
}

function avatar(seed: number, name: string): string {
  const rng = mulberry32(seed * 7 + 3);
  const palette = PALETTES[Math.floor(rng() * PALETTES.length)];
  const initial = name.slice(0, 1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <defs><linearGradient id="a${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette[0]}"/><stop offset="1" stop-color="${palette[2]}"/>
    </linearGradient></defs>
    <rect width="96" height="96" rx="48" fill="url(#a${seed})"/>
    <text x="48" y="60" font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="38" font-weight="600" fill="#fff" text-anchor="middle">${initial}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const TITLES = [
  "周末去山里住两天，把手机调成了飞行模式",
  "一个人的早餐，也要认真摆盘",
  "把阳台改成了迷你花园，每天都有新惊喜",
  "城市散步路线｜从旧书店走到江边",
  "最近爱用的三支秋冬口红，黄皮也友好",
  "第一次做可露丽，外脆内软的秘密",
  "租来的房子，也可以慢慢变成家",
  "下雨天最适合窝在沙发里看老电影",
  "通勤包里都装了什么？轻量出门清单",
  "跟着本地人吃早茶，一整天都满足了",
  "把喜欢的花做成干花，留住这个季节",
  "周末不赶路｜在美术馆待了一下午",
  "小户型收纳：把墙面利用起来",
  "给自己做一顿治愈系晚餐",
  "海边露营的 24 小时，风大但值得",
  "秋天的第一杯手冲，参数记录",
  "把旧牛仔裤改成了托特包",
  "凌晨四点的城市，原来是这样",
  "一个人去看展，也很自在",
  "把房间灯光换成暖色之后",
  "最近的阅读清单，适合睡前慢慢看",
  "山野徒步｜新手也能走的路线",
  "给自己拍一组胶片感照片",
  "周末烘焙：伯爵红茶司康",
  "把日常碎片拼成了一本手账",
  "在菜市场找到的治愈瞬间",
  "小城旅行｜两天一夜慢游攻略",
  "办公桌上的植物角落",
  "雨天窗边的阅读角",
  "自制气泡果茶，夏天的快乐水",
  "把旧家具重新刷漆之后",
  "城市里的免费展览清单",
  "一只猫的午后，什么都不做",
  "学会给自己留白的第 30 天",
  "清晨六点的公园，安静得刚刚好",
  "把旅行照片做成了一面墙",
  "周末手作：陶艺初体验",
  "一个人的火锅，也要有仪式感",
  "换季衣橱整理记录",
  "在楼顶看了一场日落"
];

const AUTHORS = [
  "林间小鹿", "一颗柚子", "晚风慢慢", "阿禾的日常", "山与海", "小满同学",
  "云朵收藏家", "橘子汽水", "木木的生活", "南风知我意", "半糖主义", "一只早起的鸟",
  "七月的海", "慢半拍", "小城日记", "拾光者", "蘑菇小姐", "春天的熊"
];

const TAGS = ["生活记录", "周末去哪儿", "美食", "家居", "穿搭", "旅行", "手作", "阅读", "摄影", "治愈"];

export const NOTES: Note[] = Array.from({ length: 60 }, (_, i) => {
  const rng = mulberry32(9001 + i * 37);
  const author = AUTHORS[i % AUTHORS.length];
  const { image, height } = cover(1000 + i * 13, i);
  return {
    id: `note-${i + 1}`,
    title: TITLES[i % TITLES.length],
    author,
    avatar: avatar(i + 1, author),
    likes: 86 + Math.floor(rng() * 9600),
    image,
    height,
    tag: TAGS[i % TAGS.length],
    time: ["刚刚", "12 分钟前", "1 小时前", "3 小时前", "昨天", "2 天前", "3 天前"][i % 7]
  };
});

export const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
  <defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#eef0f3"/><stop offset="1" stop-color="#dfe3e8"/>
  </linearGradient></defs>
  <rect width="600" height="420" fill="url(#f)"/>
  <circle cx="300" cy="190" r="52" fill="none" stroke="#b8c0ca" stroke-width="4"/>
  <path d="M198 300 L268 218 L326 278 L372 236 L430 300 Z" fill="#c8cfd8"/>
  <text x="300" y="350" text-anchor="middle" fill="#8a94a1" font-size="20" font-family="PingFang SC, Microsoft YaHei, sans-serif">图片加载失败</text>
</svg>
`)}`;

export function makePublishedNote(title: string, body: string, author = "我"): Note {
  const seed = Date.now() % 100000;
  const { image, height } = cover(seed, seed % HEIGHTS.length);
  return {
    id: `note-published-${Date.now()}`,
    title: title.trim() || body.trim().slice(0, 26) || "新的小蓝书",
    author,
    avatar: avatar(seed, author),
    likes: 0,
    image,
    height,
    tag: "生活记录",
    time: "刚刚"
  };
}
