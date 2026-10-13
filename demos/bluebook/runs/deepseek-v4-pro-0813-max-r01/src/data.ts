export interface Post {
  id: number;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  /** 图片宽度固定 600，高度不同以形成瀑布流错落 */
  image: string;
  height: number;
  tags: string[];
}

const AUTHORS = ['栗子姑娘', '阿茶', '山野笔记', 'Momo', '晚风信箱', '一颗青柠', '摄影师老周', '小满生活', '南方有乔木', '奶盖日记'];
const TAGS = ['穿搭', '美食', '旅行', '家居', '摄影', '手账', '萌宠', '咖啡', '阅读', '健身', '花艺', '探店'];
const TITLES = [
  '秋天的第一杯桂花拿铁 ☕️',
  '通勤穿搭合集 | 一周不重样',
  '把家布置成想要的样子',
  '川西小环线自驾攻略',
  '胶片相机里的城市黄昏',
  '新手也能学会的水彩手账',
  '我家猫猫的迷惑行为大赏',
  '藏在巷子里的宝藏书店',
  '减脂期也能吃的低卡晚餐',
  '周末阳台花园改造记录',
  '京都红叶季散步地图',
  '一人食 | 15 分钟快手意面',
  '入秋针织衫合集',
  '工位改造 2.0：氛围感拉满',
  '海边露营初体验',
  '零基础学插画第 30 天',
  '冬日暖阳里的下午茶',
  '老城区扫街拍照路线',
  '宿舍党早餐灵感',
  '香氛蜡烛开箱',
];

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 稳定的 Unsplash 直链（跨域策略友好），按 id 循环使用，配合高度参数形成错落瀑布流 */
const IMAGES = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29597',
  'https://images.unsplash.com/photo-1508672019048-805c876b67e2',
  'https://images.unsplash.com/photo-1523983302122-73e869e1f850',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1474418397713-7ede21d49118',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88',
  'https://images.unsplash.com/photo-1500622944204-b135684e99fd',
];

/** 确定性 mock 数据：同一序列每次生成一致，高度错落形成瀑布流 */
export function makePosts(seed: number, from: number, count: number): Post[] {
  const rand = mulberry32(seed + from * 7919);
  const posts: Post[] = [];
  for (let i = 0; i < count; i++) {
    const id = from + i;
    posts.push({
      id,
      title: TITLES[id % TITLES.length] + (id >= TITLES.length ? ` #${Math.floor(id / TITLES.length) + 1}` : ''),
      author: AUTHORS[Math.floor(rand() * AUTHORS.length)],
      avatar: `https://i.pravatar.cc/96?img=${1 + Math.floor(rand() * 60)}`,
      likes: Math.floor(rand() * 9800) + 20,
      image: `${IMAGES[id % IMAGES.length]}?w=600&q=70`,
      height: 340 + Math.floor(rand() * 6) * 55,
      tags: [TAGS[Math.floor(rand() * TAGS.length)], TAGS[Math.floor(rand() * TAGS.length)]],
    });
  }
  return posts;
}
