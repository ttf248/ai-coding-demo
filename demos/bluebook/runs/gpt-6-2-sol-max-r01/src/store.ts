import { create } from "zustand";
import { posts, type Category, type Post } from "./data";

const batchSize = 20;
type Loading = "more" | "refresh" | null;
interface Feed {
  entries: Post[];
  likes: Record<string, boolean>;
  category: Category;
  keyword: string;
  limit: number;
  loading: Loading;
  setCategory: (category: Category) => void;
  setKeyword: (keyword: string) => void;
  toggleLike: (id: string) => void;
  loadMore: () => void;
  refresh: () => void;
  publish: (post: Post) => void;
}

export function matching({ entries, category, keyword }: Feed) {
  const query = keyword.trim().toLocaleLowerCase();
  return entries.filter(
    (post) =>
      (category === "全部" || post.category === category) &&
      (!query ||
        [post.title, post.author, post.category].some((value) =>
          value.toLocaleLowerCase().includes(query),
        )),
  );
}

let revision = 0;
export const useFeed = create<Feed>((set, get) => ({
  entries: posts,
  likes: {},
  category: "全部",
  keyword: "",
  limit: batchSize,
  loading: null,
  setCategory: (category) => {
    revision++;
    set({ category, limit: batchSize, loading: null });
  },
  setKeyword: (keyword) => {
    revision++;
    set({ keyword, limit: batchSize, loading: null });
  },
  toggleLike: (id) =>
    set((state) => ({ likes: { ...state.likes, [id]: !state.likes[id] } })),
  loadMore: () => {
    const state = get();
    if (state.loading || matching(state).length <= state.limit) return;
    const request = ++revision;
    set({ loading: "more" });
    window.setTimeout(() => {
      if (request === revision)
        set((latest) => ({ limit: latest.limit + batchSize, loading: null }));
    }, 560);
  },
  refresh: () => {
    if (get().loading === "refresh") return;
    const request = ++revision;
    set({ loading: "refresh" });
    window.setTimeout(() => {
      if (request !== revision) return;
      const custom = get().entries.filter((entry) =>
        entry.id.startsWith("local-"),
      );
      const entries = get().entries.filter(
        (entry) => !entry.id.startsWith("local-"),
      );
      set({
        entries: [...custom, ...entries.slice(5), ...entries.slice(0, 5)],
        limit: batchSize,
        loading: null,
      });
    }, 650);
  },
  publish: (post) => {
    revision++;
    set((state) => ({
      entries: [post, ...state.entries],
      category: "全部",
      keyword: "",
      limit: batchSize,
      loading: null,
    }));
  },
}));
