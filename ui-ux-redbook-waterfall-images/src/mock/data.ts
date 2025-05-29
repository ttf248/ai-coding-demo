import { Post } from '../types';

// Mock 作者数据
const authors = [
  { id: '1', name: '小仙女🧚‍♀️', avatar: 'https://i.pravatar.cc/48?img=1' },
  { id: '2', name: '美食探索家', avatar: 'https://i.pravatar.cc/48?img=2' },
  { id: '3', name: '摄影师Jerry', avatar: 'https://i.pravatar.cc/48?img=3' },
  { id: '4', name: '旅行达人', avatar: 'https://i.pravatar.cc/48?img=4' },
  { id: '5', name: '时尚博主Lisa', avatar: 'https://i.pravatar.cc/48?img=5' },
  { id: '6', name: '健身教练', avatar: 'https://i.pravatar.cc/48?img=6' },
  { id: '7', name: '甜品师小白', avatar: 'https://i.pravatar.cc/48?img=7' },
  { id: '8', name: '宠物达人', avatar: 'https://i.pravatar.cc/48?img=8' },
  { id: '9', name: '手工艺人', avatar: 'https://i.pravatar.cc/48?img=9' },
  { id: '10', name: '家居设计师', avatar: 'https://i.pravatar.cc/48?img=10' },
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

// 生成随机高度的图片URL（使用 Unsplash 作为图片源）
const categories = ['nature', 'food', 'fashion', 'travel', 'lifestyle', 'beauty', 'pets', 'home'];

const getRandomImageUrl = (width: number = 400): { url: string; aspectRatio: number } => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const height = Math.floor(Math.random() * 300) + 300; // 300-600px height
  const aspectRatio = width / height;
  
  return {
    url: `https://source.unsplash.com/${width}x${height}/?${category}&${Math.random()}`,
    aspectRatio
  };
};

// 生成单个Post
const generatePost = (index: number): Post => {
  const author = authors[Math.floor(Math.random() * authors.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const likes = Math.floor(Math.random() * 10000) + 10;
  const { url, aspectRatio } = getRandomImageUrl();
  
  return {
    id: `post-${Date.now()}-${index}`,
    title,
    imageUrl: url,
    author,
    likes,
    isLiked: Math.random() > 0.7, // 30% 概率已点赞
    aspectRatio,
  };
};

// Mock API 函数
export const mockApi = {
  // 获取初始数据
  fetchPosts: async (page: number = 0, pageSize: number = 20): Promise<Post[]> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
    
    return Array.from({ length: pageSize }, (_, i) => generatePost(page * pageSize + i));
  },
  // 切换点赞状态
  toggleLike: async (_postId: string): Promise<{ success: boolean; likes: number }> => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      likes: Math.floor(Math.random() * 10000) + 10,
    };
  },

  // 搜索相关的posts
  searchPosts: async (keyword: string, _page: number = 0): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // 简单模拟搜索结果
    const searchResults = Array.from({ length: 15 }, (_, i) => generatePost(i));
    return searchResults.map(post => ({
      ...post,
      title: post.title + ` (搜索: ${keyword})`,
    }));
  },
};
