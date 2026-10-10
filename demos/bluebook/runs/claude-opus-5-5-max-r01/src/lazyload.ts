import LazyLoadImport, { forceCheck } from 'react-lazyload';

// react-lazyload ships Babel-compiled CommonJS. Under Vite 8 (Rolldown) the default import can be the whole
// module object instead of the component, so unwrap `.default` when present.
export const LazyLoad = (LazyLoadImport as unknown as { default?: typeof LazyLoadImport }).default ?? LazyLoadImport;

export { forceCheck };
