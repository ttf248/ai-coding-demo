declare module "react-lazyload" {
  import type { ComponentType, ReactNode } from "react";
  export interface LazyLoadProps {
    height?: number | string;
    offset?: number | [number, number];
    once?: boolean;
    placeholder?: ReactNode;
    overflow?: boolean;
    resize?: boolean;
    scroll?: boolean;
    debounce?: number | boolean;
    throttle?: number | boolean;
    children?: ReactNode;
  }
  const LazyLoad: ComponentType<LazyLoadProps>;
  export default LazyLoad;
}
