# Pixel Flow

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

- 运行方式：单 HTML 文件，HTTP 静态托管打开；**依赖网络**（unpkg Three.js、jsdelivr MediaPipe Hands）。摄像头功能需要 HTTPS 或 localhost 环境；页面提供「鼠标模拟手掌」降级模式（移动=张掌吸引，按下=握拳驱散），file:// 或权限被拒时也能体验同一套粒子逻辑。
- 入口：[index.html](index.html)
- 执行模型：Kimi K3，档位 high，Copilot CLI（VS Code）当前会话直接执行。
- 实现要点：
  - 上传本地图片 → Canvas 按可调采样率提取像素 → `THREE.BufferGeometry` 顶点粒子，每粒子存原始位置与颜色，初始为随机飘散的粒子流 ✓
  - 摄像头画面镜像显示于角落；MediaPipe Hands 21 关键点实时追踪，掌心为腕部与四指根均值，张掌/握拳由四指尖-腕距与掌长比例判定 ✓
  - 张掌激活「吸引区域」：跟随掌心，半径内粒子被加速吸回原位（越靠近掌心越强）；握拳驱散附近粒子并暂停吸引；一键还原为全局吸引 ✓
  - 状态面板实时显示粒子数、还原进度、手势与摄像头状态；模型加载中有加载指示，失败有明确错误提示 ✓
- 验证记录：粒子数随采样率变化；还原进度统计基于回家距离阈值；摄像头权限被拒时状态栏提示 HTTPS/localhost 要求。
- 复盘：一次生成完成，未做追加修复。摄像头画面仅在本地处理，不上传任何数据。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--kimi-k3-high-r01`
- 模型：Kimi K3；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：完整输入即主题任务正文 v1（中英双语同题），无附加上下文。
- 工具：GitHub Copilot CLI（VS Code）。model-test-base 独立克隆中由当前会话直接执行；模型 kimi-k3，档位 high；未委派子代理。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [Pixel Flow](../../../../demos/pixel-flow/runs/kimi-k3-high-r01/index.html)

### 部署适配记录

- 来源：模型测试分支 `experiment/kimi-k3`，提交 `793b2ac`。迁入时原始输入与模型产物未改写；迁入后通过本地 HTTP 打开入口并补拍实际运行截图 `screenshot.png`。
<!-- archive:end -->
