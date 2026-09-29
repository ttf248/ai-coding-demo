import { useEffect, useRef, useState } from "react";

const THRESHOLD = 72;

/** 下拉刷新：仅在页面已滚动到顶部时生效，回弹使用 transform 过渡。 */
export function usePullToRefresh(onRefresh: () => void) {
  const [offset, setOffset] = useState(0);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);

  useEffect(() => {
    const onTouchStart = (event: TouchEvent) => {
      if (window.scrollY > 0 || startY.current !== null) return;
      startY.current = event.touches[0].clientY;
      pulling.current = true;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!pulling.current || startY.current === null) return;
      const distance = event.touches[0].clientY - startY.current;
      if (distance <= 0) {
        setOffset(0);
        return;
      }
      // 阻尼，避免下拉距离跟手过猛
      setOffset(Math.min(distance * 0.45, 110));
    };

    const onTouchEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      startY.current = null;
      const shouldRefresh = offset >= THRESHOLD;
      setOffset(0);
      if (shouldRefresh) onRefresh();
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [offset, onRefresh]);

  const progress = Math.min(offset / THRESHOLD, 1);
  return {
    offset,
    progress,
    armed: offset >= THRESHOLD,
  };
}
