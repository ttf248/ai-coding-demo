import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "./components/SearchBar";
import PullToRefresh from "./components/PullToRefresh";
import Waterfall from "./components/Waterfall";
import { TABS, TOTAL_ITEMS, filterByTab, TAB_EMPTY_TEXT } from "./mock/data";
import { useFeedStore, PAGE_SIZE } from "./store/useFeedStore";

const LS_TAB = "bluebook-tab";
const LS_KW = "bluebook-kw";

export default function App() {
  const { notes, status, loadMore, refresh } = useFeedStore();
  /* 第 8 轮：频道与搜索词写入 localStorage，刷新后回到上次的位置。
     只在首次渲染时读一次，之后交给 useState 管理，避免每次渲染都碰存储。 */
  const [tab, setTab] = useState<string>(() => window.localStorage.getItem(LS_TAB) || TABS[0].key);
  const [keyword, setKeyword] = useState<string>(() => window.localStorage.getItem(LS_KW) || "");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!notes.length && status === "idle") loadMore();
  }, [notes.length, status, loadMore]);

  const flash = useCallback((t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(""), 1800);
  }, []);

  /* 第 4 轮：先按频道过滤，再按关键词过滤，顺序固定。
     两个条件同时生效，而不是切了频道搜索就失效。 */
  const byTab = useMemo(() => filterByTab(notes, tab), [notes, tab]);
  const list = useMemo(
    () => (keyword ? byTab.filter((n) => n.title.includes(keyword) || n.author.includes(keyword)) : byTab),
    [byTab, keyword],
  );

  /* 第 5 轮：把列表的真实数字显示出来。
     原型最容易被质疑的就是「到底加载了多少、有没有真的在过滤」，
     已加载 / 总数 / 当前页 / 频道命中 / 搜索命中全部由真实数据算出。 */
  const stats = useMemo(
    () => ({
      loaded: notes.length,
      total: TOTAL_ITEMS,
      page: Math.ceil(notes.length / PAGE_SIZE),
      tabHits: byTab.length,
      hits: list.length,
    }),
    [notes.length, byTab.length, list.length],
  );

  const changeTab = useCallback((key: string) => {
    setTab(key);
    window.localStorage.setItem(LS_TAB, key);
    const label = TABS.find((t) => t.key === key)?.label || key;
    flash(`已切到「${label}」频道：${TAB_EMPTY_TEXT[key] ? "按该频道规则过滤" : ""}`);
  }, [flash]);

  const changeKeyword = useCallback((v: string) => {
    setKeyword(v);
    window.localStorage.setItem(LS_KW, v);
  }, []);

  const emptyText = keyword
    ? `没有找到「${keyword}」相关内容`
    : TAB_EMPTY_TEXT[tab] || "这里还没有内容";

  return (
    <div className="h-full flex flex-col bg-canvas">
      {/* 第 7 轮：跳过导航的快捷链接，键盘用户按一次 Tab 就能进内容区 */}
      <a href="#feed" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:px-3 focus:py-1.5 focus:rounded-full focus:bg-white focus:text-[13px] focus:text-brand focus:shadow">
        跳到内容列表
      </a>

      <SearchBar value={keyword} onChange={changeKeyword} onPublish={() => flash("原型演示：发布入口（未接入后端）")} />

      <div className="flex-1 flex flex-col min-h-0">
        {/* 第 7 轮：频道栏改成 tablist 语义，选中项带 aria-selected 并支持左右方向键 */}
        <nav role="tablist" aria-label="内容频道" className="px-2.5 pt-2 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((t, i) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              tabIndex={tab === t.key ? 0 : -1}
              data-tab={t.key}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const next = TABS[(i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
                changeTab(next.key);
                document.querySelector<HTMLButtonElement>(`[data-tab="${next.key}"]`)?.focus();
              }}
              onClick={() => changeTab(t.key)}
              className={`shrink-0 px-3 py-1 rounded-full text-[12.5px] transition-colors ${
                tab === t.key ? "bg-brand text-white" : "bg-white text-[#5a5a5a]"
              }`}
            >
              {t.label}
            </button>
          ))}
          {/* 第 5 轮：真实数字读数 */}
          <span className="ml-auto shrink-0 self-center pl-2 text-[11px] text-[#9a9a9a] tabular-nums" id="feed-stats">
            第 {stats.page} 页 · 已加载 {stats.loaded}/{stats.total} · 频道命中 {stats.tabHits} · 搜索命中 {stats.hits}
          </span>
        </nav>

        <main id="feed" data-scroll-root role="tabpanel" aria-label="内容列表" className="flex-1 overflow-y-auto overscroll-contain">
          <PullToRefresh onRefresh={() => { refresh(); flash("已刷新"); }} refreshing={status === "refreshing"}>
            {!list.length ? (
              <div className="py-16 px-8 text-center text-[13px] text-[#9a9a9a]">
                {emptyText}
                {keyword && (
                  <button type="button" onClick={() => changeKeyword("")} className="mt-3 block mx-auto px-4 py-1.5 rounded-full bg-white text-brand text-[12.5px]">
                    清除搜索
                  </button>
                )}
              </div>
            ) : (
              <Waterfall items={list} />
            )}
          </PullToRefresh>
        </main>
      </div>

      {/* 第 7 轮：底部导航用 nav 语义 + aria-current，图标标记 aria-hidden */}
      <nav aria-label="主导航" className="shrink-0 h-[52px] bg-white border-t border-black/5 grid grid-cols-4 text-[10.5px] text-[#8a8a8a]">
        {[
          ["首页", "M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"],
          ["发现", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm2.5 7.5-3 6-3-6z"],
          ["消息", "M4 6h16v10H8l-4 4z"],
          ["我", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z"],
        ].map(([label, d], i) => (
          <button
            key={label}
            type="button"
            aria-current={i === 0 ? "page" : undefined}
            onClick={() => i !== 0 && flash(`原型演示：${label}`)}
            className={`flex flex-col items-center justify-center gap-1 ${i === 0 ? "text-brand" : ""}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="w-[21px] h-[21px]" fill={i === 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
              <path d={d} />
            </svg>
            {label}
          </button>
        ))}
      </nav>

      {/* 第 7 轮：toast 用 role=status + aria-live，读屏用户能听到提示 */}
      {toast && (
        <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 grid place-items-center z-50">
          <span className="px-4 py-2 rounded-full bg-black/78 text-white text-[12.5px] animate-fade-in">{toast}</span>
        </div>
      )}
    </div>
  );
}
