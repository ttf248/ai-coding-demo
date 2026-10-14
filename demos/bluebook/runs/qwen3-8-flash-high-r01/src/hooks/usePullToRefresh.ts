import { useCallback, useEffect, useRef, useState } from "react";

const THRESHOLD = 64;
const MAX_PULL = 96;

/** 移动端下拉刷新：仅在页面顶部开始下拉并超过阈值时触发 */
export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const [pull, setPull] = useState(0);
  const pullRef = useRef(0);
  const startY = useRef<number | null>(null);
  const refreshing = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    try {
      await onRefresh();
    } finally {
      refreshing.current = false;
    }
  }, [onRefresh]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      startY.current =
        window.scrollY <= 0 && !refreshing.current
          ? e.touches[0].clientY
          : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) {
        startY.current = null;
        pullRef.current = 0;
        setPull(0);
        return;
      }
      if (window.scrollY <= 0) {
        const p = Math.min(dy * 0.5, MAX_PULL);
        pullRef.current = p;
        setPull(p);
        if (e.cancelable) e.preventDefault();
      }
    };
    const onTouchEnd = () => {
      startY.current = null;
      const reached = pullRef.current >= THRESHOLD;
      pullRef.current = 0;
      setPull(0);
      if (reached) void refresh();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [refresh]);

  return { pull, threshold: THRESHOLD, refresh };
}
