import React, { useState } from "react";
import { CATEGORIES, DEFAULT_FALLBACK_IMAGE } from "../data/mockNotes";
import { useFeedStore } from "../store/useFeedStore";
import type { NoteCategory } from "../types/note";

export const NoteDetailModal: React.FC = () => {
  const { notes, selectedNoteId, openNote, toggleLike } = useFeedStore();
  const note = notes.find((n) => n.id === selectedNoteId);
  if (!note) return null;

  return (
    <div
      onClick={() => openNote(null)}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl grid grid-cols-1 sm:grid-cols-2 max-h-[88vh]"
      >
        <div className="bg-slate-100 flex items-center justify-center max-h-72 sm:max-h-none overflow-hidden">
          <img
            src={note.imageUrl}
            alt={note.title}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 sm:p-5 flex flex-col justify-between gap-4 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: note.author.avatarBg }}
                >
                  {note.author.initial}
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {note.author.name}
                  </div>
                  <div className="text-[11px] text-slate-400">{note.createdAt}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openNote(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs"
              >
                ✕
              </button>
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-900 leading-snug">
              {note.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {note.content}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-50 text-[#fe2c55] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">分类：{note.category}</span>
            <button
              type="button"
              onClick={() => toggleLike(note.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                note.liked
                  ? "bg-[#fe2c55] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-[#fe2c55]"
              }`}
            >
              ♥ {note.liked ? "已赞" : "点赞"} ({note.likes})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PublishModal: React.FC = () => {
  const { publishOpen, setPublishOpen, publishNote } = useFeedStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] =
    useState<Exclude<NoteCategory, "推荐">>("穿搭");
  const [customUrl, setCustomUrl] = useState("");

  if (!publishOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const coverSvg =
      customUrl.trim() ||
      "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 488">
            <defs><linearGradient id="u" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fe2c55"/><stop offset="100%" stop-color="#ff8fa3"/></linearGradient></defs>
            <rect width="400" height="488" fill="url(#u)"/>
            <circle cx="200" cy="190" r="85" fill="#fff" fill-opacity="0.22"/>
            <text x="200" y="340" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="700" font-size="24">${category} · 新笔记</text>
          </svg>`,
        );
    publishNote({ title, content, category, imageUrl: coverSvg });
    setTitle("");
    setContent("");
    setCustomUrl("");
  };

  return (
    <div
      onClick={() => setPublishOpen(false)}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">发布新笔记</h2>
          <button
            type="button"
            onClick={() => setPublishOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            笔记标题
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="写一个吸睛的标题..."
            className="w-full px-3 py-2 rounded-lg bg-[#f5f5f5] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fe2c55]/40"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            频道分类
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.filter((c) => c !== "推荐").map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat as Exclude<NoteCategory, "推荐">)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-[#fe2c55] text-white"
                    : "bg-[#f5f5f5] text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            正文内容
          </label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的美好生活体验..."
            className="w-full px-3 py-2 rounded-lg bg-[#f5f5f5] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fe2c55]/40"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            自定义封面链接（可选，留空自动生成；输入错误链接可测试默认兜底图）
          </label>
          <input
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="留空自动生成渐变封面"
            className="w-full px-3 py-2 rounded-lg bg-[#f5f5f5] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#fe2c55]/40"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-[#fe2c55] hover:bg-[#e5234a] active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all"
        >
          立即发布到瀑布流
        </button>
      </form>
    </div>
  );
};
