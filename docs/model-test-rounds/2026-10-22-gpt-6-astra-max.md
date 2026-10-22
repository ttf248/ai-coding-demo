# GPT 6 Astra / Max · 2026-10-22 实验记录

按用户指定模型 gpt-6-astra、档位 max，在当前会话完成全部 11 个参与主题。使用每个主题最新任务版本：小蓝书 v2，其余 v1。stock-watching 已归档，按规则不重跑。

本轮基于现有空白 model-test-base 目录，在 experiment/gpt-6-astra-max-20261022 分支实施。未查看其他分支或工作目录的历史实现，未使用子代理；未推送或修改外部部署。

## 产物

| 主题 | 提示词 | 实验及复盘 | 预览 |
| --- | --- | --- | --- |
| 小蓝书 · 瀑布流社区 | v2 | [源码与记录](../../demos/bluebook/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../previews/bluebook/gpt-6-astra-max-r02/index.html) |
| 简化电路实验台 | v1 | [源码与记录](../../demos/circuit-lab/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/circuit-lab/runs/gpt-6-astra-max-r02/index.html) |
| 奇幻地图生成器 | v1 | [源码与记录](../../demos/fantasy-map-generator/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/fantasy-map-generator/runs/gpt-6-astra-max-r02/index.html) |
| 彩色流体实验台 | v1 | [源码与记录](../../demos/fluid-simulation/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/fluid-simulation/runs/gpt-6-astra-max-r02/index.html) |
| 生活情绪日记 | v1 | [源码与记录](../../demos/life-diary/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/life-diary/runs/gpt-6-astra-max-r02/index.html) |
| 冥想 iOS App | v1 | [源码与记录](../../demos/meditation/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/meditation/runs/gpt-6-astra-max-r02/index.html) |
| 新哥特式塔楼城市 | v1 | [源码与记录](../../demos/neo-gothic-tower-city/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/neo-gothic-tower-city/runs/gpt-6-astra-max-r02/index.html) |
| 寻路算法实验室 | v1 | [源码与记录](../../demos/pathfinding-lab/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/pathfinding-lab/runs/gpt-6-astra-max-r02/index.html) |
| Pixel Flow | v1 | [源码与记录](../../demos/pixel-flow/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/pixel-flow/runs/gpt-6-astra-max-r02/index.html) |
| 体素微缩建筑工地 | v1 | [源码与记录](../../demos/voxel-construction-site/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/voxel-construction-site/runs/gpt-6-astra-max-r02/index.html) |
| YouTube UI 模块 | v1 | [源码与记录](../../demos/youtube-ui/runs/gpt-6-astra-max-r02/Readme.md) | [打开](../../demos/youtube-ui/runs/gpt-6-astra-max-r02/index.html) |

每条实验包含原始输入、元数据、README、首次源码 ZIP、修复说明、自动检查结果与桌面/手机截图。小蓝书额外包含独立 lockfile 与已构建 previews；YouTube 明确登记 5 个入口。首页、主题页和对比候选由 generate 生成。

## 验证

- 案例验收：45 个不同检查项通过。先运行全量 42 项，再对最后修改及补充交互运行 14 项；其中 11 项重复验证、3 项新增。
- 本站 Playwright：12 项通过，覆盖根路径和 Pages 子路径。修复旧测试假设：全部主题列表首先分页展示，需点击“加载更多”后再断言全部数量；站点交互源码没有改动。
- 案例验证脚本：[源分支验收脚本快照](2026-10-22-gpt-6-astra-max/acceptance-source.mjs)，自动启动/关闭只读服务器；也接受主题 ID 进行定向重跑。
- 构建、generate、validate、11 项 npm test、node --check index.js 与 git diff --check 均通过。原始输入中的 Markdown 行尾双空格原样保留，由输入快照专属的 Git whitespace 属性豁免行尾空格检查；其余代码继续检查。
- 从 Git 暂存树导出干净站点后，未安装依赖或执行构建即可启动只读服务器：15 个预览入口及 11 条实验的输入/记录均返回 200，小蓝书正确显示 20 张卡片和 4 列样式。导出目录不含 node_modules、dist、缓存或测试报告。

