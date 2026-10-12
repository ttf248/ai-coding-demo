import { useState } from 'react'
import LazyLoad from 'react-lazyload'
import { FALLBACK_IMAGE } from '../lib/mock'

interface PostImageProps {
  src: string
  alt: string
  ratio: number
  lazy?: boolean
}

/** 图片：宽度 100%、高度自适应；懒加载；加载失败显示默认图 */
export default function PostImage({ src, alt, ratio, lazy = true }: PostImageProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const img = (
    <img
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      draggable={false}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (!failed) setFailed(true)
      }}
      className={`block h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  )

  return (
    <div className="w-full overflow-hidden bg-slate-200" style={{ aspectRatio: `1 / ${ratio}` }} data-failed={failed || undefined}>
      {lazy ? (
        <LazyLoad height="100%" offset={240} once placeholder={<div className="h-full w-full animate-pulse bg-slate-200" />}>
          {img}
        </LazyLoad>
      ) : (
        img
      )}
    </div>
  )
}
