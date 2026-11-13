import { useState } from "react";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
}

export default function LikeButton({ liked, count, onToggle }: LikeButtonProps) {
  const [pop, setPop] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "取消点赞" : "点赞"}
      className="flex min-h-[32px] items-center gap-1 text-xs text-neutral-500 transition-colors hover:text-primary"
      onClick={(e) => {
        e.stopPropagation();
        setPop(true);
        onToggle();
      }}
      onAnimationEnd={() => setPop(false)}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${pop ? "animate-heart-pop" : ""} ${liked ? "fill-primary stroke-primary" : "fill-none stroke-current"}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}