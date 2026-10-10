import { useEffect, useRef, type RefObject } from 'react';

/**
 * Calls `onReach` whenever the sentinel element comes within `margin` px of the viewport bottom.
 * The observer is re-created when `deps` change so a still-visible sentinel triggers again after new content renders.
 */
export function useInfiniteScroll(sentinel: RefObject<HTMLElement | null>, onReach: () => void, enabled: boolean, deps: unknown[], margin = 600) {
  const callback = useRef(onReach);
  callback.current = onReach;
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) callback.current();
    }, { rootMargin: `0px 0px ${margin}px 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, margin, ...deps]);
}
