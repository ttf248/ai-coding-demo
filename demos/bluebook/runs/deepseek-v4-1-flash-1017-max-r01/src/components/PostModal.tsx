import { useEffect } from "react";
import type { Post } from "../types";
import { useFeedStore } from "../store/useFeedStore";
import { CloseIcon, HeartIcon } from "./Icons";
import { formatLikes } from "./PostCard";

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

export function PostModal({ post, onClose }: PostModalProps) {
  const liked = useFeedStore((state) =>
    post ? Boolean(state.liked[post.id]) : false,
  );
  const likes = useFeedStore((state) =>
    post ? state.likes[post.id] ?? post.likes : 0,
  );
  const toggleLike = useFeedStore((state) => state.toggleLike);

  useEffect(() => {
    if (!post) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="animate-fade-up max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="grid md:grid-cols-[1.15fr_1fr]">
          <div className="relative bg-[#eeeae5]">
            <img
              src={post.image}
              alt={post.title}
              className="max-h-[46vh] w-full object-cover md:max-h-[78vh]"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-black/50 md:hidden"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="relative flex flex-col p-4 sm:p-5">
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="absolute right-3 top-3 hidden h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600 md:grid"
            >
              <CloseIcon />
            </button>
            <div className="flex items-center gap-2 pr-8">
              <img src={post.avatar} alt="" className="h-8 w-8 rounded-full ring-1 ring-black/5" />
              <div>
                <p className="text-[13px] font-semibold text-neutral-800">{post.author}</p>
                <p className="text-[10px] text-neutral-400">刚刚发布 · 来自小蓝书</p>
              </div>
            </div>
            <h2 className="mt-4 text-[17px] font-bold leading-snug text-neutral-900">{post.title}</h2>
            <p className="mt-2.5 text-[13px] leading-6 text-neutral-600">
              {post.body || "记录生活里的小小闪光。今天的风、光线和心情，都值得被认真收藏。"}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-[#fff1f4] px-2 py-0.5 text-[10px] text-brand">#{post.category}</span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">#生活记录</span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">#小蓝书</span>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 md:mt-6">
              <span className="text-[11px] text-neutral-400">共 {formatLikes(likes)} 人喜欢</span>
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-semibold transition active:scale-95 ${
                  liked
                    ? "bg-brand text-white shadow-sm shadow-brand/30"
                    : "bg-[#fff1f4] text-brand hover:bg-[#ffe4ea]"
                }`}
              >
                <HeartIcon filled={liked} className={`h-4 w-4 ${liked ? "animate-pop" : ""}`} />
                {liked ? "已点赞" : "点赞"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
