import { create } from "zustand";
import { createFeed, type FeedItem } from "./data";

const PAGE_SIZE = 20;

interface FeedState {
  items: FeedItem[];
  page: number;
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  keyword: string;
  category: string;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  toggleLike: (id: string) => void;
  setKeyword: (keyword: string) => void;
  setCategory: (category: string) => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useFeedStore = create<FeedState>((set, get) => ({
  items: [],
  page: 0,
  loading: false,
  refreshing: false,
  hasMore: true,
  keyword: "",
  category: "全部",

  loadMore: async () => {
    const { loading, hasMore, page } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    await wait(420);
    const next = page + 1;
    set((state) => ({
      items: [...state.items, ...createFeed(next, PAGE_SIZE)],
      page: next,
      loading: false,
      hasMore: next < 12
    }));
  },

  refresh: async () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    await wait(600);
    set((state) => ({
      items: createFeed(state.page + 101, PAGE_SIZE),
      page: state.page + 101,
      refreshing: false,
      loading: false
    }));
  },

  toggleLike: (id: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? Math.max(0, item.likes - 1) : item.likes + 1
            }
          : item
      )
    })),

  setKeyword: (keyword: string) => set({ keyword }),
  setCategory: (category: string) => set({ category })
}));

export const filterItems = (items: FeedItem[], keyword: string, category: string) =>
  items.filter((item) => {
    const matchCategory = category === "全部" || item.category === category;
    const key = keyword.trim();
    const matchKeyword =
      !key || item.title.includes(key) || item.author.includes(key);
    return matchCategory && matchKeyword;
  });
