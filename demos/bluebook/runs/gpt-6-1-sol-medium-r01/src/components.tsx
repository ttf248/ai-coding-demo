import LazyLoad from "react-lazyload";
import { useNotes } from "./store";
import type { Note } from "./data";
export function Heart({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}
export function NoteCard({
  note,
  onOpen,
}: {
  note: Note;
  onOpen: (n: Note) => void;
}) {
  const like = useNotes((s) => s.like);
  return (
    <article className="note-card mb-4 break-inside-avoid overflow-hidden rounded-lg bg-white transition hover:-translate-y-1 hover:shadow-lg active:scale-[.98]">
      <button
        className="block w-full text-left"
        onClick={() => onOpen(note)}
        aria-label={`查看 ${note.title}`}
      >
        <LazyLoad height={240} offset={400} once>
          <img
            src={note.image}
            alt={note.title}
            className="w-full h-auto"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "./images/fallback.svg";
            }}
          />
        </LazyLoad>
        <h2 className="line-clamp-2 px-3 pt-3 text-sm font-semibold leading-6">
          {note.title}
        </h2>
      </button>
      <div className="flex items-center justify-between px-3 py-3 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="grid size-6 place-items-center rounded-full bg-rose-50 text-rose-500">
            {note.author[0]}
          </span>
          {note.author}
        </span>
        <button
          onClick={() => like(note.id)}
          aria-pressed={note.liked}
          aria-label={`${note.liked ? "取消点赞" : "点赞"} ${note.title}`}
          className={`flex items-center gap-1 ${note.liked ? "text-brand heart-pop" : ""}`}
        >
          <Heart filled={note.liked} />
          {note.likes}
        </button>
      </div>
    </article>
  );
}
