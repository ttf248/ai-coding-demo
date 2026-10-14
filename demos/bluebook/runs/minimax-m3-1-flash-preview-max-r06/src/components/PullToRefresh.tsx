import { useEffect, useRef, useState } from "react";

const MAX = 76;

/** 下拉刷新：顶部下拉超过阈值后松手触发 */
export default function PullToRefresh({
  onRefresh,
  refreshing,
  children,
}: {
  onRefresh: () => void;
  refreshing: boolean;
  children: React.ReactNode;
}) {
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  const armed = useRef(false);

  useEffect(() => {
    const el = document.querySelector("[data-scroll-root]") as HTMLElement | null;
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      if (refreshing) return;
      startY.current = e.touches[0].clientY;
      armed.current = false;
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (el.scrollTop <= 0 && dy > 0) {
        e.preventDefault();
        const d = Math.min(MAX, dy * 0.45);
        setPull(d);
        armed.current = d >= MAX;
      } else if (dy <= 0) {
        setPull(0);
      }
    };
    const onEnd = () => {
      if (armed.current && !refreshing) onRefresh();
      armed.current = false;
      startY.current = null;
      setPull(0);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [onRefresh, refreshing]);

  return (
    <div className="relative flex-1 flex flex-col min-h-0" style={{ paddingTop: pull }}>
      <div
        className="absolute left-0 right-0 top-0 grid place-items-center pointer-events-none pull-indicator"
        style={{ height: pull, opacity: pull > 12 ? 1 : 0 }}
      >
        <div className="w-7 h-7 rounded-full bg-white shadow grid place-items-center">
          {refreshing ? (
            <span className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin360" />
          ) : (
            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 text-[#8a8a8a] transition-transform ${pull >= MAX ? "rotate-180 text-brand" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
