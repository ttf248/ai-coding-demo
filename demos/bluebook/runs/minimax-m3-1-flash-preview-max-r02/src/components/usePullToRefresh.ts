import { useEffect, useRef, useState } from "react";

const TRIGGER = 70;

/** 下拉刷新：页面在顶部时向上无效、向下拖拽才生效，松手超过阈值即刷新。 */
export function usePullToRefresh(onRefresh: () => void) {
  const [pull, setPull] = useState(0);
  const origin = useRef<number | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    const down = (event: TouchEvent) => {
      if (window.scrollY > 2 || origin.current !== null) return;
      origin.current = event.touches[0].clientY;
      busy.current = true;
    };
    const move = (event: TouchEvent) => {
      if (!busy.current || origin.current === null) return;
      const delta = event.touches[0].clientY - origin.current;
      setPull(delta > 0 ? Math.min(delta * 0.42, 108) : 0);
    };
    const up = () => {
      if (!busy.current) return;
      busy.current = false;
      origin.current = null;
      const hit = pull >= TRIGGER;
      setPull(0);
      if (hit) onRefresh();
    };
    window.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);
    window.addEventListener("touchcancel", up);
    return () => {
      window.removeEventListener("touchstart", down);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchcancel", up);
    };
  }, [pull, onRefresh]);

  return { pull, ready: pull >= TRIGGER, ratio: Math.min(pull / TRIGGER, 1) };
}
