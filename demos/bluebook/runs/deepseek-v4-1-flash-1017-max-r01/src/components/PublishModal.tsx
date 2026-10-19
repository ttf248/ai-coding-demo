import { useEffect, useRef, useState } from "react";
import { useFeedStore } from "../store/useFeedStore";
import { CloseIcon, SparkIcon } from "./Icons";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublished: () => void;
}

export function PublishModal({ open, onClose, onPublished }: PublishModalProps) {
  const publish = useFeedStore((state) => state.publish);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => titleRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = () => {
    if (!title.trim()) return;
    publish(title, body);
    setTitle("");
    setBody("");
    onClose();
    onPublished();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="发布笔记"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="animate-fade-up w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-[17px] font-bold text-neutral-900">
            <SparkIcon className="h-4 w-4 text-brand" />
            发布新笔记
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-600"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <div className="grid h-[74px] w-[74px] shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ffd7c9] via-[#ff9e8a] to-[#b94b5b] text-center text-[9px] font-medium leading-tight text-white/90">
            封面<br />自动生成
          </div>
          <div className="min-w-0 flex-1">
            <input
              ref={titleRef}
              value={title}
              maxLength={60}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="给这篇笔记起个标题…"
              className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-[13px] outline-none transition placeholder:text-neutral-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
            />
            <p className="mt-1 text-right text-[10px] text-neutral-300">{title.length}/60</p>
          </div>
        </div>
        <textarea
          value={body}
          maxLength={500}
          onChange={(event) => setBody(event.target.value)}
          placeholder="分享此刻的心情、见闻或一个小发现…"
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-neutral-200 p-3 text-[13px] leading-6 outline-none transition placeholder:text-neutral-400 focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400">发布后会出现在瀑布流最前面</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-[12px] font-medium text-neutral-500 transition hover:bg-neutral-100"
            >
              取消
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!title.trim()}
              className="rounded-full bg-brand px-5 py-2 text-[12px] font-semibold text-white shadow-sm shadow-brand/25 transition enabled:hover:bg-[#e6244b] enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              发布笔记
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
