# Vercel Root Directory 对照表

Vercel 的 Root Directory 保存在项目设置中，不由 Git 仓库里的文件自动迁移。目录改造后，如果日志出现 `The specified Root Directory ... does not exist`，说明项目仍使用旧目录；更新设置后再重新部署即可。

当前迁移记录如下。路径相对于仓库根目录填写，不要加开头的 `/`。

| 项目用途 | 旧 Root Directory（已失效） | 新 Root Directory | 构建命令 | 输出目录 |
| --- | --- | --- | --- | --- |
| 小蓝书 · MiniMaxi M2 | `ui-ux-redbook-waterfall-images-minimaxi-m2` | `demos/bluebook/runs/minimax-m2-unknown-r01` | `npm run build` | `dist` |
| 小蓝书 · MiniMax M2.1 | `ui-ux-redbook-waterfall-images-minimax-m2.1` | `demos/bluebook/runs/minimax-m2-1-unknown-r01` | `npm run build` | `dist` |
| 小蓝书 · Claude 4.0 | `ui-ux-redbook-waterfall-images` | `demos/bluebook/runs/claude-4-0-unknown-r01` | `npm run build` | `dist` |
| 自选股前端 | `stock-watching-system/frontend` | `demos/stock-watching/runs/unknown-unknown-r01/frontend` | 按项目设置 | 按项目设置 |

## 本次报错的修复步骤

报错项目对应 MiniMaxi M2。打开 Vercel 项目的 **Settings → Build and Deployment**，将 **Root Directory** 改为：

```text
demos/bluebook/runs/minimax-m2-unknown-r01
```

保存后重新部署。该目录内已经包含 `package.json`、`package-lock.json`、`vite.config.ts` 和可运行的 `build` script，Vercel 可以直接执行 `npm run build` 并发布 `dist`。如果项目设置过自定义 Install Command，保留 `npm ci`；没有自定义命令时使用 Vercel 默认值即可。

## 后续目录迁移

1. 先在 `catalog/migration-v2.json` 记录旧路径和新路径。
2. 确认新 Root Directory 内包含该项目自己的依赖清单和构建配置。
3. 在每个对应的 Vercel 项目设置中更新 Root Directory，并触发一次部署。
4. 将最终路径补充到本表；GitHub Pages 仍然只通过提交到 GitHub 自动发布，不增加额外发布步骤。

不要把 Root Directory 指向 `previews/`：那里是 GitHub Pages 使用的已构建静态预览，不是 Vercel 的源码构建目录。
