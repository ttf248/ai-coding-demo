import React, { useState } from "react";
import LazyLoad from "react-lazyload";
import { DEFAULT_FALLBACK_IMAGE, NoteItem } from "../data/mockNotes";
import { useBluebookStore } from "../store/useBluebookStore";

interface NoteCardProps {
  note: NoteItem;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const toggleLike = useBluebookStore((s) => s.toggleLike);
  const openNote = useBluebookStore((s) => s.openNote);
  const [imgSrc, setImgSrc] = useState(note.imageUrl);
  const [animatingLike, setAnimatingLike] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(note.id);
    setAnimatingLike(true);
    setTimeout(() => setAnimatingLike(false), 380);
  };

  return (
    <article
      onClick={() => openNote(note.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openNote(note.id);
        }
      }}
      className="bg-white rounded-[8px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md active:scale-[0.98] transition-all duration-200 cursor-pointer select-none animate-fadeIn border border-neutral-100"
    >
      <div className="w-full bg-neutral-100 overflow-hidden">
        <LazyLoad height={180} offset={160} once>
          <img
            src={imgSrc}
            alt={note.title}
            onError={() => {
              if (imgSrc !== DEFAULT_FALLBACK_IMAGE) {
                setImgSrc(DEFAULT_FALLBACK_IMAGE);
              }
            }}
            className="w-full h-auto block object-cover"
          />
        </LazyLoad>
      </div>

      <div className="p-2.5 sm:p-3">
        <h3 className="text-[13px] sm:text-sm font-medium text-neutral-900 leading-snug line-clamp-2 min-h-[2.4em]">
          {note.title}
        </h3>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-6 h-6 rounded-full shrink-0 inline-flex items-center justify-center text-[11px] font-bold text-white"
              style={{ backgroundColor: note.avatarColor }}
              aria-hidden="true"
            >
              {note.author.slice(0, 1)}
            </span>
            <span className="text-xs text-neutral-500 truncate">{note.author}</span>
          </div>

          <button
            type="button"
            onClick={handleLikeClick}
            aria-label={`点赞 ${note.title}`}
            aria-pressed={note.liked}
            className="shrink-0 inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-[#fe2c55] py-0.5 px-1 rounded transition"
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                note.liked ? "text-[#fe2c55] fill-[#fe2c55]" : "text-neutral-400 fill-none"
              } ${animatingLike ? "animate-heartPop" : ""}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
            <span className={note.liked ? "text-[#fe2c55] font-medium" : ""}>
              {note.likes}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
