# GPT 6 Astra / max 全部活跃主题实验

本轮在当前会话完成 11 个参与测试主题，各新增 `gpt-6-astra-max-r01`。模型名称 `gpt-6-astra` 与档位 `max` 来自用户明确指定；未委派子代理。开始于 2026-10-16，用户于 2026-10-17（Asia/Shanghai）发送“继续”后完成最终验证与归档。

从仓库根目录执行 `npm run preview`，打开首页即可进入全部案例。小蓝书已提交静态构建预览，其他案例直接登记实验目录 HTML。根目录继续作为静态站点发布目录。

## 范围与提示词

先执行 `npm run topics:active` 获取参与主题，选择每个主题编号最大的提示词版本。`stock-watching` 已归档，本轮没有重跑，也没有恢复其测试状态。

| 主题 | 任务版本 | 交付内容 | 运行依赖 |
| --- | --- | --- | --- |
| [小蓝书](../../../demos/bluebook/runs/gpt-6-astra-max-r01/Readme.md) | v2 | React / TypeScript 瀑布流、搜索、分页、收藏、发布 | 已构建，HTTP，无外网依赖 |
| [简化电路实验台](../../../demos/circuit-lab/runs/gpt-6-astra-max-r01/Readme.md) | v1 | 元件拖拽连线、实际直流求解、异常提示 | 单 HTML，离线 |
| [奇幻地图生成器](../../../demos/fantasy-map-generator/runs/gpt-6-astra-max-r01/Readme.md) | v1 | 种子地形、下坡河流、地形编辑、PNG | 单 HTML，离线 |
| [彩色流体实验台](../../../demos/fluid-simulation/runs/gpt-6-astra-max-r01/Readme.md) | v1 | WebGL2 速度/染料场、压力投影、参数与导出 | 单 HTML，离线，需浮点纹理支持 |
| [生活情绪日记](../../../demos/life-diary/runs/gpt-6-astra-max-r01/Readme.md) | v1 | 七屏原型、日记与任务本地保存、导出 | Tailwind / Unsplash；两个相同内容入口 |
| [冥想 iOS App](../../../demos/meditation/runs/gpt-6-astra-max-r01/Readme.md) | v1 | 七屏原型、声景播放器、呼吸与睡眠计时 | Tailwind / Unsplash |
| [新哥特式塔楼城市](../../../demos/neo-gothic-tower-city/runs/gpt-6-astra-max-r01/Readme.md) | v1 | 程序化城市、昼夜、海面火焰、步行漫游 | 单 HTML，内嵌 Three.js，离线 |
| [寻路算法实验室](../../../demos/pathfinding-lab/runs/gpt-6-astra-max-r01/Readme.md) | v1 | BFS / Dijkstra / A*，编辑、暂停、单步 | 单 HTML，离线 |
| [Pixel Flow](../../../demos/pixel-flow/runs/gpt-6-astra-max-r01/Readme.md) | v1 | 图片粒子化、指针吸引、MediaPipe 手势还原 | Three.js / MediaPipe / 模型外链；摄像头需安全上下文 |
| [体素微缩建筑工地](../../../demos/voxel-construction-site/runs/gpt-6-astra-max-r01/Readme.md) | v1 | 高层和桥梁双场景、接土运输卸料、昼夜暴雨 | 仅 Three.js r160 CDN；场景素材由代码生成 |
| [YouTube UI 模块](../../../demos/youtube-ui/runs/gpt-6-astra-max-r01/Readme.md) | v1 | 五个 HTML、十屏原型，搜索播放、订阅评论、创作草稿 | Tailwind / Lucide / Unsplash / 示例视频 |

## 实验来源与保存方式

- 起点为当前 `model-test-base` 检出，基线提交 `452ac58`；结果写入本地分支 `experiment/gpt-6-astra-max-20261016`。按用户要求使用当前会话，没有重新开会话，不能当作严格隔离实验。
- 初始受版本控制的工作区干净，但发现此前遗留的两个 `minimax-m3-1-flash-preview-max-r0*` 目录不含 run.json，导致活跃主题命令无法完成。只枚举了名称及元数据，未读取其中实现；校验路径后移至忽略目录 `.cache/preexisting-run-artifacts-20261016/` 保留，再执行活跃主题查询。未从远程、其他分支或其他工作目录获取旧答案。
- 每条实验保存 run.json、prompt.md、Readme.md。输入快照保留用户批量请求、AGENTS.md 和所选任务正文；“继续”另存 evidence/follow-up.md。没有完整导出系统/开发者上下文与工具日志，因此 completeness 为 partial；不据此宣称输入完全一致或性能比较公平。
- 每个实验的 evidence/first-pass.zip 保存集中验收前的首次源码产物，evidence/Readme.md 记录其 SHA-256 与后续修复。所有修复由当前会话代理完成，没有人工代码修改；各 run 的 changes 同步记载。
- 使用 Sites 技能的本地开发与浏览器检查方式；没有建立或发布远程 Site。YouTube 原提示词中的 Artifacts 插件不可用，以本地 Chromium 和截图完成可视化。

## 验证与证据

环境：Windows / PowerShell、Node.js 22.16.0、Playwright 1.58.2、无头 Chromium。3D 自动检查使用 SwiftShader 软件渲染。

