import { useState } from 'react';
import { LazyLoad } from '../lazyload';
import { assetUrl, FALLBACK_IMAGE } from '../utils';

interface Props {
  src: string;
  width: number;
  height: number;
  alt: string;
  eager?: boolean;
}

/** Fixed aspect-ratio box (from the mock metadata) + react-lazyload; swaps to the default image on error. */
export default function LazyImage({ src, width, height, alt, eager = false }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const img = (
    <img
      src={failed ? FALLBACK_IMAGE : assetUrl(src)}
      alt={alt}
      decoding="async"
      draggable={false}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setLoaded(false);
        }
      }}
      data-failed={failed || undefined}
      className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${failed ? 'object-contain' : 'object-cover'} ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
  return (
    <div className="relative w-full overflow-hidden bg-gray-100" style={{ paddingBottom: `${(height / width) * 100}%` }}>
      {!loaded && <div className="skeleton absolute inset-0" />}
      {eager ? img : (
        <LazyLoad className="absolute inset-0" offset={300} once>
          {img}
        </LazyLoad>
      )}
    </div>
  );
}
