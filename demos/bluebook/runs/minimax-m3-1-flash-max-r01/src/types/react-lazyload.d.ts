declare module "react-lazyload" {
  import * as React from "react";

  export interface LazyLoadProps {
    children?: React.ReactNode;
    className?: string;
    height?: number | string;
    width?: number | string;
    offset?: number;
    threshold?: number;
    placeholder?: React.ReactNode;
    src?: string | string[];
    srcSet?: string | string[];
    unload?: boolean;
    visibleByDefault?: boolean;
    onLoad?: (arg: { src?: string | string[] }) => void;
    onError?: (arg: { src?: string | string[] }) => void;
    onVisible?: () => void;
    scrollContainer?: HTMLElement;
    scrollPosition?: number;
  }

  export default class LazyLoad extends React.Component<LazyLoadProps> {}
  export function forceCheck(): void;
  export function forceVisible(el: HTMLElement): void;
}
