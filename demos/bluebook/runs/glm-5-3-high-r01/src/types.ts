export interface Note {
  id: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  img: string;
  /** 图片宽高比（width / height），用于占位与瀑布流分配 */
  ratio: number;
}
