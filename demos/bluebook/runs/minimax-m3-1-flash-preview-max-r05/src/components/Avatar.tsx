import type { CSSProperties } from "react";

const PALETTE = [
  ["#ff9a9e", "#fad0c4"],
  ["#a18cd1", "#fbc2eb"],
  ["#84fab0", "#8fd3f4"],
  ["#ffecd2", "#fcb69f"],
  ["#a1c4fd", "#c2e9fb"],
  ["#fbc2eb", "#a6c1ee"],
];

/** 文字头像：用昵称首字生成渐变圆形头像，避免引入外部图片资源 */
export default function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const seed = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0);
  const [from, to] = PALETTE[seed % PALETTE.length];
  const style: CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.46),
    background: `linear-gradient(135deg, ${from}, ${to})`,
  };
  return (
    <span
      className="inline-grid place-items-center rounded-full text-white font-medium shrink-0 select-none"
      style={style}
      aria-hidden
    >
      {name.slice(0, 1)}
    </span>
  );
}
