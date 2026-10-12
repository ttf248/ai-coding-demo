import { memo } from 'react'
import type { Post } from '../types'
import LikeButton from './LikeButton'
import PostImage from './PostImage'

interface PostCardProps {
  post: Post
  onOpen: (post: Post) => void
}

function PostCard({ post, onOpen }: PostCardProps) {
  return (
    <article
      onClick={() => onOpen(post)}
      className="cursor-pointer select-none overflow-hidden rounded-lg bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.97] active:shadow-sm"
      data-testid="post-card"
    >
      <PostImage src={post.image} alt={post.title} ratio={post.ratio} />
      <div className="p-2.5">
        <h2 className="line-clamp-2 text-[13px] font-medium leading-[1.35] text-gray-800">{post.title}</h2>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <img src={post.avatar} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" draggable={false} />
            <span className="truncate text-xs text-gray-500">{post.author}</span>
          </div>
          <LikeButton id={post.id} base={post.likes} />
        </div>
      </div>
    </article>
  )
}

export default memo(PostCard)
