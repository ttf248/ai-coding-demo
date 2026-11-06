declare module "react-lazyload" {
  import * as React from "react";

  export interface LazyLoadProps {
    height?: number | string;
    offset?: number | number[];
    overflow?: boolean;
    resize?: boolean;
    once?: boolean;
    placeholder?: React.ReactNode;
    throttle?: number | boolean;
    debounce?: number | boolean;
    scrollContainer?: string | HTMLElement;
    unmountIfInvisible?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export default class LazyLoad extends React.Component<LazyLoadProps> {}
}
