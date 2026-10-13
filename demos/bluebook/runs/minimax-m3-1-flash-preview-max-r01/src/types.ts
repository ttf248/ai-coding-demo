export interface Note {
  id: string;
  title: string;
  nickname: string;
  avatar: string;
  image: string;
  /** 原始像素尺寸，用于在图片加载前预留正确的展示高度，避免瀑布流跳动 */
  imgW: number;
  imgH: number;
  likes: number;
}
