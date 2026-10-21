# MiniMax M3.1 Flash max · OpenCode 迁移记录

- 导入日期：2026-10-21；目标分支：main；来源：F:/dev/ai-coding-demo-test，model-test-base 分支，结果提交 `9e5302c3bf5d44db329e5984ecd6ec786cbca518`（迁移前工作区干净）。逐文件 SHA-256 和来源/目标映射见[迁移清单](2026-10-21-minimax-opencode.json)。
- 共 11 个参与测试主题。main 已存在同模型同档位 r01/r02，本轮源 r01 全部另存为 `minimax-m3-1-flash-max-r03`；此前记录及源目录保持原状，已归档 stock-watching 不在本批范围。
- 模型与档位由用户确认：MiniMax-M3.1-Flash、max；供应商 Minimax；工具 Opencode（toolId: opencode）。复用现有模型字典及查证资料，没有重查或修改模型排序。日期沿用源记录 2026-10-21。
- 用户提供：**公测限免，整批耗时 2h 14m（8040 秒）· 46.7 tok/s**。11 条记录统一引用批次 `minimax-m3-1-flash-max-opencode-2026-10-21`；不拆算单案例用时、费用或 Tokens，不从速度推算累计 Token 数。未给出货币币种或单案例明细，金额和单位留 null，限免信息保存在 plan 和说明。
- 小蓝书复用 v2，其余复用 v1；全部任务正文与 main 逐字节一致，11 份完整输入快照与源目录逐字节一致。迁入源文件共 82 个，排除 node_modules 和中间 dist。源运行说明、验收结论及复盘保留，并追加本次迁移观察，二者分别标明。
- 人工修改仅限归档元数据与说明、网页入口公共统计引用、小蓝书构建统计路径适配和补拍截图。静态 HTML 除追加带 defer 的公共 assets/analytics.js 外与来源相同；小蓝书源码入口用四层相对路径，Vite 在构建产物中改为三层路径。构建预览提交到 previews/bluebook/minimax-m3-1-flash-max-r03/。原说明中的源 r01 路径作为历史证据保留，生成入口指向 r03。
- 未合并测试分支的站点公共代码、主题定义、部署配置或生成目录；继续沿用 main 的生成器和发布方式。

## 截图与首次评分

源记录没有 PNG。使用本地 HTTP 的 Chromium 实际补拍 1440px 宽截图，日记和冥想为整页长图。电路选串联预设；地图保留种子 20240718；流体随机泼洒并拖动注入后暂停；寻路选绕行障碍并运行 BFS 到 44 步结果；3D 使用默认日间视角。视频截图选默认 home.html 的推荐、Shorts 与历史三框，其余四个模块另有入口。

Pixel Flow 先保留 screenshot.png 的初始粒子流，另拍 screenshot-restoration.png 记录内置示例图通过页面提供的鼠标牵引后的状态，并登记后者评分；未启用摄像头，没有模拟手部关键点或手势。图像重构轮廓不清楚，按已展示的点阵和进度评价。

使用 npm run review:scores 生成 348 张既有截图的匿名图集，按同主题总览比较，再逐图查看新增原图。来源已知，不称独立盲测。按[评分规则 v2](../case-scoring.md)独立评价，未依据模型、费用、tok/s、代码声明或旧分换算。首次评分与完整规则保存在[审阅快照](../../catalog/score-reviews/2026-10-21-minimax-opencode.json)。输入、截图和检查项指纹由 demo:sync 首次补写，旧实验评分保持不变。

任务四项按对应任务顺序，视觉四项依次为构图/可读性/操作表达/精修；详细证据和限制见各 run.json。

