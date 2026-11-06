# 小蓝书 · 仿小红书瀑布流

GLM 5.3 / high 于 2026-11-06 在 model-test-base 基线实现的 React 18 + TypeScript 构建型瀑布流图片展示页面。

## 原始提示词

见 [完整原始输入](prompt.md)（v2 任务正文）。

## 运行与复盘

- 源码：本目录 `src/`（Vite + React 18 + TypeScript 严格模式）。本目录执行 `npm ci && npm run build` 生成 `dist/`。
- 预览：[previews/bluebook/glm-5-3-high-r01/index.html](../../../../previews/bluebook/glm-5-3-high-r01/index.html)（build:demo 产物，需联网加载 Unsplash mock 图）。
- 技术栈严格按任务正文：React 18 + TypeScript、Tailwind CSS、Zustand 状态管理、react-lazyload 图片懒加载。
- 组件拆分：`SearchBar`（logo/搜索框/发布按钮）、`Waterfall`（响应式列数 + 贪心最矮列分配）、`NoteCard`（懒加载图片、两行截断标题、24px 圆头像、点赞红心）、`PullToRefresh`（顶部下拉刷新指示器）、`App`（IntersectionObserver 无限加载哨兵 + loading 动画）。
- 需求对照：两列（<640px）/三列（<1024px）/四列（桌面）；首次 20 条、滚动自动加载（每页 20、共 5 页后显示"已经到底"）；mock 数据用已验证的 Unsplash 图源按不同高度裁剪；主色 #fe2c55、背景 #f5f5f5、白卡片圆角 8px；hover 上浮阴影加深、active 按压缩放；点赞 heart-pop 放大缩小动画与计数 +1；图片加载失败显示"图片走丢了"默认图；新卡片渐入（fade-in-up）；下拉刷新重载首页数据。
- 验证记录：构建产物在浏览器中实测——首屏 20 卡、桌面 4 列均匀分布、全部图片加载无破图、点赞动画类与计数正确、搜索框可输入、分页状态 20→40→60→100 后 finished、刷新回到 20 条、到底文案正常渲染、无横向滚动条、控制台无错误。
- 修复记录：① react-lazyload@3.2.1 引用 `prop-types` 却未声明依赖，Vite 将其外部化为裸导入导致浏览器无法解析、页面空白，显式安装 prop-types 后正常打包；② mock 图源 picsum.photos / pravatar.cc 在测试环境不可达，换为已验证的 Unsplash 图源；③ 与 react-lazyload 叠加的 `loading="lazy"` 原生属性在后台页签中永不触发加载，移除后图片正常显示。
- 环境说明：隐藏页面中 IntersectionObserver 与触摸事件被系统节流，自动化验证通过临时 window 测试钩子驱动 store 的 loadMore/refresh 完成后已删除，最终构建产物不含钩子；真实浏览器中滚动加载与下拉刷新直接可用。

## 本次迁移记录

2026-11-06 从模型测试工作区迁入 main；以上实现和验收描述保留源作者记录。本次仅补充静态托管统计引用、真实截图与 v3 视觉复核，不把源记录中的内部测试钩子验证视作真实控件验收。原始任务正文逐字保留，完整会话上下文未留存。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--glm-5-3-high-r01`
- 模型：GLM-5.3；推理档位：high
- 类型：app；预览：build；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整原始输入取自该主题 prompts/v2 的任务正文原文，逐字复用；未追加归档要求、系统提示词或额外上下文，输入指纹与共用任务正文一致。 迁移核对：源目录仅保存任务正文快照，未保存发起批量测试的完整指令和会话上下文，不能确认完整输入与其他实验一致。
- 工具：Qoder。用户指定模型名称 GLM-5.3、档位 high，并明确要求使用当前会话直接执行、不委派子代理；本轮在 model-test-base 基线的当前工作区完成，未创建独立克隆。执行日期 2026-11-06。批量范围由 npm run topics:active 取得，testingStatus 为 archived 的 stock-watching 未参与；本主题按默认规则使用版本号最大的提示词 v2。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：aliyun 批次合计 59.12 CNY（11 个案例；原始消耗 2004 积分点，换算比例 59 CNY / 2000 积分点；批次 glm-5-3-high-qoder-2026-11-06；未记录单案例费用）
- [小蓝书瀑布流](../../../../previews/bluebook/glm-5-3-high-r01/index.html)

### 部署适配记录

- react-lazyload@3.2.1 引用 prop-types 却未声明依赖，Vite 构建将其外部化为裸导入导致浏览器无法解析、页面空白；显式安装 prop-types 依赖后正常打包。
- mock 图源原用 picsum.photos 与 pravatar.cc，在测试环境均不可达，换为已验证可用的 Unsplash 图源并以 w/h/fit=crop 参数裁出不同高度。
- 移除与 react-lazyload 叠加的 img loading="lazy" 原生属性（隐藏页签中永不触发加载），图片加载恢复正常。
- 2026-11-06：从 F:/dev/ai-coding-demo-test 的 model-test-base 工作区未提交结果迁入，源基准提交 452ac588702d3bde24f048fcf47cc5ffa7abb602；保留 prompt.md 原始字节、模型源码与源复盘，仅为网页入口添加公共统计引用。
- 2026-11-06：维护者补采真实桌面、手机及任务相关状态证据，使用现行 v3 规则逐图进行 AI 视觉复核；源 README 中的验证声明属于源测试记录，不等于本次独立复验。
- 2026-11-06：在 Vite 构建中将公共统计脚本路径由源码入口四级回退适配为 previews 入口三级回退，保持相对 base 与 Pages 子路径可用。
- 2026-11-06：本次可见证据限制：外部图片依赖 Unsplash；采集存在页面切换导致的 ERR_ABORTED，不能全部视为资源失效。 纵向补拍仅扫描原始范围前5400px，未穷尽五页数据或完整验收搜索、点赞动画和下拉刷新。
<!-- archive:end -->
