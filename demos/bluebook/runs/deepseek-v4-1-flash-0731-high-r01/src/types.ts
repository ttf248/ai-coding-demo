/** 一条笔记（瀑布流卡片） */
export interface Note {
  id: string;
  title: string;
  author: string;
  /** 文字头像的底色 */
  avatarColor: string;
  likes: number;
  /** 本地图片资源，位于 images/ 目录，构建时自动拷贝 */
  image: string;
  /** 图片宽高比，用于在图片加载前占位、避免布局跳动 */
  ratio: number;
  /** 图片加载失败时展示备用底图 */
  fallback: string;
}

export type FeedStatus = "idle" | "loading" | "refreshing" | "error";
