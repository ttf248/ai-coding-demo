import { useState } from "react";
import LazyLoad from "react-lazyload";
import { Note } from "../data/mock";
import { FALLBACK_IMAGE } from "../data/mock";
import { useStore } from "../store/useStore";

interface Props {
  note: Note;
}

export default function NoteCard({ note }: Props) {
  const liked = useStore((s) => Boolean(s.liked[note.id]));
  const burst = useStore((s) => s.likeBurst[note.id] ?? 0);
  const toggleLike = useStore((s) => s.toggleLike);
  const [failed, setFailed] = useState(false);

  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0 active:scale-[0.985]">
      <div className="relative w-full overflow-hidden bg-canvas">
        <LazyLoad
          placeholder={<div className="w-full" style={{ height: note.ratio * 180 }} />}
          width={480}
          height={Math.round(480 * note.ratio)}
          src={failed ? FALLBACK_IMAGE : note.image}
          onError={() => setFailed(true)}
          className="w-full"
        >
          <img
            src={failed ? FALLBACK_IMAGE : note.image}
            alt={note.title}
            loading="lazy"
            className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            onError={() => setFailed(true)}
          />
        </LazyLoad>
      </div>

      <div className="px-3 pb-3 pt-2.5">
        <h3 className="line-clamp-2 text-[14px] font-medium leading-[1.45] text-[#1f2329]">
          {note.title}
        </h3>

        <div className="mt-2.5 flex items-center gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-soft to-primary text-[11px] font-semibold text-white"
            title={note.author}
          >
            {note.author.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1 truncate text-[12px] text-[#8a8f99]">
            {note.author}
          </span>
          <button
            onClick={() => toggleLike(note.id)}
            className="flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[12px] text-[#8a8f99] transition hover:text-primary active:scale-90"
            aria-label={`点赞 ${note.title}`}
          >
            <svg
              key={burst}
              className={`h-[18px] w-[18px] ${
                liked ? "animate-heart-pop text-primary" : "text-[#c3c8d2]"
              }`}
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 20.5 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13Z" />
            </svg>
            <span className={liked ? "font-medium text-primary" : ""}>
              {note.likes}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
