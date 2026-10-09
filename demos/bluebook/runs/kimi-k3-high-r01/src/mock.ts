export interface Note {
  id: number
  title: string
  author: string
  avatarColor: string
  likes: number
  width: number
  height: number
  image: string
  liked: boolean
}

const TITLES = [
  '周末去郊外拍到了绝美的晨雾', '一人食｜15 分钟搞定的照烧鸡腿饭', '租房改造的 10 个小技巧',
  '这片海比想象中更蓝', '新手养猫第一个月必买清单', '徒步 20 公里看到的云海',
  '把阳台改成了小花园', '秋天的第一场露营', '通勤路上的随手拍',
  '低成本拍出氛围感大片', '咖啡店探店｜拉花天花板', '书桌收纳分享',
  '夜跑五公里打卡', '第一次尝试油画棒', '这家面馆的浇头绝了',
  '城市天际线日落机位分享', '手账拼贴入门教程', '小猫咪的午睡时间',
  '周末市集淘到的宝贝', '自制柠檬气泡水配方', '登山装备的轻量化方案',
  '老巷子里的烟火气', '阳台种的番茄熟了', '雨天宅家观影清单',
]
const AUTHORS = [
  '山间雾灯', '一只桃桃', '白日梦想家', '咸味海风', '橘子汽水',
  '慢慢慢', '不吃香菜', '北岛信箱', '三分甜', '晚风踩着云',
  '路过春天', '小岛来信', '半糖去冰', '拾光者', '野生摄影师',
]
const AVATAR_COLORS = ['#fe2c55', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

// 确定性伪随机，保证同一次会话数据稳定
let seed = 20261009
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

export function generateNotes(count: number, offset: number): Note[] {
  const notes: Note[] = []
  for (let i = 0; i < count; i++) {
    const id = offset + i
    const height = 260 + Math.floor(rand() * 340) // 不同高度
    notes.push({
      id,
      title: TITLES[id % TITLES.length],
      author: AUTHORS[Math.floor(rand() * AUTHORS.length)],
      avatarColor: AVATAR_COLORS[id % AVATAR_COLORS.length],
      likes: Math.floor(rand() * 9500) + 80,
      width: 400,
      height,
      image: `https://picsum.photos/seed/bluebook-${id}/400/${height}`,
      liked: false,
    })
  }
  return notes
}
