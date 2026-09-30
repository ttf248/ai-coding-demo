# 当前会话用户请求（原文）

所有的案例 demo 全部都做一遍，模型名称 gpt-6.1-sol 档位 medium, 用当前会话就好了，模型名称我已经告诉你

# 用户提供的仓库规则

# 项目说明与维护规则

本仓库记录 AI 提示词、模型实验及产物，观察编码能力变化。主题、任务正文、实验记录分别归档，未知历史信息不得猜测。详细命令与数据示例见 [维护指南](docs/maintenance.md)。

## 发布约束

- 保持现有 GitHub Pages 分支自动发布、域名与 CNB → GitHub 同步；提交到 GitHub 即自动更新。
- 未经用户明确要求，不得改为 Actions 部署、修改 Pages 发布源或引入独立 deploy 步骤。
- 仓库根目录必须是可直接静态托管的完整站点。首页、主题页、对比页、assets/generated 与 previews 都必须提交。
- 需要独立服务的项目继续由维护者人工部署到 Vercel。除非明确授权，不修改外部部署设置；目录迁移后的 Root Directory 调整必须同步记录在 [Vercel 对照表](docs/vercel-root-directories.md)，并保留 GitHub Pages 提交即发布逻辑。

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

## model-test-base 测试分支

- 本分支有意不包含历史实验，任务正文在 demos/{topic}/prompts 下；不要从远程、其他分支或其他工作目录获取旧实现。
- 每轮从此基线创建独立克隆，并使用新会话。基线不是操作系统权限沙箱，不得宣称文件访问被强制隔离。
- 测试前确认模型、档位和提示词版本，未知信息不推测。默认直接执行；只有用户明确要求时才委派子代理，并记录实际执行模型。
- 完整保存实际输入、生成产物、追加修复及人工修改，按现有 runs 结构新增记录。
- 不将 main 的历史合并到测试目录，不整体合并本分支回 main。结果导入见 docs/model-test-workflow.md。
- 本分支无实验时，站点目录为空是预期行为；测试用例不依赖任何历史模型结果。技术主题示例作为共用文档保留，非测试答案。


# 本案例任务正文（v1，原文）

## 完整的代码生成提示词：图片粒子化与手势还原 Web 应用

**请创建一个现代化的 Web 应用，该应用能够加载本地图片，将其分解为动态粒子流，并通过摄像头捕获的用户手势来交互式地还原原始图片。**

**技术栈要求：**

*   **前端框架：** 纯 JavaScript (Vanilla JS), HTML, CSS
*   **3D/图形库：** 现代 Three.js (用于粒子渲染和管理)
*   **计算机视觉/手势识别：** MediaPipe (用于实时手部追踪和关键点识别)
*   **图片处理：** HTML Canvas API (用于图片像素数据提取)

**核心功能与实现细节：**

1.  **图片上传与初始化：**
    *   提供一个文件输入元素 (`<input type="file">`)，允许用户上传一张本地图片。
    *   当图片上传后，使用 HTML Canvas 将其加载并提取像素数据。
    *   将每个像素或每组像素（可配置的采样率）转换为 Three.js 中的一个粒子（`THREE.Points` 或 `THREE.BufferGeometry` 中的顶点）。
    *   初始状态下，这些粒子应呈现为**随机分布或动态飘散的粒子流**，而不是原始图片。
    *   每个粒子应存储其原始位置和颜色信息，以便后续还原。

2.  **摄像头输入与手部追踪：**
    *   启动并显示实时摄像头视频流作为背景（或在屏幕的某个区域）。
    *   使用 MediaPipe Hands 模型进行**实时手部追踪**，识别用户的手部关键点（例如，手指尖、手掌中心）。
    *   确保手部追踪数据可以被 JavaScript 代码实时访问和处理。

