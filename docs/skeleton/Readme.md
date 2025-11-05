### **什么是骨架屏？**

骨架屏（Skeleton Screen）是一种 **加载占位符技术**，在页面或数据还在加载时，先显示页面的基本结构和轮廓，用户能提前了解页面布局，给用户一种「内容正在加载」的感觉，而不是空白页面。

**核心作用**：减少用户等待时的焦虑感，提升感知性能，让加载过程更流畅自然。

### **为什么需要骨架屏？**

#### 1. **提升用户体验**
- 传统方式：加载时显示空白或转圈，用户不知道要等多久
- 骨架屏：显示页面结构，用户心理有数，知道内容「正在路上」

#### 2. **降低跳出率**
- 用户看到骨架屏知道页面在加载，不会立刻关掉页面
- 心理学角度：人会倾向于等待已承诺的内容（骨架屏就是承诺）

#### 3. **业界最佳实践**
- 主流产品都在用：Facebook、YouTube、LinkedIn、Medium 等
- Material Design 和 iOS HIG 都推荐这种加载方式

### **骨架屏的应用场景**

#### **场景 1：图片列表页面**
电商、图片社交平台等内容密集型页面，图片加载慢时，用骨架块占位：

```html
<!-- 骨架屏状态：显示灰色占位块 -->
<div class="skeleton-image-container">
  <div class="bg-gray-200 animate-pulse rounded-md" style="height: 200px;"></div>
</div>

<!-- 加载完成后：显示真实图片 -->
<div class="skeleton-image-container loaded">
  <img src="真实图片URL" class="rounded-md transition-opacity duration-500">
</div>
```

#### **场景 2：个人信息卡片**
用户资料页面，姓名、头像、简介等信息模块分别占位：

```html
<div class="user-card">
  <!-- 头像骨架 -->
  <div class="skeleton-avatar"></div>
  <!-- 姓名骨架 -->
  <div class="skeleton-line w-3/4"></div>
  <!-- 简介骨架 -->
  <div class="skeleton-line w-1/2"></div>
</div>
```

#### **场景 3：文字内容页**
文章、新闻页面，标题和段落分别加载：

```html
<article class="article">
  <!-- 标题骨架 -->
  <h1 class="skeleton-title"></h1>
  <!-- 段落骨架 -->
  <p class="skeleton-paragraph"></p>
  <p class="skeleton-paragraph"></p>
</article>
```

### **如何在网页中实现骨架屏？**

#### **方法 1：CSS + 简单动画（推荐新手）**

用 `animate-pulse` 制作闪烁效果，配合灰色背景模拟加载状态：

```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### **方法 2：Tailwind CSS 的 animate-pulse（最简单）**

Tailwind 内置了脉冲动画，直接添加类名即可：

```html
<div class="bg-gray-200 rounded-md animate-pulse">
  <!-- 占位内容 -->
</div>
```

**完整例子：带骨架屏的图片卡片**

```html
<div class="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
  <!-- 加载中：骨架屏 -->
  <div class="h-48 bg-gray-200 animate-pulse"></div>

  <div class="p-4">
    <!-- 加载中：骨架文本 -->
    <div class="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
    <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
  </div>
</div>
```

#### **方法 3：React/Vue 组件化（进阶）**

用 JavaScript 控制显示状态，数据加载前显示骨架屏，加载完成后隐藏：

```javascript
// React 示例
function UserCard({ user, loading }) {
  if (loading) {
    return (
      <div className="user-card">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text"></div>
      </div>
    );
  }

  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
    </div>
  );
}
```

### **骨架屏的设计原则**

#### **1. 尺寸要匹配真实内容**
骨架屏的占位块大小应尽量接近真实内容（避免加载完成后跳动）

#### **2. 颜色选择有讲究**
- 背景色：用灰色系（`#f0f0f0`），不能是纯白（对比太强）
- 动画色：稍深的灰色（`#e0e0e0`），营造层次感

#### **3. 动画速度要合适**
- 太快：用户看不清，像在闪烁
- 太慢：用户着急，感觉卡顿
- **推荐**：1-2 秒的循环动画

#### **4. 形状要符合内容**
- 图片：圆角矩形
- 头像：圆形
- 文字：细长矩形（长度多样化模拟真实文字）

### **骨架屏 vs 传统加载方式对比**

| 方式       | 表现                                   | 用户体验          |
|------------|----------------------------------------|-------------------|
| 空白页面   | 一片空白，什么都没有                   | ❌ 焦虑，不知道要等多久 |
| Spinner    | 转圈圈，只有进度指示                   | ⚠️ 知道在加载，但不知道内容结构 |
| 骨架屏     | 显示页面轮廓，内容占位                 | ✅ 知道要加载什么，心理有数 |

### **一个结合 Unsplash 图片和骨架屏的完整例子**

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
  <div class="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden" id="card">
    <!-- 初始状态：骨架屏 -->
    <div class="h-64 bg-gray-200 animate-pulse" id="skeleton-image"></div>

    <div class="p-4">
      <div class="h-6 bg-gray-200 rounded animate-pulse mb-2" id="skeleton-title"></div>
      <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6 mb-2"></div>
      <div class="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
    </div>
  </div>

  <script>
    // 模拟加载延迟
    setTimeout(() => {
      // 隐藏骨架屏，显示真实内容
      document.getElementById('skeleton-image').className = 'h-64 transition-all duration-500';
      document.getElementById('skeleton-image').style.background = 'none';

      // 加载图片
      const img = document.createElement('img');
      img.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2070&auto=format&fit=crop';
      img.className = 'h-64 w-full object-cover';
      img.onload = () => {
        document.getElementById('skeleton-image').innerHTML = '';
        document.getElementById('skeleton-image').appendChild(img);
      };

      // 显示文字内容
      document.getElementById('skeleton-title').className = 'h-6 text-xl font-bold text-gray-800 transition-all duration-500';
      document.getElementById('skeleton-title').innerHTML = '《代码大全》';
      document.getElementById('card').querySelectorAll('#skeleton-title + div').forEach((el, idx) => {
        el.className = idx === 0 ? 'h-4 text-gray-600 mb-2' : 'h-4 text-gray-600';
        el.innerHTML = idx === 0 ? '软件开发的实用指南' : '程序员必读经典';
      });
    }, 2000); // 2秒后加载完成
  </script>
</body>
</html>
```

**效果**：页面先显示灰色占位块（骨架屏），2秒后显示真实的 Unsplash 书籍图片和文字内容，让用户清楚知道页面在加载什么内容。
