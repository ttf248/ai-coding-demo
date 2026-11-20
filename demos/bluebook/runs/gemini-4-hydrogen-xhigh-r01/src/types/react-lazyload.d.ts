declare module "react-lazyload" {
  import * as React from "react";

  export interface LazyLoadProps {
    height?: number | string;
    offset?: number | number[];
    once?: boolean;
    placeholder?: React.ReactNode;
    overflow?: boolean;
    resize?: boolean;
    scroll?: boolean;
    scrollContainer?: string | Element;
    children?: React.ReactNode;
    classNamePrefix?: string;
    style?: React.CSSProperties;
  }

  export default class LazyLoad extends React.Component<LazyLoadProps> {}
}
