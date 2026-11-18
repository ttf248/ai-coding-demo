import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import LazyLoad from "react-lazyload";
import { categories, type Post } from "./data";
import { useFeed } from "./store";

export function Icon({
  name,
  filled = false,
}: {
  name: "search" | "heart" | "plus" | "close" | "refresh";
  filled?: boolean;
}) {
  const paths = {
    search: "M21 21l-4.1-4.1M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
    heart:
      "M20.8 8.6c0 4.5-8.8 9.7-8.8 9.7S3.2 13.1 3.2 8.6a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z",
    plus: "M5 12h14m-7-7v14",
    close: "m6 6 12 12M18 6 6 18",
    refresh: "M20 10a8 8 0 1 0-2 7M20 4v6h-6",
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function PostImage({ post }: { post: Post }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [post.image]);
  return (
    <div className="photo" style={{ aspectRatio: "520 / " + post.height }}>
      {failed ? (
        <div
          role="img"
          aria-label="图片不可用"
          className="grid h-full w-full place-items-center bg-[#ece6e9] text-sm text-quiet"
        >
          图片不可用
        </div>
      ) : (
        <img
          src={post.image}
          alt={post.title}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function Likes({ post }: { post: Post }) {
  const liked = useFeed((state) => state.likes[post.id] ?? false);
  const toggle = useFeed((state) => state.toggleLike);
  return (
    <button
      type="button"
      className="like"
      aria-label={(liked ? "取消赞 " : "点赞 ") + post.title}
      aria-pressed={liked}
      onClick={() => toggle(post.id)}
    >
      <span key={String(liked)} className={liked ? "pulse-heart" : ""}>
        <Icon name="heart" filled={liked} />
      </span>
      <span>{post.likes + Number(liked)}</span>
    </button>
  );
}

function Author({ post }: { post: Post }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <span
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
        style={{ background: post.color }}
      >
        {post.author[0]}
      </span>
      <span className="truncate text-xs text-quiet">{post.author}</span>
    </span>
  );
}

export function PostCard({ post, open }: { post: Post; open: () => void }) {
  return (
    <article className="card" data-post={post.id}>
      <button type="button" onClick={open} className="block w-full text-left">
        <LazyLoad
          once
          offset={260}
          placeholder={
            <div
              className="photo"
              style={{ aspectRatio: "520 / " + post.height }}
            />
          }
        >
          <PostImage post={post} />
        </LazyLoad>
        <h2 className="line-clamp-2 px-3 pt-2.5 text-sm font-semibold leading-5">
          {post.title}
        </h2>
      </button>
      <footer className="flex items-center justify-between gap-1 px-2.5 pb-2 pt-1.5">
        <Author post={post} />
        <Likes post={post} />
      </footer>
    </article>
  );
}

export function Overlay({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const current = dialog.current;
    current?.showModal();
    return () => current?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="overlay"
      aria-labelledby="overlay-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      <section className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 id="overlay-title" className="text-lg font-bold">
            {title}
          </h2>
          <button
            type="button"
            className="icon-button"
            aria-label="关闭"
            onClick={close}
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </section>
    </dialog>
  );
}
export function PostDetail({ post, close }: { post: Post; close: () => void }) {
  return (
    <Overlay title={post.title} close={close}>
      <div className="detail-image overflow-hidden rounded-lg">
        <PostImage post={post} />
      </div>
      <div className="flex items-center justify-between">
        <Author post={post} />
        <Likes post={post} />
      </div>
      <p className="text-sm leading-relaxed text-quiet">{post.body}</p>
    </Overlay>
  );
}

export function Publisher({ close }: { close: () => void }) {
  const publish = useFeed((state) => state.publish);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const file = fields.get("photo");
    const title = String(fields.get("title") ?? "").trim();
    if (
      !title ||
      !(file instanceof File) ||
      !file.size ||
      !file.type.startsWith("image/") ||
      file.size > 15 * 1024 * 1024
    ) {
      setError("请填写标题，并选一张不超过 15 MB 的图片。");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const source = await createImageBitmap(file);
      const width = Math.min(
        760,
        source.width,
        Math.floor((1200 * source.width) / source.height),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(
        1,
        Math.min(
          1200,
          Math.round((source.height * canvas.width) / source.width),
        ),
      );
      const ctx = canvas.getContext("2d");
      try {
        if (!ctx) throw new Error("canvas");
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
      } finally {
        source.close();
      }
      publish({
        id: "local-" + Date.now(),
        title,
        body: String(fields.get("body") ?? "").trim(),
        category: fields.get("category") as Post["category"],
        author: "我",
        color: "#a54e61",
        image: canvas.toDataURL("image/webp", 0.84),
        height: Math.max(
          285,
          Math.min(970, (520 * canvas.height) / canvas.width),
        ),
        likes: 0,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      close();
    } catch {
      setError("无法读取这张图片，请试试 PNG、JPG 或 WebP。");
      setBusy(false);
    }
  }
  return (
    <Overlay title="发布一条笔记" close={close}>
      <form className="grid gap-3 text-sm" onSubmit={submit}>
        <label className="grid gap-1.5">
          标题
          <input className="field" name="title" maxLength={58} required />
        </label>
        <label className="grid gap-1.5">
          分类
          <select className="field" name="category">
            {categories.slice(1).map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5">
          照片
          <input
            className="field"
            name="photo"
            type="file"
            accept="image/*"
            required
          />
        </label>
        <label className="grid gap-1.5">
          正文
          <textarea className="field" name="body" rows={3} maxLength={500} />
        </label>
        {error && (
          <p className="text-[#9e2044]" role="alert">
            {error}
          </p>
        )}
        <button disabled={busy} className="publish">
          {busy ? "正在处理" : "发布笔记"}
        </button>
      </form>
    </Overlay>
  );
}
