import { useEffect, useRef, useState } from "react";
import LazyLoad from "react-lazyload";
import type { Note } from "../types";
import { FALLBACK_IMAGE } from "../lib/fallback";
import { ImageOffIcon } from "./Icons";

interface Props {
  note: Note;
  /** 卡片宽度，用于把占位高度对齐真实宽高比 */
  width: number;
  height: number;
}

export default function LazyImage({ note, width, height }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [note.image]);

  // 命中浏览器缓存时 onLoad 可能早于 React 绑定，这里补一次状态校准
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  });

  return (
    <div className="relative w-full overflow-hidden bg-[#f0f0f2]" style={{ height }}>
      <LazyLoad
        height={height}
        width={width}
        throttle={120}
        debounce={60}
        once
        wrapperProps={{ className: "block w-full" }}
        placeholder={
          <span
            className="block w-full animate-shimmer"
            style={{
              height,
              backgroundImage:
                "linear-gradient(90deg,#f0f0f2 0%,#f7f7f8 40%,#f0f0f2 80%)",
              backgroundSize: "460px 100%",
            }}
          />
        }
      >
        <img
          ref={imgRef}
          src={failed ? FALLBACK_IMAGE : note.image}
          alt={note.title}
          draggable={false}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={`block w-full select-none object-cover transition-opacity duration-500 ease-spring ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ height }}
        />
      </LazyLoad>

      {failed && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center text-[#c9c9cf]">
          <ImageOffIcon className="h-7 w-7" />
        </span>
      )}
    </div>
  );
}
