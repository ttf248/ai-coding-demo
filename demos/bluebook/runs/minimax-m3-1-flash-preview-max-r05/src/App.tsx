import { useCallback, useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import PullToRefresh from "./components/PullToRefresh";
import Waterfall from "./components/Waterfall";
import { TABS } from "./mock/data";
import { useFeedStore } from "./store/useFeedStore";

export default function App() {
  const { notes, status, loadMore, refresh } = useFeedStore();
  const [tab, setTab] = useState(TABS[0].key);
  const [keyword, setKeyword] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!notes.length && status === "idle") loadMore();
  }, [notes.length, status, loadMore]);

  const flash = useCallback((t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(""), 1800);
  }, []);

  // 搜索过滤：标题或作者命中关键词
  const list = keyword
    ? notes.filter((n) => n.title.includes(keyword) || n.author.includes(keyword))
    : notes;

  return (
    <div className="h-full flex flex-col bg-canvas">
      <SearchBar value={keyword} onChange={setKeyword} onPublish={() => flash("原型演示：发布入口（未接入后端）")} />

      <div className="flex-1 flex flex-col min-h-0">
        <nav className="px-2.5 pt-2 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => {
                setTab(t.key);
                if (t.key !== "recommend") flash(`原型演示：${t.label}频道`);
              }}
              className={`shrink-0 px-3 py-1 rounded-full text-[12.5px] transition-colors ${
                tab === t.key ? "bg-brand text-white" : "bg-white text-[#5a5a5a]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main data-scroll-root className="flex-1 overflow-y-auto overscroll-contain">
          <PullToRefresh onRefresh={() => { refresh(); flash("已刷新"); }} refreshing={status === "refreshing"}>
            {keyword && !list.length ? (
              <div className="py-16 text-center text-[13px] text-[#9a9a9a]">
                没有找到「{keyword}」相关内容
                <button type="button" onClick={() => setKeyword("")} className="mt-3 block mx-auto px-4 py-1.5 rounded-full bg-white text-brand text-[12.5px]">
                  清除搜索
                </button>
              </div>
            ) : (
              <Waterfall items={list} />
            )}
          </PullToRefresh>
        </main>
      </div>

      <nav className="shrink-0 h-[52px] bg-white border-t border-black/5 grid grid-cols-4 text-[10.5px] text-[#8a8a8a]">
        {[
          ["首页", "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"],
          ["发现", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm2.5 7.5-3 6-3-6z"],
          ["消息", "M4 6h16v10H8l-4 4z"],
          ["我", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"],
        ].map(([label, d], i) => (
          <button key={label} type="button" onClick={() => i !== 0 && flash(`原型演示：${label}`)} className={`flex flex-col items-center justify-center gap-1 ${i === 0 ? "text-brand" : ""}`}>
            <svg viewBox="0 0 24 24" className="w-[21px] h-[21px]" fill={i === 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d={d} />
            </svg>
            {label}
          </button>
        ))}
      </nav>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 grid place-items-center z-50">
          <span className="px-4 py-2 rounded-full bg-black/78 text-white text-[12.5px] animate-fade-in">{toast}</span>
        </div>
      )}
    </div>
  );
}
