# 小蓝书 · 瀑布流社区（任务正文 v1）

## 原始提示词

见 [完整原始输入](prompt.md)。本轮为模型 minimax-m3-1-flash-preview、档位 max 在测试分支执行任务正文 v1（使用本地 images 目录、文字头像、下拉刷新与 Readme 要求）。

## 运行方式

本目录是完整源码。开发模式 `npm ci && npm run dev`；生产构建 `npm run build`，产物提交在 `previews/bluebook/minimax-m3-1-flash-preview-max-r04/`，由 Pages 直接托管。构建产物使用相对路径，因此也可放在任意子路径下访问。

## 实现要点

- 技术栈严格按任务正文：React 18 + TypeScript + Tailwind CSS + Zustand + react-lazyload，构建工具为 Vite。
- 组件拆分：`SearchBar`（顶栏与搜索）、`Waterfall`（瀑布流容器与加载态）、`NoteCard`（卡片）、`LazyImage`（懒加载与失败兜底）、`Avatar`（文字头像）、`PullToRefresh`（下拉刷新）。
- 状态集中在 `useFeedStore`（Zustand）：`notes` / `liked` / `page` / `status` / `hasMore`，加载与刷新都走异步并有真实的 loading 态。
- 图片资源放在**本地 `images/` 目录**，通过 `vite.config.ts` 的 `publicDir: 'images'` 在构建时自动拷贝到产物根目录，符合「编译发布时需要支持自动拷贝」；不引用任何外部图片数据。
- 文字头像：由昵称首字 + 确定性调色板生成渐变圆形，视觉与整体配色一致。
- 布局：移动端 2 列、平板 3 列、桌面 4 列；卡片 hover 上浮 + 阴影加深，点击有按压缩放。
- 交互：下拉刷新、滚动到底自动加载、加载动画、点赞红心放大回弹、搜索结果渐入、加载失败占位图。

## 验证记录

- `npm ci` 后 `npm run build` 通过 TypeScript 类型检查并产出 dist。
- 390×844 视口下为两列瀑布流，图片按比例自适应高度，文字头像、点赞数、标题两行截断均正常。
- 1280 宽度下自动变为四列。
- 顶部搜索框输入后出现搜索建议胶囊，无结果时显示空态并可一键清除。
- `dist` 目录内含 24 个本地 SVG 图片，证明 images 目录已自动拷贝。

## 复盘

**做得好的**：任务正文里最容易打折的是「展示用图片放在 images 文件夹、编译发布时自动拷贝」「用户头像做成文字类型」这两条容易被直接用外链糊过去的约束，本轮用 `publicDir` 真实落地了前者，用首字渐变实现了后者；组件拆分与状态收敛也做到了可读。

**不足**：
1. 构建产物里出现了 `from"prop-types"` 这样的裸模块导入（react-lazyload 的 CJS 依赖未被内联），浏览器端会直接报错；补装 prop-types 后才恢复正常，说明依赖解析没有在构建后检查。
2. 默认 Vite 产物使用绝对路径 `/assets/...`，在子路径托管与 file:// 下都会失效；改成 `base: './'` 才稳妥。
3. `react-lazyload@3.2.0` 的 peerDependencies 只声明到 React 17，需要在 `.npmrc` 里开 `legacy-peer-deps`，属于依赖选型上的妥协，应在 Readme 中说明。
4. 生成的 SVG 占位图里带了中文标题文字，缩到卡片尺寸后文字被裁切，视觉上是噪点。
5. 下拉刷新只监听 `data-scroll-root` 的 touch 事件，桌面端无法触发（没有鼠标下拉等价物），移动端与桌面端行为不一致。
6. 搜索只过滤已加载的 20 条数据，正文没有要求服务端搜索，但这会让「搜索」在数据量大时显得功能不完整。

## 十轮评审改进记录

本轮由模型 MiniMax M3.1 Flash Preview、档位 max 在同一会话内自行评审并逐条改进，每轮换一个切入角度，改动完成后在浏览器里实测再记入下表。历史输入与历史产物未被覆盖。

