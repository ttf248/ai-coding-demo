import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const SearchIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const HeartIcon = ({ filled = false, ...props }: IconProps & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={filled ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 0-6.6 4.4 4.4 0 0 1 6.2 0l1.2 1.2 1.2-1.2a4.4 4.4 0 0 1 6.2 0 4.7 4.7 0 0 1 0 6.6Z" />
  </svg>
);

export const PublishIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
    strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Spinner = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`animate-spin-slow ${className}`} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
