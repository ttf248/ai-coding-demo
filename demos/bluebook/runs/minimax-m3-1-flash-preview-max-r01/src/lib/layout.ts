import type { Note } from "../types";

export const GRID_GAP = 16;

/** 提示词要求：移动端两列、平板三列、桌面四列 */
export function columnsForWidth(width: number): number {
  if (width >= 1024) return 4;
  if (width >= 640) return 3;
  return 2;
}

export function cardWidthFor(width: number, columns: number): number {
  return Math.max(120, (width - GRID_GAP * (columns - 1)) / columns);
}

/** 图片展示高度，和真实宽高比一致，保证占位与加载完成后一致 */
export function imageHeightFor(note: Note, cardWidth: number): number {
  return Math.round((cardWidth * note.imgH) / note.imgW);
}

/**
 * 卡片高度估算 = 图片 + 内边距 + 两行标题 + 作者行。
 * 分桶时用它估算各列高度，只影响列分配，不影响最终渲染高度。
 */
export function estimateCardHeight(note: Note, cardWidth: number): number {
  return (
    imageHeightFor(note, cardWidth) +
    BODY_PADDING_TOP +
    TITLE_LINE_HEIGHT * 2 +
    BODY_GAP +
    FOOTER_HEIGHT +
    BODY_PADDING_BOTTOM
  );
}

const BODY_PADDING_TOP = 10;
const BODY_PADDING_BOTTOM = 12;
const BODY_GAP = 8;
const TITLE_LINE_HEIGHT = 18;
const FOOTER_HEIGHT = 24;
