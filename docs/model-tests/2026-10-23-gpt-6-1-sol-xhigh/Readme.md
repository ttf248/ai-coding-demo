# GPT-6.1 Sol xhigh · 2026-10-23 迁入记录

本批从独立目录 `F:/dev/ai-coding-demo-test` 的 `experiment/gpt-6-1-sol-xhigh-20261023` 分支提交 `f66f19c8b972544527a094085ab12464473b34ef` 迁入 main。共 11 个参与主题，任务正文与 main 已有版本逐字一致，小蓝书使用 v2，其余使用 v1；stock-watching 已归档，不在本批范围内。

供应商 OpenAI，工具 Codex，账号 Pro 订阅，Fast 开启。用户提供整批消耗 Pro 周额度 2%，耗时 18m 1s（1081 秒）。这些是 11 个案例的合计，不分摊到单案例；货币费用及 Token 明细未知。费用字典批次为 `gpt-6-1-sol-xhigh-codex-pro-fast-2026-10-23`。

## 来源与路径

源分支全部使用 r01，与 main 已有 2026-10-09 的自主设计实验冲突，本次全部另存为 r02。两批没有已知继承关系，sourceRunId 留 null。完整映射见 [migration.json](migration.json)。仅迁入本批源码、输入、真实图片、首次 ZIP 和验收资料，原始 prompt 与源证据中的历史路径/ID 保留。

| 主题 | main 实验 | 任务 |
| --- | --- | --- |
| bluebook | [bluebook--gpt-6-1-sol-xhigh-r02](../../../demos/bluebook/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v2 |
| circuit-lab | [circuit-lab--gpt-6-1-sol-xhigh-r02](../../../demos/circuit-lab/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| fantasy-map-generator | [fantasy-map-generator--gpt-6-1-sol-xhigh-r02](../../../demos/fantasy-map-generator/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| fluid-simulation | [fluid-simulation--gpt-6-1-sol-xhigh-r02](../../../demos/fluid-simulation/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| life-diary | [life-diary--gpt-6-1-sol-xhigh-r02](../../../demos/life-diary/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| meditation | [meditation--gpt-6-1-sol-xhigh-r02](../../../demos/meditation/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| neo-gothic-tower-city | [neo-gothic-tower-city--gpt-6-1-sol-xhigh-r02](../../../demos/neo-gothic-tower-city/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| pathfinding-lab | [pathfinding-lab--gpt-6-1-sol-xhigh-r02](../../../demos/pathfinding-lab/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| pixel-flow | [pixel-flow--gpt-6-1-sol-xhigh-r02](../../../demos/pixel-flow/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| voxel-construction-site | [voxel-construction-site--gpt-6-1-sol-xhigh-r02](../../../demos/voxel-construction-site/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |
| youtube-ui | [youtube-ui--gpt-6-1-sol-xhigh-r02](../../../demos/youtube-ui/runs/gpt-6-1-sol-xhigh-r02/Readme.md) | v1 |

## 证据与维护修改

- [源验证报告](validation.md)、experiment-*.json、checks.txt、clean-checkout.json 和 generation-scripts.zip 保留源文件。源自动化脚本保存在 source-tests，保留原文，不直接执行其旧目录引用。
- [源批次说明](source-readme.md) 为原文证据，其中 r01 链接指向源分支语境，当前有效入口以上表为准，不把它们当作 main r01 的验收。
- 每个新实验保留 evidence/initial.zip、repairs.md 和 validation.md；小蓝书源截图保存在本批 screenshots，其他源截图保存在各 run 的 evidence。
- 维护者仅补加公共 analytics.js defer 引用；小蓝书增加 Vite 路径转换并重建 previews，使源码和预览均兼容根路径与 Pages 子路径。不调整产品逻辑或依赖版本。
- 迁入后按当前 v3 规则采集桌面 1440×900、手机 390×844、滚动和实际控制状态，保留失败尝试及全部来源链。逐图复核、二十项独立评分及完整清单绑定见各 run.json；这些评分不替代源功能验收，不构成跨主题模型能力排名。

## 已知边界

本批共享原测试会话，宿主系统与开发者上下文未完整转录，输入 completeness 保持 partial，不宣称隔离公平评测。未提供真实摄像头、人手或模拟视频进行本次评分；源相机专项含模拟设备，仅作为原验收报告保留。

流体在本次桌面 Chromium / SwiftShader 出现 WebGL 上下文丢失，初次手机图曾显示流场，后续桌面及手机注入补拍因按钮禁用失败，全部尝试保留；未改写源码或伪造成功状态。冥想有外部图片加载失败；小蓝书长页懒加载存在未填满图片槽，不能以初始封面替代完整证据。工地只有两个已登记选项，third-site-rain 帧是请求末项后实际展示的第二工地雨景，不代表第三个场景。

## 迁入验收

[54 项逐入口浏览器检查](import-browser-checks.json)全部通过，覆盖根路径和 Pages 子路径的所有登记入口、原始输入/封面/公共统计脚本、390px 页面宽度、真实对比 iframe，以及 10 个静态案例的 file:// 默认入口。这些检查不验证完整功能；流体环境阻塞与外部资源限制按上文保留。

[来源保真核对](import-preservation-check.json)对固定源提交核对 74 个未作维护适配的文件，其中 31 个二进制文件逐字节一致；文本仅按仓库输入规则统一 BOM 和换行比较。HTML 仅补统计引用，元数据和 README 按迁入映射更新。

本次首次评分复核覆盖 60 张采集帧及 26 份采集清单，包含两个没有新增帧的注入补拍失败清单。封面和全部证据指纹由 demo:sync 补写，11 条记录均通过 --check 并 --finalize 为 ready。

[干净检出检查](import-clean-checkout.json)：从暂存区导出站点，不安装依赖、不执行构建，11 个新增默认入口及其输入、封面可访问，小蓝书显示 20 张初始卡片。

本次调整浏览器测试对新增轮次的断言：同档位保留两条 xhigh 记录，对比回退包含较新的 r02；旧 r01 的自主设计授权仍保留。四行记录的总高度上限随行数调整，单行实测仍约 70px，未修改本站样式或计算样式钉子。

入口检查集中保存在本批报告，不把入口可见性登记为完整功能验收，也不在首页轻量目录重复携带长篇验证说明。12 个登记 HTML 入口与固定源提交核对，仅包含已声明的统计引用适配。

最终[检查汇总](import-validation.json)：generate、validate、73 项单元测试、JavaScript 语法和差异检查通过。全量浏览器回归初次为 329 通过、10 条旧断言失败、1 跳过；更新上述新增轮次断言后，对三份受影响用例在根路径与 Pages 子路径重跑，44 项全部通过，其余初次通过的用例未重复执行。
