export type Note = {
  id: string;
  title: string;
  author: string;
  image: string;
  likes: number;
  liked: boolean;
  category: string;
};
const names = [
  "一颗橙子",
  "山间来信",
  "小满同学",
  "木木的日常",
  "岛屿漫游",
  "慢慢生活",
];
const titles = [
  "把周末留给山野，风会给你答案",
  "今日份的好天气，装进我的小相机",
  "在家也能拥有一家自己的咖啡馆",
  "寻找到城市里一小片安静的绿",
  "收集生活里的每一个温柔瞬间",
  "今天的快乐，是一顿认真做的早餐",
  "这条海岸线值得一整个夏天",
  "整理房间，也整理一下心情",
  "属于秋天的第一束花",
  "不赶路的时候，才看到生活",
];
const categories = ["旅行", "生活", "美食", "家居", "穿搭"];
export function mockPage(page: number): Note[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${page}-${i}`,
    title: titles[(i + page * 3) % titles.length],
    author: names[i % names.length],
    image: `./images/scene-${(i + page * 2) % 10}.svg`,
    likes: 127 + ((i * 73) % 2100),
    liked: false,
    category: categories[i % 5],
  }));
}
