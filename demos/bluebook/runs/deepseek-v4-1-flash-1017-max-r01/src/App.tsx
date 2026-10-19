import { useCallback, useRef, useState } from "react";
import type { Post } from "./types";
import { Header } from "./components/Header";
import { Feed } from "./components/Feed";
import { PostModal } from "./components/PostModal";
import { PublishModal } from "./components/PublishModal";

export default function App() {
  const [publishOpen, setPublishOpen] = useState(false);
  const [detail, setDetail] = useState<Post | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  }, []);

  return (
    <div className="min-h-screen bg-canvas">
      <Header onPublish={() => setPublishOpen(true)} />
      <main>
        <Feed onOpen={setDetail} />
      </main>

      <footer className="border-t border-black/[0.04] bg-white/60">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-1.5 px-4 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] font-semibold text-neutral-500">
            小蓝书 <span className="mx-1 font-normal text-neutral-300">·</span>
            <span className="font-normal text-neutral-400">把生活里的小小闪光认真收藏</span>
          </p>
          <p className="text-[10px] text-neutral-400">
            React 18 · TypeScript · Zustand · react-lazyload ｜ 数据为本地 mock
          </p>
        </div>
      </footer>

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublished={() => {
          showToast("笔记发布成功");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      <PostModal post={detail} onClose={() => setDetail(null)} />

      <div
        className={`pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-neutral-900/85 px-4 py-2 text-[12px] font-medium text-white shadow-lg backdrop-blur transition duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </div>
  );
}
