import React, { useEffect, useState } from "react";
import { DEFAULT_FALLBACK_IMAGE } from "../data/mockNotes";
import { useBluebookStore } from "../store/useBluebookStore";

export const NoteDetailModal: React.FC = () => {
  const selectedNoteId = useBluebookStore((s) => s.selectedNoteId);
  const notes = useBluebookStore((s) => s.notes);
  const openNote = useBluebookStore((s) => s.openNote);
  const toggleLike = useBluebookStore((s) => s.toggleLike);

  const note = notes.find((n) => n.id === selectedNoteId);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [note?.id]);

  if (!note) return null;

  return (
    <div
      onClick={() => openNote(null)}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={note.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl grid grid-cols-1 sm:grid-cols-2"
      >
        <div className="bg-neutral-100 flex items-center justify-center">
          <img
            src={imgError ? DEFAULT_FALLBACK_IMAGE : note.imageUrl}
            alt={note.title}
            onError={() => setImgError(true)}
            className="w-full h-full max-h-[420px] object-cover"
          />
        </div>
        <div className="p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: note.avatarColor }}
                >
                  {note.author.slice(0, 1)}
                </span>
                <span className="text-sm font-medium text-neutral-800">{note.author}</span>
              </div>
              <button
                type="button"
                onClick={() => openNote(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-sm"
                aria-label="关闭详情"
              >
                ✕
              </button>
            </div>
            <h2 className="text-base font-bold text-neutral-900 leading-snug mb-2">
              {note.title}
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-3">
              {note.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-xs text-neutral-600"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => toggleLike(note.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                note.liked
                  ? "bg-[#fe2c55] text-white border-[#fe2c55]"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-[#fe2c55] hover:text-[#fe2c55]"
              }`}
            >
              ♥ {note.liked ? "已赞" : "点赞"} · {note.likes}
            </button>
            <span className="text-xs text-neutral-400">频道：{note.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
