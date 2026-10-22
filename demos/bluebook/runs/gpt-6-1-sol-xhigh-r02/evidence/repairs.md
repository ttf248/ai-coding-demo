# 首次产物后的修复

首次源文件见 initial.zip；后续测试中发现的问题按实际情况追加。

- 首次 Vite 构建提示 react-lazyload 的 prop-types 被作为外部依赖；补充固定版本 prop-types@15.8.1，并重新生成独立 lockfile、构建静态预览，避免浏览器裸模块导入失败。
