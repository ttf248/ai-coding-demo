import { Post } from '../types';

// Mock 作者数据
const authors = [
  { id: '1', name: '小仙女🧚‍♀️', avatar: '' },
  { id: '2', name: '美食探索家', avatar: '' },
  { id: '3', name: '摄影师Jerry', avatar: '' },
  { id: '4', name: '旅行达人', avatar: '' },
  { id: '5', name: '时尚博主Lisa', avatar: '' },
  { id: '6', name: '健身教练', avatar: '' },
  { id: '7', name: '甜品师小白', avatar: '' },
  { id: '8', name: '宠物达人', avatar: '' },
  { id: '9', name: '手工艺人', avatar: '' },
  { id: '10', name: '家居设计师', avatar: '' },
];

// Mock 标题数据
const titles = [
  '今天的穿搭分享 💕 夏日清新搭配',
  '超简单的芝士蛋糕做法！新手也能成功',
  '巴厘岛旅行攻略 🏝️ 必打卡景点',
  '护肤小技巧 | 让你拥有水嫩肌肤',
  '我的房间改造记录 ✨ 小空间大变身',
  '健身一个月的变化对比 💪',
  '手工制作可爱小物件 🎨',
  '今日妆容分享 | 温柔系日常妆',
  '我家猫咪的日常 🐱 太可爱了',
  '下午茶时光 ☕ 精致生活从细节开始',
  '夏日饮品制作 🥤 清爽解腻',
  '穿搭灵感 | 复古风格搭配',
  'DIY手账贴纸 📝 记录美好时光',
  '居家收纳技巧 📦 告别杂乱',
  '瑜伽初学者指南 🧘‍♀️',
  '烘焙小课堂 🧁 奶油泡芙制作',
  '植物养护心得 🌱 让家充满绿意',
  '化妆品空瓶记录 💄 真实使用感受',
  '周末Market探店 🛍️ 发现好物',
  '手机摄影技巧 📸 拍出大片感',
];

console.log('Authors data initialized:', authors);
console.log('Titles data initialized:', titles);

// 本地图片管理
const LOCAL_IMAGE_COUNT = 35;
let usedImages = new Set<number>();

// 图片源配置
// 七牛云测试域名，一个月后自动删除，提供的还是 http 链接
// cloudflare r2 需要配置信用卡，图片上传到了博客站点
// 添加本地 images 文件夹支持
const IMAGE_SOURCES = [
  './images/{index}.jpg', // 本地 images 文件夹（构建后会在 dist/images）
  'https://raw.githubusercontent.com/ttf248/ai-coding-demo/refs/heads/main/demos/bluebook/runs/claude-4-0-unknown-r01/images/{index}.jpg',
];

// 缓存最快的图片源
let fastestImageSource: string | null = null;
let speedTestPromise: Promise<void> | null = null;

// 测试图片源速度
const testImageSourceSpeed = async (source: string): Promise<number> => {
  const testUrl = source.replace('{index}', '1');
  const startTime = Date.now();
  
  try {
    const response = await fetch(testUrl, { method: 'HEAD' });
    if (response.ok) {
      return Date.now() - startTime;
    }
    return Infinity;
  } catch {
    return Infinity;
  }
};

// 选择最快的图片源
const selectFastestImageSource = async (): Promise<string> => {
  if (fastestImageSource) {
    return fastestImageSource;
  }

  if (!speedTestPromise) {
    speedTestPromise = (async () => {
      console.log('Testing image source speeds...');
      const speedTests = IMAGE_SOURCES.map(async (source) => {
        const speed = await testImageSourceSpeed(source);
        return { source, speed };
      });

      const results = await Promise.all(speedTests);
      const fastest = results.reduce((prev, current) => 
        current.speed < prev.speed ? current : prev
      );

      fastestImageSource = fastest.source;
      console.log('Fastest image source selected:', fastest);
    })();
  }

  await speedTestPromise;
  return fastestImageSource!;
};

// 生成随机高度的图片URL（使用最快的图片源）
const getRandomImageUrl = async (width: number = 400): Promise<{ url: string; aspectRatio: number }> => {
  // 如果所有图片都用过了，重置使用记录
  if (usedImages.size >= LOCAL_IMAGE_COUNT) {
    usedImages.clear();
    console.log('All images used, resetting rotation cycle');
  }

  // 获取未使用的图片索引
  const availableImages = Array.from({ length: LOCAL_IMAGE_COUNT }, (_, i) => i + 1)
    .filter(index => !usedImages.has(index));

  // 随机选择一张未使用的图片
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImageIndex = availableImages[randomIndex];
  
  // 标记为已使用
  usedImages.add(selectedImageIndex);

  const height = Math.floor(Math.random() * 300) + 300; // 300-600px height
  const aspectRatio = width / height;

  // 获取最快的图片源并生成URL
  const imageSource = await selectFastestImageSource();
  const imageUrl = imageSource.replace('{index}', selectedImageIndex.toString());
  
  console.log('Generated image URL:', { imageUrl, aspectRatio, usedCount: usedImages.size });

  return {
    url: imageUrl,
    aspectRatio
  };
};

// 生成单个Post
const generatePost = async (index: number): Promise<Post> => {
  const author = authors[Math.floor(Math.random() * authors.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const likes = Math.floor(Math.random() * 10000) + 10;
  const { url, aspectRatio } = await getRandomImageUrl();

  const post = {
    id: `post-${Date.now()}-${index}`,
    title,
    imageUrl: url,
    author,
    likes,
    isLiked: Math.random() > 0.7, // 30% 概率已点赞
    aspectRatio,
  };

  console.log('Generated post:', post);
  return post;
};

// Mock API 函数
export const mockApi = {
  // 获取初始数据
  fetchPosts: async (page: number = 0, pageSize: number = 20): Promise<Post[]> => {
    console.log(`Fetching posts for page ${page} with pageSize ${pageSize}`);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
    
    const posts = await Promise.all(
      Array.from({ length: pageSize }, (_, i) => generatePost(page * pageSize + i))
    );
    console.log('Fetched posts:', posts);
    return posts;
  },
  // 切换点赞状态
  toggleLike: async (_postId: string): Promise<{ success: boolean; likes: number }> => {
    console.log(`Toggling like for postId: ${_postId}`);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const result = {
      success: true,
      likes: Math.floor(Math.random() * 10000) + 10,
    };
    console.log('Toggle like result:', result);
    return result;
  },

  // 搜索相关的posts
  searchPosts: async (keyword: string, _page: number = 0): Promise<Post[]> => {
    console.log(`Searching posts with keyword: ${keyword}`);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 简单模拟搜索结果
    const searchResults = await Promise.all(
      Array.from({ length: 15 }, (_, i) => generatePost(i))
    );
    const modifiedResults = searchResults.map(post => ({
      ...post,
      title: post.title + ` (搜索: ${keyword})`,
    }));
    console.log('Search results:', modifiedResults);
    return modifiedResults;
  },
};