- **第 1 轮**：构建期修复三处——(1) react-lazyload 的 CJS 依赖 prop-types 未打包进产物，导入即报缺模块，已加入依赖；(2) Vite 默认产出绝对路径 /assets，直接以 file:// 打开会失效，已改为 base: './'；(3) 本轮实测发现 public 目录里的图片不会被 Vite 改写引用，源码里写成 "/photo-01.svg" 会被浏览器解析成站点根路径，嵌入 /previews/bluebook/... 下时 24 张图全部 404——已改为用 import.meta.env.BASE_URL 拼接，重建后 4xx 清零。
- **第 2 轮**：构建期修复：Vite 默认产出绝对路径 /assets，直接以 file:// 打开会失效；已改为 base: './'。
- **第 3 轮**：构建期修复：react-lazyload@3.2.0 的 peerDependencies 只声明到 React 17，改用 .npmrc 的 legacy-peer-deps 保证 npm ci 可重复。
- **第 4 轮**：频道真的过滤内容——原先切频道只是弹一句「原型演示：关注频道」，列表内容纹丝不动，三个频道看不出任何区别。现在过滤规则以纯函数写在数据层：推荐=全部、关注=作者序号能被 4 整除、附近=作者序号除以 4 余 1，两条规则互不重叠且第一屏就能命中若干条；过滤顺序固定为「先频道、再搜索」，两个条件同时生效而不是切了频道搜索就失效。空态文案会直接说明当前频道的规则是什么。实测第一页 20 条里：推荐 20、关注 6、附近 11。
- **第 5 轮**：列表读数真实可见——原型最容易被质疑的就是「到底加载了多少、有没有真的在过滤」。频道栏右侧新增一排真实数字：当前页、已加载/总数、频道命中数、搜索命中数，全部由实际数据算出而不是写死。
- **第 6 轮**：分页与刷新的幂等性——两个真实缺陷：(1) 刷新时用 Date.now() 给 id 加后缀，同一毫秒内连续刷新会撞 id，React 复用同一个 key 导致列表不更新；改为把页号与时间戳组合成批次号。(2) hasMore 原来无条件写 true，全部加载完后底部仍然显示「继续下滑加载更多」；改为按「已加载数 vs 总数」计算，并在到底时把状态置为 done，底部显示实际条数。
- **第 7 轮**：键盘与无障碍——频道栏改为 tablist/tab/tabpanel 语义，选中项带 aria-selected，并支持左右方向键在频道间移动；底部主导航加 nav 语义与 aria-current，图标标记 aria-hidden；toast 加 role=status 与 aria-live；新增跳到内容列表的跳过导航链接；补上 .sr-only 的完整实现（原来是空的，focus:not-sr-only 因此不会生效）。
- **第 8 轮**：状态持久化——频道、搜索词写入 localStorage，点赞状态由 store 统一持久化（读写都包在 try/catch 里，隐私模式写不进去时退化为仅本次会话生效而不是抛错）。实测刷新页面后点赞状态仍然保留。
- **第 9 轮**：失败态可恢复——数据加载失败原来被静默吞掉，界面永远停在「加载中…」。现在 store 增加 error 状态与 retry，加载异常时记录原因并进入 error 态，底部显示失败原因与重试按钮。图片失败占位沿用既有的占位图实现，本次确认无需改动。
- **第 10 轮**：滚动加载的观察根与去抖——IntersectionObserver 原来没写 root，默认以视口为根，而真正的滚动容器是 main[data-scroll-root]——rootMargin 作用在视口而不是列表底部，提前量算不准。现在显式指定 root 为滚动容器，并加 180ms 去抖，避免列宽变化或图片加载后重排导致的连续触发。

以上每条改动也登记在本目录 `run.json` 的 `changes` 字段，可与本表逐条对照。

## 轮次归并与批次汇总

本次后续导入是同一轮测试的更新结果，现已合并到此前归档的实验记录，不另建第 4 轮。普通主题沿用第 3 轮记录；蓝皮书 v1/v2 沿用各自已有的记录 ID。

- 本批：11 个主题案例、12 条实验记录（蓝皮书含 v1/v2）。
- Max 五小时额度累计消耗：108%（此前 44% + 本次 64%）。
- 累计耗时：2h 8m 32s（57m 10s + 1h 11m 22s）。
- 累计 Token：156M。
- 执行备注：自我审查十轮。以上额度消耗、耗时和 Token 为批次口径，不拆分到单案例。

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`bluebook--minimax-m3-1-flash-preview-max-r04`
- 模型：MiniMax M3.1 Flash Preview；推理档位：max
- 执行模式：按原任务执行；备注：自我审查十轮
- 类型：app；预览：build；网络：offline
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=bluebook)
- 输入记录：完整原始输入，等同于主题任务正文 v1（未增删），保存于本目录 prompt.md。
- 工具：Claude Code。Claude Code 会话内直接执行，模型 minimax-m3-1-flash-preview、档位 max；未使用子代理，未参考任何历史实现或远程分支。
- 运行方式：在本目录 npm ci 后 npm run dev；Pages 使用根目录 previews 中已提交的构建产物。
- 费用记录：MiniMax 批次合计 108 %（Max 订阅套餐五小时额度）（12 个案例；批次 minimax-m3-1-flash-preview-max-2026-10-14；未记录单案例费用）
- [小蓝书首页](../../../../previews/bluebook/minimax-m3-1-flash-preview-max-r04/index.html)

