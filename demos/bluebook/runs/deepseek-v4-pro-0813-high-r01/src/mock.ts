export interface FeedItem {
  id: number
  title: string
  image: string
  author: string
  avatar: string
  likes: number
  height: number
}

const TITLES = [
  '周末去山里徒步，拍到了绝美的云海',
  '今天做的桂花拿铁，治愈了整个下午',
  '极简书桌改造，办公效率翻倍',
  '分享一家藏在小巷里的宝藏咖啡店',
  '秋日穿搭合集，温柔又显白',
  '第一次做陶艺，成品意外地好看',
  '猫咪的一天，从赖床到撒娇',
  '深夜食堂：一碗热腾腾的豚骨拉面',
  '把阳台改造成小花园，太治愈了',
  '健身 90 天的变化，坚持就有收获',
  '海边日落，拍不够的温柔时刻',
  '手账新手入门，记录生活的仪式感',
  '在家也能做的烘焙，软糯巴斯克',
  '雨天宅家，和书一起度过安静时光',
  '城市夜跑路线分享，夜景超美',
  '第一次滑雪，摔了很多次但很快乐',
  '阳台种菜日记，收获第一颗番茄',
  '通勤路上的随手拍，平凡也闪光',
  '旧物改造，给家里添一点温度',
  '一个人的旅行，遇见更好的自己',
]

const AUTHORS = ['小鹿', '阿茶', '橘子汽水', 'momo', '山间清风', '一颗桃子', '晚风', '拾光者', '白桃乌龙', '小满']

const HEIGHTS = [180, 210, 240, 270, 300, 330, 360]

export function genItems(offset: number, count: number): FeedItem[] {
  const items: FeedItem[] = []
  for (let i = 0; i < count; i++) {
    const id = offset + i + 1
    const height = HEIGHTS[(id * 3) % HEIGHTS.length]
    items.push({
      id,
      title: TITLES[id % TITLES.length],
      image: `https://picsum.photos/seed/bluebook-${id}/400/${height}`,
      author: AUTHORS[id % AUTHORS.length],
      avatar: `https://i.pravatar.cc/48?img=${(id % 70) + 1}`,
      likes: (id * 137) % 2400 + 10,
      height,
    })
  }
  return items
}
