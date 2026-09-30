# 验证与修复

九个 375px 页面；课程筛选、10 分钟计时、4/4/4 呼吸动画和 Web Audio 合成雨声。课程/统计为示例，没有真实音频课程和账户服务。

## 验证结果

- npm run generate / validate：8 主题、8 实验、14 技术指南，生成目录与来源指纹一致。
- npm test：7 项通过；node --check index.js 与 git diff --check 通过。
- npm run test:browser：18 项通过，覆盖根路径与 /ai-coding-demo/ 子路径、390px 无横向溢出、单 HTML file:// 打开、主要交互与 WebGL。检查源码：tests/browser/session-20260930.spec.mjs。
- 小蓝书 TypeScript/Vite 构建通过，previews 已生成。股票 TypeScript/Vite 构建和 Go 编译通过；真实 PostgreSQL 16.4 下 15 项 API 与前端联调通过。

## 限制

当前会话依次完成，包含前序案例上下文；未委派。输入上下文记录 partial。浏览器使用软件 WebGL，不作为 60FPS 达成证据；没有进行穷尽式 3D 碰撞证明。摄像头真实手势与摄像头权限流程需要实体设备复查，自动检查验证了粒子与按钮还原。外部图片/CDN 需要网络。未部署、推送或更改发布方式。
