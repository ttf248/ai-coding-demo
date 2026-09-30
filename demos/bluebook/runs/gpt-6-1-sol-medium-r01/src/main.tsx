import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useNotes } from "./store";
import { NoteCard } from "./components";
import type { Note } from "./data";
import "./style.css";
function App() {
  const s = useNotes();
  const [detail, setDetail] = useState<Note | null>(null),
    [publish, setPublish] = useState(false),
    [title, setTitle] = useState(""),
    [image, setImage] = useState(""),
    [pull, setPull] = useState(0);
  const sentinel = useRef<HTMLDivElement>(null),
    start = useRef<number | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          window.scrollY > 0 &&
          !s.query &&
          s.category === "推荐"
        )
          void s.load();
      },
      { rootMargin: "300px" },
    );
    if (sentinel.current) observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [s.load, s.query, s.category]);
  useEffect(() => {
    function escape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDetail(null);
        setPublish(false);
      }
    }
    window.addEventListener("keydown", escape);
    document.body.style.overflow = detail || publish ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", escape);
      document.body.style.overflow = "";
    };
  }, [detail, publish]);
  const notes = s.notes.filter(
    (n) =>
      (s.category === "推荐" || s.category === n.category) &&
      `${n.title}${n.author}`.includes(s.query),
  );
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-stone-200/60 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
          <a
            className="shrink-0 text-2xl font-black tracking-tight text-brand"
            href="#"
          >
            小蓝书
            <span className="hidden pl-3 text-xs font-normal tracking-wide text-stone-400 lg:inline">
              生活，值得被记录
            </span>
          </a>
          <label className="ml-auto flex w-full max-w-md items-center gap-2 rounded-full bg-stone-100 px-4 py-2.5">
            <span aria-hidden="true">⌕</span>
            <input
              value={s.query}
              onChange={(e) => s.setQuery(e.target.value)}
              placeholder="搜索你感兴趣的内容"
              aria-label="搜索"
              className="min-w-0 w-full bg-transparent text-sm outline-none"
            />
          </label>
          <button
            onClick={() => setPublish(true)}
            className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            ＋ 发布
          </button>
        </div>
      </header>
      <main
        className="mx-auto max-w-6xl px-4 pb-16"
        onTouchStart={(e) => {
          start.current = scrollY === 0 ? e.touches[0].clientY : null;
        }}
        onTouchMove={(e) => {
          if (start.current !== null)
            setPull(
              Math.max(
                0,
                Math.min(100, (e.touches[0].clientY - start.current) * 0.45),
              ),
            );
        }}
        onTouchEnd={() => {
          if (pull > 55) void s.refresh();
          setPull(0);
          start.current = null;
        }}
      >
        <div className="py-8">
          <p className="text-xs tracking-[.25em] text-stone-400">
            EXPLORE YOUR EVERYDAY
          </p>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              发现生活的小美好<span className="ml-2 text-brand">.</span>
            </h1>
            <button
              className="text-xs text-stone-500"
              onClick={() => void s.refresh()}
            >
              ↻ 换一批灵感
            </button>
          </div>
        </div>
        <nav className="mb-6 flex flex-wrap gap-2" aria-label="分类">
          {["推荐", "旅行", "生活", "美食", "家居", "穿搭"].map((c) => (
            <button
              key={c}
              onClick={() => s.setCategory(c)}
              className={`rounded-full px-5 py-2 text-sm transition ${s.category === c ? "bg-stone-900 text-white" : "bg-white text-stone-500 hover:bg-rose-50"}`}
            >
              {c}
            </button>
          ))}
        </nav>
        {pull > 0 && (
          <p className="pb-4 text-center text-sm text-brand">
            {pull > 55 ? "松开刷新" : "继续下拉刷新"}
          </p>
        )}
        <section
          key={s.category}
          className="fade-in columns-2 gap-4 md:columns-3 lg:columns-4"
        >
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} onOpen={setDetail} />
          ))}
        </section>
        {!notes.length && (
          <p className="py-16 text-center text-stone-500">
            没有找到相关笔记，试试其他关键词。
          </p>
        )}
        <div
          ref={sentinel}
          className="py-8 text-center text-sm text-stone-400"
          role="status"
        >
          {s.loading ? (
            <>
              <span className="spinner" /> 正在收集更多美好…
            </>
          ) : s.page >= 5 ? (
            "今天的灵感都在这里了"
          ) : s.query || s.category !== "推荐" ? (
            "已显示已加载笔记中的筛选结果"
          ) : (
            "向下探索更多"
          )}
        </div>
      </main>
      {(detail || publish) && (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4"
          onClick={() => {
            setDetail(null);
            setPublish(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={detail ? "笔记详情" : "发布笔记"}
            className="fade-in relative max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              onClick={() => {
                setDetail(null);
                setPublish(false);
              }}
              aria-label="关闭"
              className="absolute right-4 top-3 rounded-full bg-white px-3 py-2"
            >
              ✕
            </button>
            {detail ? (
              <>
                <img
                  className="w-full rounded-xl"
                  src={detail.image}
                  alt={detail.title}
                />
                <h2 className="mt-5 text-xl font-semibold">{detail.title}</h2>
                <p className="mt-3 text-stone-500">
                  {detail.author} · 分享我的生活灵感，愿你也遇见美好。
                </p>
                <button
                  onClick={() => s.like(detail.id)}
                  className="mt-4 rounded-full bg-rose-50 px-5 py-2 text-brand"
                >
                  {s.notes.find((n) => n.id === detail.id)?.liked
                    ? "♥ 已喜欢"
                    : "♡ 喜欢这篇"}
                </button>
              </>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (title.trim() && image) {
                    s.publish(title.trim(), image);
                    setPublish(false);
                    setTitle("");
                    setImage("");
                    s.setCategory("推荐");
                    s.setQuery("");
                  }
                }}
              >
                <h2 className="text-xl font-semibold">记录你的美好</h2>
                <label className="mt-6 block text-sm">
                  标题
                  <input
                    required
                    maxLength={80}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-xl border p-3"
                  />
                </label>
                <label className="mt-4 block text-sm">
                  选择本地图片
                  <input
                    required
                    type="file"
                    accept="image/*"
                    className="mt-2 block w-full text-xs"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const r = new FileReader();
                        r.onload = () => setImage(String(r.result));
                        r.readAsDataURL(f);
                      }
                    }}
                  />
                </label>
                {image && (
                  <img
                    src={image}
                    alt="发布预览"
                    className="mt-4 max-h-48 rounded-xl"
                  />
                )}
                <button className="mt-6 w-full rounded-xl bg-brand py-3 text-white">
                  发布笔记
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
