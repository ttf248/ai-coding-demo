import { useCallback, useEffect, useRef, useState } from "react";
import { useFeedStore } from "../store/useFeedStore";
import { ChevronDownIcon, Spinner } from "./Icons";

const TRIGGER = 72;
/** 阻尼系数：手指拉 200px 只下移 80px，避免下拉过度 */
const DAMPING = 0.42;
const MAX_PULL = 96;

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const refresh = useFeedStore((s) => s.refresh);
  const status = useFeedStore((s) => s.status);
  const refreshing = status === "refreshing";

  const startY = useRef(0);
  const pulling = useRef(false);
  const [pull, setPull] = useState(0);

  const reset = useCallback(() => {
    pulling.current = false;
    setPull(0);
  }, []);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (refreshing) return;
      if (window.scrollY > 0) return;
      startY.current = e.touches[0].clientY;
      pulling.current = false;
    };

    const onMove = (e: TouchEvent) => {
      if (refreshing) return;
      const dy = e.touches[0].clientY - startY.current;
      // 只在页面顶部且手指继续向下拉时才接管，否则交还给浏览器滚动
      if (dy <= 0 || window.scrollY > 0) {
        if (pulling.current) reset();
        return;
      }
      pulling.current = true;
      const next = Math.min(MAX_PULL, dy * DAMPING);
      setPull(next);
      // 已经判定为下拉刷新手势，需要阻止默认行为才不会跟着滚
      if (e.cancelable) e.preventDefault();
    };

    const onEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      setPull((current) => {
        if (current >= TRIGGER * DAMPING) refresh();
        return 0;
      });
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [refreshing, refresh, reset]);

  const armed = pull >= TRIGGER * DAMPING;
  const offset = refreshing ? MAX_PULL : pull;

  return (
    <div
      id="top"
      style={{ transform: `translateY(${offset}px)`, transition: pulling.current ? "none" : undefined }}
      className={pulling.current ? "" : "transition-transform duration-200 ease-spring"}
    >
      <div
        aria-hidden={offset < 1}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center overflow-hidden"
        style={{ height: MAX_PULL }}
      >
        <div
          className="flex items-center gap-2 text-[12px] font-medium"
          style={{ opacity: Math.min(1, offset / (TRIGGER * DAMPING)) }}
        >
          {refreshing ? (
            <>
              <Spinner className="h-4 w-4 animate-spin-slow text-brand" />
              <span className="text-neutral-500">正在刷新…</span>
            </>
          ) : (
            <>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-150 ${
                  armed ? "rotate-180 text-brand" : "text-neutral-400"
                }`}
              />
              <span className={armed ? "text-brand" : "text-neutral-400"}>
                {armed ? "松开立即刷新" : "下拉刷新"}
              </span>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
