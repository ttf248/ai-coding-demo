# 小蓝书应用部署指南

## 🚀 本地开发部署

### 1. 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 2. 启动开发环境
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 应用将在 http://localhost:5173 启动
```

## 🌐 生产环境部署

### 1. 构建生产版本
```bash
npm run build
```

### 2. 预览生产版本
```bash
npm run preview
```

### 3. 静态文件部署
构建完成后，`dist` 文件夹包含所有静态文件，可以部署到任何静态文件服务器：

- **Vercel**: 直接连接 GitHub 仓库自动部署
- **Netlify**: 拖拽 `dist` 文件夹或连接 Git
- **GitHub Pages**: 使用 GitHub Actions 自动部署
- **阿里云OSS**: 上传到对象存储服务
- **腾讯云COS**: 静态网站托管

### 4. 服务器部署（Nginx示例）
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🐳 Docker 部署

### 1. 创建 Dockerfile
```dockerfile
# 构建阶段
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. 构建和运行
```bash
# 构建镜像
docker build -t xiaolanshu-app .

# 运行容器
docker run -p 8080:80 xiaolanshu-app
```

## 📱 PWA 支持（可选）

如需将应用转换为PWA，可以添加：

1. **Service Worker**
2. **Web App Manifest**
3. **离线缓存策略**

## 🔧 环境变量配置

创建 `.env` 文件配置环境变量：

```env
# API 基础地址
VITE_API_BASE_URL=https://api.example.com

# 应用标题
VITE_APP_TITLE=小蓝书

# 是否启用分析
VITE_ENABLE_ANALYTICS=true
```

## 📊 性能优化建议

1. **启用 CDN** - 加速静态资源加载
2. **开启 Gzip** - 减少传输大小
3. **图片优化** - 使用 WebP 格式
4. **懒加载** - 已实现图片懒加载
5. **缓存策略** - 设置合理的缓存头

## 🔍 SEO 优化

对于SEO需求，建议：

1. **服务端渲染 (SSR)** - 使用 Next.js 或 Nuxt.js
2. **预渲染** - 使用 Prerender.io
3. **Meta 标签** - 动态设置页面标题和描述

## 📈 监控和分析

推荐集成：

- **Google Analytics** - 用户行为分析
- **Sentry** - 错误监控
- **Lighthouse** - 性能监控

## 🛡️ 安全配置

- 设置 HTTPS
- 配置 CSP 头部
- 启用 HSTS
- 定期更新依赖

---

**🎉 部署完成后，您就可以享受小蓝书瀑布流应用带来的精彩体验了！**
