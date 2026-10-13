import { useState } from "react";
import LazyLoad from "react-lazyload";
import { defaultCover, type NoteItem } from "../mock";
import { useStore } from "../store";

function Card({ item }: { item: NoteItem }) {
  const liked = useStore((s) => !!s.liked[item.id]);
  const toggleLike = useStore((s) => s.toggleLike);
  const [pressed, setPressed] = useState(false);
  const [burst, setBurst] = useState(false);
  const [src, setSrc] = useState(item.failed ? "broken://cover" : item.cover);

  const likeCount = item.likes + (liked ? 1 : 0);

  return (
    <article
      data-card={item.id}
      className={`mb-3 break-inside-avoid rounded-lg bg-white p-2 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
        pressed ? "scale-[0.97] shadow-none" : ""
      }`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <LazyLoad height={item.height} offset={120} once>
        <div className="overflow-hidden rounded-md bg-page" style={{ minHeight: 80 }}>
          <img
            src={src}
            alt={item.title}
            loading="lazy"
            onError={() => setSrc(defaultCover())}
            className="block w-full object-cover"
            style={{ height: "auto", minHeight: 80 }}
          />
        </div>
      </LazyLoad>

      <h3 className="line-clamp-2 mt-2 text-sm font-medium leading-snug text-neutral-800">
        {item.title}
      </h3>

      <div className="mt-2 flex items-center gap-2">
        <img
          src={item.avatar}
          alt=""
          className="h-6 w-6 shrink-0 rounded-full bg-page object-cover"
        />
        <span className="min-w-0 flex-1 truncate text-xs text-neutral-500">
          {item.author}
        </span>
        <button
          type="button"
          aria-label={liked ? "取消点赞" : "点赞"}
          aria-pressed={liked}
          className="flex shrink-0 items-center gap-1 text-xs text-neutral-500"
          onClick={() => {
            toggleLike(item.id);
            if (!liked) {
              setBurst(true);
              window.setTimeout(() => setBurst(false), 450);
            }
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 ${burst ? "heart-pop" : ""}`}
            fill={liked ? "#fe2c55" : "none"}
            stroke={liked ? "#fe2c55" : "currentColor"}
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 20.5S3.5 14.7 3.5 8.9A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.5 2.6c0 5.8-8.5 11.6-8.5 11.6z" />
          </svg>
          <span>{likeCount}</span>
        </button>
      </div>
    </article>
  );
}

export default function Waterfall({ items }: { items: NoteItem[] }) {
  return (
    <div
      data-waterfall
      className="columns-2 gap-3 px-3 sm:columns-3 lg:columns-4"
      aria-label="瀑布流内容列表"
    >
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}
