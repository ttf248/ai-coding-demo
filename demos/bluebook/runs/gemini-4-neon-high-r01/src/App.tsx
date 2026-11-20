import React, { useMemo, useRef, useState } from "react";
import { MasonryGrid } from "./components/MasonryGrid";
import { NoteDetailModal, PublishModal } from "./components/Modals";
import { TopBar } from "./components/TopBar";
import { CATEGORIES } from "./data/mockNotes";
import { useFeedStore } from "./store/useFeedStore";

export function App() {
  const {
    notes,
    searchQuery,
    activeCategory,
    setActiveCategory,
    refreshFeed,
    refreshing,
  } = useFeedStore();

  // Pull-to-refresh touch state
  const [pullDist, setPullDist] = useState(0);
  const startYRef = useRef<number | null>(null);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes.filter((n) => {
      const catOk = activeCategory === "推荐" || n.category === activeCategory;
      const queryOk =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.author.name.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q));
      return catOk && queryOk;
    });
  }, [notes, searchQuery, activeCategory]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 2) {
      startYRef.current = e.touches[0].clientY;
    } else {
      startYRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startYRef.current === null || refreshing) return;
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy > 0) {
      setPullDist(Math.min(82, dy * 0.55));
    }
  };

  const handleTouchEnd = () => {
    if (pullDist >= 56) {
      refreshFeed();
    }
    setPullDist(0);
    startYRef.current = null;
  };

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <TopBar />

      {/* Category Switch Bar */}
      <nav className="bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm transition-all ${
                  active
                    ? "bg-[#fe2c55]/10 text-[#fe2c55] font-bold"
                    : "text-slate-600 hover:bg-slate-100 font-medium"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Pull-to-refresh Indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-150 text-xs text-slate-500"
        style={{ height: refreshing ? 42 : pullDist }}
      >
        {refreshing ? (
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#fe2c55] border-t-transparent animate-spin" />
            <span>正在刷新推荐内容...</span>
          </div>
        ) : pullDist > 12 ? (
          <span>{pullDist >= 56 ? "松开立即刷新" : "继续下拉刷新"}</span>
        ) : null}
      </div>

      {/* Main Waterfall Area (keyed by category for smooth fade-in transition) */}
      <main
        key={activeCategory}
        className="max-w-7xl w-full mx-auto px-2.5 sm:px-5 pt-3 pb-10 animate-fade-in"
      >
        <MasonryGrid notes={filteredNotes} />
      </main>

      <NoteDetailModal />
      <PublishModal />
    </div>
  );
}

export default App;
