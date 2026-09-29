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

export const PlusIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}
    strokeLinecap="round" {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ArrowIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
