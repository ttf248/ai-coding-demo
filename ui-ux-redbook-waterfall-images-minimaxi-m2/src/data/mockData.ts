import { PostItem, CommentItem } from '../store/useStore'

const NICKNAMES = [
  '小仙女', '时尚达人', '美食探索者', '旅行爱好者', '美妆博主',
  '生活家', '摄影师', '设计师', '文艺青年', '健身达人',
  '摄影师小王', '潮流先锋', '花艺师', '咖啡师', '烘焙师',
  '读书人', '画者', '音乐人', '舞者', '瑜伽教练',
]

const TAGS = ['美食', '旅行', '时尚', '生活', '摄影', '美妆', '穿搭', '居家', '艺术', '健身']

const COMMENT_CONTENTS = [
  '这张图片太美了！',
  '好喜欢这种风格～',
  '求同款滤镜！',
  '拍照技术真好！',
  '色调很舒服～',
  '好有氛围感！',
  '分享一下拍摄技巧吧',
  '这个角度很赞！',
  '色彩搭配绝了！',
  '每一张都是大片！',
  '看了心情都变好了',
  '求教程！',
  '这个构图很棒',
  '太有创意了！',
  '美学在线！',
]

const COMMENT_TIMES = [
  '2分钟前', '5分钟前', '10分钟前', '15分钟前', '30分钟前',
  '1小时前', '2小时前', '3小时前', '5小时前', '8小时前',
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

const POST_TYPES: PostItem['type'][] = ['standard', 'tall', 'short', 'wide', 'full']

const generateRandomTags = (postId: number): string[] => {
  const tagCount = 2 + (postId % 3)
  const selectedTags: string[] = []
  const availableTags = [...TAGS]

  for (let i = 0; i < tagCount && availableTags.length > 0; i++) {
    const randomIndex = (postId + i) % availableTags.length
    selectedTags.push(availableTags[randomIndex])
    availableTags.splice(randomIndex, 1)
  }

  return selectedTags
}

const generateComments = (postId: number): CommentItem[] => {
  const commentCount = 3 + (postId % 5)
  const comments: CommentItem[] = []

  for (let i = 0; i < commentCount; i++) {
    const authorIndex = (postId + i) % NICKNAMES.length
    const contentIndex = (postId + i) % COMMENT_CONTENTS.length
    const timeIndex = (postId + i) % COMMENT_TIMES.length

    comments.push({
      id: postId * 100 + i,
      postId,
      author: NICKNAMES[authorIndex],
      content: COMMENT_CONTENTS[contentIndex],
      likes: Math.floor(Math.random() * 200) + 5,
      createTime: COMMENT_TIMES[timeIndex],
    })
  }

  return comments
}

const generateImageUrls = (postId: number): string[] => {
  const imageCount = 2 + (postId % 4) // 2-5 张图片
  const images: string[] = []

  // 获取基础图片索引
  const baseImageIndex = (postId % IMAGE_COUNT) + 1

  // 生成连续的图片路径
  for (let i = 0; i < imageCount; i++) {
    const imageIndex = (baseImageIndex + i - 1) % IMAGE_COUNT + 1
    images.push(`/images/${imageIndex}.jpg`)
  }

  return images
}

export const generateMockData = (startIndex: number, count: number): PostItem[] => {
  const items: PostItem[] = []

  for (let i = 0; i < count; i++) {
    const id = startIndex + i + 1
    const randomType = POST_TYPES[Math.floor(Math.random() * POST_TYPES.length)]
    const tags = generateRandomTags(id)
    const comments = generateComments(id)
    const images = generateImageUrls(id)

    items.push({
      id,
      title: TITLES[(startIndex + i) % TITLES.length],
      images,
      author: NICKNAMES[(startIndex + i) % NICKNAMES.length],
      likes: Math.floor(Math.random() * 5000) + 100,
      isLiked: false,
      type: randomType,
      tags,
      comments,
    })
  }

  return items
}

export const loadPosts = async (page: number, pageSize: number = 20): Promise<PostItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return generateMockData(page * pageSize, pageSize)
}
