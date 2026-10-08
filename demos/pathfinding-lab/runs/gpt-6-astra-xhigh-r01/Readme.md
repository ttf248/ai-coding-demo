# 寻路算法实验室 · GPT 6 Astra xhigh

## 原始输入与执行条件

见 [完整输入快照](prompt.md)。任务正文采用 v1。用户指定模型 gpt-6-astra、档位 xhigh；在当前会话直接执行，没有委派子代理。11 个活跃案例共享会话上下文，不能视为隔离的独立同题测评。

## 运行

离线单文件；30×20 网格，支持绘制障碍和代价 5 地形、拖动端点、预设、暂停和单步。

## 实现与复盘

BFS 以步数搜索；Dijkstra 与 A* 按进入地形的代价搜索，A* 使用曼哈顿启发式。

## 验证

已完成 HTTP、390px 无水平溢出及页面脚本检查；案例功能检查与实际数值见[本轮总报告](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/Readme.md)和[验收结果](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/verification.json)。首次代码保存在[首次产物 ZIP](../../../../docs/model-tests/2026-10-08-gpt-6-astra-xhigh/first-output/pathfinding-lab.zip)，首次定稿前的修正见 run.json 的 changes。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pathfinding-lab--gpt-6-astra-xhigh-r01`
- 模型：GPT-6 Astra；推理档位：xhigh
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pathfinding-lab)
- 输入记录：保留用户本轮原文、仓库规则快照及所选任务原文。当前会话顺序完成全部活跃主题，共享上下文；系统/开发者消息和全部工具输出未复制，不能视为独立同输入测评。
- 工具：Codex。Windows / PowerShell；用户指定模型 gpt-6-astra、档位 xhigh；按用户要求沿用当前会话和当前基线目录。单代理直接执行；未读取其他分支、远程或工作目录的历史实现。版本选择：数字最大的可用版本。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- [主页面](../../../../demos/pathfinding-lab/runs/gpt-6-astra-xhigh-r01/index.html)

### 部署适配记录

- 本轮从空白基线首次实现；没有人工修改。
<!-- archive:end -->
