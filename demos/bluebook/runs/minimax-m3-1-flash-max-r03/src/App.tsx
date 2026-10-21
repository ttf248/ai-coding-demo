import { useCallback, useEffect, useRef, useState } from "react";
import Feed from "./components/Feed";
import SearchBar from "./components/SearchBar";
import { useFeedStore } from "./store";

const BASE = import.meta.env.BASE_URL;

export default function App() {
  const query = useFeedStore((state) => state.query);
  const setQuery = useFeedStore((state) => state.setQuery);
  const refresh = useFeedStore((state) => state.refresh);
  const refreshing = useFeedStore((state) => state.refreshing);

  const [pull, setPull] = useState(0);
  const startY = useRef(0);
  const pulling = useRef(false);

  const onTouchStart = useCallback((event: TouchEvent) => {
    if (window.scrollY <= 0 && event.touches.length === 1) {
      startY.current = event.touches[0].clientY;
      pulling.current = true;
    }
  }, []);

  const onTouchMove = useCallback((event: TouchEvent) => {
    if (!pulling.current || window.scrollY > 0) return;
    const delta = event.touches[0].clientY - startY.current;
    if (delta > 0) {
      if (event.cancelable) event.preventDefault();
      setPull(Math.min(delta * 0.45, 110));
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pull > 70) {
      refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setPull(0);
  }, [pull, refresh]);

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  return (
    <div className="page-enter min-h-screen bg-canvas pb-10">
      <SearchBar value={query} onChange={setQuery} />

      <div
        className="pointer-events-none flex justify-center overflow-hidden"
        style={{ height: pull > 0 ? 56 : 0 }}
      >
        <div
          className="mt-2 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-neutral-500 shadow-card"
          style={{ transform: `translateY(${pull / 2 - 28}px)` }}
        >
          <svg
            aria-hidden="true"
            className={`h-4 w-4 text-brand ${refreshing ? "animate-spin-slow" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M12 4v12" strokeLinecap="round" />
            <path d="m6.5 11.5 5.5 5.5 5.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {refreshing ? "正在刷新" : pull > 70 ? "松开刷新" : "下拉刷新"}
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-3 sm:px-6">
        <Feed base={BASE} />
      </main>
    </div>
  );
}
