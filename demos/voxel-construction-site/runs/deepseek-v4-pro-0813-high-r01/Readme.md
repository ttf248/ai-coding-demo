# 体素微缩建筑工地

## 原始提示词

见 [完整原始输入](prompt.md)，任务正文对应 `demos/voxel-construction-site/prompts/v1/prompt.md`。

## 运行与复盘

- 入口：`index.html`，通过 importmap 从 unpkg CDN 加载 Three.js r160，需联网；浏览器直接打开或静态托管运行。
- 实现：桌面与工地全部几何体/材质/颜色代码生成，大量体素用 InstancedMesh（`setColorAt` 实例颜色）批渲染；基坑、钢筋加工棚、物料堆放、在建高层基座、临时板房、渣土堆放、施工道路七区齐全，围挡/彩旗/指示牌/照明灯/脚手架等细节齐备。
- 机械与人物：挖掘机铲斗往复、渣土卡车循环行驶并卸料、塔吊回转吊运、搅拌罐车行驶与滚筒旋转、装载机平整，多台体素工人与安保巡逻，均在沙盘桌面范围内运动。
- 环境与交互：连续昼夜循环（黎明/正午/黄昏/夜晚）与夜晚暖光窗；尘土粒子（强度可调）、空格触发暴雨；鼠标拖拽环视、闲置自动环绕、滚轮缩放；点击桌面旋钮调节机械速度、开关昼夜、调节尘土强度。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--deepseek-v4-pro-0813-high-r01`
- 模型：DeepSeek-V4-Pro-0813；推理档位：high
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：完整原始输入与任务正文 v1 一致，未删改。
- 工具：Claude Code。命令行会话直接执行，未委派子代理；一次生成完整产物。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 4.81 CNY（11 个案例；批次 deepseek-v4-pro-0813-high-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/voxel-construction-site/runs/deepseek-v4-pro-0813-high-r01/index.html)

### 部署适配记录

- 迁移来源：F:/dev/ai-coding-demo-test/demos/voxel-construction-site/runs/deepseek-v4-pro-0813-high-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 入口（Edge 桌面视口）补拍实际运行截图；10 个静态入口另通过 file:// 检查。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
