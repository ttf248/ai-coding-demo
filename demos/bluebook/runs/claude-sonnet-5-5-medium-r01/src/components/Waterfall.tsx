import { useMemo } from 'react'
import type { Post } from '../types'
import { useColumns } from '../hooks'
import PostCard from './PostCard'

interface WaterfallProps {
  items: Post[]
  onOpen: (post: Post) => void
}

/** 卡片文字区的大致高度（相对于卡片宽度的比例），用于把卡片分配到最矮的一列 */
const FOOTER_RATIO = 0.42

export default function Waterfall({ items, onOpen }: WaterfallProps) {
  const cols = useColumns()

  const columns = useMemo(() => {
    const result: Post[][] = Array.from({ length: cols }, () => [])
    const heights = new Array(cols).fill(0)
    for (const post of items) {
      let target = 0
      for (let i = 1; i < cols; i++) if (heights[i] < heights[target]) target = i
      result[target].push(post)
      heights[target] += post.ratio + FOOTER_RATIO
    }
    return result
  }, [items, cols])

  return (
    <div className="flex items-start gap-2 tablet:gap-3" data-columns={cols}>
      {columns.map((col, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col gap-2 tablet:gap-3" data-testid="column">
          {col.map((post) => (
            <PostCard key={post.id} post={post} onOpen={onOpen} />
          ))}
        </div>
      ))}
    </div>
  )
}
