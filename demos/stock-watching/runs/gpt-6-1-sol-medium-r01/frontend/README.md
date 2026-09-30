# Stockroom 前端

React 18 + TypeScript + Vite。执行 `npm ci` 和 `npm run dev`，打开 http://127.0.0.1:5173 。先启动 PostgreSQL 与 backend，开发服务器将 `/api` 代理到 127.0.0.1:8080。直连不同后端时设置 `VITE_API_BASE`，并在后端 CORS_ORIGINS 中登记前端来源。`npm run build` 只生成前端 bundle，全栈项目仍需独立服务，未登记 GitHub Pages 静态预览。

支持 CN/HK/US 切换、名称与代码搜索、新增/修改/删除、30 秒自动刷新。请求超时 8 秒；后端不可用时显示错误及重试，不填入假数据。所有返回行情由后端明确标记为 simulated；前端始终显示模拟行情提示。控制台打印请求、应答、HTTP 状态与请求 ID。页面有响应式移动布局、弹窗焦点控制和 Escape 关闭。
