import { PostItem } from '../store/useStore'

const NICKNAMES = [
  '小仙女', '时尚达人', '美食探索者', '旅行爱好者', '美妆博主',
  '生活家', '摄影师', '设计师', '文艺青年', '健身达人',
  '摄影师小王', '潮流先锋', '花艺师', '咖啡师', '烘焙师',
  '读书人', '画者', '音乐人', '舞者', '瑜伽教练',
]

const TITLES = [
  '今日份的美好，请查收～',
  '分享一波超美的风景照',
  '这个色调真的太绝了！',
  '生活中的小确幸',
  '记录美好瞬间',
  '一组治愈系的图片',
  '来看看我的日常分享',
  '这个角度太美了',
  '日常穿搭分享',
  '美食制作的快乐时光',
  '春日限定美景',
  '今天的ootd来啦',
  'ins风照片分享',
  '生活碎片记录',
  '发现生活之美',
  '分享一组清新写真',
  '日常美好时光',
  '这个滤镜太美了',
  '留住最美的瞬间',
  '今天也要开心呀～',
  '超爱的几个色调',
  '日常记录合集',
  '分享一些小心情',
  '生活需要仪式感',
  '今日份的快乐源泉',
  '一组温柔的照片',
  '日常分享小记',
  '生活的美好角落',
  '来看看今天的收获',
  '分享我的小世界',
]

const IMAGE_COUNT = 35

export const generateMockData = (startIndex: number, count: number): PostItem[] => {
  const items: PostItem[] = []

  for (let i = 0; i < count; i++) {
    const id = startIndex + i + 1
    const imageIndex = ((startIndex + i) % IMAGE_COUNT) + 1

    items.push({
      id,
      title: TITLES[(startIndex + i) % TITLES.length],
      imageUrl: `/images/${imageIndex}.jpg`,
      author: NICKNAMES[(startIndex + i) % NICKNAMES.length],
      likes: Math.floor(Math.random() * 5000) + 100,
      isLiked: false,
    })
  }

  return items
}

export const loadPosts = async (page: number, pageSize: number = 20): Promise<PostItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return generateMockData(page * pageSize, pageSize)
}
