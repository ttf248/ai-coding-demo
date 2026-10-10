import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export const SearchIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

export const PlusIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}><path d="M12 5v14M5 12h14" /></svg>
);

export const CloseIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}><path d="M18 6 6 18M6 6l12 12" /></svg>
);

export const BackIcon = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size, p)}><path d="m15 18-6-6 6-6" /></svg>
);

export const ArrowUpIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
);

export const ArrowDownIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)}><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
);

export const StarIcon = ({ size = 22, filled = false, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(size, p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  </svg>
);

export const ChatIcon = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size, p)}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /></svg>
);

export const HeartIcon = ({ size = 16, filled = false, ...p }: IconProps & { filled?: boolean }) => (
  <svg {...base(size, p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.6 3.1 4.4 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />
  </svg>
);
