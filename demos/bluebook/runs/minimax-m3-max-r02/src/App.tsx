import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Waterfall } from "./components/Waterfall";
import { Refresh } from "./components/Icons";

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const startRef = useRef<{ y: number } | null>(null);
  const [pull, setPull] = useState(0);

  useEffect(() => {
    const onStart = (clientY: number) => {
      if (window.scrollY > 0) return;
      startRef.current = { y: clientY };
    };
    const onMove = (clientY: number) => {
      const start = startRef.current;
      if (!start) return;
      const dy = clientY - start.y;
      if (dy > 0) setPull(Math.min(dy, 120));
    };
    const onEnd = () => {
      const start = startRef.current;
      if (!start) return;
      if (pull > 80) {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
          window.location.reload();
        }, 700);
      }
      setPull(0);
      startRef.current = null;
    };

    const touchStart = (e: TouchEvent) => onStart(e.touches[0].clientY);
    const touchMove = (e: TouchEvent) => onMove(e.touches[0].clientY);
    const touchEnd = () => onEnd();

    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: true });
    window.addEventListener("touchend", touchEnd);
    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
    };
  }, [pull]);

  return (
    <div className="min-h-screen bg-canvas animate-fade-in">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex justify-center"
        style={{
          transform: `translateY(${pull - 16}px)`,
          opacity: Math.min(pull / 80, 1),
        }}
      >
        <div className="mt-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs text-neutral-600 shadow-card">
          <Refresh className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "正在刷新…" : "下拉刷新"}
        </div>
      </div>
      <Header />
      <Waterfall />
    </div>
  );
}