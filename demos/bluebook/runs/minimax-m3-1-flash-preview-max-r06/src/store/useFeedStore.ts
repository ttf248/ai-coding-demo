import { create } from "zustand";
import { buildPage, TOTAL_ITEMS } from "../mock/data";
import type { Note } from "../types";

interface FeedState {
  notes: Note[];
  liked: Record<string, boolean>;
  page: number;
  status: "idle" | "loading" | "refreshing" | "done" | "error";
  hasMore: boolean;
  /** 第 9 轮：失败原因，供 UI 展示与重试 */
  error: string | null;
  retry: () => void;
  toggleLike: (id: string) => void;
  loadMore: () => void;
  refresh: () => void;
}

export const PAGE_SIZE = 20;

const LS_LIKED = "bluebook-liked";

/** 第 8 轮：点赞状态持久化。读一次写一次，容量超限时退化为清空而不是抛错。 */
function loadLiked(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(LS_LIKED);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}
function saveLiked(liked: Record<string, boolean>) {
  try {
    window.localStorage.setItem(LS_LIKED, JSON.stringify(liked));
  } catch {
    /* 隐私模式或超额时写不进去，忽略即可：点赞仍然在本次会话内生效 */
  }
}

export const useFeedStore = create<FeedState>((set, get) => ({
  notes: [],
  liked: loadLiked(),
  page: 0,
  status: "idle",
  hasMore: true,
  error: null,

  toggleLike: (id) => {
    const liked = { ...get().liked, [id]: !get().liked[id] };
    saveLiked(liked);
    set({ liked });
  },

  loadMore: () => {
    const { status, page, hasMore, notes } = get();
    if (status === "loading" || !hasMore) return;
    set({ status: "loading", error: null });
    // 模拟网络请求，保证首屏与滚动加载都有真实的加载态
    window.setTimeout(() => {
      try {
        const next = buildPage(page);
        /* 第 6 轮：hasMore 由「已加载数 + 本页数」与总数比较得出，
           而不是无条件写 true。原先 refresh() 之后即使已经全部加载完，
           底部仍然显示「继续下滑加载更多」。 */
        const merged = notes.concat(next);
        set({
          notes: merged,
          page: page + 1,
          status: merged.length >= TOTAL_ITEMS ? "done" : "idle",
          hasMore: merged.length < TOTAL_ITEMS,
        });
      } catch (e) {
        /* 第 9 轮：加载失败不再静默——记录原因并进入 error 态，
           UI 会显示可重试的提示，而不是永远停在「加载中…」。 */
        set({ status: "error", error: e instanceof Error ? e.message : String(e) });
      }
    }, 520);
  },

  retry: () => {
    set({ error: null, status: "idle" });
    get().loadMore();
  },

  refresh: () => {
    const { status } = get();
    if (status === "refreshing") return;
    set({ status: "refreshing", error: null });
    window.setTimeout(() => {
      try {
        /* 第 6 轮：批次号保证同一毫秒内连续刷新也不会产生重复 id。
           原先用 Date.now() 拼后缀，两次刷新落在同一毫秒就会撞 id，
           React 复用同一个 key 导致列表不更新。 */
        const batch = `r${(get().page + 1).toString(36)}${Date.now().toString(36)}`;
        const first = buildPage(0).map((n) => ({ ...n, id: `${n.id}-${batch}` }));
        set({ notes: first, page: 1, status: "idle", hasMore: first.length < TOTAL_ITEMS });
      } catch (e) {
        set({ status: "error", error: e instanceof Error ? e.message : String(e) });
      }
    }, 700);
  },
}));
