import { create } from "zustand";
import { MockPost, fetchPosts } from "../data/mock";

const PAGE_SIZE = 20;
const MAX_PAGES = 10;

export interface FeedState {
  posts: MockPost[];
  page: number;
  seed: number;
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  likedIds: Record<string, true>;
  keyword: string;
  fadeKey: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleLike: (id: string) => void;
  addPost: (post: MockPost) => void;
  setKeyword: (keyword: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  page: 0,
  seed: Math.floor(Math.random() * 1000),
  loading: false,
  refreshing: false,
  hasMore: true,
  likedIds: {},
  keyword: "",
  fadeKey: 0,

  async loadMore() {
    const { loading, refreshing, hasMore, page, seed } = get();
    if (loading || refreshing || !hasMore) return;
    if (page >= MAX_PAGES) {
      set({ hasMore: false });
      return;
    }
    set({ loading: true });
    const next = await fetchPosts(page, seed, PAGE_SIZE);
    set((s) => ({
      posts: s.posts.concat(next),
      page: s.page + 1,
      loading: false,
    }));
  },

  async refresh() {
    if (get().refreshing) return;
    set({ refreshing: true });
    const seed = Math.floor(Math.random() * 1000);
    const first = await fetchPosts(0, seed, PAGE_SIZE);
    set((s) => ({
      posts: first,
      page: 1,
      seed,
      hasMore: true,
      likedIds: {},
      refreshing: false,
      fadeKey: s.fadeKey + 1,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  toggleLike(id) {
    set((s) => {
      const likedIds = { ...s.likedIds };
      if (likedIds[id]) delete likedIds[id];
      else likedIds[id] = true;
      return { likedIds };
    });
  },

  addPost(post) {
    set((s) => ({ posts: [post, ...s.posts], fadeKey: s.fadeKey + 1 }));
  },

  setKeyword(keyword) {
    set((s) => ({ keyword, fadeKey: s.fadeKey + 1 }));
  },
}));

export function selectVisiblePosts(state: FeedState): MockPost[] {
  const kw = state.keyword.trim().toLowerCase();
  if (!kw) return state.posts;
  return state.posts.filter(
    (p) =>
      p.title.toLowerCase().includes(kw) ||
      p.author.toLowerCase().includes(kw) ||
      p.tags.some((t) => t.toLowerCase().includes(kw)),
  );
}
