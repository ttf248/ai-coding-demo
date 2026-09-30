export type Post = {
  id: string;
  title: string;
  author: string;
  image: string;
  ratio: number;
  category: string;
  likes: number;
  description: string;
};
export const categories = ["推荐", "旅行", "生活", "美食", "家居", "摄影"];
const photos = [
  "photo-1470770841072-f978cf4d019e",
  "photo-1441974231531-c6227db76b6e",
  "photo-1518837695005-2083093ee35b",
  "photo-1500530855697-b586d89ba3ee",
  "photo-1495474472287-4d71bcdd2085",
  "photo-1484154218962-a197022b5858",
  "photo-1493246507139-91e8fad9978e",
  "photo-1464822759023-fed622ff2c3b",
  "photo-1517248135467-4c7edcad34c4",
  "photo-1519681393784-d120267933ba",
  "photo-1501785888041-af3ef285b470",
  "photo-1494438639946-1ebd1d20bf85",
];
const titles = [
  "在山里，找回自己的节奏",
  "把周末留给一片绿色",
  "海边没有计划的一天",
  "不赶路的时候，风景刚刚好",
  "今天的快乐是一杯手冲",
  "关于我理想中的小家",
  "收藏了很久的湖边散步路线",
  "山是不会回消息的朋友",
  "在转角遇见一家小店",
  "抬头看，今晚的星空很美",
  "出发吧，生活总有新的答案",
  "让房间慢慢长成自己的样子",
];
const authors = [
  "小满",
  "一颗橘子",
  "阿树的日常",
  "南风",
  "木木",
  "林间",
  "陈小岛",
  "慢慢生活",
];
const groups = [
  "旅行",
  "生活",
  "摄影",
  "旅行",
  "美食",
  "家居",
  "旅行",
  "摄影",
  "美食",
  "摄影",
  "旅行",
  "家居",
];
export function makePosts(): Post[] {
  return Array.from({ length: 160 }, (_, i) => ({
    id: `note-${i + 1}`,
    title: titles[i % 12] + (i >= 12 ? ` · ${Math.floor(i / 12) + 1}` : ""),
    author: authors[i % 8],
    image: `https://images.unsplash.com/${photos[i % 12]}?auto=format&fit=crop&w=700&q=80`,
    ratio: [0.77, 1, 1.24, 0.82, 1.08, 0.72][i % 6],
    category: groups[i % 12],
    likes: 23 + ((i * 137) % 1200),
    description:
      "记录一些不必急着完成的日常。带上相机，走一条没走过的路，给生活留一点空白，也给自己留一点时间。\n\n这里是演示社区，所有笔记与互动均为本地 mock 数据。",
  }));
}
export function fallbackImage(label = "生活的另一种可能") {
  return (
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#ece4d9"/><stop offset="1" stop-color="#c2cebd"/></linearGradient></defs><rect width="600" height="760" fill="url(#g)"/><circle cx="410" cy="250" r="110" fill="#fff8e7"/><path d="M0 660 200 370 350 560 450 450 600 700V760H0" fill="#698475"/><text x="40" y="90" font-family="sans-serif" font-size="25" fill="#466254">${label.replace(/[<>&]/g, "")}</text></svg>`,
    )
  );
}
