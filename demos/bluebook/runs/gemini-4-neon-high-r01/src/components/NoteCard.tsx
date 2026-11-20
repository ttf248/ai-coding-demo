import React, { useState } from "react";
import LazyLoad from "react-lazyload";
import { DEFAULT_FALLBACK_IMAGE } from "../data/mockNotes";
import { useFeedStore } from "../store/useFeedStore";
import type { NoteItem } from "../types/note";

interface Props {
  note: NoteItem;
}

export const NoteCard: React.FC<Props> = ({ note }) => {
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const openNote = useFeedStore((s) => s.openNote);
  const [imgSrc, setImgSrc] = useState(note.imageUrl);
  const [popping, setPopping] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(note.id);
    setPopping(false);
    requestAnimationFrame(() => setPopping(true));
  };

  return (
    <article
      onClick={() => openNote(note.id)}
      className="group bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.97] transition-all duration-200 cursor-pointer select-none animate-fade-in border border-slate-100"
    >
      {/* Adaptive aspect-ratio image wrapped in react-lazyload */}
      <div
        className="w-full bg-slate-100 overflow-hidden relative"
        style={{ aspectRatio: `1 / ${note.aspectRatio}` }}
      >
        <LazyLoad
          height={220}
          offset={240}
          once
          placeholder={
            <div className="w-full h-full bg-slate-200/70 animate-pulse" />
          }
        >
          <img
            src={imgSrc}
            alt={note.title}
            onError={() => {
              if (imgSrc !== DEFAULT_FALLBACK_IMAGE) {
                setImgSrc(DEFAULT_FALLBACK_IMAGE);
              }
            }}
            className="w-full h-full object-cover block group-hover:scale-[1.03] transition-transform duration-300"
          />
        </LazyLoad>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-3">
        <h3 className="text-[13px] sm:text-sm font-medium text-slate-900 leading-[1.4] line-clamp-2 min-h-[2.6em]">
          {note.title}
        </h3>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          {/* Circular 24px Author Avatar + Nickname */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: note.author.avatarBg }}
            >
              {note.author.initial}
            </span>
            <span className="text-[11.5px] text-slate-500 truncate">
              {note.author.name}
            </span>
          </div>

          {/* Like Button with Heart Pop Animation */}
          <button
            type="button"
            onClick={handleLikeClick}
            className="shrink-0 flex items-center gap-1 text-[12px] text-slate-500 hover:text-[#fe2c55] transition-colors py-0.5 px-1 rounded"
            aria-label={note.liked ? "取消点赞" : "点赞"}
          >
            <svg
              onAnimationEnd={() => setPopping(false)}
              className={`w-4 h-4 transition-colors ${
                note.liked ? "text-[#fe2c55] fill-[#fe2c55]" : "text-slate-400 fill-none"
              } ${popping ? "animate-heart-pop" : ""}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className={note.liked ? "text-[#fe2c55] font-medium" : ""}>
              {note.likes >= 1000
                ? `${(note.likes / 1000).toFixed(1)}k`
                : note.likes}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
