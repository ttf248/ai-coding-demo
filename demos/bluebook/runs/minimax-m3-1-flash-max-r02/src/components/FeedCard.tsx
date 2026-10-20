import { useState } from "react";
import LazyLoad from "react-lazyload";
import { FALLBACK_IMAGE, type FeedItem } from "../data";
import { useFeedStore } from "../store";

interface Props {
  item: FeedItem;
  index: number;
}

export default function FeedCard({ item, index }: Props) {
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const [broken, setBroken] = useState(false);
  const [popping, setPopping] = useState(false);

  const handleLike = () => {
    toggleLike(item.id);
    setPopping(true);
    window.setTimeout(() => setPopping(false), 420);
  };

  return (
    <article
      className="card-press mb-3 break-inside-avoid overflow-hidden rounded-lg bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover"
      style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
    >
      <LazyLoad
        className="block w-full"
        height={Math.round(400 * item.ratio)}
        once
        offset={200}
        placeholder={
          <div
            className="w-full animate-shimmer bg-[linear-gradient(90deg,#f1f5f9_25%,#e2e8f0_37%,#f1f5f9_63%)] bg-[length:200%_100%]"
            style={{ height: Math.round(400 * item.ratio) }}
          />
        }
      >
        <img
          src={broken ? FALLBACK_IMAGE : item.image}
          alt={item.title}
          loading="lazy"
          onError={() => setBroken(true)}
          className="block w-full object-cover"
          style={{ aspectRatio: `1 / ${item.ratio}` }}
        />
      </LazyLoad>

      <div className="px-3 pb-3 pt-2.5">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-[1.45] text-slate-800">
          {item.title}
        </h3>

        <div className="mt-2.5 flex items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-soft to-brand-deep text-[11px] font-semibold text-white">
            {item.avatar}
          </span>
          <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
            {item.author}
          </span>
          <button
            type="button"
            onClick={handleLike}
            aria-label="点赞"
            className="flex shrink-0 items-center gap-1 rounded-full px-1.5 py-1 transition hover:bg-brand/5"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-[18px] w-[18px] transition ${
                popping ? "animate-heart-pop" : ""
              } ${item.liked ? "text-brand" : "text-slate-400"}`}
              fill={item.liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            >
              <path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8c0 5.8-8.5 11.3-8.5 11.3Z" />
            </svg>
            <span
              className={`text-xs tabular-nums ${
                item.liked ? "font-semibold text-brand" : "text-slate-500"
              }`}
            >
              {item.likes}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
