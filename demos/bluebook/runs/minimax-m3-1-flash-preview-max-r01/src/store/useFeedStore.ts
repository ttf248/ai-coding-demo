import { create } from "zustand";
import type { Note } from "../types";
import { DATASET_SIZE, PAGE_SIZE, page, refreshOffset, searchNotes } from "../data/mock";

export type FeedStatus = "idle" | "loading" | "refreshing" | "done";

interface FeedState {
  notes: Note[];
  /** 已消费到的位置，搜索时不参与 */
  offset: number;
  status: FeedStatus;
  keyword: string;
  liked: Record<string, boolean>;
  /** 每次下拉刷新 +1，用来错开 mock 数据起点 */
  refreshRound: number;
  /** 内容版本号，切换时用来重新触发渐入动画 */
  epoch: number;

  loadMore: () => void;
  refresh: () => void;
  setKeyword: (keyword: string) => void;
  toggleLike: (id: string) => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

function clearTimer() {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

export const useFeedStore = create<FeedState>((set, get) => ({
  notes: page(0),
  offset: PAGE_SIZE,
  status: "idle",
  keyword: "",
  liked: {},
  refreshRound: 0,
  epoch: 0,

  loadMore: () => {
    const { status, keyword, offset } = get();
    if (keyword) return;
    if (status === "loading") return;
    if (offset >= DATASET_SIZE) {
      set({ status: "done" });
      return;
    }
    set({ status: "loading" });
    clearTimer();
    timer = setTimeout(() => {
      const next = offset + PAGE_SIZE;
      set((state) => ({
        notes: [...state.notes, ...page(state.offset)],
        offset: next,
        status: next >= DATASET_SIZE ? "done" : "idle",
      }));
      timer = null;
    }, 650);
  },

  refresh: () => {
    if (get().status === "refreshing") return;
    set({ status: "refreshing" });
    clearTimer();
    timer = setTimeout(() => {
      set((state) => {
        const round = state.refreshRound + 1;
        const start = refreshOffset(round);
        return {
          notes: page(start),
          offset: Math.min(start + PAGE_SIZE, DATASET_SIZE),
          status: "idle",
          refreshRound: round,
          epoch: state.epoch + 1,
        };
      });
      timer = null;
    }, 700);
  },

  setKeyword: (keyword) => {
    clearTimer();
    set((state) => ({
      keyword,
      notes: keyword ? searchNotes(keyword) : page(0),
      offset: PAGE_SIZE,
      status: "idle",
      epoch: state.epoch + 1,
    }));
  },

  toggleLike: (id) =>
    set((state) => ({
      liked: { ...state.liked, [id]: !state.liked[id] },
    })),
}));

/** 选中状态下有赞的原始数字 +1，无赞则 -1 */
export function useLikeCount(note: Note) {
  const liked = useFeedStore((s) => Boolean(s.liked[note.id]));
  return liked ? note.likes + 1 : note.likes;
}
