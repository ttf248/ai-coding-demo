# AI 大模型编码实验室

这是一个记录 AI 时代前端提示词测试的实验档案：把想法交给模型生成，再把原始提示词、可以打开的页面和迭代过程留下来，用来观察模型能力如何变化。

[打开新版项目首页](https://ttf248.life/ai-coding-demo/) · [在线全局预览](https://ttf248.github.io/ai-coding-demo)

---

## 📋 目录

- [测试方式](#-测试方式)
- [首页维护](#-首页维护)
- [开发记录](#-开发记录)
- [技术文档列表](#-技术文档列表)
- [项目记录](#-项目记录)

---

## 🧭 测试方式

项目会随着模型和开发工具的变化持续增加，单个目录通常包含以下内容：

- **原始提示词**：记录当时给模型的目标、约束和上下文。
- **实现结果**：静态 HTML 可以直接用浏览器打开，Vue/React 项目保留完整源码和构建配置。
- **复盘材料**：记录页面效果、交互细节以及模型没有处理好的部分。

## 🧩 首页维护

项目首页由三个文件组成：

- `index.html`：页面结构和固定文案。
- `index.css`：视觉样式、卡片网格/列表视图和响应式布局。
- `index.js`：项目目录数据、技术主题数据以及搜索、筛选、排序和加载更多逻辑。

以后新增实验时，优先在 `index.js` 的 `projectRecords` 中增加一条项目数据，并填写项目目录、模型、技术栈和链接；首页卡片、项目总数和筛选结果会自动生成，不需要复制 HTML。技术主题则维护 `guideRecords`，对应的示例页面放在 `docs/` 下。

## 🗓️ 开发记录

- **2025-02**：从股票自选系统开始，进行前后端拆分、接口、数据生成和响应式界面的多轮 AI 迭代。
- **2025-05**：整理为 AI Demo 集合，增加 iOS 原型、YouTube 模块和第一批前端技术文档，并发布 GitHub Pages。
- **2025-11**：扩充 React、TypeScript 等技术主题，同时持续迭代小蓝书的瀑布流、搜索、详情和加载体验。
- **2025-12**：加入图片粒子化与手势交互测试，并记录小蓝书的 MiniMax M2 / M2.1 版本。
- **2026-09**：新增 GPT 6 Default 与 GPT 5.6 Luna Max 的新哥特式塔楼城市单 HTML 对比实验，并将首页目录改为数据驱动。
- **2026-09-14**：增加 GPT 6 High 的独立实现「NOCTIS · 雾隐之城」，将 3D 引擎、程序化城市、海浪与音景内嵌为可离线打开的单 HTML，支持自由飞行和三组巡游视角。[提示词](neo-gothic-tower-city-gpt-6-high/Readme.md) · [预览](neo-gothic-tower-city-gpt-6-high/index.html)
- **2026-09-15**：增加 GPT 5.6 Luna Max 的「筑境工地」体素微缩建筑工地沙盘，加入 InstancedMesh 批渲染、设备循环作业、日夜/尘土/暴雨控制与场景边界碰撞约束。[提示词](voxel-construction-site-gpt-5.6-luna-max/Readme.md) · [预览](voxel-construction-site-gpt-5.6-luna-max/index.html)
- **2026-09-15**：归档 GPT 5.6 Sol High 的同提示词版本，将 `voxel_construction_site_threejs_r160.html` 规范化为独立 `index.html`，并记录其高层施工区 / 地下综合管廊双场景切换。[提示词](voxel-construction-site-gpt-5.6-sol-high/Readme.md) · [预览](voxel-construction-site-gpt-5.6-sol-high/index.html)
- **2026-09-15**：新增 GPT 6 Astra Low 的独立体素沙盘「筑间 / FIELDWORK」，提供高层筑造、桥梁工坊两套场景，包含实体旋钮、施工调度、昼夜与暴雨系统。[提示词](voxel-construction-site-gpt-6-astra-low/Readme.md) · [预览](voxel-construction-site-gpt-6-astra-low/index.html)
- **2026-09-16**：新增 GPT 6 Astra Xhigh 的独立体素沙盘「筑物 / LITTLE SITE STUDIO」，提供高层筑造、地铁车站两套场景，加入实例化机械与工人、车辆排队装卸、桌面实体旋钮、昼夜及暴雨交互。[提示词](voxel-construction-site-gpt-6-astra-xhigh/Readme.md) · [预览](voxel-construction-site-gpt-6-astra-xhigh/index.html)
- **持续更新**：随着模型和开发工具变化，继续补充新的提示词测试。

## 📚 技术文档列表

> 涵盖了前端开发中的核心技术栈和最佳实践

| 技术 | 类型 | 文档 | 在线预览 |
|------|------|------|----------|
| **Tailwind CSS** | CSS 框架 | [什么是 Tailwind CSS？](docs/tailwindcss/) | [快速查看示例](docs/tailwindcss/what-is-tailwindcss-demo.html) |
| **Lucide 图标库** | 图标库 | [什么是 Lucide？](docs/lucide/) | [快速查看示例](docs/lucide/what-is-lucide-demo.html) |
| **Unsplash** | 图片资源平台 | [什么是 Unsplash？](docs/unsplash/) | [快速查看示例](docs/unsplash/what-is-unsplash-demo.html) |
| **骨架屏** | 加载占位符技术 | [什么是骨架屏？](docs/skeleton/) | [快速查看示例](docs/skeleton/what-is-skeleton-demo.html) |
| **Vue.js** | 前端框架 | [什么是 Vue.js？](docs/vue/) | [快速查看示例](docs/vue/what-is-vue-demo.html) |
| **React** | 前端框架 | [什么是 React？](docs/react/) | [快速查看示例](docs/react/what-is-react-demo.html) |
| **TypeScript** | 编程语言 | [什么是 TypeScript？](docs/typescript/) | [快速查看示例](docs/typescript/what-is-typescript-demo.html) |
| **Vite** | 构建工具 | [什么是 Vite？](docs/vite/) | [快速查看示例](docs/vite/what-is-vite-demo.html) |
| **JavaScript** | 编程语言 | [什么是 JavaScript？](docs/javascript/) | [快速查看示例](docs/javascript/what-is-javascript-demo.html) |
| **状态管理** | 前端架构 | [什么是状态管理？](docs/state-management/) | [快速查看示例](docs/state-management/what-is-state-management-demo.html) |
| **API/REST** | 前后端通信 | [什么是 API/REST？](docs/api-rest/) | [快速查看示例](docs/api-rest/what-is-api-rest-demo.html) |
| **前端构建** | 开发流程 | [什么是前端构建？](docs/frontend-build/) | [快速查看示例](docs/frontend-build/what-is-frontend-build-demo.html) |
| **NPM** | 包管理器 | [什么是 NPM？](docs/npm/) | [快速查看示例](docs/npm/what-is-npm-demo.html) |
| **组件化开发** | 开发思想 | [什么是组件化开发？](docs/component-based/) | [快速查看示例](docs/component-based/what-is-component-based-demo.html) |

---

## 📸 项目记录

> 实战项目集合，涵盖全栈开发、UI/UX 设计等多个领域

### 🧪 交互与工程实验

#### Pixel Flow：图片粒子化与手势还原

- **类型**: 前端交互提示词记录
- **技术栈**: Vanilla JavaScript / Three.js / MediaPipe
- **文档**: [项目详情](pixel-flow/)

#### 自选股实战

- **类型**: 前端 + 后端
- **技术栈**: React / Golang
- **文档**: [项目详情](stock-watching-system/)

---

### 🌌 沉浸式视觉实验

#### 筑物 / LITTLE SITE STUDIO (GPT 6 Astra Xhigh)

- **类型**: 单 HTML / 3D 前端视觉实验
- **技术栈**: HTML / Three.js r160 / WebGL / InstancedMesh / ShaderMaterial
- **内容**: 深色实木工作桌上的高层筑造与地铁车站双场景，包含开口基坑、钢筋棚、材料区、板房、48 名体素工人、8 台施工机械，以及代码生成的木纹、蓝图和桌面工具。
- **交互**: 拖拽环视、滚轮 / 双指缩放、闲置巡航；实体旋钮与屏幕按钮控制设备速度、昼夜和尘土；`Space` 切换暴雨，`N` 切换场景，`R` 重置镜头，`P` 暂停设备。
- **提示词**: [原始提示词](voxel-construction-site-gpt-6-astra-xhigh/Readme.md)
- **预览**: [打开 HTML 页面](voxel-construction-site-gpt-6-astra-xhigh/index.html)

#### 筑间 / FIELDWORK (GPT 6 Astra Low)

- **类型**: 单 HTML / 3D 前端视觉实验
- **技术栈**: HTML / Three.js r160 / WebGL / InstancedMesh / ShaderMaterial
- **内容**: 深色实木桌上的高层施工与桥梁施工双场景，48 名体素工人、双塔吊、双挖掘机、渣土车、搅拌罐车和装载机；所有模型、纹理与标识均由代码生成。
- **交互**: 拖拽环视、滚轮缩放、闲置巡航；实体旋钮与屏幕按钮控制速度、昼夜、尘土及暴雨；`Space` 切换暴雨，`N` 切换场景。
- **提示词**: [原始提示词](voxel-construction-site-gpt-6-astra-low/Readme.md)
- **预览**: [打开 HTML 页面](voxel-construction-site-gpt-6-astra-low/index.html)


#### 体素微缩建筑工地沙盘 (GPT 5.6 Luna Max)

- **类型**: 单 HTML / 3D 前端视觉实验
- **技术栈**: HTML / Three.js r160 / WebGL / InstancedMesh
- **内容**: 室内实木桌面上的完整施工工地，包含基坑、钢筋棚、塔楼基座、板房、渣土堆、塔吊、挖掘机、渣土车、工人、围挡和程序化昼夜天气。
- **交互**: 拖拽环视、滚轮缩放；点击桌面前沿实体控制台切换速度、日夜循环和尘土强度；按 `Space` 触发暴雨。
- **提示词**: [原始提示词](voxel-construction-site-gpt-5.6-luna-max/Readme.md)
- **预览**: [打开 HTML 页面](voxel-construction-site-gpt-5.6-luna-max/index.html)

#### 体素微缩建筑工地沙盘 (GPT 5.6 Sol High)

- **类型**: 单 HTML / 3D 前端视觉实验
- **技术栈**: HTML / Three.js r160 / WebGL / InstancedMesh
- **内容**: 同一施工沙盘提示词的 Sol High 版本，包含高层综合施工区与地下综合管廊 / 地铁竖井施工区两套可切换布局。
- **交互**: 拖拽环视、滚轮缩放；点击桌面前沿实体控制台切换速度、日夜循环、尘土与场景；按 `Space` 触发暴雨，按 `N` 切换新场景。
- **提示词**: [原始提示词](voxel-construction-site-gpt-5.6-sol-high/Readme.md)
- **预览**: [打开 HTML 页面](voxel-construction-site-gpt-5.6-sol-high/index.html)

#### 新哥特式塔楼城市 (GPT 6 High)

- **类型**: 单 HTML / 可离线运行的 3D 前端视觉实验
- **技术栈**: HTML / Three.js / WebGL
- **内容**: 米制比例的程序化城市、184 米主塔、尖拱桥、自由飞行、环境设置、海浪音景和截图导出
- **提示词**: [原始提示词](neo-gothic-tower-city-gpt-6-high/Readme.md)
- **预览**: [打开 HTML 页面](neo-gothic-tower-city-gpt-6-high/index.html)

#### 新哥特式塔楼城市 (GPT 6 Default)

- **类型**: 单 HTML / 3D 前端视觉实验
- **技术栈**: HTML / Three.js / WebGL
- **提示词**: [原始提示词](neo-gothic-tower-city-gpt-6-default/Readme.md)
- **预览**: [打开 HTML 页面](neo-gothic-tower-city-gpt-6-default/index.html)

#### 新哥特式塔楼城市 (GPT 5.6 Luna Max)

- **类型**: 单 HTML / 3D 前端视觉实验
- **技术栈**: HTML / Three.js / WebGL
- **提示词**: [原始提示词](neo-gothic-tower-city-gpt-5.6-luna-max/Readme.md)
- **预览**: [打开 HTML 页面](neo-gothic-tower-city-gpt-5.6-luna-max/index.html)

---

### 🎨 UI/UX 设计项目

#### 冥想 iOS App

- **类型**: UI/UX 设计
- **文档**: [项目详情](ui-ux-ios-meditation-app/)
- **预览**: [快速查看原型](ui-ux-ios-meditation-app/meditation-app-prototype.html)

#### 生活情绪日记

- **类型**: UI/UX 设计
- **文档**: [项目详情](ui-ux-ios-life-assistant-app/)
- **预览**: [快速查看原型](ui-ux-ios-life-assistant-app/canghe_app_prototype.html)

#### YouTube 视频分享应用

> 提示词更加通用，按照不同模块分别设计页面

- **类型**: UI/UX 设计
- **文档**: [项目详情](ui-ux-common/)
- **预览**:
  - [首页推荐模块](ui-ux-common/youtube-app-homepage.html)
  - [视频播放模块](ui-ux-common/youtube-app-player.html)
  - [个人中心模块](ui-ux-common/youtube-app-profile.html)
  - [发现页面模块](ui-ux-common/youtube-app-discover.html)
  - [创作中心模块](ui-ux-common/youtube-app-creator.html)

#### 小蓝书 - 仿小红书瀑布流图片展示页面

- **类型**: 前端开发
- **技术栈**: React / Vercel
- **文档**: [项目详情](ui-ux-redbook-waterfall-images/docs/)
- **预览**: [快速查看示例](https://bluebook.ttf248.life/)  [备用地址](https://bluebook-eight.vercel.app/)

#### 小蓝书 (MiniMaxi-M2 版本)

- **类型**: 前端开发 (基于 MiniMaxi-M2 模型生成)
- **文档**: [项目详情](ui-ux-redbook-waterfall-images-minimaxi-m2/)

#### 小蓝书 (MiniMax M2.1 版本)

- **类型**: 前端开发 (基于 MiniMax M2.1 模型生成)
- **文档**: [项目详情](ui-ux-redbook-waterfall-images-minimax-m2.1/)

---

### 📊 项目统计

- **实验项目与模型版本**: 15 个
- **技术主题**: 14 个
- **可直接打开的静态页面**: 25+ 个