| 主题 | 任务版本 | 总分 | 任务四项 | 视觉四项 |
| --- | --- | ---: | --- | --- |
| [bluebook](../../demos/bluebook/runs/minimax-m3-1-flash-max-r03/Readme.md) | v2 | 87 | 10 / 9 / 10 / 9 | 17 / 12 / 9 / 11 |
| [circuit-lab](../../demos/circuit-lab/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 79 | 8 / 7 / 9 / 9 | 14 / 13 / 9 / 10 |
| [fantasy-map-generator](../../demos/fantasy-map-generator/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 74 | 8 / 5 / 9 / 5 | 16 / 13 / 9 / 9 |
| [fluid-simulation](../../demos/fluid-simulation/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 85 | 9 / 6 / 10 / 10 | 17 / 12 / 9 / 12 |
| [life-diary](../../demos/life-diary/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 81 | 9 / 9 / 7 / 8 | 17 / 11 / 9 / 11 |
| [meditation](../../demos/meditation/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 83 | 9 / 9 / 8 / 9 | 17 / 11 / 8 / 12 |
| [neo-gothic-tower-city](../../demos/neo-gothic-tower-city/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 64 | 6 / 5 / 5 / 8 | 12 / 12 / 8 / 8 |
| [pathfinding-lab](../../demos/pathfinding-lab/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 87 | 9 / 10 / 10 / 9 | 17 / 12 / 9 / 11 |
| [pixel-flow](../../demos/pixel-flow/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 71 | 6 / 8 / 2 / 6 | 17 / 13 / 9 / 10 |
| [voxel-construction-site](../../demos/voxel-construction-site/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 68 | 8 / 7 / 5 / 6 | 13 / 12 / 8 / 9 |
| [youtube-ui](../../demos/youtube-ui/runs/minimax-m3-1-flash-max-r03/Readme.md) | v1 | 66 | 8 / 7 / 8 / 5 | 14 / 7 / 7 / 10 |

评分评价截图呈现，不是算法、AI 服务、音频、手势追踪、动画碰撞或性能验收，也不作为跨任务模型能力排名。日记周报空图、冥想深底黑字、地图直线水系、3D 遮挡和构件简化、视频小字等按实际图像记录，不为迁移重写产物。

## 迁移验收

- 11 条记录分别通过 demo:sync --check、首次指纹同步与 --finalize，全部为 ready 且 preview.embed 为 true。
- 小蓝书通过 npm run build:demo 重建，补拍后再次构建以包含当前源文件指纹；构建输出的普通 defer 统计脚本提示不影响预览，产物与源码一并归档。
- 针对本批 16 个登记页面，分别验证 HTTP 根路径与 /ai-coding-demo/ 子路径、390px 无页面水平溢出、公共统计脚本路径与 defer、异步 Google tag 以及每文档一次初始化。远程统计请求全程拦截。11 条记录的阅读页、原始输入、PNG 链接均返回成功。
- 11 个默认入口均在真实 compare.html iframe 中打开；电路、流体、寻路和粒子另在两种路径下操作预设/注入/运行/示例图，核对主体画面。电路本次串联读数为 0.0400A；寻路绕行 BFS 本次显示 44 步/代价 44；不据此扩展为完整算法验收。
- 10 个静态实验的默认入口均通过 file:// 实际打开；小蓝书使用提交的 previews，未将 TSX 源码入口当作静态产物。正式站点首页与生成链接仍由公共代码提供。
- npm test：56 项通过；npm run test:browser：281 项通过、1 项按既有配置跳过（子路径项目中的重复 file:// 测试，根路径及本批专门检查已覆盖）。覆盖目录计数、筛选、搜索、排序、视图、加载更多、对比关系与分享恢复、移动端、子路径、统计及计算样式钉子。此次仅导入数据和案例，不改公共页面样式，样式钉子保持原值并通过。
- 最终 npm run generate、npm run validate、node --check assets/home.js 与 git diff --check 全部通过。保留完整静态站点、真实 PNG、派生截图、阅读页和构建预览；不提交 node_modules、中间 dist 或本机验收缓存。
- 未调整 Pages 发布源、域名、CNB 同步或外部部署设置；本次只提交到本地 main，不自动推送。
