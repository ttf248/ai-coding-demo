import { useEffect } from "react";
import { Header } from "./components/Header";
import { MasonryFeed } from "./components/MasonryFeed";
import { useFeedStore } from "./store/useFeedStore";

export default function App() {
  const toast = useFeedStore((s) => s.toast);
  const clearToast = useFeedStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(clearToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <MasonryFeed />
      {toast && (
        <div
          role="status"
          className="fixed bottom-8 left-1/2 z-40 -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2 text-[12px] text-white shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
