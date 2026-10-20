import { useEffect } from "react";
import TopBar from "./components/TopBar";
import MasonryGrid from "./components/MasonryGrid";
import PullToRefresh from "./components/PullToRefresh";
import { useFeedStore } from "./store";

export default function App() {
  const loadMore = useFeedStore((state) => state.loadMore);
  const items = useFeedStore((state) => state.items);

  // 首屏加载 20 条
  useEffect(() => {
    if (!items.length) void loadMore();
  }, [items.length, loadMore]);

  return (
    <div className="min-h-screen animate-fade-in">
      <TopBar />
      <PullToRefresh>
        <MasonryGrid />
      </PullToRefresh>
    </div>
  );
}
