// 测试小蓝书应用的基本功能
// 这个脚本可以在浏览器开发者工具的控制台中运行

console.log('🎉 小蓝书瀑布流应用测试');

// 测试1: 检查应用是否正确渲染
function testAppRendering() {
  const header = document.querySelector('header');
  const logo = document.querySelector('h1');
  const searchInput = document.querySelector('input[placeholder*="搜索"]');
  const publishBtn = document.querySelector('button');
  
  console.log('📱 应用渲染测试:');
  console.log('  - 头部:', header ? '✅' : '❌');
  console.log('  - Logo:', logo?.textContent === '小蓝书' ? '✅' : '❌');
  console.log('  - 搜索框:', searchInput ? '✅' : '❌');
  console.log('  - 发布按钮:', publishBtn ? '✅' : '❌');
}

// 测试2: 检查瀑布流布局
function testWaterfallLayout() {
  const gridContainer = document.querySelector('.grid');
  const postCards = document.querySelectorAll('[class*="bg-white rounded-lg"]');
  
  console.log('🌊 瀑布流布局测试:');
  console.log('  - 网格容器:', gridContainer ? '✅' : '❌');
  console.log('  - 卡片数量:', postCards.length);
  
  // 检查响应式布局
  const gridClasses = gridContainer?.className;
  const hasResponsiveClasses = gridClasses?.includes('grid-cols-2') && 
                              gridClasses?.includes('md:grid-cols-3') && 
                              gridClasses?.includes('lg:grid-cols-4');
  console.log('  - 响应式布局:', hasResponsiveClasses ? '✅' : '❌');
}

// 测试3: 检查卡片功能
function testCardFeatures() {
  const images = document.querySelectorAll('img[alt]:not([alt=""])');
  const likeButtons = document.querySelectorAll('button[class*="heart"], button[class*="text-primary"]');
  const avatars = document.querySelectorAll('img[class*="rounded-full"]');
  
  console.log('🃏 卡片功能测试:');
  console.log('  - 图片加载:', images.length > 0 ? '✅' : '❌');
  console.log('  - 点赞按钮:', likeButtons.length > 0 ? '✅' : '❌');
  console.log('  - 用户头像:', avatars.length > 0 ? '✅' : '❌');
}

// 测试4: 检查动画和样式
function testAnimationsAndStyles() {
  const hasAnimations = document.querySelector('[class*="animate-"]');
  const hasTransitions = document.querySelector('[class*="transition-"]');
  const hasPrimaryColor = document.querySelector('[class*="primary"]');
  
  console.log('🎨 动画和样式测试:');
  console.log('  - CSS动画:', hasAnimations ? '✅' : '❌');
  console.log('  - 过渡效果:', hasTransitions ? '✅' : '❌');
  console.log('  - 主色调:', hasPrimaryColor ? '✅' : '❌');
}

// 运行所有测试
setTimeout(() => {
  console.clear();
  console.log('🧪 开始测试小蓝书应用...\n');
  
  testAppRendering();
  console.log('');
  testWaterfallLayout();
  console.log('');
  testCardFeatures();
  console.log('');
  testAnimationsAndStyles();
  
  console.log('\n✨ 测试完成！如果看到很多 ✅，说明应用运行正常。');
  console.log('💡 提示: 您可以尝试以下交互:');
  console.log('  - 在搜索框中输入关键词');
  console.log('  - 点击红心图标进行点赞');
  console.log('  - 滚动到底部触发加载更多');
  console.log('  - 在移动端尝试下拉刷新');
}, 2000);
