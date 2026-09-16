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

<!-- archive:start -->
## 当前归档信息（自动生成）

- 实验 ID：`pixel-flow--unknown-unknown-r01`
- 模型：未记录 / 多轮混合；推理档位：unknown
- 类型：prompt；预览：none；网络：required
- [完整原始输入快照](prompt.md) · [主题与其他版本](../../../../topic.html?id=pixel-flow)
- 输入记录：保留文档中的原始输入；其他会话上下文未记录。
- 工具：未记录。历史记录未提供可确认的单一模型标识，未沿用旧首页推测标签。
- 运行方式：无静态预览，参见上方历史说明与源码。


### 部署适配记录

无新增实现改动。
<!-- archive:end -->
