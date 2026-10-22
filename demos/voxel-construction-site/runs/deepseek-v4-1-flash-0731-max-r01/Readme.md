# 体素工地 · 首轮

## 原始提示词

见 [完整原始输入](prompt.md)（任务正文 v1 原文快照）。

## 运行与复盘

- 运行方式：DeepSeek-V4.1-Flash-0731（档位 max）在 Claude Code 当前会话直接生成；未使用子代理、未提供后续追问。
- 产物入口：[index.html](index.html)（单文件；Three.js r160 与 addons 经 CDN 加载）。
- 验证记录（Playwright，HTTP 与 file:// 双路径，23 项断言全部通过）：
  - 8 台机械（挖掘机×2 / 塔吊×2 / 渣土车×2 / 搅拌车 / 装载机）与 17 名体素工人
  - 车辆行驶、塔吊回转、挖掘机动臂往复均持续动画
  - 单车道车距约束：连续采样车辆最小间距 25.1，无追尾穿模
  - 全部元素限定在沙盘桌面范围内
  - 桌面实体旋钮射线点击分别切换 速度（慢/标准/快）、昼夜循环、尘土（无/轻/浓）
  - 夜晚相位灯光激活（nightLevel 1.0），正午关闭；空格触发暴雨并产生湿滑地面，再按关闭
  - 拖拽环视 / 滚轮缩放 / 闲置自动环绕均生效；390px 按钮控制生效、无水平溢出
- 过程记录：为避免穿模做了一轮专门整理——单车道行车 + 车距约束、工人搬运路径绕开基坑、门卫巡逻避开行车道、物料堆与道路保持净距；另修复了地面标高统一（沙地顶面 y=0.8）与塔吊吊索伸缩。
- 备注：几何体、材质、贴图（木纹/蓝图/标识）均由代码生成；烟尘与光锥为自定义着色器。任务正文中“添加新场景进去”按丰富场景元素处理（水车/工具车等未选，改为完善既有要素与交互）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`voxel-construction-site--deepseek-v4-1-flash-0731-max-r01`
- 模型：DeepSeek-V4.1-Flash-0731；推理档位：max
- 类型：single-html；预览：static；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=voxel-construction-site)
- 输入记录：任务正文 v1 原文。单次输入，未附后续追问或其他上下文。
- 工具：Claude Code 2.1.295。用户指定模型 DeepSeek-V4.1-Flash-0731、档位 max；当前会话直接生成，未使用子代理；Windows 11 / Node v22.16.0。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Deepseek 批次合计 2.78 CNY（11 个案例；批次 deepseek-v4-1-flash-0731-max-2026-10-13；未记录单案例费用）
- [主页面](../../../../demos/voxel-construction-site/runs/deepseek-v4-1-flash-0731-max-r01/index.html)

### 部署适配记录

- Three.js r160 与 BufferGeometryUtils 经 CDN 加载，需联网。
- 工地车辆采用单车道车距约束以免追尾穿模；工人路径、巡逻路线与堆料区保持净距。
- 迁移来源：F:/dev/ai-coding-demo-test/demos/voxel-construction-site/runs/deepseek-v4-1-flash-max-r01；保留原始 r01、完整输入快照与测试产物。
- 迁移验收：通过本地 HTTP 打开实际入口并补拍桌面截图；390px 检查无页面横向溢出，Playwright 控制台无页面错误。
- 模型与实验目录标识按用户确认更新为 DeepSeek-V4.1-Flash-0731；历史输入、评分、产物与迁移来源保留。
- 维护者于 2026-10-22 按 v3 对本轮桌面、手机及补充状态逐图重评并绑定 captures 证据；旧截图和 v2 评分见 catalog/score-reviews/2026-10-21-v3-source.json。未重跑模型或改写实验源码，截图不证明完整功能、算法、手势或性能。
<!-- archive:end -->
