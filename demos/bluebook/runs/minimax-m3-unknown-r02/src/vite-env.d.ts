/// <reference types="vite/client" />

declare module 'react-lazyload' {
  import * as React from 'react';

  export interface LazyLoadProps {
    height?: number | string;
    width?: number | string;
    offset?: number | Array<number>;
    offsetVertical?: number;
    offsetHorizontal?: number;
    offsetTop?: number;
    offsetBottom?: number;
    offsetLeft?: number;
    offsetRight?: number;
    throttle?: number | false;
    debounce?: number | false;
    throttleHidden?: boolean;
    placeholder?: React.ReactNode;
    scroll?: boolean;
    scrollContainer?: string | HTMLElement;
    resize?: boolean;
    useIntersection?: boolean;
    rootMargin?: string;
    unmountIfInvisible?: boolean;
    visibleByDefault?: boolean;
    children: React.ReactNode;
    once?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }

  const LazyLoad: React.FC<LazyLoadProps>;
  export default LazyLoad;
}
