import { useEffect } from "react";
import TopBar from "./components/TopBar";
import Waterfall from "./components/Waterfall";
import PullToRefresh from "./components/PullToRefresh";
import { useFeedStore } from "./store";

export default function App() {
  const init = useFeedStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="min-h-screen bg-page animate-fade-in">
      <TopBar />
      <PullToRefresh>
        <main className="max-w-6xl mx-auto px-3 pt-3 pb-10">
          <Waterfall />
        </main>
      </PullToRefresh>
    </div>
  );
}
