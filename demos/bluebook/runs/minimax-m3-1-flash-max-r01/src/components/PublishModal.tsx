import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PublishModal({ open, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-fade-in rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">发布新内容</h2>
          <button
            onClick={onClose}
            className="text-[#8a8f99] hover:text-[#1f2329]"
            aria-label="关闭"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m5 13 4 4L19 7" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm text-[#1f2329]">已提交，等待审核</p>
            <p className="mt-1 text-xs text-[#8a8f99]">内容将出现在你的主页中</p>
            <button
              onClick={() => {
                setSent(false);
                setTitle("");
                onClose();
              }}
              className="mt-5 w-full rounded-full bg-primary py-2.5 text-sm font-medium text-white"
            >
              好的
            </button>
          </div>
        ) : (
          <>
            <label className="mt-4 block text-[13px] text-[#8a8f99]">标题</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给这份内容起个标题"
              className="mt-1 w-full rounded-xl bg-canvas px-3 py-2.5 text-sm outline-none ring-1 ring-transparent focus:ring-primary/40"
            />
            <div className="mt-3 flex h-32 items-center justify-center rounded-xl border border-dashed border-[#dfe2e8] text-[13px] text-[#a8adb8]">
              拖拽图片到这里上传
            </div>
            <button
              onClick={() => setSent(true)}
              disabled={!title.trim()}
              className="mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-medium text-white transition enabled:active:scale-95 disabled:opacity-40"
            >
              发布
            </button>
          </>
        )}
      </div>
    </div>
  );
}
