### **什么是 Unsplash？**  

Unsplash 是一个 **免费高清图片资源平台**，提供海量高质量图片，所有图片均可免费用于个人或商业项目（无需授权，非常友好）。  
**核心用途**：在网页中快速引入美观的图片，无需自己拍摄或设计，适合前端开发时填充页面内容。

### **如何在网页中使用 Unsplash 的图片？**  

#### 1. **直接通过图片 URL 引用（推荐新手）**  

Unsplash 每张图片都有公开的 URL，可直接在 HTML 的 `<img>` 标签中使用。  

**步骤**：  

- 打开 [Unsplash 官网](https://unsplash.com/)，搜索关键词（如 “nature” “tech”），找到喜欢的图片。  
- 点击图片，右键选择 **复制图片链接**（或在图片页面的地址栏获取 URL）。  
- 将 URL 粘贴到 `<img src="..." />` 中。  

**例子**：  

```html
<!-- 引用一张Unsplash的风景图 -->
<img 
  src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5980e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
  alt="自然风光" 
  class="w-96 h-64 object-cover rounded-md" <!-- 配合Tailwind CSS调整样式 -->
>
```  

- **URL 结构**：`https://images.unsplash.com/photo-...` 是图片的直接地址，后面的参数（如 `ixlib`）是Unsplash的标识，无需修改。  
- **配合Tailwind CSS**：用 `w-96 h-64` 设定图片宽高，`object-cover` 让图片适应容器比例，`rounded-md` 加圆角。

#### 2. **通过 Unsplash API 动态获取图片（进阶）**  

如果需要随机图片或按关键词动态加载，可以用 Unsplash 的免费 API。  

**例子**（获取随机猫咪图片）：  

```html
<img id="cat-img" alt="随机猫咪" class="w-64 h-64 rounded-full">

<script>
  // 调用Unsplash API获取随机图片URL
  fetch("https://api.unsplash.com/photos/random?query=cat&client_id=YOUR_ACCESS_KEY")
    .then(response => response.json())
    .then(data => {
      document.getElementById("cat-img").src = data.urls.regular;
    });
</script>
```  

- **注意**：使用API需要先在 [Unsplash开发者平台](https://unsplash.com/developers) 申请 `client_id`（免费），替换代码中的 `YOUR_ACCESS_KEY`。

### **为什么选择 Unsplash 而不是其他图片网站？**  

1. **完全免费且无版权限制**：可用于商业项目，无需标注来源（但尊重摄影师是好习惯～）。  
2. **高质量图片库**：图片分辨率高，适合各种场景（背景图、头像、banner等）。  
3. **集成方便**：直接用 URL，无需下载到本地（尤其适合新手快速搭建Demo）。

### **一个结合 Tailwind CSS 和 Unsplash 的完整例子**  

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
  <!-- 带图片的卡片，用Tailwind CSS布局，图片来自Unsplash -->
  <div class="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
    <img 
      src="https://images.unsplash.com/photo-1507191515990-7f6f17d39c76?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
      alt="书籍" 
      class="w-full h-48 object-cover" <!-- 图片宽度撑满，高度固定，裁剪保持比例 -->
    >
    <div class="p-4">
      <h2 class="text-lg font-bold">好书推荐</h2>
      <p class="text-gray-700">阅读是成长的最佳途径</p>
    </div>
  </div>
</body>
</html>
```  

- **效果**：一个带书籍图片的卡片，图片自动适应容器，文字部分用Tailwind CSS排版，整体美观简洁。
