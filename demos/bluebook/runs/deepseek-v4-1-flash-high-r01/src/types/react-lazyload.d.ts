/**
 * react-lazyload@3.2.0 未随包提供类型声明，这里补一份最小可用的声明，
 * 使 TypeScript 严格模式下的构建可以通过（仅覆盖本项目用到的属性）。
 */
declare module "react-lazyload" {
  import type { Component, CSSProperties, ReactElement, ReactNode } from "react";

  export interface LazyLoadProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    /** 占位高度，用于在真实内容渲染前预留空间 */
    height?: number | string;
    width?: number | string;
    /** 提前多少像素开始加载 */
    offset?: number | number[];
    /** 是否只加载一次 */
    once?: boolean;
    throttle?: number | boolean;
    debounce?: number | boolean;
    scroll?: boolean;
    resize?: boolean;
    unmountIfInvisible?: boolean;
    placeholder?: ReactElement | null;
    overflow?: boolean;
    scrollContainer?: string | Element;
  }

  export default class LazyLoad extends Component<LazyLoadProps> {}
}
