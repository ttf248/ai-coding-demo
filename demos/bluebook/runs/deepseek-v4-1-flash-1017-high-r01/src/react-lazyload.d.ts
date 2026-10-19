declare module "react-lazyload" {
  import type { ReactNode } from "react";

  interface LazyLoadProps {
    children?: ReactNode;
    placeholder?: ReactNode;
    height?: number | string;
    offset?: number | number[];
    once?: boolean;
    scroll?: boolean;
    resize?: boolean;
    overflow?: boolean;
    debounce?: number | false;
    throttle?: number | false;
    className?: string;
  }

  export default function LazyLoad(props: LazyLoadProps): JSX.Element;
}
