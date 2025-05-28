### **什么是 Tailwind CSS？**  

Tailwind CSS 是一个 **「原子化 CSS 框架」**，简单来说，它通过预设好的 **类名** 来定义样式，不需要自己写 `style` 标签里的 CSS 代码。  

**核心特点**：用类名代替自定义样式，快速组合出各种效果，避免样式冗余，适合快速开发。

### **为什么不用传统 `style` 样式？**  

举个🌰：  
传统写法（需要自己写 CSS）：  

```html
<div style="color: red; font-size: 16px; margin: 10px; padding: 8px; border-radius: 4px; background-color: #f0f0f0;">
  传统样式
</div>
```  

Tailwind 写法（直接用类名）：  

```html
<div class="text-red-500 text-base mx-4 px-3 rounded-md bg-gray-100">
  Tailwind 样式
</div>
```  

- **类名含义**：  
  - `text-red-500`：红色文字（Tailwind 预设的颜色体系）  
  - `text-base`：基础字体大小（相当于 16px）  
  - `mx-4`：左右 margin 为 4 个单位（默认单位是 px，可换算）  
  - `px-3`：左右 padding 为 3 个单位  
  - `rounded-md`：中等圆角  
  - `bg-gray-100`：浅灰色背景  

**优势**：不需要自己调颜色值、算间距，直接用预设类名，样式复用性高，改样式时只需改类名，不用找 `style` 里的代码。

### **如何引入 Tailwind CSS？**  

最简单的方式是用 **CDN 链接**（适合新手，无需安装），在 HTML 的 `<head>` 里加入：  

```html
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
```  

然后就可以在 HTML 中直接用类名写样式了～

### **一个完整的 Tailwind 例子**  

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
  <!-- 一个带悬停效果的按钮 -->
  <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
    点击我
  </button>
</body>
</html>
```  

- `hover:bg-blue-600`：鼠标悬停时背景色变深（Tailwind 支持响应式类名）  
