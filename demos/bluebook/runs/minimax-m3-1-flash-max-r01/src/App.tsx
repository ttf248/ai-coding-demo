import { useEffect, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import Waterfall from "./components/Waterfall";
import PublishModal from "./components/PublishModal";
import { useStore } from "./store/useStore";

const PULL_THRESHOLD = 72;

export default function App() {
  const notes = useStore((s) => s.notes);
  const loading = useStore((s) => s.loading);
  const refreshing = useStore((s) => s.refreshing);
  const loadMore = useStore((s) => s.loadMore);
  const refresh = useStore((s) => s.refresh);
  const publishOpen = useStore((s) => s.publishOpen);
  const setPublishOpen = useStore((s) => s.setPublishOpen);

  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const pulling = useRef(false);

  /* 首次加载 20 条 */
  useEffect(() => {
    if (notes.length === 0) loadMore();
  }, [notes.length, loadMore]);

  /* 下拉刷新：触摸端在顶部继续下拉时触发 */
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0) {
        pulling.current = true;
        startY.current = e.touches[0].clientY;
      } else {
        pulling.current = false;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return;
      const distance = e.touches[0].clientY - startY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, PULL_THRESHOLD * 1.6));
      }
    };
    const onTouchEnd = () => {
      if (pulling.current && pullDistance >= PULL_THRESHOLD) {
        refresh();
      }
      pulling.current = false;
      setPullDistance(0);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pullDistance, refresh]);

  return (
    <div className="min-h-full bg-canvas">
      <TopBar onPublish={() => setPublishOpen(true)} />

      {/* 下拉刷新指示器 */}
      <div
        className="pointer-events-none flex justify-center overflow-hidden"
        style={{ height: pullDistance }}
      >
        <div
          className="pull-indicator mt-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary shadow"
          style={{
            transform: `rotate(${(pullDistance / PULL_THRESHOLD) * 180}deg)`,
          }}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {refreshing && (
        <div className="flex items-center justify-center gap-2 py-2 text-[13px] text-[#8a8f99]">
          <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-primary/30 border-t-primary" />
          <span>正在刷新…</span>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-3 py-3 sm:px-4">
        <div key={notes.length === 0 ? "empty" : "list"} className="animate-fade-in">
          <Waterfall />
        </div>
        {loading && notes.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-[#8a8f99]">
            <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-primary/30 border-t-primary" />
            <span>正在加载…</span>
          </div>
        )}
      </main>

      <PublishModal open={publishOpen} onClose={() => setPublishOpen(false)} />
    </div>
  );
}
