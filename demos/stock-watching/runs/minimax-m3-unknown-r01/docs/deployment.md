# 自选股 · MiniMax M3 · 部署说明

本项目对外仅交付源码，不在归档内托管在线服务。下列为生产环境独立部署的参考步骤。

## 1. 部署后端

### 方式 A：本地直接运行

```bash
cd backend
go build -o stock-watch-backend .
./stock-watch-backend
# 默认监听 :8080
```

### 方式 B：Docker

```dockerfile
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY . .
RUN go build -o /out/stock-watch-backend .

FROM alpine:3.19
COPY --from=build /out/stock-watch-backend /usr/local/bin/
EXPOSE 8080
CMD ["stock-watch-backend"]
```

构建并运行：

```bash
docker build -t stock-watch-backend backend/
docker run -d --name stock-watch-backend -p 8080:8080 stock-watch-backend
```

### 数据库

- **SQLite**：容器内挂载卷 `-v $PWD/data:/data` 并设置 `DB_SQLITE_PATH=/data/stocks.db`。
- **PostgreSQL**：通过 `DB_DRIVER=postgres` + `DB_HOST/...` 连接。

## 2. 部署前端

```bash
cd frontend
npm install
npm run build -- --base=./    # 产物在 dist/
```

将 `dist/` 静态文件丢给任意 CDN / Nginx / Vercel 即可。

### Nginx 示例

```nginx
server {
  listen 80;
  server_name example.com;

  root /var/www/stock-watch/dist;
  index index.html;

  location / {
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
  }
}
```

## 3. 环境变量

| 变量                | 默认值                  | 说明                          |
| ------------------- | ----------------------- | ----------------------------- |
| `PORT`              | `8080`                  | 后端监听端口                  |
| `DB_DRIVER`         | （空，等同 SQLite）      | 设置 `postgres` 切换数据库    |
| `DB_HOST`           | `localhost`             | PostgreSQL 主机               |
| `DB_USER`           | `postgres`              | PostgreSQL 用户               |
| `DB_PASSWORD`       | `123456`                | PostgreSQL 密码               |
| `DB_NAME`           | `postgres`              | PostgreSQL 数据库             |
| `DB_PORT`           | `5432`                  | PostgreSQL 端口               |
| `DB_SQLITE_PATH`    | `stocks.db`             | SQLite 文件路径               |
| `VITE_API_BASE_URL` | `http://localhost:8080` | 前端访问后端的基础地址        |

## 4. 健康检查

```bash
curl http://localhost:8080/api/health
# {"status":"ok","time":"..."}
```