在根目录运行 `npm run preview`，打开输出的本地地址即可浏览全部产物。干净检出使用已提交的 previews，不必构建实验；运行本仓库验证工具前需 npm ci。

## 对比边界

模型和档位由用户给定，未独立读取运行时模型设置。用户要求当前会话连续执行，不符合“每轮新会话”的默认隔离条件；输入记录为 partial，系统上下文和所有工具交互未逐字归档，不作为严格公平对比。

Pixel Flow 已加载真实 MediaPipe 模型，并使用模拟摄像头测试生命周期；真人手势识别仍需在目标设备实测。Three.js/流体检查使用软件 WebGL，不证明稳定 60FPS。工地运动按固定区域、路线和间距约束，不声称穷尽了所有机械碰撞状态。联网资源、原型数据、无后端等边界分别记录在各实验 README。

## main 迁入记录

2026-10-22 从测试分支提交 `931b8b50` 复制 11 条实验，main 现有同模型同档位 r01 不覆盖，本轮统一登记 r02。原输入、首次 ZIP、源截图及验收证据保留原 ID。上文验证结论来自源分支，脚本快照保留源路径，仅供追溯；迁入检查另行记录。小蓝书复用 v2，其余复用 v1，正文逐字相同；归档主题 stock-watching 未参与。

用户提供：OpenAI，GPT-6 Astra / max，Codex，Pro 订阅，Fast 与常规混合使用；消耗未记录，整批耗时 55m 52s（3352 秒），不分摊到单案例。

## 迁入验收与截图复核（2026-10-23）

[迁入检查结果](2026-10-22-gpt-6-astra-max/import-checks.json) 逐条覆盖 11 个实验：原始输入与源 evidence 逐字节一致，15 个登记预览入口分别在 HTTP 根路径和 Pages 子路径下检查 1440px / 390px，公共统计每页只初始化一次；全部默认入口在对比页实际加载，10 个静态 HTML 默认入口另检查 file://。这些检查只确认所列行为，不追认源分支全部功能验收。

维护者在 2026-10-22 采集桌面、手机、滚动和实际操作证据，2026-10-23 完成 68 帧人工复核并按现行 v3 写入首次评分。包括上传固定测试 PNG、粒子还原、电路预设、桥梁场景、暴雨、原型导航、冥想播放和呼吸状态；失败清单与补拍来源链全部保留。截图不等于全功能验收，不从源分支通过数或历史分数换算。

流体案例本机 1440×900 软件 WebGL 两次出现上下文丢失，390×844 仍有真实染料；源分支成功截图保持原样。本次桌面启动受阻记录于采集清单与评分限制，评分按明确核心阻塞使用 39 分上限，不宣称全部设备失败，也不为迁入改写模型模拟算法。Pixel Flow 没有真实相机或手部证据，不将按钮还原计为手势识别。

迁入源码只添加公共 analytics.js；小蓝书增加 Vite HTML 路径转换，将四层源码路径改为三层 previews 路径，并以原 lockfile 重建。其余应用源码、原始输入和首次 ZIP 均保留原状；没有改动 Pages、CNB 同步或外部部署设置。

浏览器回归用例改为从目录读取 Astra 记录数，并在 xhigh 条件组内定位历史比较链接，支持本次新增的真实 max 重跑；本站交互与样式没有修改。

最终检查：`npm run generate`、`npm run validate`、73 项 `npm test`、`node --check assets/home.js` 与 Git 空白检查通过。全量 `npm run test:browser` 首次为 335 通过、4 项旧断言失败、1 项既有跳过；修正上述数据数量及链接定位断言后，`npx playwright test tests/browser/topic-models.spec.mjs` 根路径与子路径共 16 项全部通过。未放宽测试阈值、修改站点渲染或样式钉子。
