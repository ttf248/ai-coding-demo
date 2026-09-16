# 部署指南

## 环境要求

- Docker 20.10+
- Docker Compose 2.0+ (可选)

## 生产环境部署

### 1. 数据库部署

首先创建虚拟网络：

```shell
docker network create trae-network
```

启动 PostgreSQL 数据库：

```shell
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=123456 \
  -p 5432:5432 \
  --network trae-network \
  postgres:17
```

### 2. 后端部署

#### 方式一：本地构建镜像

1. 进入后端目录：

```shell
cd backend
```

2. 构建 Docker 镜像：

```shell
docker build -t trae-backend .
```

3. 运行容器：

```shell
docker run -d --name trae-backend \
  --network trae-network \
  -p 8080:8080 \
  -e DB_HOST=postgres \
  -e DB_USER=postgres \
  -e DB_PASSWORD=123456 \
  -e DB_NAME=postgres \
  trae-backend
```

#### 方式二：使用预构建镜像

```shell
docker run -d --name trae-backend \
  --network trae-network \
  -p 8080:8080 \
  -e DB_HOST=postgres \
  -e DB_USER=postgres \
  -e DB_PASSWORD=123456 \
  -e DB_NAME=postgres \
  i-do-docker.pkg.coding.net/github/trae-demo/backend
```

### 3. 前端部署

#### 方式一：本地构建镜像

1. 进入前端目录：

```shell
cd frontend
```

2. 构建 Docker 镜像：

```shell
docker build -t trae-frontend .
```

3. 运行容器：

```shell
docker run -d --name trae-frontend \
  --network trae-network \
  -p 5173:80 \
  trae-frontend
```

#### 方式二：使用预构建镜像

```shell
docker run -d --name trae-frontend \
  --network trae-network \
  -p 5173:80 \
  i-do-docker.pkg.coding.net/github/trae-demo/frontend
```

## 生产环境配置

### Nginx 代理配置

生产环境中，建议使用 Nginx 作为反向代理，统一处理前端静态文件和 API 请求。

#### 前端代理配置

前端已配置为生产环境下使用相对路径访问 API：

- 开发环境：直接访问 `http://localhost:8080/api`
- 生产环境：通过 Nginx 代理访问 `/api`

这样的配置确保了：
- 所有 API 请求都通过 Nginx 代理转发
- 提高了系统安全性，隐藏了后端服务器的真实地址
- 统一了请求入口，便于后期维护和扩展
- 支持了跨域请求处理

### 环境变量配置

#### 后端环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DB_HOST` | 数据库主机 | `localhost` |
| `DB_PORT` | 数据库端口 | `5432` |
| `DB_USER` | 数据库用户名 | `postgres` |
| `DB_PASSWORD` | 数据库密码 | - |
| `DB_NAME` | 数据库名称 | `postgres` |
| `PORT` | 服务端口 | `8080` |
| `LOG_LEVEL` | 日志级别 | `info` |

#### 前端环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API 基础地址 | `/api` |

## Docker Compose 部署

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:17
    container_name: postgres
    environment:
      POSTGRES_PASSWORD: 123456
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - trae-network

  backend:
    image: i-do-docker.pkg.coding.net/github/trae-demo/backend
    container_name: trae-backend
    environment:
      DB_HOST: postgres
      DB_USER: postgres
      DB_PASSWORD: 123456
      DB_NAME: postgres
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - trae-network

  frontend:
    image: i-do-docker.pkg.coding.net/github/trae-demo/frontend
    container_name: trae-frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
    networks:
      - trae-network

volumes:
  postgres_data:

networks:
  trae-network:
    driver: bridge
```

启动所有服务：

```shell
docker-compose up -d
```

## 健康检查

### 后端健康检查

```shell
curl http://localhost:8080/api/health
```

### 前端访问检查

访问 `http://localhost:5173` 确认前端应用正常运行。

## 监控和日志

### 查看容器日志

```shell
# 查看后端日志
docker logs trae-backend

# 查看前端日志
docker logs trae-frontend

# 查看数据库日志
docker logs postgres
```

### 实时监控

```shell
# 实时查看后端日志
docker logs -f trae-backend
```

## 备份和恢复

### 数据库备份

```shell
docker exec postgres pg_dump -U postgres postgres > backup.sql
```

### 数据库恢复

```shell
docker exec -i postgres psql -U postgres postgres < backup.sql
```

## 故障排除

### 常见问题

1. **容器无法启动**
   - 检查端口是否被占用
   - 检查环境变量配置
   - 查看容器日志

2. **数据库连接失败**
   - 确认数据库容器正常运行
   - 检查网络连接
   - 验证数据库凭据

3. **前端 API 请求失败**
   - 检查后端服务状态
   - 确认 Nginx 代理配置
   - 验证网络连通性

### 性能优化

- 使用 Redis 缓存频繁查询的数据
- 配置数据库连接池
- 启用 Gzip 压缩
- 配置 CDN 加速静态资源
