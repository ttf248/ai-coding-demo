# Pixel Flow - 快速开始指南

## 项目概述

**Pixel Flow** 是一个现代化的交互式粒子流可视化应用，集成以下核心功能：

- 🖼️ 图片上传与粒子化处理
- ✋ 实时摄像头手部追踪（MediaPipe）
- 🎨 Three.js 粒子系统与 3D 渲染
- 👆 基于手势的交互式粒子还原
- 📊 实时性能与交互状态显示

## 环境要求

- Node.js 14+ 和 npm
- 现代化浏览器（Chrome、Firefox、Safari、Edge）
- 网络连接（用于 CDN 加载 MediaPipe 模型）

## 安装步骤

### 1. 安装依赖

```bash
cd demos/pixel-flow/runs/claude-haiku-45-mid-r01
npm install
```

这会安装：
- **three**: 3D 图形库
- **@mediapipe/tasks-vision**: 手部追踪模型
- **vite**: 现代构建工具

### 2. 启动开发服务器

```bash
npm run dev
```

输出示例：
```
  VITE v4.4.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

在浏览器中打开 `http://localhost:5173`

## 功能使用

### 1. 上传图片

1. 点击 **"Upload Image"** 按钮
2. 选择本地图片文件（支持 JPG、PNG 等）
3. 图片会自动转换为粒子并显示在画布上

### 2. 调整粒子数量

- 使用滑块调整粒子数量（100-5000）
- 粒子数越多，图像细节越清晰但性能消耗越大
- 建议在 2000-3000 之间获得最佳效果

### 3. 启用摄像头和手势识别

1. 勾选 **"Enable Camera"** 复选框
2. 允许浏览器访问摄像头
3. 摄像头实时视频会在右下角显示

### 4. 手势交互

- **打开手掌**：粒子会被吸引到您的手部位置
- **握拳**：粒子吸引力减弱
- **移动手部**：粒子跟随手部轨迹

### 5. 控制动画

- **Reset Particles**：粒子重新散开到随机位置
- **Pause Animation**：暂停/恢复粒子动画
- **右下角摄像头**：显示实时摄像头画面

### 6. 实时信息显示

左上角信息面板显示：
- **Hand Detected**: 是否检测到手部（Yes/No）
- **Restoration**: 粒子还原为原始图像的进度（0-100%）
- **FPS**: 当前帧率（每秒帧数）

## 构建与部署

### 构建生产版本

```bash
npm run build
```

生成的文件位于 `dist/` 目录，可以直接部署到静态服务器。

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
.
├── public/
│   └── index.html                 # 主 HTML 文件
├── src/
│   ├── main.js                    # 主应用入口
│   ├── styles/
│   │   └── main.css               # 全局样式
│   └── utils/
│       ├── ParticleSystem.js       # Three.js 粒子系统
│       ├── ImageProcessor.js       # 图片处理与像素提取
│       └── HandTracker.js          # MediaPipe 手部追踪
├── package.json                   # 依赖配置
├── vite.config.js                 # Vite 构建配置
└── README.md                       # 项目文档
```

## 核心实现细节

### ParticleSystem (src/utils/ParticleSystem.js)

- 使用 Three.js 的 `Points` 几何体渲染粒子
- 每个粒子有目标位置（原始图像位置）和实时位置
- 物理模拟：加速度、速度、阻尼
- 手部吸引力：基于距离和手势强度

```javascript
// 粒子属性
{
  x, y, z          // 当前位置
  target: {x, y, z}  // 目标位置
  velocity: {x, y, z} // 速度向量
  color: {r, g, b}   // RGB 颜色
}
```

### ImageProcessor (src/utils/ImageProcessor.js)

- 图片加载：FileReader API + Image 对象
- 尺寸自适应：按比例缩放到最大 256px
- 像素提取：Canvas 2D context getImageData

```javascript
// 处理流程
Image File → Load → Resize → Canvas → Extract Pixels → Particle Data
```

### HandTracker (src/utils/HandTracker.js)

- 使用 MediaPipe Tasks Vision API
- 实时手部关键点检测（21 个点）
- 手部中心计算：腕部与中指基部的中点
- 手势识别：开掌 vs 握拳

```javascript
// 手部坐标系
x: [-0.5, 0.5]  // 水平（右为正）
y: [-0.5, 0.5]  // 竖直（下为正）
z: [0, 1]       // 深度（远为正）
```

## 浏览器兼容性

| 浏览器 | 支持度 | 备注 |
|--------|--------|------|
| Chrome | ✅ | 完全支持，最佳性能 |
| Firefox | ✅ | 完全支持 |
| Safari | ⚠️ | 需要 HTTPS，摄像头可能受限 |
| Edge | ✅ | 基于 Chromium，完全支持 |

## 常见问题

### Q: 摄像头显示黑屏？
A: 检查浏览器权限设置，可能需要在浏览器地址栏左侧允许摄像头访问。

### Q: 手部识别不准确？
A: 确保光线充足，手部在摄像头视野内。MediaPipe 在手部完全可见时效果最佳。

### Q: 粒子动画卡顿？
A: 减少粒子数量（通过滑块调整）或关闭摄像头以降低计算量。

### Q: 能否在移动设备上运行？
A: 可以，但需要支持 WebGL 的现代浏览器和摄像头访问权限。

## 性能优化建议

1. **粒子数量**：
   - 低端设备：500-1000
   - 中端设备：1500-2500
   - 高端设备：3000-5000

2. **摄像头分辨率**：应用自动优化至 1280×720

3. **禁用非必要功能**：
   - 不需要手势交互时关闭摄像头
   - 减少场景中的灯光

## 依赖说明

### Three.js (^r128)
3D 图形库，用于：
- 场景、相机、渲染器
- 粒子系统与点云渲染
- 灯光与雾化效果

### MediaPipe Tasks Vision (^0.10.0)
Google 开源的 ML 模型库，用于：
- 实时手部关键点检测
- 手势识别与分类
- 通过 CDN 加载预训练模型

### Vite (^4.4.0)
现代前端构建工具，用于：
- 快速开发服务器
- ES6 模块打包
- 代码分割与优化

## 如何扩展

### 添加多手支持
修改 `HandTracker.js` 的 `numHands` 参数：
```javascript
numHands: 2  // 支持 2 只手
```

### 自定义粒子效果
在 `ParticleSystem.js` 中修改：
- 粒子大小：`material.size`
- 初始分布：`reset()` 方法
- 物理参数：速度衰减、加速度

### 添加键盘控制
在 `main.js` 中添加：
```javascript
window.addEventListener('keydown', (e) => {
  // 自定义键盘逻辑
});
```

## 许可证

MIT License - 可自由使用、修改和分发

## 致谢

- Three.js 社区
- Google MediaPipe 团队
- Vite 开发团队
