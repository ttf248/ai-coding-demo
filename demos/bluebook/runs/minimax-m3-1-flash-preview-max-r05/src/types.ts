export interface Note {
  id: string;
  title: string;
  image: string;
  /** 图片原始比例（宽 / 高），用于瀑布流高度自适应 */
  ratio: number;
  author: string;
  likes: number;
}

export interface Tab {
  key: string;
  label: string;
}
