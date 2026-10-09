import type { Note } from "./types";

const PALETTES: [string, string][] = [
  ["#ff9a9e", "#fecfef"],
  ["#a1c4fd", "#c2e9fb"],
  ["#84fab0", "#8fd3f4"],
  ["#fbc2eb", "#a6c1ee"],
  ["#fddb92", "#d1fdff"],
  ["#cfd9df", "#e2ebf0"],
  ["#fa709a", "#fee140"],
  ["#667eea", "#764ba2"],
];
const RATIOS = [0.75, 1, 1.25, 1.33, 0.6, 1.5];
const TITLES = ["小鹿的日常", "周末去哪玩", "一周穿搭记录", "厨房小技巧", "城市夜景合集", "宠物日记", "读书笔记", "手绘练习", "咖啡探店", "健身打卡", "旅行清单", "桌面好物"];
const AUTHORS = ["小满", "阿橙", "Mia", "山野", "木子", "Ken", "七七", "饼干"];

// Deterministic pseudo-random numbers so every index always yields the same note.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const uri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function makeNote(index: number): Note {
  const r = rng(index * 9973 + 17);
  const [c1, c2] = PALETTES[index % PALETTES.length];
  const ratio = RATIOS[Math.floor(r() * RATIOS.length)];
  const w = 300;
  const h = Math.round(w * ratio);
  const cx = Math.round(w * (0.3 + r() * 0.4));
  const cy = Math.round(h * (0.3 + r() * 0.4));
  const radius = Math.round(40 + r() * 60);
  const cover = uri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><circle cx="${cx}" cy="${cy}" r="${radius}" fill="#ffffff" fill-opacity="0.55"/><rect x="${Math.round(w * 0.15)}" y="${Math.round(h * 0.7)}" width="${Math.round(w * 0.7)}" height="${Math.round(h * 0.08)}" rx="${Math.round(h * 0.04)}" fill="#ffffff" fill-opacity="0.6"/></svg>`,
  );
  const avatar = uri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="${c2}"/><circle cx="24" cy="19" r="9" fill="#ffffff" fill-opacity="0.9"/><ellipse cx="24" cy="44" rx="16" ry="12" fill="#ffffff" fill-opacity="0.9"/></svg>`,
  );
  return {
    id: `note-${index}`,
    title: `${TITLES[index % TITLES.length]} · ${index + 1}`,
    author: AUTHORS[Math.floor(r() * AUTHORS.length)],
    avatar,
    likes: 20 + Math.floor(r() * 4800),
    cover,
    ratio,
  };
}

export function fetchNotes(seed: number, page: number, size: number): Promise<Note[]> {
  return new Promise((resolve) => {
    // Mock network latency so the loading state is visible.
    window.setTimeout(() => {
      const start = seed * 1000 + page * size;
      resolve(Array.from({ length: size }, (_, i) => makeNote(start + i)));
    }, 500);
  });
}
