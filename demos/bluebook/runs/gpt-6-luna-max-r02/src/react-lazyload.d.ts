declare module 'react-lazyload' {
  import type { ComponentType, ReactNode } from 'react';
  const LazyLoad: ComponentType<{ children: ReactNode; height?: number; offset?: number; once?: boolean; placeholder?: ReactNode }>;
  export default LazyLoad;
}
