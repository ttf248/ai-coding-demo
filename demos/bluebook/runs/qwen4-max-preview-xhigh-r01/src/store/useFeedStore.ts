import { create } from "zustand";
import { ALL_NOTES, PAGE_SIZE, type Note } from "../data/mock";

interface FeedState {
  order: number[];
  visibleCount: number;
  liked: Record<number, boolean>;
  likeDelta: Record<number, number>;
  loading: boolean;
  refreshing: boolean;
  query: string;
  refreshSeed: number;
  loadMore: () => void;
  refresh: () => Promise<void>;
  toggleLike: (id: number) => void;
  setQuery: (q: string) => void;
}

function shuffled(seed: number): number[] {
  const arr = ALL_NOTES.map((n) => n.id);
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  order: ALL_NOTES.map((n) => n.id),
  visibleCount: PAGE_SIZE,
  liked: {},
  likeDelta: {},
  loading: false,
  refreshing: false,
  query: "",
  refreshSeed: 1,
  loadMore: () => {
    const { loading, visibleCount, order } = get();
    if (loading || visibleCount >= order.length) return;
    set({ loading: true });
    setTimeout(() => {
      set((st) => ({
        visibleCount: Math.min(st.visibleCount + PAGE_SIZE, st.order.length),
        loading: false,
      }));
    }, 600);
  },
  refresh: async () => {
    if (get().refreshing) return;
    set({ refreshing: true });
    await new Promise((r) => setTimeout(r, 700));
    const seed = get().refreshSeed + 1;
    set({
      order: shuffled(seed * 7919),
      visibleCount: PAGE_SIZE,
      refreshing: false,
      refreshSeed: seed,
    });
  },
  toggleLike: (id) =>
    set((st) => {
      const liked = { ...st.liked, [id]: !st.liked[id] };
      const likeDelta = { ...st.likeDelta, [id]: (st.likeDelta[id] ?? 0) + (liked[id] ? 1 : -1) };
      return { liked, likeDelta };
    }),
  setQuery: (q) => set({ query: q, visibleCount: PAGE_SIZE }),
}));

export function selectVisibleNotes(st: FeedState): Note[] {
  const byId = new Map(ALL_NOTES.map((n) => [n.id, n]));
  const q = st.query.trim().toLowerCase();
  const ids = st.order.filter((id) => {
    if (!q) return true;
    const n = byId.get(id)!;
    return n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q);
  });
  return ids.slice(0, st.visibleCount).map((id) => byId.get(id)!);
}

export function selectHasMore(st: FeedState): boolean {
  const q = st.query.trim().toLowerCase();
  const total = q
    ? ALL_NOTES.filter((n) => n.title.toLowerCase().includes(q) || n.author.toLowerCase().includes(q)).length
    : st.order.length;
  return st.visibleCount < total;
}