# 奇幻岛屿地图生成器

## 原始提示词

见 [完整原始输入](prompt.md)（主题任务正文 v1 逐字快照）。本轮批量触发语：“所有的案例 demo 全部都做一遍，模型名称 qwen3.8-flash 档位 high, 用当前会话就好了”。当前会话按 topics:active 清单直接执行。

## 批次记录

Aliyun 批次共 11 个案例，合计 3.6 CNY，耗时 1h 18m 26s；费用和耗时均为批次总计，不拆分为单案例。

## 运行与复盘

- 运行方式：浏览器直接打开本目录 index.html（纯静态、离线、无 CDN）。
- 实现要点：96×96 格高度场 = 4 倍频值噪声（种子字符串哈希 → mulberry32）× 岛屿径向衰减；海平面/粗糙度滑杆；分类为海洋/海岸/平原/森林(湿度噪声)/山脉。河流从局部山峰沿严格下坡（含允许平地蜿蜒但禁上坡）追踪：入海停止、洼地成合理内陆湖；画笔升高/降低（半径可调、余弦衰减）后重分类并全量重算河流/湖。指针拖拽平移、滚轮/双指 pinch 缩放（缩放后点击坐标按视图逆变换换算）、城镇按种子 RNG 命名并显示标签、导出 PNG 走离屏 canvas 全图渲染。羊皮纸斑点、抖动海岸线与海侧波纹弧营造手绘感，抖动数组以“种子+海平面+高度摘要”哈希缓存保证同输入同输出。
- 验收（headless Chromium，canvas toDataURL 像素比对）：同种子重生成一致（预热一帧后 0 差异；headless 首帧中文标签字形为一次性字体 artifact，非生成随机性）；换种子不同；画笔拖拽明显改变地图；390px 无水平溢出；无 JS 错误。
- 修复记录：初版“生成”按钮里残留第二次 regenTowns 导致同种子二次生成城镇漂移，已删除（见 run.json changes）。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`fantasy-map-generator--qwen3-8-flash-high-r01`
- 模型：Qwen 3.8 Flash；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=fantasy-map-generator)
- 输入记录：当前会话直接执行主题任务正文 v1，完整原始输入为该正文的逐字快照，未附加其他材料；批量触发语记录于本 run 的 Readme。
- 工具：Claude Code CLI（当前会话）。模型名称与档位按用户给定登记（qwen3.8-flash / high）；Windows 11 + Node 22，当前会话生成并自检，未委派子代理；实现过程中的自我修正记录于 changes 与 Readme。 迁移到 main 时，按用户确认将测试分支误记的档位从 default 更正为 high。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：Aliyun 批次合计 3.6 CNY（11 个案例；批次 qwen3-8-flash-high-2026-10-14；未记录单案例费用）
- [主页面](../../../../demos/fantasy-map-generator/runs/qwen3-8-flash-high-r01/index.html)

### 部署适配记录

- 实现期自检：海岸线抖动改用种子哈希保证同种子重生成结果一致；导出走离屏 canvas 全图渲染。
- headless 验收发现 gen 点击处理残留二次 regenTowns 会使同种子再生的城镇漂移，已删除（保留 generate() 内唯一调用）。
- 迁移时根据用户确认将误记的 default 档位纠正为 high，并同步更正实验 ID 与路径。
<!-- archive:end -->
