import { useState } from "react";
import { useStore } from "../store";

export default function PublishModal() {
  const open = useStore((s) => s.publishOpen);
  const setPublish = useStore((s) => s.setPublish);
  const publish = useStore((s) => s.publish);
  const [title, setTitle] = useState("");
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-30 grid place-items-center bg-black/45 p-6 animate-fadein"
      onClick={() => setPublish(false)}
      role="dialog"
      aria-modal="true"
      aria-label="发布笔记"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[16px] font-bold text-gray-800">发布笔记</h2>
        <p className="mt-1 text-[12px] text-gray-500">标题将展示在瀑布流卡片上，封面随机分配。</p>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="写一个吸引人的标题…"
          className="mt-4 w-full rounded-xl border border-gray-200 bg-page px-4 py-3 text-[13px] outline-none focus:border-primary/50 focus:bg-white"
        />
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => setPublish(false)}
            className="flex-1 rounded-full bg-page py-3 text-[13px] font-medium text-gray-600"
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => {
              publish(title.trim());
              setTitle("");
            }}
            className="flex-1 rounded-full bg-primary py-3 text-[13px] font-semibold text-white active:scale-95"
          >
            发布
          </button>
        </div>
      </div>
    </div>
  );
}
