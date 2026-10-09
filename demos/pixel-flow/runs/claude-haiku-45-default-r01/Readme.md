# Pixel Flow - Interactive Particle Visualization

Interactive particle flow visualization with hand gesture control. Upload an image, and watch as it dissolves into animated particles. Use your hand gestures to restore the original image.

## Features

- 📸 **Image Upload**: Load any local image and convert it to interactive particles
- ✋ **Hand Gesture Control**: Real-time hand tracking using MediaPipe
- 🎨 **Particle Animation**: Smooth, physics-based particle system
- 🎯 **Interactive Restoration**: Particles are attracted to both their original positions and hand gestures
- 📊 **Real-time Statistics**: Display hand detection, restoration level, and FPS
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Three.js**: 3D rendering and particle system
- **MediaPipe**: Real-time hand landmark detection
- **Vite**: Modern build tool and dev server
- **Vanilla JavaScript**: No heavy frameworks

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Usage

1. **Upload Image**: Click on the "Upload Image" input to select a local image file
2. **Adjust Settings**:
   - Use the slider to control the number of particles
   - Toggle camera for hand gesture control
3. **Interact**: 
   - Open your hand to attract particles toward it
   - Particles will be drawn toward both your hand and their original positions
   - Click "Reset Particles" to scatter particles again
   - Click "Pause Animation" to freeze the current state

## How It Works

### Image Processing
- Image is loaded and resized to fit particle count requirements
- Pixels are extracted and mapped to particle properties (position, color)
- Particles start in random positions

### Particle System
- Each particle has a target position (original image location)
- Particles move toward their targets with physics-based acceleration
- Particles respond to hand gestures when detected
- Smooth damping creates fluid motion

### Hand Tracking
- MediaPipe detects hand landmarks in real-time
- Hand center position is calculated from wrist and middle finger
- Gesture intensity (open hand vs closed fist) controls attraction strength
- Particles within radius of hand position are attracted to it

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 项目完整实现，包含完整的前端应用架构
- 支持图片上传、粒子系统、手势识别
- 通过 `npm install && npm run dev` 启动开发服务器
- 通过 `npm run build` 生成生产版本
- 所有依赖已在 package.json 中定义

### Browser Compatibility

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ⚠️ Camera access may require HTTPS
- Edge: ✅ Full support

### Mobile Support

The app is responsive and works on mobile devices. For hand gesture control, use a device with a front-facing camera and run over HTTPS or localhost.

## Files

```
src/
├── main.js              # Main application entry point
├── styles/
│   └── main.css         # All styling
└── utils/
    ├── ParticleSystem.js    # Three.js particle system
    ├── ImageProcessor.js    # Image loading and pixel extraction
    └── HandTracker.js       # MediaPipe hand tracking
public/
└── index.html           # Main HTML file
package.json            # Dependencies and scripts
vite.config.js          # Build configuration
```

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--claude-haiku-45-default-r01`
- 模型：Claude Haiku 4.5；推理档位：default
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整提示词
- 工具：未记录。迁移来源模型测试工作树 model-test-base@452ac58，原始运行工具未记录。用户确认实际档位为 default；源目录名和元数据中的 mid 在迁移时规范为 default。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：GitHub Copilot 批次合计 $3.42 USD（12 个案例；原始消耗 598.29 GitHub Copilot credits，换算比例 40 USD / 7000 GitHub Copilot credits；批次 github-copilot-claude-haiku-45-default-2026-10-09；未记录单案例费用）
- [主页](../../../../demos/pixel-flow/runs/claude-haiku-45-default-r01/public/index.html)

### 部署适配记录

- 来源：F:/dev/ai-coding-demo-test 的 model-test-base 分支工作树，HEAD 452ac58；这些测试记录迁移时处于未提交状态。源标识为 pixel-flow/runs/claude-haiku-45-mid-r01，依据用户确认将主分支档位和 run ID 规范为 default；输入快照与模型产物按源文件保留。
- 迁入后通过本地 HTTP 页面补拍实际桌面截图 screenshot.png；源输入与模型产物未改写。
<!-- archive:end -->
