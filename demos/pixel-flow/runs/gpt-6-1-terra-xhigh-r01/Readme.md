# 图片粒子与手势还原

## 原始提示词

见 [输入记录](prompt.md)。

## 运行与复盘

通过 HTTPS 或 localhost 访问以使用摄像头；页面从 CDN 加载 Three.js 与 MediaPipe。可上传本地图片、改变采样率，以张开手掌或拖动指针吸引粒子。浏览器中检查了页面初始化与移动宽度；实际摄像头和手势识别尚未在真实设备上验证。此实验与其他案例共用会话，存在上下文交叉。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--gpt-6-1-terra-xhigh-r01`
- 模型：GPT-6.1 Terra；推理档位：xhigh
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：记录用户批量指令和读取的任务正文；同一会话还包含仓库维护规则与其他主题上下文。
- 工具：Codex。用户提供模型 gpt-6-1-terra、档位 xhigh；在当前会话顺序执行批量主题，非隔离单题会话。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 金额未记录（11 个案例；批次 gpt-6-1-terra-xhigh-codex-pro-2026-10-26；未记录单案例费用）
- [主页面](../../../../demos/pixel-flow/runs/gpt-6-1-terra-xhigh-r01/index.html)

### 部署适配记录

- 从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区迁入未提交测试产物；该工作区当时 HEAD 为 452ac588。维护者补充公共访问统计脚本及截图采集，原始输入保持不变。
- 2026-10-27：按用户明确授权由 Codex 对已列明全部采集帧进行 AI 视觉复核，填写 v3 二十项评分和观察；评分不代表人工复核或完整功能验收。
- 迁入时将入口末尾多余空行规范为单个换行，未改动页面逻辑。
<!-- archive:end -->
