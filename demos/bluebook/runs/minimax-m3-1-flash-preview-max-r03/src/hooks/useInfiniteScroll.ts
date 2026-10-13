import { useEffect, useRef } from "react";
import { useFeedStore } from "../store/useFeedStore";

export default function useInfiniteScroll() {
  const sentinel = useRef<HTMLDivElement | null>(null);
  const loadMore = useFeedStore((s) => s.loadMore);
  const status = useFeedStore((s) => s.status);
  const keyword = useFeedStore((s) => s.keyword);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || keyword) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "500px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, keyword, status]);

  return sentinel;
}