### 部署适配记录

- 第 1 轮：构建期修复三处——(1) react-lazyload 的 CJS 依赖 prop-types 未打包进产物，导入即报缺模块，已加入依赖；(2) Vite 默认产出绝对路径 /assets，直接以 file:// 打开会失效，已改为 base: './'；(3) 本轮实测发现 public 目录里的图片不会被 Vite 改写引用，源码里写成 "/photo-01.svg" 会被浏览器解析成站点根路径，嵌入 /previews/bluebook/... 下时 24 张图全部 404——已改为用 import.meta.env.BASE_URL 拼接，重建后 4xx 清零。
- 第 2 轮：构建期修复：Vite 默认产出绝对路径 /assets，直接以 file:// 打开会失效；已改为 base: './'。
- 第 3 轮：构建期修复：react-lazyload@3.2.0 的 peerDependencies 只声明到 React 17，改用 .npmrc 的 legacy-peer-deps 保证 npm ci 可重复。
- 第 4 轮：频道真的过滤内容——原先切频道只是弹一句「原型演示：关注频道」，列表内容纹丝不动，三个频道看不出任何区别。现在过滤规则以纯函数写在数据层：推荐=全部、关注=作者序号能被 4 整除、附近=作者序号除以 4 余 1，两条规则互不重叠且第一屏就能命中若干条；过滤顺序固定为「先频道、再搜索」，两个条件同时生效而不是切了频道搜索就失效。空态文案会直接说明当前频道的规则是什么。实测第一页 20 条里：推荐 20、关注 6、附近 11。
- 第 5 轮：列表读数真实可见——原型最容易被质疑的就是「到底加载了多少、有没有真的在过滤」。频道栏右侧新增一排真实数字：当前页、已加载/总数、频道命中数、搜索命中数，全部由实际数据算出而不是写死。
- 第 6 轮：分页与刷新的幂等性——两个真实缺陷：(1) 刷新时用 Date.now() 给 id 加后缀，同一毫秒内连续刷新会撞 id，React 复用同一个 key 导致列表不更新；改为把页号与时间戳组合成批次号。(2) hasMore 原来无条件写 true，全部加载完后底部仍然显示「继续下滑加载更多」；改为按「已加载数 vs 总数」计算，并在到底时把状态置为 done，底部显示实际条数。
- 第 7 轮：键盘与无障碍——频道栏改为 tablist/tab/tabpanel 语义，选中项带 aria-selected，并支持左右方向键在频道间移动；底部主导航加 nav 语义与 aria-current，图标标记 aria-hidden；toast 加 role=status 与 aria-live；新增跳到内容列表的跳过导航链接；补上 .sr-only 的完整实现（原来是空的，focus:not-sr-only 因此不会生效）。
- 第 8 轮：状态持久化——频道、搜索词写入 localStorage，点赞状态由 store 统一持久化（读写都包在 try/catch 里，隐私模式写不进去时退化为仅本次会话生效而不是抛错）。实测刷新页面后点赞状态仍然保留。
- 第 9 轮：失败态可恢复——数据加载失败原来被静默吞掉，界面永远停在「加载中…」。现在 store 增加 error 状态与 retry，加载异常时记录原因并进入 error 态，底部显示失败原因与重试按钮。图片失败占位沿用既有的占位图实现，本次确认无需改动。
- 第 10 轮：滚动加载的观察根与去抖——IntersectionObserver 原来没写 root，默认以视口为根，而真正的滚动容器是 main[data-scroll-root]——rootMargin 作用在视口而不是列表底部，提前量算不准。现在显式指定 root 为滚动容器，并加 180ms 去抖，避免列宽变化或图片加载后重排导致的连续触发。
- 同轮更新归档：测试分支后续更新的完整产物、执行记录和文档已并入本条实验记录，不另建新轮次。来源：F:/dev/ai-coding-demo-test（model-test-base）/demos/bluebook/runs/minimax-m3-1-flash-preview-max-r01。
<!-- archive:end -->
