# 小蓝书 · 瀑布流社区（任务正文 v2）

## 原始提示词

见 [完整原始输入](prompt.md)。本轮为模型 minimax-m3-1-flash-preview、档位 max 执行任务正文 v2。v2 与 v1 是不同任务：v2 去掉了 images 目录、编译拷贝与 Readme 要求，改为「使用 mock 数据，包含不同高度的图片」。

## 运行方式

本目录是完整源码。开发模式 `npm ci && npm run dev`；生产构建 `npm run build`，产物提交在 `previews/bluebook/minimax-m3-1-flash-preview-max-r05/`。

## 实现要点

- 与 v1 同栈（React 18 + TypeScript + Tailwind + Zustand + react-lazyload + Vite），组件拆分与状态管理保持一致，便于对照两个任务正文的差异。
- 关键差异在数据层：不再有 `images/` 目录，改为在 `src/mock/data.ts` 里**运行时生成 SVG data URL** 作为 mock 图片，颜色按索引取自固定主题表，山形与圆点只是占位装饰。
- 「不同高度」被显式建模为 `ratio`：0.72 / 1.0 / 1.33 / 0.8 / 1.5 等高宽比混合，瀑布流据此预留占位高度，避免加载时的布局跳动。
- 其余需求（首屏 20 条、滚动加载、loading 动画、两行截断、hover 上浮、按压反馈、下拉刷新、失败默认图、点赞弹跳、页面渐入、2/3/4 列响应式）按正文逐条实现。

## 验证记录

- `npm ci` 后 `npm run build` 通过，产物不依赖任何外部图片请求。
- 390×844 视口下为两列瀑布流，卡片高度明显不同（高图 / 方图 / 宽图交错），错落效果成立。
- 1280 宽度下为四列。
- 控制台无报错，无 404 图片请求。

## 复盘

**做得好的**：同一模型在同一主题的两个任务正文版本下，代码结构保持可对照，而数据层按 v2 的要求真实改成「运行时 mock 不同高度图片」——这正是版本化任务正文存在的意义：同一个模型在两套约束下的差异是可被观察的，而不是复制一份改改文案。

**不足**：
1. 运行时把 SVG data URL 写进每条数据（120 条各一段字符串），每次刷新首屏都会重复编码；更好的做法是缓存编码结果或用 OffscreenCanvas 统一生成。
2. `ratioFor` 使用 `(i * 3) % ratios.length`，虽然能覆盖全部比例，但序列有明显的规律性，长列表滚动时会看出重复节奏。
3. 与 v1 共用同一套组件，等于把 v2 实现建立在 v1 的产物上；若两个任务正文出现互相矛盾的要求，当前结构缺少隔离手段。
4. `LazyImage` 的懒加载在这份 mock 数据上没有真实收益（data URL 无网络请求），组件仍然全量挂载，属于为 v1 保留的结构。
5. 依然没有把「搜索」做成全量搜索，数据只覆盖已加载页，v2 正文虽未要求，但功能表观上不完整。

## 批次记录

本批共 11 个主题案例、12 条实验记录（蓝皮书含 v1/v2）；MiniMax Max 五小时额度消耗 44%，token 消耗 60.6M，耗时 57m 10s。测试备注：自我审查五轮。以上为批次总计，不拆分为单条记录。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-preview-max-r05`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整原始输入，等同于主题任务正文 v2（未增删），保存于本目录 prompt.md。
- 工具：Claude Code。Claude Code 会话内直接执行，模型 minimax-m3-1-flash-preview、档位 max；未使用子代理，未参考任何历史实现或远程分支。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：MiniMax 批次合计 44 %（Max 订阅套餐五小时额度）（12 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-14；未记录单案例费用）
- [小蓝书首页](../../../../previews/bluebook/minimax-m3-1-flash-preview-max-r05/index.html)

### 部署适配记录

- 构建期修复：补 prop-types 依赖，避免产物出现无法解析的裸模块导入。
- 构建期修复：改为 base: './'，使产物在子路径下同样可用。
- 迁移来源：F:\dev\ai-coding-demo-test（model-test-base）/demos/bluebook/runs/minimax-m3-1-flash-preview-max-r02；main 已有该轮号，保留旧记录后迁入为 minimax-m3-1-flash-preview-max-r05。原始输入与产物按源分支复制，prompt.md 未改写。
- 用户提供的本批测试备注：自我审查五轮。
- 迁移截图：源测试分支未登记桌面截图；已在本仓库通过本地 HTTP 入口按实际页面补拍，并在 390px 视口确认无水平溢出（2026-10-14）。
<!-- archive:end -->
