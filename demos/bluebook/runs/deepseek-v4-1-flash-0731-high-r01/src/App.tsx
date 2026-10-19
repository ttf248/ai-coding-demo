import { useEffect, useState } from "react";
import { TopBar } from "./components/TopBar";
import { MasonryGrid } from "./components/MasonryGrid";
import { useFeedStore } from "./store/useFeedStore";

/** 页面整体渐入 */
function usePageFadeIn() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready;
}

export default function App() {
  const ready = usePageFadeIn();
  const refresh = useFeedStore((s) => s.refresh);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  function handleSearch(keyword: string) {
    setToast(keyword ? "搜索：" + keyword : "已回到推荐");
    if (!keyword) void refresh();
  }

  return (
    <div
      className={
        "min-h-screen transition-opacity duration-500 " +
        (ready ? "opacity-100" : "opacity-0")
      }
    >
      <TopBar onSearch={handleSearch} onPublish={() => setToast("发布入口（原型）")} />
      <MasonryGrid />

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center">
          <span className="animate-fade-in rounded-full bg-neutral-900/85 px-4 py-2 text-[12px] text-white shadow-lg">
            {toast}
          </span>
        </div>
      )}
    </div>
  );
}
