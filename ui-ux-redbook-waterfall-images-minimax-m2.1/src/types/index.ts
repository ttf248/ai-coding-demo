export interface Post {
  id: number
  image: string
  title: string
  author: {
    name: string
    avatar?: string
  }
  likes: number
  isLiked: boolean
}

export interface Column {
  posts: Post[]
  height: number
}
