import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function SearchIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="10.9" cy="10.9" r="6.7" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} {...props}>
      <path
        d="M20.2 8.8c0 4.3-8.2 10-8.2 10s-8.2-5.7-8.2-10a4.1 4.1 0 0 1 7.3-2.6l.9 1 .9-1a4.1 4.1 0 0 1 7.3 2.6Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M19.8 4.6C11.2 4.3 6.1 6.6 5 11.1c-.7 2.8 1.1 5.5 3.9 5.6 4.4.2 8.3-5.1 10.9-12.1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M4.4 20c2.4-4.4 5.4-7.2 9.3-9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 4v15m0 0 5.5-5.5M12 19l-5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
