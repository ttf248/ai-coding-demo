import { memo } from "react";
import { useFeedStore } from "../store/useFeedStore";
import type { Note } from "../types";
import Avatar from "./Avatar";
import LazyImage from "./LazyImage";

const fmtLikes = (n: number) => (n >= 10000 ? `${(n / 10000).toFixed(1)} 万` : String(n));

function NoteCard({ note }: { note: Note }) {
  const liked = useFeedStore((s) => !!s.liked[note.id]);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const likes = liked ? note.likes + 1 : note.likes;

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_22px_-10px_rgba(0,0,0,.28)] active:scale-[.985] active:shadow-none">
      <LazyImage src={note.image} alt={note.title} ratio={note.ratio} />
      <div className="px-2.5 pt-2 pb-3">
        <h3 className="text-[13.5px] leading-[1.45] text-[#1f1f1f] line-clamp-2">{note.title}</h3>
        <div className="mt-2 flex items-center gap-1.5">
          <Avatar name={note.author} size={24} />
          <span className="text-[12px] text-[#8a8a8a] truncate flex-1">{note.author}</span>
          <button
            type="button"
            aria-label={liked ? "取消点赞" : "点赞"}
            aria-pressed={liked}
            onClick={() => toggleLike(note.id)}
            className="flex items-center gap-1 text-[12px] text-[#8a8a8a] active:scale-90 transition-transform"
          >
            <svg viewBox="0 0 24 24" className={`w-[15px] h-[15px] ${liked ? "animate-pop" : ""}`} fill={liked ? "#fe2c55" : "none"} stroke={liked ? "#fe2c55" : "#8a8a8a"} strokeWidth="2" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            {fmtLikes(likes)}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(NoteCard);
