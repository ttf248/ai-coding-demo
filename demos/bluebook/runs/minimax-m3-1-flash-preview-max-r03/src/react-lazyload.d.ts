declare module "react-lazyload" {
  import type { ComponentType, CSSProperties, ReactNode } from "react";

  export interface LazyLoadProps {
    className?: string;
    wrapperClassName?: string;
    wrapperProps?: Record<string, unknown> & { style?: CSSProperties };
    /** 占位高度，单位 px */
    height?: number | string;
    width?: number | string;
    delay?: number;
    threshold?: number;
    offset?: number | string;
    once?: boolean;
    eager?: boolean;
    placeholder?: ReactNode;
    scrollParent?: HTMLElement | Window | null;
    resize?: boolean;
    throttle?: number;
    debounce?: number;
    onLoad?: (options?: unknown) => void;
    onError?: (options?: unknown) => void;
    children?: ReactNode;
  }

  const LazyLoad: ComponentType<LazyLoadProps>;
  export default LazyLoad;
}
