import { Post } from '../types'

const nicknames = [
  '小仙女', '爱分享', '生活家', '美食控', '旅行达人',
  '美妆博主', '时尚精', '居家小能手', '摄影爱好者', '萌宠日记',
  '手作达人', '咖啡爱好者', '读书控', '运动健将', '插画师',
  '花艺师', '烘焙师', '民宿主人', '自由摄影师', '生活方式博主'
]

const titles = [
  '周末在家做了超级好吃的甜点🍰',
  '这家咖啡店的氛围太棒了☕',
  '新入的宝藏单品，强烈推荐！',
  '今天的ootd，特别喜欢这套搭配',
  '周末短途旅行记录📸',
  '超简单的护肤小技巧分享',
  '解锁新技能！烘焙初体验',
  '春天就是要出门踏青呀',
  '私藏已久的宝藏店铺分享',
  '宅家幸福感提升好物',
  '减脂期的美味食谱分享',
  '提升工作效率的小技巧',
  '周末的小确幸时光',
  '新入手的数码产品使用感受',
  '宅家也能拍的氛围感照片',
  '超实用的收纳神器推荐',
  '低成本改造出租屋心得',
  '那些让我幸福感爆棚的小事',
  '一个人也要好好吃饭',
  '提高生活品质的居家好物'
]

// 模拟不同比例的图片高度 (基于3:4基础，略有变化)
const imageHeights = [200, 220, 180, 240, 200, 260, 190, 230, 210, 250]

const getRandomNickname = () => nicknames[Math.floor(Math.random() * nicknames.length)]
const getRandomTitle = () => titles[Math.floor(Math.random() * titles.length)]
const getRandomLikes = () => Math.floor(Math.random() * 10000) + 100
const getRandomHeight = () => imageHeights[Math.floor(Math.random() * imageHeights.length)]

const images = Array.from({ length: 35 }, (_, i) => `${i + 1}.jpg`)

export const generateMockPosts = (page: number, pageSize: number = 20): Post[] => {
  const start = (page - 1) * pageSize + 1
  const end = start + pageSize - 1
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const id = start + i
    const imageIndex = (id - 1) % images.length
    return {
      id,
      image: `/images/${images[imageIndex]}`,
      title: getRandomTitle(),
      author: {
        name: getRandomNickname(),
      },
      likes: getRandomLikes(),
      isLiked: false,
      imageHeight: getRandomHeight(),
    }
  })
}

export const initialPosts = generateMockPosts(1, 20)
