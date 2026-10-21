declare module "react-lazyload" {
  import type { ComponentType, ReactNode } from "react";

  interface LazyLoadProps {
    children?: ReactNode;
    height?: number | string;
    width?: number | string;
    className?: string;
    placeholder?: ReactNode;
    throttle?: number;
    once?: boolean;
    offset?: number;
    style?: React.CSSProperties;
    onLoad?: () => void;
    onError?: () => void;
  }

  const LazyLoad: ComponentType<LazyLoadProps>;
  export default LazyLoad;
}
