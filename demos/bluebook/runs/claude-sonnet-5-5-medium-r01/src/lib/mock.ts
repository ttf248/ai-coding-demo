import type { Post } from '../types'

const TITLES = [
  '周末去哪儿？藏在城市里的 5 家治愈系咖啡馆',
  '一周通勤穿搭｜小个子也能穿出高级感',
  '10 分钟搞定的快手早餐，打工人必备',
  '独居女孩的小户型改造，租房党狂喜',
  '秋日露营清单：新手也不会漏的 30 件装备',
  '手帐拼贴教程，把日常记录得闪闪发光',
  '在家做出咖啡店同款手冲，关键就这三步',
  '周末徒步路线推荐，一天往返不累人',
  '氛围感拉满的书桌布置，学习效率翻倍',
  '平价护肤好物合集，学生党闭眼入',
  '云南慢旅行 7 天，把时间浪费在美好的事物上',
  '自制低卡甜品，减脂期也能放心吃',
  '被问爆的拍照姿势｜随手一拍就出片',
  '极简主义整理术：扔掉 80% 的东西之后',
  '城市夜景摄影技巧，手机也能拍大片',
  '宠物友好餐厅探店，带毛孩子一起吃饭',
]
const AUTHORS = ['momo', '阿柠', '小鹿森林', 'Yuki', '山河', '晚风', '橘子汽水', 'Ellie', '北辰', '一只喵', '小满', 'Leo']
const PALETTE: Array<[string, string]> = [
  ['#ff9a9e', '#fad0c4'],
  ['#a1c4fd', '#c2e9fb'],
  ['#84fab0', '#8fd3f4'],
  ['#fbc2eb', '#a6c1ee'],
  ['#ffecd2', '#fcb69f'],
  ['#d4fc79', '#96e6a1'],
  ['#f6d365', '#fda085'],
  ['#e0c3fc', '#8ec5fc'],
  ['#fdcbf1', '#e6dee9'],
  ['#c1dfc4', '#deecdd'],
]

/** 可复现的伪随机数 */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const enc = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

/** 用 SVG 生成不同高度的占位大图，不依赖外部网络 */
export function makeImage(seed: number, ratio: number): string {
  const rnd = mulberry32(seed)
  const [c1, c2] = PALETTE[Math.floor(rnd() * PALETTE.length)]
  const w = 400
  const h = Math.round(w * ratio)
  let shapes = ''
  for (let i = 0; i < 6; i++) {
    const cx = Math.round(rnd() * w)
    const cy = Math.round(rnd() * h)
    const r = Math.round(30 + rnd() * 90)
    shapes += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" opacity="${(0.12 + rnd() * 0.25).toFixed(2)}"/>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/>${shapes}</svg>`
  return enc(svg)
}

export function makeAvatar(name: string, seed: number): string {
  const rnd = mulberry32(seed)
  const [c1, c2] = PALETTE[Math.floor(rnd() * PALETTE.length)]
  const ch = Array.from(name)[0].toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="48" height="48" fill="url(#a)"/><text x="24" y="32" font-size="22" text-anchor="middle" fill="#fff" font-family="sans-serif">${ch}</text></svg>`
  return enc(svg)
}

/** 加载失败时显示的默认图 */
export const FALLBACK_IMAGE = enc(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#eceff1"/><g fill="none" stroke="#b0bec5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><rect x="140" y="95" width="120" height="90" rx="10"/><circle cx="175" cy="125" r="10"/><path d="M148 175l35-30 25 20 20-15 24 25"/></g><text x="200" y="225" font-size="16" text-anchor="middle" fill="#90a4ae" font-family="sans-serif">图片加载失败</text></svg>`,
)

const RATIOS = [0.9, 1.0, 1.15, 1.3, 1.45, 1.6, 1.8, 1.25]

/** 生成一页 mock 数据；每 11 条中有 1 条使用不存在的图片地址，用于演示失败兜底 */
export function makePosts(page: number, count: number, salt = 0): Post[] {
  return Array.from({ length: count }, (_, i) => {
    const n = page * 1000 + i
    const rnd = mulberry32(n * 31 + salt * 977 + 7)
    const ratio = RATIOS[Math.floor(rnd() * RATIOS.length)]
    const author = AUTHORS[Math.floor(rnd() * AUTHORS.length)]
    const title = TITLES[Math.floor(rnd() * TITLES.length)]
    const broken = (n + salt) % 11 === 5
    return {
      id: `p${salt}-${n}`,
      title,
      image: broken ? `./missing/${n}.jpg` : makeImage(n * 13 + salt, ratio),
      ratio,
      author,
      avatar: makeAvatar(author, n),
      likes: Math.floor(rnd() * rnd() * 12000) + 3,
      desc: `${title}。这是第 ${n} 条 mock 笔记，包含不同高度的图片，用于展示瀑布流布局、懒加载与点赞交互。`,
    }
  })
}