3.  **粒子还原交互逻辑：**
    *   根据 MediaPipe 提供的手部关键点数据，**设计一套手势识别逻辑**。为了提高识别的成功率和交互的直观性，建议使用简单、明确的手势，例如“张开手掌”（激活粒子吸引）和“握拳”（暂停吸引）。
    *   当识别到特定的“还原”手势时，粒子流应该开始**向其原始图片位置移动**，并逐渐重构出原始图片。
    *   考虑实现一个**“力场”或“吸引区域”**的概念，该区域跟随用户的手部移动，当粒子进入该区域时，它们会被吸引并加速向其最终位置移动。
    *   可以设计不同的还原阶段或手势，例如：
        *   **激活手势：** 开始还原过程。
        *   **控制手势：** 调整还原的速度或区域。
        *   **完成手势：** 完全还原图片。
    *   动画效果应平滑且具有视觉吸引力。

4.  **UI/UX 考虑：**
    *   提供基本的 HTML 布局，包含视频显示区域和粒子渲染的 Canvas 区域。
    *   通过 CSS 实现响应式布局和现代化的视觉风格。
    *   可能需要一个简单的加载指示器或状态消息。

**技术细节提示：**

*   Three.js 粒子系统可以使用 `PointsMaterial` 或自定义 `ShaderMaterial` 来实现更丰富的视觉效果。
*   MediaPipe 的手部关键点数据通常以标准化坐标返回，需要将其转换为屏幕或 Three.js 场景坐标。
*   还原粒子的动画可以使用 `Tween.js` 或 Three.js 自身的动画循环来实现。

---

### English Version / 英文版本

## Complete Code Generation Prompt: Image Particlization and Gesture Restoration Web Application

**Please create a modern web application that can load a local image, break it down into a dynamic particle stream, and interactively restore the original image through user gestures captured by a camera.**

**Technology Stack Requirements:**

*   **Frontend Framework:** Vanilla JS, HTML, CSS
*   **3D/Graphics Library:** Modern Three.js (for particle rendering and management)
*   **Computer Vision/Gesture Recognition:** MediaPipe (for real-time hand tracking and keypoint recognition)
*   **Image Processing:** HTML Canvas API (for extracting image pixel data)

**Core Functionality and Implementation Details:**

1.  **Image Upload and Initialization:**
    *   Provide a file input element (`<input type="file">`) to allow users to upload a local image.
    *   Once the image is uploaded, use HTML Canvas to load it and extract its pixel data.
    *   Convert each pixel or group of pixels (at a configurable sampling rate) into a particle in Three.js (a vertex in `THREE.Points` or `THREE.BufferGeometry`).
    *   Initially, these particles should appear as a **randomly distributed or dynamically scattering particle stream**, not the original image.
    *   Each particle should store its original position and color information for later restoration.

2.  **Camera Input and Hand Tracking:**
    *   Start and display a real-time camera video stream as the background (or in a specific area of the screen).
    *   Use the MediaPipe Hands model for **real-time hand tracking** to identify the user's hand keypoints (e.g., fingertips, palm center).
    *   Ensure that the hand tracking data can be accessed and processed by JavaScript code in real-time.

3.  **Particle Restoration Interaction Logic:**
    *   Based on the hand keypoint data from MediaPipe, **design a set of gesture recognition logic**. To improve recognition accuracy and intuitive interaction, it is recommended to use simple, clear gestures, such as "open palm" (to activate particle attraction) and "clenched fist" (to pause attraction).
    *   When a specific "restore" gesture is recognized, the particle stream should begin to **move towards its original image position**, gradually reconstructing the original image.
    *   Consider implementing a **"force field" or "attraction zone"** concept that follows the user's hand. When particles enter this zone, they are attracted and accelerated towards their final position.
    *   Different restoration stages or gestures can be designed, for example:
        *   **Activation Gesture:** Starts the restoration process.
        *   **Control Gesture:** Adjusts the speed or area of restoration.
        *   **Completion Gesture:** Fully restores the image.
    *   The animation should be smooth and visually appealing.

4.  **UI/UX Considerations:**
    *   Provide a basic HTML layout that includes the video display area and the particle rendering canvas area.
    *   Use CSS for a responsive layout and a modern visual style.
    *   A simple loading indicator or status message may be needed.

**Technical Details/Tips:**

*   The Three.js particle system can use `PointsMaterial` or a custom `ShaderMaterial` to achieve richer visual effects.
*   MediaPipe's hand keypoint data is usually returned in normalized coordinates and needs to be converted to screen or Three.js scene coordinates.
*   The particle restoration animation can be implemented using `Tween.js` or Three.js's own animation loop.