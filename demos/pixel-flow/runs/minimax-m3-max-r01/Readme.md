# Pixel Flow · 图片粒子化与手势还原

## 原始提示词

完整原始输入见 [prompt.md](prompt.md)。

## 运行与复盘

按 v1 任务正文“图片粒子化 + MediaPipe 手势识别还原”实现。任务正文同时给出中英文版本；本实现遵循中文需求要点。

实现要点：

- **粒子化**：上传图片 → Canvas 采样像素 → 写入 `THREE.Points` 顶点 + 颜色 + size；最大 28000 粒子
- **手势识别**：通过 CDN 引入 MediaPipe Hands（@0.4.1675469240），张开手掌激活吸引、握拳暂停；过渡手势保持原状
- **吸引 / 还原**：每个粒子 spring 回到原始位置，张开手掌时力度 0.03，握拳时 0.004
- **演示图**：Canvas 绘制的“日落剪影”作为默认图片，避免上传步骤
- **可降级**：摄像头不可用或 MediaPipe CDN 失败时，可通过滑块手动控制“吸引强度”，仍能体验粒子还原效果
- **HUD**：采样密度、吸引强度、当前手势徽章、还原百分比

技术选择：

- Three.js r160 ESM + importmap
- 自定义 ShaderMaterial 处理粒子圆点 + additive blending
- MediaPipe Hands 通过动态 `<script>` 注入

## 验证记录

- 直接打开 `index.html` 可看到演示图的粒子流
- 摄像头可用 + MediaPipe CDN 可达时，可用手势控制
- 摄像头 / CDN 不可用时，仍可通过滑块观察还原过程
- 文件夹未保存摄像头视频帧，不收集任何用户数据

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--minimax-m3-max-r01`
- 模型：MiniMax M3；推理档位：max
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：原 prompts/v1/prompt.md 完整保存；包含任务正文的中英文版本。
- 工具：Claude Code (MiniMax-M3)。当前会话直接执行；不使用 worktree 或子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [粒子画布](../../../../demos/pixel-flow/runs/minimax-m3-max-r01/index.html)

### 部署适配记录

- 摄像头 / MediaPipe CDN 不可用时降级为手动滑块控制，避免单点失败。
- 默认演示图为 Canvas 绘制的日落剪影，避免上传依赖。
- 归档来源：F:\dev\ai-coding-demo-test（model-test-base 分支）中的 demos/pixel-flow/runs/minimax-m3-max-r01；按原实验轮次导入。
<!-- archive:end -->
