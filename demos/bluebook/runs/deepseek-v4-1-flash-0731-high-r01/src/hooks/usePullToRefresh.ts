import { useCallback, useEffect, useRef, useState } from "react";

const THRESHOLD = 68;
const MAX_PULL = 110;

/**
 * 下拉刷新：只响应「滚动到顶部后继续向下拖」的手势，鼠标与触摸同样可用。
 */
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (window.scrollY > 0) return;
    startY.current = e.clientY;
    pulling.current = true;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pulling.current || startY.current === null) return;
    const delta = e.clientY - startY.current;
    if (delta <= 0) {
      setPull(0);
      return;
    }
    // 阻尼：越拉越沉
    const damped = Math.min(MAX_PULL, delta * 0.55);
    setPull(damped);
    if (damped > 8 && e.cancelable) e.preventDefault();
  }, []);

  const finish = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    startY.current = null;
    if (pull < THRESHOLD) {
      setPull(0);
      return;
    }
    setRefreshing(true);
    setPull(THRESHOLD);
    await onRefresh();
    setRefreshing(false);
    setPull(0);
  }, [onRefresh, pull]);

  useEffect(() => {
    const onUp = () => {
      void finish();
    };
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [finish]);

  return {
    pull,
    refreshing,
    threshold: THRESHOLD,
    handlers: { onPointerDown, onPointerMove },
  };
}
