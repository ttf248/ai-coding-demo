# AI 大模型编码实验室

保存任务提示词、模型实验和可运行产物，观察 AI 编码能力的变化。

[浏览实验](https://ttf248.life/ai-coding-demo/) · [GitHub Pages](https://ttf248.github.io/ai-coding-demo/)

## 维护方式

根目录就是发布站点。继续使用现有 GitHub Pages 分支发布：提交到 GitHub 即自动更新，不需要 deploy 命令或 Actions 发布流程。独立服务继续人工部署到 Vercel。

详见 [维护指南](docs/maintenance.md) 和 [仓库规则](AGENTS.md)。

## 🗓️ 开发记录

- **2025-02**：从股票自选系统开始，进行前后端拆分、接口、数据生成和响应式界面的多轮 AI 迭代。
- **2025-05**：整理为 AI Demo 集合，增加 iOS 原型、YouTube 模块和第一批前端技术文档，并发布 GitHub Pages。
- **2025-11**：扩充 React、TypeScript 等技术主题，同时持续迭代小蓝书的瀑布流、搜索、详情和加载体验。
- **2025-12**：加入图片粒子化与手势交互测试，并记录小蓝书的 MiniMax M2 / M2.1 版本。
- **2026-09**：新增 GPT 6 Default 与 GPT 5.6 Luna Max 的新哥特式塔楼城市单 HTML 对比实验，并将首页目录改为数据驱动。
- **2026-09-14**：增加 GPT 6 High 的独立实现「NOCTIS · 雾隐之城」，将 3D 引擎、程序化城市、海浪与音景内嵌为可离线打开的单 HTML，支持自由飞行和三组巡游视角。[提示词](demos/neo-gothic-tower-city/runs/gpt-6-high-r01/Readme.md) · [预览](demos/neo-gothic-tower-city/runs/gpt-6-high-r01/index.html)
- **2026-09-15**：增加 GPT 5.6 Luna Max 的「筑境工地」体素微缩建筑工地沙盘，加入 InstancedMesh 批渲染、设备循环作业、日夜/尘土/暴雨控制与场景边界碰撞约束。[提示词](demos/voxel-construction-site/runs/gpt-5-6-luna-max-r01/Readme.md) · [预览](demos/voxel-construction-site/runs/gpt-5-6-luna-max-r01/index.html)
- **2026-09-15**：归档 GPT 5.6 Sol High 的同提示词版本，将 `voxel_construction_site_threejs_r160.html` 规范化为独立 `index.html`，并记录其高层施工区 / 地下综合管廊双场景切换。[提示词](demos/voxel-construction-site/runs/gpt-5-6-sol-high-r01/Readme.md) · [预览](demos/voxel-construction-site/runs/gpt-5-6-sol-high-r01/index.html)
- **2026-09-15**：新增 GPT 6 Astra Low 的独立体素沙盘「筑间 / FIELDWORK」，提供高层筑造、桥梁工坊两套场景，包含实体旋钮、施工调度、昼夜与暴雨系统。[提示词](demos/voxel-construction-site/runs/gpt-6-astra-low-r01/Readme.md) · [预览](demos/voxel-construction-site/runs/gpt-6-astra-low-r01/index.html)
- **2026-09-16**：新增 GPT 6 Astra Xhigh 的独立体素沙盘「筑物 / LITTLE SITE STUDIO」，提供高层筑造、地铁车站两套场景，加入实例化机械与工人、车辆排队装卸、桌面实体旋钮、昼夜及暴雨交互。[提示词](demos/voxel-construction-site/runs/gpt-6-astra-xhigh-r01/Readme.md) · [预览](demos/voxel-construction-site/runs/gpt-6-astra-xhigh-r01/index.html)
- **2026-09-16 · 档案 V2**：将 15 条实验归入 8 个主题，新增双栏预览、提示词差异与分享链接；加入元数据生成和校验，保留现有 GitHub Pages 提交即发布方式。构建型前端预览与源码一同归档。[维护指南](docs/maintenance.md) · [双栏对比](compare.html)
- **2026-09-16**：用 GPT 5.6 Luna Max 补做此前未覆盖的六个主题：小蓝书、情绪日记、冥想、Pixel Flow、自选股和 YouTube UI；同步保留本地预览、全栈源码、原始输入与对比目录。
- **持续更新**：随着模型和开发工具变化，继续补充新的提示词测试。


<!-- catalog:start -->
## 项目统计

- 实验主题：8
- 实验记录：21
- 可预览记录：18
- 技术主题：14

## 实验目录

### 小蓝书 · 瀑布流社区

[主题与版本对比](topic.html?id=bluebook) · [主题说明](demos/bluebook/Readme.md)

| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |
|---|---|---|---|---|
| [小蓝书](demos/bluebook/runs/claude-4-0-unknown-r01/Readme.md) | Claude 4.0 / unknown | 2025-05 | [v2](demos/bluebook/runs/claude-4-0-unknown-r01/prompt.md) | [打开](previews/bluebook/claude-4-0-unknown-r01/index.html) |
| [小蓝书 · GPT 5.6 Luna Max](demos/bluebook/runs/gpt-5-6-luna-max-r01/Readme.md) | GPT 5.6 Luna / max | 2026-09-16 | [v1](demos/bluebook/runs/gpt-5-6-luna-max-r01/prompt.md) | [打开](previews/bluebook/gpt-5-6-luna-max-r01/index.html) |
| [小蓝书 · MiniMax M2.1](demos/bluebook/runs/minimax-m2-1-unknown-r01/Readme.md) | MiniMax M2.1 / unknown | 2025-12 | [v1](demos/bluebook/runs/minimax-m2-1-unknown-r01/prompt.md) | [打开](previews/bluebook/minimax-m2-1-unknown-r01/index.html) |
| [小蓝书 · MiniMaxi M2](demos/bluebook/runs/minimax-m2-unknown-r01/Readme.md) | MiniMaxi M2 / unknown | 2025-11 | [v1](demos/bluebook/runs/minimax-m2-unknown-r01/prompt.md) | [打开](previews/bluebook/minimax-m2-unknown-r01/index.html) |

### 生活情绪日记

[主题与版本对比](topic.html?id=life-diary) · [主题说明](demos/life-diary/Readme.md)

| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |
|---|---|---|---|---|
| [情绪日记 · GPT 5.6 Luna Max](demos/life-diary/runs/gpt-5-6-luna-max-r01/Readme.md) | GPT 5.6 Luna / max | 2026-09-16 | [v1](demos/life-diary/runs/gpt-5-6-luna-max-r01/prompt.md) | [打开](demos/life-diary/runs/gpt-5-6-luna-max-r01/index.html) |
| [生活情绪日记](demos/life-diary/runs/unknown-unknown-r01/Readme.md) | 未记录 / 多轮混合 / unknown | 2025-05 | [v1](demos/life-diary/runs/unknown-unknown-r01/prompt.md) | [打开](demos/life-diary/runs/unknown-unknown-r01/index.html) |

### 冥想 iOS App

[主题与版本对比](topic.html?id=meditation) · [主题说明](demos/meditation/Readme.md)

| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |
|---|---|---|---|---|
| [静心 · GPT 5.6 Luna Max](demos/meditation/runs/gpt-5-6-luna-max-r01/Readme.md) | GPT 5.6 Luna / max | 2026-09-16 | [v1](demos/meditation/runs/gpt-5-6-luna-max-r01/prompt.md) | [打开](demos/meditation/runs/gpt-5-6-luna-max-r01/index.html) |
| [冥想 iOS App](demos/meditation/runs/unknown-unknown-r01/Readme.md) | 未记录 / 多轮混合 / unknown | 2025-05 | [v1](demos/meditation/runs/unknown-unknown-r01/prompt.md) | [打开](demos/meditation/runs/unknown-unknown-r01/index.html) |

### 新哥特式塔楼城市

[主题与版本对比](topic.html?id=neo-gothic-tower-city) · [主题说明](demos/neo-gothic-tower-city/Readme.md)

| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |
|---|---|---|---|---|
| [塔城漫游 · GPT 5.6 Luna Max](demos/neo-gothic-tower-city/runs/gpt-5-6-luna-max-r01/Readme.md) | GPT 5.6 Luna / max | 2026-09 | [v1](demos/neo-gothic-tower-city/runs/gpt-5-6-luna-max-r01/prompt.md) | [打开](demos/neo-gothic-tower-city/runs/gpt-5-6-luna-max-r01/index.html) |
| [雾隐之城 · GPT 6 Default](demos/neo-gothic-tower-city/runs/gpt-6-default-r01/Readme.md) | GPT 6 / default | 2026-09 | [v1](demos/neo-gothic-tower-city/runs/gpt-6-default-r01/prompt.md) | [打开](demos/neo-gothic-tower-city/runs/gpt-6-default-r01/index.html) |
| [雾隐之城 · GPT 6 High](demos/neo-gothic-tower-city/runs/gpt-6-high-r01/Readme.md) | GPT 6 / high | 2026-09-14 | [v1](demos/neo-gothic-tower-city/runs/gpt-6-high-r01/prompt.md) | [打开](demos/neo-gothic-tower-city/runs/gpt-6-high-r01/index.html) |

### Pixel Flow

[主题与版本对比](topic.html?id=pixel-flow) · [主题说明](demos/pixel-flow/Readme.md)

| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |
|---|---|---|---|---|
| [Pixel Flow · GPT 5.6 Luna Max](demos/pixel-flow/runs/gpt-5-6-luna-max-r01/Readme.md) | GPT 5.6 Luna / max | 2026-09-16 | [v1](demos/pixel-flow/runs/gpt-5-6-luna-max-r01/prompt.md) | [打开](demos/pixel-flow/runs/gpt-5-6-luna-max-r01/index.html) |
| [Pixel Flow](demos/pixel-flow/runs/unknown-unknown-r01/Readme.md) | 未记录 / 多轮混合 / unknown | 2025-12 | [v1](demos/pixel-flow/runs/unknown-unknown-r01/prompt.md) | 无静态预览 |

### 自选股实战

[主题与版本对比](topic.html?id=stock-watching) · [主题说明](demos/stock-watching/Readme.md)

| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |
|---|---|---|---|---|
| [自选股实战 · GPT 5.6 Luna Max](demos/stock-watching/runs/gpt-5-6-luna-max-r01/Readme.md) | GPT 5.6 Luna / max | 2026-09-16 | [v1](demos/stock-watching/runs/gpt-5-6-luna-max-r01/prompt.md) | 无静态预览 |
| [自选股实战](demos/stock-watching/runs/unknown-unknown-r01/Readme.md) | 未记录 / 多轮混合 / unknown | 2025-02 | [v1](demos/stock-watching/runs/unknown-unknown-r01/prompt.md) | 无静态预览 |

### 体素微缩建筑工地

[主题与版本对比](topic.html?id=voxel-construction-site) · [主题说明](demos/voxel-construction-site/Readme.md)

| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |
|---|---|---|---|---|
| [筑境工地 · GPT 5.6 Luna Max](demos/voxel-construction-site/runs/gpt-5-6-luna-max-r01/Readme.md) | GPT 5.6 Luna / max | 2026-09-15 | [v1](demos/voxel-construction-site/runs/gpt-5-6-luna-max-r01/prompt.md) | [打开](demos/voxel-construction-site/runs/gpt-5-6-luna-max-r01/index.html) |
| [筑境工地 · GPT 5.6 Sol High](demos/voxel-construction-site/runs/gpt-5-6-sol-high-r01/Readme.md) | GPT 5.6 Sol / high | 2026-09-15 | [v1](demos/voxel-construction-site/runs/gpt-5-6-sol-high-r01/prompt.md) | [打开](demos/voxel-construction-site/runs/gpt-5-6-sol-high-r01/index.html) |
| [筑间工地 · GPT 6 Astra Low](demos/voxel-construction-site/runs/gpt-6-astra-low-r01/Readme.md) | GPT 6 Astra / low | 2026-09-15 | [v1](demos/voxel-construction-site/runs/gpt-6-astra-low-r01/prompt.md) | [打开](demos/voxel-construction-site/runs/gpt-6-astra-low-r01/index.html) |
| [筑物工地 · GPT 6 Astra Xhigh](demos/voxel-construction-site/runs/gpt-6-astra-xhigh-r01/Readme.md) | GPT 6 Astra / xhigh | 2026-09-16 | [v1](demos/voxel-construction-site/runs/gpt-6-astra-xhigh-r01/prompt.md) | [打开](demos/voxel-construction-site/runs/gpt-6-astra-xhigh-r01/index.html) |

### YouTube UI 模块

[主题与版本对比](topic.html?id=youtube-ui) · [主题说明](demos/youtube-ui/Readme.md)

| 实验 | 模型 / 档位 | 日期 | 提示词 | 预览 |
|---|---|---|---|---|
| [VideoTube UI · GPT 5.6 Luna Max](demos/youtube-ui/runs/gpt-5-6-luna-max-r01/Readme.md) | GPT 5.6 Luna / max | 2026-09-16 | [v1](demos/youtube-ui/runs/gpt-5-6-luna-max-r01/prompt.md) | [打开](demos/youtube-ui/runs/gpt-5-6-luna-max-r01/index.html) |
| [YouTube UI 模块](demos/youtube-ui/runs/unknown-unknown-r01/Readme.md) | 未记录 / 多轮混合 / unknown | 2025-05 | [v1](demos/youtube-ui/runs/unknown-unknown-r01/prompt.md) | [打开](demos/youtube-ui/runs/unknown-unknown-r01/youtube-app-creator.html) |

## 技术文档

- [Tailwind CSS](docs/tailwindcss/Readme.md) · [运行示例](docs/tailwindcss/what-is-tailwindcss-demo.html)
- [Lucide](docs/lucide/Readme.md) · [运行示例](docs/lucide/what-is-lucide-demo.html)
- [Unsplash](docs/unsplash/Readme.md) · [运行示例](docs/unsplash/what-is-unsplash-demo.html)
- [骨架屏](docs/skeleton/Readme.md) · [运行示例](docs/skeleton/what-is-skeleton-demo.html)
- [Vue.js](docs/vue/Readme.md) · [运行示例](docs/vue/what-is-vue-demo.html)
- [React](docs/react/Readme.md) · [运行示例](docs/react/what-is-react-demo.html)
- [TypeScript](docs/typescript/Readme.md) · [运行示例](docs/typescript/what-is-typescript-demo.html)
- [Vite](docs/vite/Readme.md) · [运行示例](docs/vite/what-is-vite-demo.html)
- [JavaScript](docs/javascript/Readme.md) · [运行示例](docs/javascript/what-is-javascript-demo.html)
- [状态管理](docs/state-management/Readme.md) · [运行示例](docs/state-management/what-is-state-management-demo.html)
- [API / REST](docs/api-rest/Readme.md) · [运行示例](docs/api-rest/what-is-api-rest-demo.html)
- [前端构建](docs/frontend-build/Readme.md) · [运行示例](docs/frontend-build/what-is-frontend-build-demo.html)
- [NPM](docs/npm/Readme.md) · [运行示例](docs/npm/what-is-npm-demo.html)
- [组件化开发](docs/component-based/Readme.md) · [运行示例](docs/component-based/what-is-component-based-demo.html)
<!-- catalog:end -->
