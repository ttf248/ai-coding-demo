# 冥想 iOS App 原型

## 原始提示词

见 [完整原始输入](prompt.md)。

## 运行与复盘

单文件网页实现，入口为 [index.html](index.html)。通过静态 HTTP 托管或浏览器直接打开。

核心实现：
1. **产品与场景梳理**：模拟真实冥想用户的碎片化场景与夜间助眠需求，规划设计了四大核心模块：
   - 今日正念：主推练习、状态卡片、意图快速入口与夜间故事推荐。
   - 沉浸播放器：动态收缩放大的呼吸引导光环、阶段倒计时与环境音混音控件。
   - 声景与故事：白噪音开关阵列（骤雨、篝火、浪潮）、睡前慢读故事与自动定时睡眠关停。
   - 正念档案：累计时长、连续连击天数、Apple Health 数据接入展示与成就勋章。
2. **视觉体系**：基于深绿与炭黑禅意色调，使用 Tailwind CSS 构建高质感移动端原型。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`meditation--gemini-3-8-flash-high-r01`
- 模型：Gemini 3.8 Flash；推理档位：high
- 类型：prototype；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=meditation)
- 输入记录：使用当前模型执行 v1 任务正文。
- 工具：Copilot SDK in VS Code。当前会话直接执行生成与验证。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [冥想原型](../../../../demos/meditation/runs/gemini-3-8-flash-high-r01/index.html)

### 部署适配记录

无新增实现改动。
<!-- archive:end -->
