declare module 'react-lazyload' {
  import type { ReactNode } from 'react';
  export default function LazyLoad(props: {
    children: ReactNode;
    height?: number | string;
    once?: boolean;
    offset?: number | number[];
    placeholder?: ReactNode;
    scrollContainer?: () => HTMLElement | null;
  }): JSX.Element;
}
