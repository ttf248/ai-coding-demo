# 项目说明与维护规则

本仓库记录 AI 提示词、模型实验及产物，观察编码能力变化。主题、任务正文、实验记录分别归档，未知历史信息不得猜测。详细命令与数据示例见 [维护指南](docs/maintenance.md)。

## 发布约束

- 保持现有 GitHub Pages 分支自动发布、域名与 CNB → GitHub 同步；提交到 GitHub 即自动更新。
- 未经用户明确要求，不得改为 Actions 部署、修改 Pages 发布源或引入独立 deploy 步骤。
- 仓库根目录必须是可直接静态托管的完整站点。首页、主题页、对比页、assets/generated 与 previews 都必须提交。
- 需要独立服务的项目继续由维护者人工部署到 Vercel。除非明确授权，不修改外部部署设置；目录迁移后的 Root Directory 调整写入文档。

## 目录与数据

1. 新增前查询已有主题、提示词及模型，避免重复登记。
2. 统一放入 `demos/{topic}/runs/{model-slug}-{effort}-rNN/`，小写 kebab-case。实验 ID 为 `{topic}--{run}`，不会因显示标题变化而改变。
3. 每条实验必须包含 run.json、prompt.md 和 Readme.md。保留完整输入、模型、档位、日期、类型、运行方式及复盘。缺失信息用 unknown/null，不补造。
4. 共用任务正文放在主题 prompts 下，按版本归档。相同正文可关联不同原始输入；完整输入指纹只统一 BOM 与换行，不删改内容。
5. 历史输入及产物不得覆盖；模型重跑、任务变更和追加迭代新增记录，记录来源和人工修改。新增提示词版本不覆盖旧版。
6. 单文件入口统一 index.html，保留浏览器直接打开能力；多页面显式登记入口。不能将依赖 CDN 的文件标为离线。
7. 按 catalog/schema.json 维护元数据。共享模型、分类和技术主题分别维护 catalog 字典，不将目录结构或标题解析作为数据来源。

## 不同产物的要求

- 静态 HTML：直接登记本目录入口，检查 file:// 和 HTTP。
- 构建型纯前端：独立 lockfile，通过 build:demo 生成 previews，源码与预览产物同步提交。不能将包含 TSX 源码的 HTML 当成 Pages 预览。
- 全栈或独立部署：保留源码及运行说明；只有已知可用外部地址才登记 external，不制造静态预览。
- 仅提示词：标记无预览，保留输入及来源。
- 不为归档统一升级历史项目依赖或重写 demo。必要部署修复必须在 changes 中登记。

## 首页与文档

- 首页卡片、筛选、统计、主题版本和对比候选均从生成数据读取，禁止手写卡片或人工维护项目计数。
- assets/generated/catalog.js、主题 Readme、根 README 的 catalog 区块和实验 README 的 archive 区块由 generate 维护，禁止手改。
- 根 README 的开发时间线和实验复盘为人工内容，生成器不得覆盖。
- 新技术主题在 docs/{slug}/ 保留 Readme.md 与可运行示例，同时登记 catalog/guides.json。
- CLAUDE.md 只引用本文件，不复制第二套规则。

## 提交前检查

1. 若修改构建型实验源码或构建配置，先 `npm run build:demo -- <id>`；文档修改不要求重建。
2. 执行 `npm run generate`、`npm run validate`、`npm test`、`node --check index.js` 和 `git diff --check`。
3. 首页或对比交互变更执行 `npm run test:browser`，覆盖目录计数、筛选、搜索、排序、视图和加载更多；同输入、异输入、无预览、分享恢复、移动端与子路径。
4. 用本地静态服务器检查新增入口、原始输入和首页生成的链接；390px 移动端无页面水平溢出。单 HTML 额外验证直接打开。
5. 目录迁移核对完整性、旧目录消失及有效链接更新。迁移清单和原始历史输入中的旧路径作为证据保留，不做机械替换。
6. 确保 previews 和 assets/generated 不被忽略；无 node_modules、缓存或中间 dist 误提交。干净检出无需构建即可预览站点。

## 对比边界

区分原始输入一致、任务正文一致、同主题不同输入、跨主题及信息不足。注明工具、档位、人工修改和上下文缺失。默认独立操作，不暗示同步相机或公平性能评测。外部不可嵌入时保留独立打开；双开 3D 提供单侧卸载，手机只加载当前侧。
