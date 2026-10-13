# 奇幻地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/fantasy-map-generator/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`，浏览器直接打开或静态托管均可运行，无外部依赖。
- 实现：种子驱动的二维值噪声（fBm）生成高度场，径向衰减形成岛屿；海平面与粗糙度可调；按高度分类海洋/海岸/平原/森林/山脉；河流自高海拔源头沿最陡下降流向海洋，遇局部最低点形成内陆水体，不穿越山峰。
- 编辑：升高/降低画笔修改高度场后重算海岸与河流；支持平移、缩放（滚轮/双指）、城镇标签与 PNG 导出；首屏加载默认地图与图例。
- 验证：相同种子重生成结果一致；改变种子产生不同地图；画笔修改地形并联动海岸与河流；缩放后绘制坐标正确；导出图片包含当前地图；触摸可操作。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/fantasy-map-generator/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/fantasy-map-generator/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
<!-- archive:end -->
