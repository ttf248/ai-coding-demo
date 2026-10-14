import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#e5e7eb"/><g fill="none" stroke="#9ca3af" stroke-width="10" stroke-linecap="round"><circle cx="150" cy="132" r="42"/><path d="M150 108v48M126 132h48"/></g><text x="150" y="235" font-size="24" fill="#9ca3af" text-anchor="middle" font-family="sans-serif">图片走丢了</text></svg>`,
  );

interface Props {
  src: string;
  alt: string;
  height: number;
}

/** 带骨架占位与失败兜底的图片（外层已包裹 react-lazyload） */
export default function LazyImage({ src, alt, height }: Props) {
  const [state, setState] = useState<"loading" | "ok" | "error">(
    "loading",
  );
  return (
    <div
      className="relative w-full overflow-hidden rounded-t-card bg-gray-100"
      style={{ height }}
    >
      {state === "loading" && (
        <div className="skeleton-breathe absolute inset-0 bg-gray-200" />
      )}
      <img
        src={state === "error" ? FALLBACK : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setState((s) => (s === "error" ? s : "ok"))}
        onError={() => setState("error")}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
