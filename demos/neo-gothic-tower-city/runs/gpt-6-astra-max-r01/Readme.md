# 新哥特式塔楼城市 · Astra Max

可离线打开的新哥特式塔楼城市，含昼夜切换、海面、火焰、环绕和第一人称漫游。

任务版本：v1。模型与档位按用户提供记录为 **gpt-6-astra / max**。开始日期 2026-10-16，2026-10-17（Asia/Shanghai）继续完成验证与归档；本轮在同一会话直接执行，未委派子代理。

[输入快照](prompt.md) · [首次产物与修复](evidence/Readme.md) · [后续输入](evidence/follow-up.md) · [整轮实验报告](../../../../docs/experiments/gpt-6-astra-max-20261016/Readme.md)

输入完整性为 partial：保留了批量请求、仓库指令和所选任务正文，未完整导出系统/开发者上下文及工具历史；不作为隔离或同输入公平评测。

## 运行

直接双击 [index.html](index.html) 即可离线运行；也可在仓库根目录执行 `npm run preview` 后从主题页进入。

## 实现

- 单 HTML 内嵌 Three.js r160，程序生成尖塔、扶壁、尖拱、玫瑰窗、街道与海岸。按米定义建筑尺寸，主塔尖顶约 124m，步行视点高度 1.7m。
- 实例化重复石块、尖顶及拱形构件；海面着色器、火焰粒子、行人和昼夜光照。鼠标/触摸环绕缩放，WASD 或触屏方向键漫游。

## 验证

- 验证步行前进改变相机位置、昼夜切换、暂停与重置；390px 截图复核与无水平溢出检查。
- 禁用网络后直接 file:// 打开，内嵌 Three.js 正常初始化，未出现页面脚本错误。

具体脚本、运行报告与截图见整轮实验报告。自动验证环境为 Windows、Node.js 22.16.0、Playwright 1.58.2 和无头 Chromium，3D 检查使用 SwiftShader。

## 边界与复盘

- 城市为原创场景，按统一尺寸组织，未依据某座真实城市的测绘或建筑图纸复原。碰撞使用建筑占地区域约束，不是完整物理引擎。
- 未在实体显卡与真实手机上做帧率基准测试。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`neo-gothic-tower-city--gpt-6-astra-max-r01`
- 模型：GPT-6 Astra；推理档位：max
- 类型：single-html；预览：static；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=neo-gothic-tower-city)
- 输入记录：保存用户批量请求、用户仓库指令与所选任务正文原文。当前会话逐个执行，系统/开发者上下文与其他主题的工具过程未完整导出，不作为隔离或同输入公平评测。 用户后续“继续”另存 evidence/follow-up.md，未改写首次输入快照或任务正文。
- 工具：Codex。Windows / PowerShell / Node.js 22.16.0；按用户明确指定记录 gpt-6-astra / max；当前会话直接执行，未委派子代理。最新版本优先；已归档主题跳过。基线目录已有其他实验残留，未读取实现，移至 .cache/preexisting-run-artifacts-20261016 保留。
- 运行方式：浏览器直接打开本目录入口；CDN/外部素材需要联网。
- 费用记录：OpenAI 批次合计 13 %（ChatGPT Plus 周额度）（11 个案例；批次 gpt-6-astra-max-2026-10-16；未记录单案例费用）
- [主页面](../../../../demos/neo-gothic-tower-city/runs/gpt-6-astra-max-r01/index.html)

### 部署适配记录

- 本轮按所选任务正文创建新实验，当前会话直接执行；首次实现保留为 evidence/first-pass.zip，后续修复均由本会话代理完成，无人工代码修改。
- 修正首次内嵌库字符串替换导致的脚本截断，改用安全拼接并转义结束标签。
- 修正教堂山墙几何，批渲染重复尖顶与拱形构件；根据画面宽高比调整相机距离。
- 在单 HTML 和 THIRD_PARTY_NOTICES.md 中保存 Three.js r160 完整 MIT 许可。
- 从 experiment/gpt-6-astra-max-20261016 分支迁移到 main；保留原始实现、输入、首次产物、修复记录和验证报告。
- 迁移归档时于 2026-10-17 在 1440px 桌面视口补拍真实运行截图，并按案例截图评分规则 v2 逐图复核；截图、维度与依据保存在本实验记录。
- 本轮 11 个案例的订阅额度消耗与耗时由用户按批次提供，关联 billing batch gpt-6-astra-max-2026-10-16，不拆分为单案例。
<!-- archive:end -->
