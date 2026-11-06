import { useEffect, useRef, useState } from "react";
import { useFeed } from "../store";

/** 移动端下拉刷新：滚动到顶后继续下拉出现指示器，松手触发刷新 */
export default function PullToRefresh({
  children,
}: {
  children: React.ReactNode;
}) {
  const refresh = useFeed((s) => s.refresh);
  const [pull, setPull] = useState(0);
  const [armed, setArmed] = useState(false);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);
  pullRef.current = pull;

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (window.scrollY <= 0) {
        startY.current = e.touches[0].clientY;
        setArmed(true);
      }
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const d = e.touches[0].clientY - startY.current;
      if (d > 0) {
        setPull(Math.min(90, d * 0.45));
        if (d * 0.45 > 60) e.preventDefault();
      }
    };
    const onEnd = () => {
      if (pullRef.current > 60) refresh();
      setPull(0);
      startY.current = null;
      setArmed(false);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [refresh]);

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex justify-center"
        style={{
          transform: `translateY(${pull - 40}px)`,
          opacity: armed ? Math.min(1, pull / 60) : 0,
          transition: startY.current === null ? "transform .25s, opacity .25s" : "none",
        }}
      >
        <div className="rounded-full bg-white px-3 py-1.5 text-xs text-slate-500 shadow-md">
          {pull > 60 ? "释放刷新" : "下拉刷新"}
          <span className="ml-1 inline-block" style={{ transform: `rotate(${pull * 4}deg)` }}>
            ↓
          </span>
        </div>
      </div>
      {children}
    </>
  );
}
