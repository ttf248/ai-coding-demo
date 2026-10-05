# 本轮产物留存

- [01 / 检查前首次产物](01/index.html)：SHA-256（统一 BOM / 换行）`aadc3c74c19f2992f008ca7b127bd6168e67273effa7f284b576f3b38fa2044c`。
- [当前完整产物](../index.html)：SHA-256（统一 BOM / 换行）`5aef88d78ffc4beda0440e3f78b1ea695fe6d2cd0c9bbe2b54d7c7166de48fa3`。

专项检查发现 Canvas 绘图状态残留会使重复生成的墨线端点不同；每次绘图重置画布状态，确认同种子及参数的 PNG 完全一致。首版源码保留在 iterations/01/index.html。

复查属于同一生成会话内部自检，没有追加用户任务或人工改动。
