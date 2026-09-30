import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makePosts, type Post } from "./mock";
type State = {
  posts: Post[];
  likes: string[];
  toggleLike: (id: string) => void;
  publish: (post: Post) => void;
  refresh: () => void;
};
export const useFeed = create<State>()(
  persist(
    (set) => ({
      posts: makePosts(),
      likes: [],
      toggleLike: (id) =>
        set((s) => ({
          likes: s.likes.includes(id)
            ? s.likes.filter((x) => x !== id)
            : [...s.likes, id],
        })),
      publish: (post) => set((s) => ({ posts: [post, ...s.posts] })),
      refresh: () =>
        set((s) => ({ posts: [...s.posts.slice(8), ...s.posts.slice(0, 8)] })),
    }),
    { name: "bluebook-likes-v1", partialize: (s) => ({ likes: s.likes }) },
  ),
);
