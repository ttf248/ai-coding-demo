import { useEffect, useRef } from "react";
import { useFeedStore } from "../store";

/**
 * 下拉刷新容器：移动端在页面顶部继续下拉时触发刷新，
 * 桌面端鼠标按住页面顶部同样可以触发。
 */
export default function PullToRefresh({
  children
}: {
  children: React.ReactNode;
}) {
  const refresh = useFeedStore((state) => state.refresh);
  const refreshing = useFeedStore((state) => state.refreshing);
  const startY = useRef<number | null>(null);
  const offset = useRef(0);

  useEffect(() => {
    const onTouchStart = (event: TouchEvent) => {
      if (window.scrollY <= 0 && !refreshing) {
        startY.current = event.touches[0].clientY;
      }
    };
    const onTouchMove = (event: TouchEvent) => {
      if (startY.current === null) return;
      const distance = event.touches[0].clientY - startY.current;
      if (distance > 0) {
        offset.current = Math.min(distance * 0.45, 96);
      }
    };
    const onTouchEnd = () => {
      if (startY.current !== null && offset.current > 56) {
        void refresh();
      }
      startY.current = null;
      offset.current = 0;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [refresh, refreshing]);

  return (
    <div className="relative">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 flex justify-center transition-opacity duration-200 ${
          refreshing ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: `translateY(${refreshing ? 8 : 0}px)` }}
      >
        <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-card">
          <span className="h-3 w-3 animate-spin-slow rounded-full border-2 border-brand border-t-transparent" />
          正在刷新
        </span>
      </div>
      {children}
    </div>
  );
}
