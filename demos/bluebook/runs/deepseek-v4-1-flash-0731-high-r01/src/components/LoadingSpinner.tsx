interface Props {
  label?: string;
}

/** 加载动画：三个跳动的小圆点 */
export function LoadingSpinner({ label = "正在加载" }: Props) {
  return (
    <div
      className="flex items-center justify-center gap-2 py-5"
      role="status"
      aria-live="polite"
    >
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-xhs"
            style={{
              animation: "heart-pop 0.9s ease-in-out infinite",
              animationDelay: i * 0.15 + "s",
            }}
          />
        ))}
      </span>
      <span className="text-[12px] text-neutral-400">{label}</span>
    </div>
  );
}
