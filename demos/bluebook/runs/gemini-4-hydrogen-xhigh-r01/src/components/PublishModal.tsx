import React, { useState } from "react";
import { CATEGORIES_LIST } from "../data/mockNotes";
import { useBluebookStore } from "../store/useBluebookStore";

export const PublishModal: React.FC = () => {
  const isPublishOpen = useBluebookStore((s) => s.isPublishOpen);
  const setPublishOpen = useBluebookStore((s) => s.setPublishOpen);
  const addNote = useBluebookStore((s) => s.addNote);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("蓝书用户");
  const [category, setCategory] = useState("摄影");
  const [aspectRatio, setAspectRatio] = useState(1.25);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  if (!isPublishOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNote({ title, author, category, description, aspectRatio, imageUrl });
    setTitle("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <div
      onClick={() => setPublishOpen(false)}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="发布新笔记"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl space-y-3.5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-neutral-900">发布新笔记</h2>
          <button
            type="button"
            onClick={() => setPublishOpen(false)}
            className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-500 text-sm"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">笔记标题</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="写一个吸引人的标题..."
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-[#fe2c55]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">作者昵称</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-[#fe2c55]"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">频道分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white"
            >
              {CATEGORIES_LIST.filter((c) => c !== "推荐").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">卡片画幅比例</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm bg-white"
          >
            <option value={1.35}>竖图 3:4（适合瀑布流）</option>
            <option value={1.0}>方图 1:1</option>
            <option value={0.85}>横图 4:3</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">图片地址（留空使用内置插画，可填错误地址测试默认图回退）</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="可选：自定义图片 URL"
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-[#fe2c55]"
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">正文内容</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="记录你的日常灵感..."
            className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-[#fe2c55]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-[#fe2c55] hover:bg-[#e5244a] text-white text-sm font-semibold transition"
        >
          立即发布到瀑布流
        </button>
      </form>
    </div>
  );
};
