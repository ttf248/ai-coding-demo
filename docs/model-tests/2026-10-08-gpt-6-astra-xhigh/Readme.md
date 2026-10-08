# GPT 6 Astra · xhigh · 2026-10-08

本轮完成全部 **11 个活跃主题、11 条实验、16 个可访问 HTML 入口**。用户指定模型为 `gpt-6-astra`，档位为 `xhigh`，并明确要求使用当前会话。除体素工地记录为 `r02` 外，实验位于各主题的 `runs/gpt-6-astra-xhigh-r01/`；小蓝书构建预览位于 `previews/bluebook/gpt-6-astra-xhigh-r01/`。

## 范围与执行条件

- 按 `npm run topics:active` 选取主题；`stock-watching` 已归档，本轮没有执行，也没有恢复其测试状态。
- 迁入 `main` 时发现体素工地已有 2026-09-16 的 `gpt-6-astra-xhigh-r01`，所以保留历史记录并将本轮结果编号为 `r02`；测试源码与原始输入未改动。
- 小蓝书存在 v1、v2，本轮使用最新的 **v2**。其余参与主题只有 v1。
- 当前空白基线目录、当前会话、单代理直接实现；没有委派子代理，没有读取远程、其他分支或其他工作目录的旧实现。
- 用户提供的请求、AGENTS.md 快照和任务正文原文保存在每个实验的 `prompt.md`。系统与开发者消息、全部工具输出没有复制；输入完整度记为 `partial`。共享会话上下文，不宣称相互隔离或公平性能评测。
- 没有追加用户提示或人工代码修改。首轮实现后的自检修正在首次定稿前完成，逐条写入 `run.json` 的 `changes`；首次文件另行保留。
- 新建分支 `experiment/gpt-6-astra-xhigh`。保持原 Pages、域名及 CNB 同步方式；没有修改外部部署或推送远程。

## 产物

| 主题 | 任务 | 入口 / 结果 | 截图 |
| --- | --- | --- | --- |
| 小蓝书 | v2 | [React 构建预览](../../../previews/bluebook/gpt-6-astra-xhigh-r01/index.html)，20 条首屏、分页、搜索、分类、点赞、详情与演示发布 | [桌面](screenshots/bluebook-desktop.png) / [390px](screenshots/bluebook-mobile.png) |
| 简化电路实验台 | v1 | [单文件](../../../demos/circuit-lab/runs/gpt-6-astra-xhigh-r01/index.html)，端子接线、元件编辑、MNA 求解 | [桌面](screenshots/circuit-lab-desktop.png) / [390px](screenshots/circuit-lab-mobile.png) |
| 奇幻地图生成器 | v1 | [单文件](../../../demos/fantasy-map-generator/runs/gpt-6-astra-xhigh-r01/index.html)，种子地形、画笔、水系、缩放与导出 | [桌面](screenshots/fantasy-map-generator-desktop.png) |
| 彩色流体实验台 | v1 | [单文件](../../../demos/fluid-simulation/runs/gpt-6-astra-xhigh-r01/index.html)，WebGL 2 速度、染料、压力和投影计算 | [桌面](screenshots/fluid-simulation-desktop.png) / [390px](screenshots/fluid-simulation-mobile.png) |
| AI 情绪日记 | v1 | [8 屏原型](../../../demos/life-diary/runs/gpt-6-astra-xhigh-r01/index.html)，同时保留任务要求的 canghe_app_prototype.html | [桌面](screenshots/life-diary-desktop.png) |
| 冥想 | v1 | [8 屏原型](../../../demos/meditation/runs/gpt-6-astra-xhigh-r01/index.html)，含真实计时、暂停、重置和感受记录 | [桌面](screenshots/meditation-desktop.png) |
| 新哥特式塔楼城市 | v1 | [单文件](../../../demos/neo-gothic-tower-city/runs/gpt-6-astra-xhigh-r01/index.html)，程序化塔楼、漫游、海浪、火焰和昼夜切换 | [桌面](screenshots/neo-gothic-tower-city-desktop.png) |
| 寻路算法实验室 | v1 | [单文件](../../../demos/pathfinding-lab/runs/gpt-6-astra-xhigh-r01/index.html)，BFS、Dijkstra、A*、地形编辑和单步 | [桌面](screenshots/pathfinding-lab-desktop.png) |
| 图片粒子与手势还原 | v1 | [静态应用](../../../demos/pixel-flow/runs/gpt-6-astra-xhigh-r01/index.html)，Three.js + MediaPipe，图片上传、张掌局部吸引、捏合归位 | [桌面](screenshots/pixel-flow-desktop.png) |
| 体素建筑工地 | v1 | [单文件](../../../demos/voxel-construction-site/runs/gpt-6-astra-xhigh-r02/index.html)，机械、车辆、工人、实体旋钮、昼夜、尘土和暴雨 | [桌面](screenshots/voxel-construction-site-desktop.png) |
| YouTube UI | v1 | [5 模块 / 10 屏原型](../../../demos/youtube-ui/runs/gpt-6-astra-xhigh-r01/index.html)，首页、播放、发现、个人与创作 | [桌面](screenshots/youtube-ui-desktop.png) |

## 首次产物与修正

