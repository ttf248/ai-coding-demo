import LazyLoad from "react-lazyload";
import { useStore } from "../store";
import { PLACEHOLDER, type MockItem } from "../mock";

function fmt(n: number): string {
  return n >= 10000 ? (n / 10000).toFixed(1) + "w" : String(n);
}

export default function Card({ item }: { item: MockItem }) {
  const liked = useStore((s) => !!s.liked[item.id]);
  const toggleLike = useStore((s) => s.toggleLike);
  const likes = item.likes + (liked ? 1 : 0);
  return (
    <article
      data-card
      className="mb-3 break-inside-avoid overflow-hidden rounded-card bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.97]"
    >
      <LazyLoad
        height={180}
        offset={140}
        once
        placeholder={
          <div className="w-full animate-pulse bg-page" style={{ aspectRatio: `300 / ${item.h}` }} />
        }
      >
        <img
          src={item.img}
          alt={item.title}
          style={{ aspectRatio: `300 / ${item.h}` }}
          className="block w-full bg-page object-cover"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith(PLACEHOLDER)) img.src = PLACEHOLDER;
          }}
        />
      </LazyLoad>
      <div className="px-3 pb-3 pt-2">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-5 text-gray-800">{item.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="flex min-w-0 items-center gap-1.5">
            <span
              className="grid h-6 w-6 flex-none place-items-center rounded-full text-[10px] font-semibold text-white"
              style={{ background: `hsl(${item.hue} 62% 55%)` }}
              aria-hidden
            >
              {item.author.slice(0, 1)}
            </span>
            <span className="truncate text-[11px] text-gray-500">{item.author}</span>
          </span>
          <button
            type="button"
            data-like
            aria-pressed={liked}
            onClick={() => toggleLike(item.id)}
            className="flex flex-none items-center gap-1 rounded-full px-1.5 py-1"
          >
            <svg
              key={liked ? "liked" : "unliked"}
              viewBox="0 0 24 24"
              className={
                "h-4 w-4 " +
                (liked ? "animate-heartpop fill-primary stroke-primary" : "fill-transparent stroke-gray-400")
              }
              strokeWidth={2}
              aria-hidden
            >
              <path d="M12 21s-7.6-4.9-10-9.2C.4 8.6 2.2 5 5.7 5c2 0 3.4 1.1 4.3 2.6C10.9 6.1 12.3 5 14.3 5c3.5 0 5.3 3.6 3.7 6.8C19.6 16.1 12 21 12 21z" />
            </svg>
            <span className={"text-[11px] " + (liked ? "font-semibold text-primary" : "text-gray-500")}>
              {fmt(likes)}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
