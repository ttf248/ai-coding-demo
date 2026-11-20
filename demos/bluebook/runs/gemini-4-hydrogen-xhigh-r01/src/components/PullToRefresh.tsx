import React, { useRef, useState } from "react";
import { useBluebookStore } from "../store/useBluebookStore";

interface PullToRefreshProps {
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ children }) => {
  const refreshFeed = useBluebookStore((s) => s.refreshFeed);
  const isRefreshing = useBluebookStore((s) => s.isRefreshing);
  const [pullDist, setPullDist] = useState(0);
  const startYRef = useRef<number | null>(null);
  const threshold = 58;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 2 && e.touches.length === 1) {
      startYRef.current = e.touches[0].clientY;
    } else {
      startYRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null || isRefreshing) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0 && window.scrollY <= 2) {
      setPullDist(Math.min(90, delta * 0.48));
    } else {
      setPullDist(0);
    }
  };

  const handleTouchEnd = () => {
    if (pullDist >= threshold && !isRefreshing) {
      void refreshFeed();
    }
    startYRef.current = null;
    setPullDist(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      <div
        className="overflow-hidden flex items-center justify-center text-xs text-neutral-500 transition-all duration-200"
        style={{ height: isRefreshing ? 42 : pullDist }}
      >
        {isRefreshing ? (
          <div className="flex items-center gap-2 text-[#fe2c55] font-medium">
            <span className="w-4 h-4 border-2 border-[#fe2c55] border-t-transparent rounded-full animate-spin" />
            <span>正在为你推荐新笔记...</span>
          </div>
        ) : pullDist > 12 ? (
          <span>{pullDist >= threshold ? "释放立即刷新" : "继续下拉刷新"}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
};
