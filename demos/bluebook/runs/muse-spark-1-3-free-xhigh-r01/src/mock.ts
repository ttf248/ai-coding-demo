export interface Post {
  id: number;
  title: string;
  author: string;
  likes: number;
  liked: boolean;
  height: number;
  seed: string;
}
const titles = [
  '周末去湖边散步，风很轻，心情好好',
  '分享我的桌面收纳，附链接，超实用',
  'iPhone 摄影技巧，3 个参数调出电影感',
  '今日穿搭：秋日奶油色系，温柔又显白',
  ' handmade 陶艺初体验，翻车但快乐',
  '城市夜跑路线推荐，夜景绝美',
  '一人食晚餐，15 分钟快手菜合集',
  '租房改造｜小阳台变身花园角落',
  '新入手的香薰，整个房间都是秋天',
  '备考 30 天计划，附时间表模板',
  '露营装备清单，新手照抄不踩雷',
  '手冲咖啡入门，附豆单与水温表',
];
const authors = ['小屿', '阿梨', '陈小满', '北城', '桃子酱', '林晚', '苏苏', '大白', '青禾', '一颗橙子'];
export function mockPosts(start: number, count: number): Post[] {
  return Array.from({ length: count }, (_, i) => {
    const id = start + i;
    return {
      id,
      title: titles[id % titles.length] + ` #${id}`,
      author: authors[id % authors.length],
      likes: 100 + ((id * 137) % 9000),
      liked: false,
      height: 280 + ((id * 89) % 260),
      seed: `bluebook-${id}`,
    };
  });
}
