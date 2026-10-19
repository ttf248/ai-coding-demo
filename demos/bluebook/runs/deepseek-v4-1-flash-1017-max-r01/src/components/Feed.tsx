import { useEffect, useMemo, useRef, useState } from "react";
import LazyLoad from "react-lazyload";
import type { Post } from "../types";
import { ALL_POSTS } from "../data/mock";
import { useFeedStore } from "../store/useFeedStore";
import { CardSkeleton, PostCard } from "./PostCard";
import { SearchIcon, SparkIcon } from "./Icons";

interface FeedProps {
  onOpen: (post: Post) => void;
}

export function Feed({ onOpen }: FeedProps) {
  const posts = useFeedStore((state) => state.posts);
  const loading = useFeedStore((state) => state.loading);
  const refreshing = useFeedStore((state) => state.refreshing);
  const hasMore = useFeedStore((state) => state.hasMore);
  const query = useFeedStore((state) => state.query);
  const loadMore = useFeedStore((state) => state.loadMore);
  const refresh = useFeedStore((state) => state.refresh);
  const sentinel = useRef<HTMLDivElement | null>(null);
  const [pull, setPull] = useState(0);
  const pullRef = useRef(0);
  const startY = useRef<number | null>(null);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return posts;
    return ALL_POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword) ||
        post.author.toLowerCase().includes(keyword) ||
        post.category.toLowerCase().includes(keyword),
    );
  }, [posts, query]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || query) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, query, hasMore, posts.length]);

  useEffect(() => {
    const onStart = (event: TouchEvent) => {
      if (window.scrollY <= 0 && !refreshing) {
        startY.current = event.touches[0]?.clientY ?? null;
      }
    };
    const onMove = (event: TouchEvent) => {
      if (startY.current === null) return;
      const delta = (event.touches[0]?.clientY ?? 0) - startY.current;
      if (delta <= 0) {
        pullRef.current = 0;
        setPull(0);
        return;
      }
      if (window.scrollY > 0) {
        startY.current = null;
        pullRef.current = 0;
        setPull(0);
        return;
      }
      const distance = Math.min(84, delta * 0.48);
      pullRef.current = distance;
      setPull(distance);
      if (distance > 6 && event.cancelable) event.preventDefault();
    };
    const onEnd = () => {
      if (startY.current === null) return;
      startY.current = null;
      if (pullRef.current > 52) void refresh();
      pullRef.current = 0;
      setPull(0);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [refresh, refreshing]);

  const refreshingNow = refreshing || pull > 44;

  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-3 pb-14 pt-4 sm:px-6 sm:pt-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${pull ? pull * 0.7 : refreshing ? 26 : 0}px)` }}
        aria-hidden={!pull && !refreshing}
      >
        <div
          className={`flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-medium text-neutral-500 shadow-md ring-1 ring-black/5 ${
            pull || refreshing ? "opacity-100" : "opacity-0"
          } transition-opacity`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full border-2 border-brand/25 border-t-brand ${
              refreshing ? "animate-spin" : ""
            }`}
            style={refreshing ? undefined : { transform: `rotate(${pull * 4}deg)` }}
          />
          {refreshing ? "正在刷新…" : refreshingNow ? "松开刷新" : "下拉刷新"}
        </div>
      </div>

      <div className="mb-3.5 flex items-end justify-between gap-3 px-0.5 sm:mb-5">
        <div>
          <h1 className="flex items-center gap-1.5 text-[17px] font-bold tracking-tight text-neutral-900 sm:text-xl">
            {query ? "搜索结果" : "发现灵感"}
            {!query && <SparkIcon className="h-4 w-4 text-brand/80" />}
          </h1>
          <p className="mt-0.5 text-[11px] text-neutral-400 sm:text-xs">
            {query
              ? `“${query.trim()}” · ${filtered.length} 篇笔记`
              : "把生活里的小小闪光，认真收藏"}
          </p>
        </div>
        <span className="hidden rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-neutral-400 shadow-sm ring-1 ring-black/[0.04] sm:inline">
          {query ? `${filtered.length} 条结果` : `${posts.length} / ${ALL_POSTS.length} 篇`}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl bg-white/70 py-24 text-center ring-1 ring-black/[0.03]">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#f7f2f3] text-brand/50">
            <SearchIcon className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-neutral-600">没有找到相关笔记</p>
          <p className="mt-1 text-xs text-neutral-400">换个关键词试试，比如“旅行”或“咖啡”</p>
        </div>
      ) : (
        <div
          key={query || "feed"}
          className="animate-fade-up columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4"
        >
          {filtered.map((post, index) => (
            <LazyLoad
              key={post.id}
              height={280}
              offset={380}
              once
              className="mb-3 break-inside-avoid md:mb-4"
              placeholder={
                <div className="mb-3 md:mb-4">
                  <CardSkeleton />
                </div>
              }
            >
              <div className="mb-3 md:mb-4">
                <PostCard post={post} onOpen={onOpen} />
              </div>
              {index === filtered.length - 1 && !query && !hasMore && (
                <p className="break-inside-avoid pb-2 text-center text-[11px] text-neutral-400">
                  — 已经看到全部笔记啦 —
                </p>
              )}
            </LazyLoad>
          ))}
        </div>
      )}

      {!query && (
        <>
          <div ref={sentinel} className="h-1 w-full" aria-hidden="true" />
          {loading && (
            <div className="flex items-center justify-center gap-1.5 py-8" role="status" aria-label="加载中">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-brand/70"
                  style={{ animationDelay: `${dot * 0.14}s` }}
                />
              ))}
              <span className="ml-1.5 text-[11px] text-neutral-400">正在加载更多…</span>
            </div>
          )}
          {!hasMore && !loading && posts.length > 0 && (
            <p className="py-7 text-center text-[11px] text-neutral-400">— 已经看到全部笔记啦 —</p>
          )}
        </>
      )}
    </section>
  );
}
