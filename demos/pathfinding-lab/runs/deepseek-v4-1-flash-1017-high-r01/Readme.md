# 寻路算法实验室

## 原始提示词

见 [完整原始输入](prompt.md)。任务正文来自 `demos/pathfinding-lab/prompts/v1/prompt.md`。

## 运行方式

直接用浏览器打开 [index.html](index.html)，或通过静态服务器访问。无外部依赖。

## 实现与验证

- BFS、Dijkstra、A*（四方向，A* 使用曼哈顿距离）；可绘制/擦除障碍、高代价地形，拖动起点/终点。
- 运行、暂停、单步、速度、清除搜索、重置地图、固定预设地图；编辑地图会停止并清除旧搜索。
- 验证：空地图 BFS 为 27 步（曼哈顿距离）；加权预设 Dijkstra 与 A* 均为 33 代价；BFS 为 31 步但代价 59；封闭终点显示不可达；暂停后计数不变；单步扩展一个节点；390 px 无横向溢出。

## 复盘与边界

BFS 只保证步数最少，不保证地形代价最小；路径代价按进入格计算，起点不计。高代价格为 5。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--deepseek-v4-1-flash-1017-high-r01`
- 模型：DeepSeek-V4.1-Flash-1017；推理档位：high
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：用户消息与 demos/pathfinding-lab/prompts/v1/prompt.md 原文完整保存；项目规则来自 AGENTS.md。
- 工具：Claude Code。当前会话直接执行，未委派子代理；模型名称由用户指定为 DeepSeek-V4.1-Flash-1017，档位 high。 源分支误登记 max，迁移时依据用户更正修正为 high；prompt.md 保留源输入原文。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：deepseek 批次合计 3.28 CNY（11 个案例；批次 deepseek-v4-1-flash-1017-high-2026-10-19；未记录单案例费用）
- [寻路算法实验室](../../../../demos/pathfinding-lab/runs/deepseek-v4-1-flash-1017-high-r01/index.html)

### 部署适配记录

- 2026-10-19 从 F:/dev/ai-coding-demo-test 的 experiment/deepseek-v4-1-flash-1017-max 分支（bbbdfcd）导入新增实验；未覆盖历史记录。
- 用户更正实际档位为 high；目录、实验 ID 和元数据由 max 修正为 high，完整原始输入保持不变。来源路径见 docs/imports/2026-10-19-deepseek-1017-high.md。
- 迁移维护者为全部网页入口添加带 defer 的公共 assets/analytics.js 引用；构建型实验重建 previews。
- 迁移时补拍 1440px 桌面实际页面截图并按评分规则 v2 逐图复核；本批 11 个案例合计 ¥3.28、59m 27s，不分摊。
<!-- archive:end -->

## 迁移与档位更正

2026-10-19 迁入 main。用户确认实际推理档位为 **high**；源目录及原始输入中的 max 为历史误记，原始输入保持不变。供应商 deepseek；本批 11 个案例合计 ¥3.28、59m 27s，不分摊到单案例。源码仅补充站点统计接入；截图与评分为迁移时新增证据。详见[导入清单](../../../../docs/imports/2026-10-19-deepseek-1017-high.md)。
