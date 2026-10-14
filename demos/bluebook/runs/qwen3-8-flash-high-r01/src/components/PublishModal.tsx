import { useState } from "react";
import { makeUserPost } from "../data/mock";
import { useFeedStore } from "../store/feed";

const TAGS = ["生活", "旅行", "美食", "穿搭", "摄影", "家居"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PublishModal({ open, onClose }: Props) {
  const addPost = useFeedStore((s) => s.addPost);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>(["生活"]);
  if (!open) return null;

  const submit = () => {
    addPost(makeUserPost(title.trim(), tags));
    setTitle("");
    setTags(["生活"]);
    onClose();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-4 shadow-xl sm:rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-gray-800">发布笔记</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={40}
          placeholder="填写标题"
          className="mt-3 w-full rounded-card bg-[#f3f4f6] px-3 py-2 text-sm outline-none placeholder:text-gray-400"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() =>
                setTags((cur) =>
                  cur.includes(t)
                    ? cur.filter((x) => x !== t)
                    : cur.length < 3
                      ? [...cur, t]
                      : cur,
                )
              }
              className={`rounded-full px-3 py-1 text-xs transition ${
                tags.includes(t)
                  ? "bg-brand text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-gray-100 py-2 text-sm text-gray-600 active:scale-95"
          >
            取消
          </button>
          <button
            onClick={submit}
            disabled={!title.trim()}
            className="flex-1 rounded-full bg-brand py-2 text-sm text-white active:scale-95 disabled:opacity-40"
          >
            发布
          </button>
        </div>
      </div>
    </div>
  );
}
