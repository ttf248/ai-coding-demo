export const categories = [
  "全部",
  "旅行",
  "日常",
  "食刻",
  "空间",
  "阅读",
] as const;
export type Category = (typeof categories)[number];
type Section = Exclude<Category, "全部">;

export interface Post {
  id: string;
  title: string;
  body: string;
  image: string;
  height: number;
  author: string;
  color: string;
  category: Section;
  likes: number;
}
const photos = [
  ["coast", 670, "旅行", "在山坡上等到一束穿过云层的光", "阿澄"],
  ["coffee", 560, "食刻", "给自己煮一杯不用赶时间的咖啡", "小许"],
  ["mountains", 640, "旅行", "雪线之上，世界换了一个音量", "野北"],
  ["room", 580, "空间", "家里最舒服的一平方米", "周晚"],
  ["bookshop", 700, "阅读", "旧书店的纸香，闻了就想多待一会", "听白"],
  ["brunch", 430, "食刻", "不赶早的晚餐也可以是蔬菜拼盘", "黎夏"],
  ["roadtrip", 610, "旅行", "拐进地图上没标名字的树林", "绘里"],
  ["lake", 440, "旅行", "把秋天寄存在山间的小木屋", "山鹭"],
  ["citrus", 420, "食刻", "切开鲜橙，这一刻都是晴天", "杏子"],
  ["ceramics", 590, "空间", "有手工痕迹的日常器物", "谷川"],
  ["dunes", 560, "旅行", "日落后沙丘还留着一点暖意", "闻舟"],
  ["windows", 640, "空间", "用木头与石材留住室内的光", "知秋"],
  ["forest", 660, "旅行", "一条通往苔藓深处的周末路线", "岚野"],
  ["bricks", 700, "空间", "城市散步｜向上看见不同的线条", "丁禾"],
  ["pasta", 550, "食刻", "留给周五晚上的一碗意面", "舒葵"],
  ["rain", 630, "日常", "潮湿的空气里有雨天的慢节奏", "目青"],
  ["shore", 610, "旅行", "沿着水走，等一等浪花", "阿澄"],
  ["sourdough", 510, "食刻", "自制酸面包，切开的声音很治愈", "梨原"],
  ["plants", 610, "日常", "给新来的小植物挑一个窗台", "小许"],
  ["tracks", 500, "旅行", "在旷野里重学如何闲逛", "野北"],
  ["wildflowers", 520, "日常", "不用买花束，在路边观察花", "黎夏"],
  ["sunrise", 500, "旅行", "醒得比日出更早的一个周末", "岚野"],
  ["museum", 660, "日常", "一个人去看展有什么好处", "绘里"],
  ["chair", 600, "空间", "只要一把椅子和半扇光", "知秋"],
] as const;

const palettes = ["#a54e61", "#4f7780", "#766785", "#556a4c", "#a15c3d"];
const prefixes = ["", "一张图的答案 · ", "周末存档 · "];
const descriptions: Record<Section, string> = {
  旅行: "没有排太满的行程，就沿着喜欢的方向走一走。把路上的光线和颜色记在这里。",
  日常: "把普通的一天留成一张小小的照片。下次翻到，应该还记得当时的心情。",
  食刻: "这道不复杂，重要的是留一点时间给自己。食材和顺序都可以按当天的心情变。",
  空间: "记录光线、材质和偶然喜欢上的一个角落。住久了，空间也慢慢有了自己的表情。",
  阅读: "没有打卡的目标，随手翻几页。记下一处愿意在以后重新读到的片段。",
};

export const posts: Post[] = prefixes.flatMap((prefix, page) =>
  photos.map(([file, height, category, title, author], index) => ({
    id: "note-" + (page * photos.length + index + 1),
    title: prefix + title,
    body: descriptions[category],
    image: import.meta.env.BASE_URL + "images/" + file + ".webp",
    height,
    author,
    category,
    color: palettes[index % palettes.length],
    likes: 20 + (((index + 13) * 39 + page * 43) % 481),
  })),
);
