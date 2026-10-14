import { useState } from "react";
import LazyLoad from "react-lazyload";

const FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='#eceef1'/><path d='M120 210l52-58 42 44 34-32 52 46z' fill='#d6d9df'/><circle cx='160' cy='120' r='22' fill='#d6d9df'/><text x='200' y='272' font-size='15' fill='#a7adb8' text-anchor='middle'>图片加载失败</text></svg>`,
  );

/** 图片懒加载 + 加载失败兜底（占位图） */
export default function LazyImage({ src, alt, ratio }: { src: string; alt: string; ratio: number }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <LazyLoad once height={`${Math.round(ratio * 100)}%`} offset={200} placeholder={<div className="w-full h-full bg-[#f0f1f3]" />}>
      <div className="w-full h-full overflow-hidden relative" style={{ paddingBottom: `${ratio * 100}%` }}>
        <img
          src={failed ? FALLBACK : src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded || failed ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </LazyLoad>
  );
}
