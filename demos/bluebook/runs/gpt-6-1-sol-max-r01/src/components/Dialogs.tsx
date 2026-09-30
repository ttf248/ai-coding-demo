import { useEffect, useRef, useState, type FormEvent } from "react";
import { type Post, fallbackImage } from "../mock";
import { useFeed } from "../store";
import { Icon } from "./Icon";
function Shell({
  children,
  onClose,
  label,
}: {
  children: React.ReactNode;
  onClose: () => void;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="w-[calc(100%-24px)] max-w-3xl overflow-y-auto rounded-2xl p-0 backdrop:bg-black/45"
    >
      <div className="relative">
        <button
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow"
          aria-label="关闭"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
export function DetailDialog({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  const liked = useFeed((s) => s.likes.includes(post.id)),
    toggle = useFeed((s) => s.toggleLike),
    [follow, setFollow] = useState(false);
  return (
    <Shell onClose={onClose} label="笔记详情">
      <div className="grid sm:grid-cols-2">
        <img
          src={post.image}
          alt={post.title}
          className="max-h-[65vh] w-full object-cover sm:h-full sm:max-h-[80vh]"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackImage();
          }}
        />
        <section className="flex flex-col p-6 pt-14">
          <div className="mb-8 flex items-center justify-between">
            <span className="font-medium">{post.author}</span>
            <button
              className="rounded-full border border-brand px-4 py-1 text-sm text-brand"
              onClick={() => setFollow(!follow)}
            >
              {follow ? "已关注" : "关注"}
            </button>
          </div>
          <h2 className="text-xl font-bold leading-8">{post.title}</h2>
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-stone-600">
            {post.description}
          </p>
          <p className="my-5 text-sm text-brand">
            #{post.category} #日常记录 #把日子过成喜欢的样子
          </p>
          <div className="mt-auto border-t pt-5">
            <button
              aria-pressed={liked}
              className={`like flex items-center gap-2 ${liked ? "liked text-brand" : ""}`}
              onClick={() => toggle(post.id)}
            >
              <Icon name="heart" />
              {post.likes + (liked ? 1 : 0)} 人喜欢这条笔记
            </button>
          </div>
        </section>
      </div>
    </Shell>
  );
}
export function PublishDialog({
  onClose,
  onPublished,
}: {
  onClose: () => void;
  onPublished: () => void;
}) {
  const publish = useFeed((s) => s.publish),
    [image, setImage] = useState(""),
    [error, setError] = useState(""),
    [reading, setReading] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!image) {
      setError("先选一张图片吧");
      return;
    }
    const title = String(form.get("title")).trim();
    if (!title) {
      setError("请输入笔记标题");
      return;
    }
    publish({
      id: `local-${Date.now()}`,
      title,
      author: "我",
      image,
      ratio: 0.85,
      category: String(form.get("category")),
      likes: 0,
      description:
        String(form.get("body")).trim() || "今天，也有值得记录的事。",
    });
    onPublished();
    onClose();
  }
  return (
    <Shell onClose={onClose} label="发布笔记">
      <form onSubmit={submit} className="mx-auto max-w-xl space-y-5 p-6 pt-10">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-brand">
            A little moment
          </p>
          <h2 className="mt-2 text-2xl font-bold">分享你眼中的生活</h2>
          <p className="mt-2 text-sm text-stone-500">
            本地演示发布，刷新后不会保留。
          </p>
        </div>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50 p-5">
          {image ? (
            <img src={image} className="max-h-44 rounded-lg" alt="待发布图片" />
          ) : (
            <>
              <Icon name="image" className="h-10 w-10 text-stone-400" />
              <span className="mt-2 text-sm text-stone-500">
                选择图片（不超过 6 MB）
              </span>
            </>
          )}
          <input
            aria-label="选择图片"
            className="mt-3 block w-full text-sm"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (
                !file.type.startsWith("image/") ||
                file.size > 6 * 1024 * 1024
              ) {
                setError("请选择 6 MB 以内的图片");
                return;
              }
              setError("");
              setReading(true);
              const reader = new FileReader();
              reader.onload = () => {
                setImage(String(reader.result));
                setReading(false);
              };
              reader.onerror = () => {
                setError("图片读取失败");
                setReading(false);
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        <input
          className="w-full rounded-lg border p-3"
          name="title"
          placeholder="给这一刻起个标题"
          aria-label="笔记标题"
          maxLength={60}
          required
        />
        <textarea
          className="w-full rounded-lg border p-3"
          rows={4}
          name="body"
          placeholder="写下你的故事…"
          aria-label="笔记正文"
          maxLength={2000}
        />
        <label className="flex items-center gap-3 text-sm">
          分类
          <select name="category" className="rounded-lg border p-2">
            {["生活", "旅行", "美食", "家居", "摄影"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        {error && (
          <p role="alert" className="text-sm text-brand">
            {error}
          </p>
        )}
        <button
          disabled={reading}
          className="w-full rounded-xl bg-brand py-3 font-medium text-white disabled:opacity-50"
        >
          {reading ? "读取图片…" : "发布笔记"}
        </button>
      </form>
    </Shell>
  );
}
