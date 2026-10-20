declare module "react-lazyload" {
  import * as React from "react";

  export interface LazyLoadProps {
    height?: number | string;
    width?: number | string;
    offset?: number;
    threshold?: number;
    once?: boolean;
    placeholder?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onVisible?: () => void;
  }

  const LazyLoad: React.ComponentType<LazyLoadProps>;
  export default LazyLoad;
}
