import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./Icons";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (title: string, body: string) => void;
}

export default function PublishModal({ open, onClose, onPublish }: PublishModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => bodyRef.current?.focus(), 80);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const canPublish = title.trim().length > 0 || body.trim().length > 0;

  const submit = () => {
    if (!canPublish) return;
    onPublish(title, body);
    setTitle("");
    setBody("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="发布笔记"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="animate-fadeIn w-full max-w-[560px] rounded-t-2xl bg-white p-4 shadow-2xl sm:rounded-2xl sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-gray-900">发布笔记</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="关闭"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
          <div className="flex h-28 items-center justify-center bg-gradient-to-br from-[#ff9a8b] via-[#ff6a88] to-[#ff99ac] text-center">
            <div className="rounded-full bg-white/25 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              封面将根据内容自动生成
            </div>
          </div>
          <div className="p-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value.slice(0, 40))}
              placeholder="填写标题会有更多赞哦～"
              aria-label="笔记标题"
              className="w-full border-0 bg-transparent text-[15px] font-semibold text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-300"
            />
            <textarea
              ref={bodyRef}
              value={body}
              onChange={(event) => setBody(event.target.value.slice(0, 500))}
              placeholder="分享此刻的生活……"
              aria-label="笔记正文"
              rows={5}
              className="mt-2 w-full resize-none border-0 bg-transparent text-[13px] leading-6 text-gray-700 outline-none placeholder:text-gray-300"
            />
            <div className="mt-1 text-right text-[10px] text-gray-300">{body.length} / 500</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">发布后会出现在瀑布流顶部</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canPublish}
              className="rounded-full bg-xhs px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-xhs-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              发布
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
