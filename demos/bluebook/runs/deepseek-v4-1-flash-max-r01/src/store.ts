import { create } from "zustand";
import { makePosts, type Post } from "./data/mock";

interface FeedState {
  posts: Post[];
  page: number;
  loading: boolean;
  refreshing: boolean;
  /** 首次加载：20 条 */
  init: () => void;
  /** 滚动到底部加载更多：每次 20 条 */
  loadMore: () => void;
  /** 下拉刷新：重新拉取最新数据 */
  refresh: () => void;
  toggleLike: (id: number) => void;
}

const PAGE_SIZE = 20;
let seedCursor = 1000;

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  page: 0,
  loading: false,
  refreshing: false,

  init: () => {
    if (get().posts.length > 0 || get().loading) return;
    set({ loading: true });
    // 模拟首屏请求
    window.setTimeout(() => {
      seedCursor = 1000 + Math.floor(Math.random() * 500) * 20;
      set({ posts: makePosts(seedCursor, PAGE_SIZE), page: 1, loading: false });
    }, 420);
  },

  loadMore: () => {
    const { loading, refreshing, posts, page } = get();
    if (loading || refreshing) return;
    set({ loading: true });
    window.setTimeout(() => {
      const next = makePosts(seedCursor + page * PAGE_SIZE, PAGE_SIZE);
      set({ posts: posts.concat(next), page: page + 1, loading: false });
    }, 460);
  },

  refresh: () => {
    const { refreshing } = get();
    if (refreshing) return;
    set({ refreshing: true });
    window.setTimeout(() => {
      seedCursor += 7000; // 刷新后视为最新一页内容
      set({ posts: makePosts(seedCursor, PAGE_SIZE), page: 1, refreshing: false });
    }, 620);
  },

  toggleLike: (id) =>
    set({
      posts: get().posts.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p,
      ),
    }),
}));

// 自动化验证用的只读入口
declare global {
  interface Window {
    __bb?: typeof useFeedStore;
  }
}
if (typeof window !== "undefined") window.__bb = useFeedStore;
