# 验证与修复

React + Go Gin/GORM + PostgreSQL，完整市场切换与合约 CRUD、约束校验、CORS 和通讯日志。修复 TypeScript ES2020 数组兼容性，锁定兼容 Go 1.23 的间接依赖；请求 ID 增加原子序列以避免 Windows 时间精度造成重复；改善后端非 JSON 失败应答告警。报价始终标记 simulated。

## 验证结果

- npm run generate / validate：8 主题、8 实验、14 技术指南，生成目录与来源指纹一致。
- npm test：7 项通过；node --check index.js 与 git diff --check 通过。
- npm run test:browser：18 项通过，覆盖根路径与 /ai-coding-demo/ 子路径、390px 无横向溢出、单 HTML file:// 打开、主要交互与 WebGL。检查源码：tests/browser/session-20260930.spec.mjs。
- 小蓝书 TypeScript/Vite 构建通过，previews 已生成。股票 TypeScript/Vite 构建和 Go 编译通过；真实 PostgreSQL 16.4 下 15 项 API 与前端联调通过。

## 限制

停止真实 PostgreSQL 后，/api/health 和 /api/contracts 均返回预期的 503，数据库中断错误处理已验证。测试结束已停止临时数据库、Go API 和 Vite。自动安全审查以“策略阻止”拒绝删除 .cache/postgres-check；临时缓存及测试 exe 被 Git 忽略，未纳入提交。

当前会话依次完成，包含前序案例上下文；未委派。输入上下文记录 partial。浏览器使用软件 WebGL，不作为 60FPS 达成证据；没有进行穷尽式 3D 碰撞证明。摄像头真实手势与摄像头权限流程需要实体设备复查，自动检查验证了粒子与按钮还原。外部图片/CDN 需要网络。未部署、推送或更改发布方式。
