(function () {
  const root = document.getElementById("guide-lab"),
    slug = document.body.dataset.guide;
  const output = (id, value) => {
    document.getElementById(id).textContent =
      typeof value === "string" ? value : JSON.stringify(value, null, 2);
  };
  const panel = (title, body) =>
    `<section class="lab-panel"><h2>${title}</h2>${body}</section>`;
  const button = (id, label, primary = false) =>
    `<button id="${id}"${primary ? ' class="primary"' : ""}>${label}</button>`;
  if (slug === "javascript") {
    root.innerHTML =
      panel(
        "数组转换与不可变数据",
        '<label>输入数字数组<textarea id="numbers">[7, 2, 9, 4, 1, 6]</textarea></label><div class="lab-actions">' +
          button("sort", "从小到大排序", true) +
          button("filter", "筛选偶数") +
          button("map", "每个数字乘 2") +
          '</div><p id="js-status" class="lab-status" role="status"></p>',
      ) +
      panel(
        "执行结果与原始数组",
        '<pre id="js-result" aria-live="polite"></pre>',
      );
    for (const action of ["sort", "filter", "map"])
      document.getElementById(action).onclick = () => {
        try {
          const values = JSON.parse(document.getElementById("numbers").value);
          if (
            !Array.isArray(values) ||
            !values.every(
              (value) => typeof value === "number" && Number.isFinite(value),
            )
          )
            throw Error("请输入只包含有限数字的 JSON 数组。");
          const result =
            action === "sort"
              ? [...values].sort((a, b) => a - b)
              : action === "filter"
                ? values.filter((value) => value % 2 === 0)
                : values.map((value) => value * 2);
          output("js-result", { original: values, result });
          output("js-status", "已执行 " + action + "；原始数组保持原样。");
        } catch (error) {
          output("js-status", error.message);
        }
      };
    document.getElementById("sort").click();
  } else if (slug === "state-management") {
    root.innerHTML =
      panel(
        "同一份状态，两个订阅视图",
        '<p>点击任一操作，两个视图会从共享状态读取相同的计数。</p><div class="lab-card">视图 A <strong class="lab-value" id="state-a"></strong></div><div class="lab-card">视图 B <strong class="lab-value" id="state-b"></strong></div><div class="lab-actions">' +
          button("increment", "增加", true) +
          button("decrement", "减少") +
          button("reset", "重置") +
          "</div>",
      ) +
      panel(
        "状态快照与操作记录",
        '<pre id="store" aria-live="polite"></pre><pre id="actions"></pre>',
      );
    let state = { count: 0 },
      log = [];
    const subscribers = [
      (value) => output("state-a", String(value.count)),
      (value) => output("state-b", String(value.count)),
      (value) => output("store", value),
    ];
    const dispatch = (action) => {
      state = {
        count:
          action === "reset"
            ? 0
            : state.count + (action === "increment" ? 1 : -1),
      };
      log = [...log, action].slice(-8);
      subscribers.forEach((subscriber) => subscriber(state));
      output("actions", log);
    };
    for (const action of ["increment", "decrement", "reset"])
      document.getElementById(action).onclick = () => dispatch(action);
    dispatch("reset");
  } else if (slug === "api-rest") {
    root.innerHTML =
      panel(
        "本地 REST 请求模拟",
        '<p>操作内存中的资源列表，用于观察 HTTP 方法与状态码；这里不会向外部服务器发送请求。</p><label>方法 <select id="method">' +
          ["GET", "POST", "PUT", "PATCH", "DELETE"]
            .map((method) => `<option>${method}</option>`)
            .join("") +
          '</select></label><p><label>资源 ID <input id="resource-id" type="number" value="1" min="1"></label></p><label>JSON 请求体<textarea id="request-body">{"title":"阅读实验记录","done":false}</textarea></label><div class="lab-actions">' +
          button("send", "发送模拟请求", true) +
          '</div><p id="api-status" class="lab-status" role="status"></p>',
      ) +
      panel(
        "响应与当前资源",
        '<pre id="response" aria-live="polite"></pre><pre id="resources"></pre>',
      );
    let resources = [{ id: 1, title: "查看模型版本", done: false }];
    let nextId = 2;
    document.getElementById("send").onclick = () => {
      const method = document.getElementById("method").value,
        id = Number(document.getElementById("resource-id").value);
      let status = 200,
        response;
      try {
        const index = resources.findIndex((item) => item.id === id);
        const body = ["GET", "DELETE"].includes(method)
          ? null
          : JSON.parse(document.getElementById("request-body").value);
        if (body !== null && (typeof body !== "object" || Array.isArray(body)))
          throw Error("请求体需要 JSON 对象。");
        if (!["GET", "DELETE"].includes(method) && !body)
          throw Error("请求体需要 JSON 对象。");
        if (
          ["POST", "PUT"].includes(method) &&
          (!body.title || typeof body.title !== "string")
        )
          throw Error("请求体需要非空 title 字段。");
        if (
          method === "PATCH" &&
          body.title !== undefined &&
          (typeof body.title !== "string" || !body.title.trim())
        )
          throw Error("title 需要非空字符串。");
        if (body?.done !== undefined && typeof body.done !== "boolean")
          throw Error("done 需要布尔值。");
        if (method === "GET")
          response = resources.find((item) => item.id === id);
        else if (method === "POST") {
          response = { id: nextId++, title: body.title, done: !!body.done };
          resources.push(response);
          status = 201;
        } else if (index < 0) status = 404;
        else if (method === "DELETE") {
          resources.splice(index, 1);
          status = 204;
          response = null;
        } else {
          response =
            method === "PUT"
              ? { id, title: body.title, done: body.done ?? false }
              : {
                  ...resources[index],
                  ...(body.title === undefined ? {} : { title: body.title }),
                  ...(body.done === undefined ? {} : { done: body.done }),
                };
          resources[index] = response;
        }
        if (method === "GET" && !response) status = 404;
        if (status === 404) response = { error: "资源不存在" };
      } catch (error) {
        status = 400;
        response = { error: error.message };
      }
      output("api-status", method + " /tasks/" + id + " → " + status);
      output("response", { status, body: response ?? null });
      output("resources", resources);
    };
    document.getElementById("send").click();
  } else if (slug === "frontend-build") {
    root.innerHTML =
      panel(
        "构建流程示意",
        '<p>按顺序观察源文件、模块合并、压缩与产物清单。这是流程演示，示例转换规则仅处理下方这段固定代码。</p><label><input type="checkbox" id="minify" checked> 使用压缩展示</label><pre id="build-source">// greeting.js\nexport const message = "Hello";\n// main.js\nimport { message } from "./greeting.js";\nconsole.log(message);</pre><div class="lab-actions">' +
          button("build", "生成示意产物", true) +
          "</div>",
      ) +
      panel(
        "阶段与输出",
        '<ol id="build-steps"></ol><pre id="build-result" aria-live="polite"></pre>',
      );
    document.getElementById("build").onclick = () => {
      const source = 'const message = "Hello";\nconsole.log(message);';
      const bundle = document.getElementById("minify").checked
        ? 'const message="Hello";console.log(message);'
        : source;
      document.getElementById("build-steps").innerHTML = [
        "读取两个源模块",
        "解析 greeting.js 的导出与 main.js 的导入",
        "将依赖合并为示例 bundle",
        "生成产物清单",
      ]
        .map((step) => `<li>${step}</li>`)
        .join("");
      output("build-result", {
        files: ["dist/index.html", "dist/app.js"],
        appJs: bundle,
        bytes: new TextEncoder().encode(bundle).length,
      });
    };
    document.getElementById("build").click();
  } else if (slug === "npm") {
    root.innerHTML =
      panel(
        "依赖与脚本配置",
        '<p>选择依赖类型，观察 package.json 和安装命令如何变化；此页面不会在你的电脑上执行命令。</p><p><label>依赖名称 <input id="package-name" value="react"></label></p><p><label>版本说明 <input id="package-version" value="18.3.1"></label></p><label><input id="dev-dependency" type="checkbox"> 开发依赖</label><div class="lab-actions">' +
          button("add-package", "更新配置", true) +
          '</div><p id="npm-status" class="lab-status" role="status"></p>',
      ) +
      panel(
        "配置与命令",
        '<pre id="package-json" aria-live="polite"></pre><pre id="install-command"></pre>',
      );
    const manifest = {
      name: "learning-demo",
      private: true,
      scripts: { dev: "vite", build: "vite build" },
    };
    document.getElementById("add-package").onclick = () => {
      const name = document.getElementById("package-name").value.trim(),
        version = document.getElementById("package-version").value.trim();
      if (
        !/^(@[a-z0-9-]+\/)?[a-z0-9-]+$/i.test(name) ||
        !version ||
        /[\s;&|`$]/.test(version)
      ) {
        output("npm-status", "请输入有效的依赖名称和版本说明。");
        return;
      }
      const dev = document.getElementById("dev-dependency").checked,
        key = dev ? "devDependencies" : "dependencies";
      manifest[key] ??= {};
      manifest[key][name] = version;
      const other = dev ? "dependencies" : "devDependencies";
      if (manifest[other]) delete manifest[other][name];
      output("package-json", manifest);
      output(
        "install-command",
        `npm install ${dev ? "--save-dev " : ""}${name}@${version}\n\n已有匹配 lockfile 时：npm ci`,
      );
      output("npm-status", "配置已更新。版本与命令仅为学习示例。");
    };
    document.getElementById("add-package").click();
  } else if (slug === "component-based") {
    root.innerHTML =
      panel(
        "共享属性与独立状态",
        '<p>修改共享标题会更新两个卡片；每张卡片自己的点击次数独立保存。</p><label>共享标题 <input id="component-title" value="实验卡片"></label><div class="lab-actions">' +
          button("theme", "切换共享主题") +
          '</div><div id="component-cards"></div>',
      ) +
      panel(
        "组件数据快照",
        '<pre id="component-state" aria-live="polite"></pre>',
      );
    const counts = [0, 0];
    let dark = false;
    const render = () => {
      const title = document.getElementById("component-title").value;
      const cards = document.getElementById("component-cards");
      cards.classList.toggle("lab-dark", dark);
      cards.replaceChildren();
      counts.forEach((count, index) => {
        const card = document.createElement("div");
        card.className = "lab-card";
        const heading = document.createElement("h3");
        heading.textContent = title + " " + String.fromCharCode(65 + index);
        const action = document.createElement("button");
        action.textContent = "点击次数 " + count;
        action.onclick = () => {
          counts[index]++;
          render();
        };
        card.append(heading, action);
        cards.append(card);
      });
      output("component-state", {
        props: { title, theme: dark ? "dark" : "light" },
        localState: counts.map((count) => ({ count })),
      });
    };
    document.getElementById("component-title").oninput = render;
    document.getElementById("theme").onclick = () => {
      dark = !dark;
      render();
    };
    render();
  }
})();
