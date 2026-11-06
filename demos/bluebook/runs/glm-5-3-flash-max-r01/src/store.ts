import { create } from "zustand";

export interface Post {
  id: number;
  title: string;
  image: string;
  author: string;
  likes: number;
  liked: boolean;
  ratio: number;
}

const AUTHORS = [
  "小鹿", "阿橙", "桃子酱", "山月", "KK", "柚子茶", "北巷", "软软",
  "林间风", "一一", "照夜白", "半糖",
];
const TITLES = [
  "城市漫游指南：转角遇到的花店",
  "一人食晚餐，治愈整天的疲惫",
  "周末去哪儿｜小众海边栈道推荐",
  "卧室改造计划，百元预算大变样",
  "通勤路上的天空摄影合集",
  "新手烘焙：一次成功的巴斯克",
  "书桌好物分享，提升专注力",
  "秋日穿搭灵感：大地色叠穿",
  "捡秋！落叶标本制作教程",
  "低成本养花：窗台绿植角",
  "古着小店探店记录",
  "深夜食堂：一碗葱油拌面",
  "手帐排版灵感 · 十月",
  "骑行环湖 40km 的午后",
  "猫咪日常：晒太阳的一百种姿势",
  "胶片质感调色教程",
  "出租屋厨房改造实录",
  "山间露营装备清单",
  "咖啡入门：手冲参数笔记",
  "旧物改造：木箱变边几",
];

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makePosts(startId: number, count: number, seed: number): Post[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    const imgIndex = ((startId + i - 1) % 24) + 1;
    return {
      id: startId + i,
      title: TITLES[Math.floor(rnd() * TITLES.length)],
      image: `${import.meta.env.BASE_URL}images/img-${String(imgIndex).padStart(2, "0")}.svg`,
      author: AUTHORS[Math.floor(rnd() * AUTHORS.length)],
      likes: Math.floor(rnd() * 4200) + 12,
      liked: false,
      ratio: [4 / 3, 1, 3 / 4, 3 / 5, 4 / 5][Math.floor(rnd() * 5)],
    };
  });
}

interface FeedState {
  posts: Post[];
  query: string;
  page: number;
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  setQuery: (q: string) => void;
  loadMore: () => Promise<void>;
  toggleLike: (id: number) => void;
  refresh: () => Promise<void>;
}

export const useFeed = create<FeedState>((set, get) => ({
  posts: [],
  query: "",
  page: 0,
  loading: false,
  refreshing: false,
  hasMore: true,
  setQuery: (q) => set({ query: q }),
  loadMore: async () => {
    const { loading, hasMore, page, posts } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 600));
    const next = makePosts(posts.length + 1, 20, 1000 + page);
    set({
      posts: [...posts, ...next],
      page: page + 1,
      loading: false,
      hasMore: page < 4,
    });
  },
  toggleLike: (id) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p,
      ),
    })),
  refresh: async () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    await new Promise((r) => setTimeout(r, 900));
    const seed = Date.now() % 100000;
    set({
      posts: makePosts(1, 20, seed),
      page: 1,
      hasMore: true,
      refreshing: false,
    });
  },
}));
