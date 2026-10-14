import { useRef, useState } from "react";
import SearchBar from "./components/SearchBar";
import Waterfall from "./components/Waterfall";
import PublishModal from "./components/PublishModal";
import { useStore } from "./store";

/** 下拉刷新：滚动顶端继续下拉时出现指示器，释放超过阈值触发刷新（渐入重挂载 feed） */
export default function App() {
  const startY = useRef(-1);
  const pull = useRef(0);
  const [hint, setHint] = useState(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = window.scrollY <= 0 ? e.touches[0].clientY : -1;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current < 0 || window.scrollY > 0) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) return;
    pull.current = Math.min(96, dy * 0.45);
    setHint(pull.current);
  };
  const onTouchEnd = () => {
    if (pull.current > 56) useStore.getState().refresh();
    pull.current = 0;
    setHint(0);
    startY.current = -1;
  };

  return (
    <div
      className="min-h-screen bg-page text-gray-900"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <SearchBar />
      {hint > 8 && (
        <div className="pointer-events-none fixed inset-x-0 top-14 z-20 flex justify-center">
          <span className="rounded-full bg-white/90 px-4 py-2 text-[12px] text-gray-500 shadow backdrop-blur">
            {hint > 56 ? "释放立即刷新" : "下拉刷新"}
          </span>
        </div>
      )}
      <Waterfall />
      <PublishModal />
    </div>
  );
}
