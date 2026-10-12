export interface Post {
  id: string
  title: string
  image: string
  /** 图片宽高比（高 / 宽），用于不同高度的瀑布流布局 */
  ratio: number
  author: string
  avatar: string
  likes: number
  desc: string
}
