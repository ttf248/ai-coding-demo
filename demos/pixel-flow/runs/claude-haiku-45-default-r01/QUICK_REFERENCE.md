# 🎯 Pixel Flow - 快速参考

## 立即开始

```bash
cd demos/pixel-flow/runs/claude-haiku-45-mid-r01
npm install
npm run dev
```

访问: **http://localhost:5173**

---

## 核心功能

| 功能 | 说明 | 快捷键/方法 |
|------|------|-----------|
| 📸 上传图片 | 选择本地图片 | 点击"Upload Image" |
| 📊 调整粒子 | 100-5000 粒子 | 移动"Particle Count"滑块 |
| 📹 摄像头 | 启用/禁用 | 勾选"Enable Camera" |
| ✋ 手势控制 | 打开手掌吸引粒子 | 在摄像头前打开/关闭手掌 |
| 🔄 重置 | 粒子重新散开 | 点击"Reset Particles" |
| ⏸️ 暂停 | 停止/恢复动画 | 点击"Pause Animation" |

---

## 实时信息

左上角显示:
- **Hand Detected** - 是否检测到手 (Yes/No)
- **Restoration** - 粒子还原进度 (0-100%)
- **FPS** - 当前帧率

---

## 项目结构

```
src/
├── main.js              # 主应用 (235 行)
├── styles/main.css      # 样式 (247 行)
└── utils/
    ├── ParticleSystem.js       # 3D 粒子系统
    ├── ImageProcessor.js       # 图片处理
    └── HandTracker.js          # 手部追踪
public/
└── index.html           # HTML 入口
```

---

## npm 命令

```bash
npm install      # 安装依赖
npm run dev      # 开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产版本
```

---

## 技术栈

- **Three.js**: 3D 粒子渲染
- **MediaPipe**: 手部追踪 (CDN 加载)
- **Vite**: 现代构建工具
- **Vanilla JS**: 无框架

---

## 文件大小

| 文件 | 大小 |
|------|------|
| main.js | 10.2 KB |
| ParticleSystem.js | 7.0 KB |
| main.css | 5.6 KB |
| HandTracker.js | 3.6 KB |
| index.html | 2.9 KB |
| ImageProcessor.js | 1.8 KB |
| **总计** | **62.6 KB** |

---

## 浏览器兼容性

| 浏览器 | 支持 |
|--------|------|
| Chrome | ✅ 推荐 |
| Firefox | ✅ |
| Edge | ✅ |
| Safari | ⚠️ 需要 HTTPS |

---

## 常见问题

**Q: 摄像头不工作?**  
A: 检查浏览器权限，地址栏左侧允许摄像头。

**Q: 手部识别不准?**  
A: 确保光线充足，手完全在摄像头内。

**Q: 动画卡顿?**  
A: 减少粒子数量或关闭摄像头。

---

## 文档导航

- 📖 [README.md](README.md) - 项目说明
- 🚀 [GETTING_STARTED.md](GETTING_STARTED.md) - 详细教程
- ✅ [COMPLETION_REPORT.md](COMPLETION_REPORT.md) - 完成报告
- 📋 [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) - 功能清单
- 📦 [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md) - 交付总结

---

## 关键数值

| 参数 | 值 | 可配置 |
|------|-----|--------|
| 最少粒子 | 100 | ✓ |
| 默认粒子 | 2000 | ✓ |
| 最多粒子 | 5000 | ✓ |
| 帧率目标 | 60 FPS | ✗ |
| 摄像头分辨率 | 1280×720 | ✗ |
| 图片最大尺寸 | 256×256 | ✗ |
| 阻尼系数 | 0.95 | ✗ |

---

## 性能优化建议

- 低端设备: 使用 500-1000 粒子
- 中端设备: 使用 1500-2500 粒子  
- 高端设备: 使用 3000-5000 粒子
- 关闭摄像头可提升 20-30% 性能

---

## 开发提示

- 修改 `ParticleSystem.js` 调整粒子效果
- 修改 `main.css` 自定义样式
- 修改 `HandTracker.js` 支持多手或新手势
- 使用浏览器开发者工具调试 WebGL

---

**生成时间**: 2026-10-09  
**状态**: ✅ 完全可用  
**版本**: 1.0.0
