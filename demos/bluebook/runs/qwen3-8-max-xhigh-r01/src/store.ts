import { create } from "zustand";
import { POOL, shuffled, type MockItem } from "./mock";

const PAGE_FIRST = 20;
const PAGE_MORE = 10;

interface BBState {
  /** 当前 feed 顺序（下拉刷新会重排） */
  pool: MockItem[];
  /** 已加载条数 */
  loaded: number;
  liked: Record<number, boolean>;
  query: string;
  loading: boolean;
  ended: boolean;
  feedKey: number;
  publishOpen: boolean;
  extra: MockItem[];
  setQuery: (q: string) => void;
  toggleLike: (id: number) => void;
  loadMore: () => void;
  refresh: () => void;
  setPublish: (open: boolean) => void;
  publish: (title: string) => void;
}

export const useStore = create<BBState>((set, get) => ({
  pool: POOL,
  loaded: PAGE_FIRST,
  liked: {},
  query: "",
  loading: false,
  ended: false,
  feedKey: 1,
  publishOpen: false,
  extra: [],
  setQuery: (q) => set({ query: q }),
  toggleLike: (id) =>
    set((s) => ({ liked: { ...s.liked, [id]: !s.liked[id] } })),
  loadMore: () => {
    const { loading, loaded, pool, extra } = get();
    if (loading) return;
    const total = extra.length + pool.length;
    if (loaded >= total) {
      set({ ended: true });
      return;
    }
    set({ loading: true });
    // 模拟网络请求的加载动画
    window.setTimeout(() => {
      set((s) => ({
        loading: false,
        loaded: Math.min(s.loaded + PAGE_MORE, extra.length + pool.length),
      }));
    }, 450);
  },
  refresh: () =>
    set((s) => ({
      pool: shuffled(s.pool),
      loaded: PAGE_FIRST,
      ended: false,
      feedKey: s.feedKey + 1,
    })),
  setPublish: (open) => set({ publishOpen: open }),
  publish: (title) => {
    const item: MockItem = {
      id: Date.now(),
      title: title || "我的新笔记",
      author: "我",
      hue: Math.floor(Math.random() * 360),
      likes: 0,
      img: `images/p${String(Math.floor(Math.random() * 48) + 1).padStart(2, "0")}.svg`,
      h: 300 + Math.floor(Math.random() * 5) * 100,
    };
    set((s) => ({ extra: [item, ...s.extra], publishOpen: false, feedKey: s.feedKey + 1 }));
  },
}));

/** 供自动化验证读取状态 */
(window as unknown as Record<string, unknown>).__bbStore = useStore;