[first-output](first-output/) 保存每个主题首次代码、依赖声明、原始输入和当时元数据的 ZIP；不包含 node_modules 或中间 dist。小蓝书 ZIP 为源码快照，首次构建暴露的缺失依赖没有隐藏。最终源码保留在 runs，构建输出保留在 previews。

主要修正：

1. 小蓝书补齐 react-lazyload 所需的 prop-types，避免生成产物含无法解析的裸模块引用；首批 mock 改为 20 张不同照片和标题。
2. MediaPipe `0.10.22` 稳定版本地址返回 404，改用已实际载入的 `0.10.21`。最终复测又发现 Google 模型跨域下载多次连接重置（记录见 [verification-network-retry.json](verification-network-retry.json)），因此 HTTP 下改用随应用保存的官方未修改模型；保留模型摘要、来源和上游许可证，file:// 仍可尝试官方地址。
3. 粒子在无活动力场时停止未完成的吸引；城市状态文字在低帧率下仍按时间更新。
4. 体素工地分开挖掘作业行，将动态方块也加入实例批次；本次浏览器观察到约 29–32 次绘制调用。
5. 流体显示通道采用双线性取样；原型图表使用 Tailwind 高度类，视频草稿读取文本标题字段。
6. 专项触摸测试先滚动画布进入视口，再发送屏幕坐标；原始失败保留在 [verification-initial.json](verification-initial.json)。实际触摸绘制复测通过。
7. 既有首页回归在“全部主题”时直接断言全部卡片，忽略有实验后每页 9 条的分页。测试改为检查并点击加载更多；没有修改首页产品行为。
8. 暂存检查识别出 YouTube 原始任务中的 Markdown 行尾双空格。为保留完整输入原文，仅对 runs 下的 prompt.md 设置行尾空格检查例外；没有清理输入内容或重算指纹掩盖修改。

## 验证证据

[verify.mjs](verify.mjs) 为可重复运行的案例验收脚本，[verification.json](verification.json) 保存最终 **34/34** 专项检查结果及数值。

- 所有 11 个案例 HTTP 打开无页面脚本异常，390px 无页面水平溢出；16 个 HTML 入口与 11 份输入链接返回成功。
- 4 个要求无外部依赖的实验在离线 `file://` 下成功运行。3D 城市、工地、粒子及三套原型的联网 `file://` 入口也已验证。
- 串联 12V / 100Ω / 200Ω：0.04A；并联：0.12A、0.06A、总电流 0.18A。断开开关零电流；短路、冲突和冗余电源分别提示；触摸连线、移动和删除通过。
- 加权河谷：Dijkstra 与 A* 代价同为 35；BFS 为 23 步、代价 75。空地图 23 步；封闭终点不可达；暂停和单步通过。
- 地图同种子一致，换种子不同；放大后中心画笔修改正确高度，河流逐步下降，PNG 可下载。
- 流体 GPU 帧推进、暂停冻结、清空、分辨率重建及 PNG 通过；重建后持有 8 个模拟纹理目标；不支持 WebGL 时显示可见错误。
- 小蓝书首屏 20 条、搜索、分类、点赞、详情关闭和滚动加载通过。日记本地保存和冥想倒计时通过。
- 粒子上传、打散和完整还原通过；真实 MediaPipe 库、WASM、模型在 Chromium 虚拟摄像头下初始化并处理视频，关闭释放摄像头状态。
- 仓库 `npm run generate`、`npm run validate`、`npm test`（11 项）、`node --check index.js`、`git diff --check` 通过。
- `npm run test:browser` 12 项中首轮 10 项通过、2 项为上述分页断言失败；修正测试后两个失败项目在根路径和 `/ai-coding-demo/` 子路径均复测通过。

复现：在仓库根目录执行 `npm ci`，用 `PORT=43910` 启动 `node scripts/serve.mjs --read-only`，再执行 `node docs/model-tests/2026-10-08-gpt-6-astra-xhigh/verify.mjs`。PowerShell 可先设置 `$env:PORT='43910'`。`DEMO_TEST_URL` 可改测试地址；`DEMO_TEST_FILTER` 可按检查名称筛选复测，并保留其余已完成结果。

## 已知边界

- 摄像头测试使用虚拟画面，不包含真人手势准确率评估。手掌姿态、光线、遮挡和手机摄像头需在实际设备上验证；建议独立打开粒子页面以授予摄像头权限。
- 浏览器自动化允许 SwiftShader 软件渲染，不是独立显卡性能测评。体素场景软件渲染截图约 7–8 FPS；**没有达到或证明提示词中的稳定 60FPS 目标**。车道、车距和塔吊高度有约束，尚未穷举所有机械姿态的几何碰撞。
- 地形为有限网格及局部下降水系，洼地作为内陆湖；流体为可视化数值近似。哥特城市为按米制比例构造的幻想城，不是实地测绘复原。
- 原型的 AI 对话、课程音频、视频媒体、云上传和系统通知未接入服务，并在界面或说明中明确标为原型。小蓝书使用本地 mock，照片加载需要网络，失败有内置默认图。
- CDN、Unsplash、摄像头和 WebGL 的设备要求均按实际情况登记；没有把联网产物标记为离线，也没有为独立服务制造外部部署地址。