| 验证 | 结果与证据 |
| --- | --- |
| 小蓝书生产构建 | `npm run build:demo -- bluebook--gpt-6-astra-max-r01` 通过；独立 lockfile、预览和 build-info.json 保存 |
| 11 个案例的针对性交互 | 全部通过：[完整报告](verification-1792156200472.json)、[城市与工地调整后复验](verification-1792156478609.json)、[可复现脚本](verify.mjs) |
| 环境和降级 | 8 项通过：MediaPipe 合成摄像头加载/推理、拒绝权限、WebGL2 不可用提示、五个离线单页的 file://；[报告](environment-verification.json)、[脚本](verify-environment.mjs) |
| 完整装卸循环 | 两个场景各推进 180 秒，均验证两辆渣土车接土与卸料，路线和车辆间距保持约束；[报告](transport-verification.json)、[脚本](verify-transport.mjs) |
| 页面与输入链接 | 16 个登记入口的 HTTP / 390px、15 个静态入口的 file://、11 个输入指纹及 124 个首页/主题页本地链接全部通过：[报告](delivery-verification.json)、[脚本](verify-delivery.mjs) |
| 仓库单元测试 | `npm test`：11 项通过 |
| 站点浏览器回归 | `npm run test:browser`：12 项通过，覆盖域名根目录与 Pages 子路径 |
| 目录和源码检查 | `npm run generate`、`npm run validate`、`node --check index.js`、单页内联脚本语法及 `git diff --check` 均通过 |
| 无构建预览 | 将暂存区 Git 树导出到空目录，未安装依赖或构建，16 个入口与 11 个输入可读；屏蔽外网后首页与小蓝书构建预览正常渲染：[报告](clean-checkout-verification.json)、[脚本](verify-clean-checkout.mjs)、[截图](screenshots/bluebook-clean-checkout.png) |

站点浏览器测试最初有两项失败：原测试切换到“全部”时直接期待所有主题卡片，忽略了现有每页 9 条的分页行为。本轮仅修正 `tests/browser/home-directory.spec.mjs` 的断言，先检查首批，再点击“加载更多”验证计数与隐藏状态；首页实现没有修改。修正后 12 项全部通过。

暂存区空白检查发现 YouTube 原始任务正文含有 Markdown 行尾双空格。为满足原始输入不得删改的规则，`.gitattributes` 仅对 `demos/*/runs/*/prompt.md` 关闭 blank-at-eol 检查；其他空白规则及源码检查照常执行，输入内容与哈希均未改变。

工地长循环检查后的一张手机截图曾显示空白；保留 [首次截图](screenshots/voxel-construction-site-mobile-transient.png)。等待实际渲染帧后重测，未观察到上下文丢失或 GL 错误，[最终截图](screenshots/voxel-construction-site-mobile-final.png) 正常。截图现象不能作为稳定帧率的证据。

可在根目录启动只读服务器后执行独立验收脚本：

```powershell
node scripts/serve.mjs --read-only
# 另开终端；verify.mjs 可在末尾加主题 ID 只复验指定主题
node docs/experiments/gpt-6-astra-max-20261016/verify.mjs
node docs/experiments/gpt-6-astra-max-20261016/verify-environment.mjs
node docs/experiments/gpt-6-astra-max-20261016/verify-transport.mjs
node docs/experiments/gpt-6-astra-max-20261016/verify-delivery.mjs
```

## 结论边界

- 全部案例已提供可运行产物，原型中的 AI 回顾、内容、账号和分析数据明确作为演示；没有接入真实业务后端。
- Pixel Flow 的 MediaPipe 使用合成摄像头验证了模型加载与推理，未做真实手部动作或实体摄像头识别率测试。
- 工地的 60FPS 是任务目标，未在实体 GPU 上验收。车辆中心间距与路线边界通过测试，但这不等同于所有关节、吊物及静态几何都经过完整碰撞验证。
- 新哥特城市是按统一尺寸创作的虚构城市，未声称按真实城市测绘数据复建。
- 依赖 CDN、WASM、模型或远程照片的案例均标记 network: required；小蓝书的 offline 指不需外网，构建预览仍需 HTTP。
- 本轮只提交本地实验分支；没有推送、导入 main 或修改 Pages / CNB / 域名 / Vercel 设置。结果导入按 [model-test 工作流](../../model-test-workflow.md) 处理。

技术接口依据：[Three.js InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html)、[MediaPipe Web Hand Landmarker](https://developers.google.cn/edge/mediapipe/solutions/vision/hand_landmarker/web_js)。内嵌 Three.js 的许可保存在对应实验中。


## 迁移至 main（2026-10-17）

将本分支的 11 条实验、蓝皮书构建预览及本目录验收报告迁入当前 main。实验日期沿用源 run.json 中记录的 2026-10-16；迁移时补拍的桌面截图登记为 2026-10-17。用户提供本批供应商为 OpenAI，使用 ChatGPT Plus 周额度 13%，总耗时 13m 54s；数据作为 11 案例批次记录，不拆算到单案例。原有手机视口和运行验收截图保留；新增 11 张 1440px 桌面截图，并按导入时的案例截图评分规则 v2 逐图复核，评分依据、输入/检查项/截图指纹写入各 run.json。迁移只登记仓库内容，不修改 Pages、CNB、域名或 Vercel 配置。

迁移后应用户要求，对这 11 张桌面截图重新逐图评分，旧分、新分与各项依据见 [2026-10-17 评分快照](../../../catalog/score-reviews/2026-10-17-gpt-6-astra-max-v2.json)。本次保留全部原始截图与产物。
