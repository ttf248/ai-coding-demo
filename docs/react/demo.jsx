const { useState, useEffect, useMemo, useCallback } = React;

// 英雄区块组件
function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">React</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          用于构建用户界面的库
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
            开始学习
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
            查看文档
          </button>
        </div>
      </div>
    </div>
  );
}

// 计数器组件
function CounterDemo() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const doubleCount = useMemo(() => count * 2, [count]);

  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + step);
  }, [step]);

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">
        1. useState Hook - 状态管理
      </h3>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">计数器示例</h4>
            <p className="text-3xl font-bold text-blue-600 mb-4">{count}</p>
            <p className="text-gray-600 mb-4">
              双倍值：<span className="font-bold">{doubleCount}</span>
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setCount((prev) => prev - step)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
              >
                -{step}
              </button>
              <button
                onClick={handleIncrement}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
              >
                +{step}
              </button>
              <button
                onClick={() => setCount(0)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
              >
                重置
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">设置步长</h4>
            <input
              type="number"
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              min="1"
              max="100"
            />
            <p className="mt-2 text-sm text-gray-600">当前步长：{step}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 输入组件
function InputDemo() {
  const [text, setText] = useState("");
  const [isUpperCase, setIsUpperCase] = useState(false);

  const displayText = useMemo(() => {
    return isUpperCase ? text.toUpperCase() : text;
  }, [text, isUpperCase]);

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">
        2. 输入处理与状态提升
      </h3>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">输入文本</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="在这里输入..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isUpperCase}
              onChange={(e) => setIsUpperCase(e.target.checked)}
              className="mr-2"
            />
            转换为大写
          </label>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">显示内容：</p>
            <p className="text-xl font-bold text-blue-600">
              {displayText || "（空）"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              字符数：{displayText.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 条件渲染组件
function ConditionalRenderDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [showMessage, setShowMessage] = useState(true);

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">3. 条件渲染</h3>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <label className="flex items-center mr-4">
            <input
              type="checkbox"
              checked={isLoggedIn}
              onChange={(e) => setIsLoggedIn(e.target.checked)}
              className="mr-2"
            />
            已登录
          </label>
          <label className="flex items-center mr-4">
            <input
              type="checkbox"
              checked={isVIP}
              onChange={(e) => setIsVIP(e.target.checked)}
              className="mr-2"
            />
            VIP 用户
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showMessage}
              onChange={(e) => setShowMessage(e.target.checked)}
              className="mr-2"
            />
            显示消息
          </label>
        </div>

        {showMessage && (
          <div className="space-y-4">
            {isLoggedIn ? (
              <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-green-800">✓ 欢迎回来，用户！</p>
                {isVIP && (
                  <p className="text-yellow-800 mt-2">🌟 您是尊贵的 VIP 会员</p>
                )}
              </div>
            ) : (
              <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-blue-800">请登录以使用更多功能</p>
              </div>
            )}

            {!isLoggedIn && !isVIP && (
              <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="text-yellow-800">💡 成为 VIP 会员享受更多特权</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 列表渲染组件
function ListRenderDemo() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "学习 React Hooks", completed: false },
    { id: 2, text: "理解状态管理", completed: true },
    { id: 3, text: "实践组件通信", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">
        4. 列表渲染与数组操作
      </h3>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4">任务列表</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              placeholder="添加新任务..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={addTask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
            >
              添加
            </button>
          </div>
        </div>

        <ul className="space-y-2 mb-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mr-3"
                />
                <span
                  className={task.completed ? "line-through text-gray-400" : ""}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            总计：{tasks.length} 个任务 | 已完成：{completedCount} 个 | 未完成：
            {tasks.length - completedCount} 个
          </p>
        </div>
      </div>
    </div>
  );
}

// 组件通信演示
function ChildComponent({ message, onSendMessage }) {
  return (
    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <p className="text-purple-800 mb-2">子组件接收：{message}</p>
      <button
        onClick={() => onSendMessage("来自子组件的消息")}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
      >
        向父组件发送消息
      </button>
    </div>
  );
}

function ParentChildDemo() {
  const [parentMessage, setParentMessage] = useState("Hello from Parent");
  const [childMessage, setChildMessage] = useState("");

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">
        5. 组件通信（Props & Callbacks）
      </h3>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 mb-2">父组件：向子组件传递 Props</p>
            <p className="text-gray-600">
              消息：<span className="font-bold">{parentMessage}</span>
            </p>
          </div>

          <ChildComponent
            message={parentMessage}
            onSendMessage={setChildMessage}
          />

          {childMessage && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 mb-2">父组件：接收子组件消息</p>
              <p className="text-gray-600">
                收到：<span className="font-bold">{childMessage}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 副作用演示
function EffectDemo() {
  const [count, setCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 模拟 API 调用
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Effect 执行：数据加载完成");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 每次计数变化时执行
  useEffect(() => {
    if (count > 0) {
      console.log(`Count 变化为：${count}`);
    }
  }, [count]);

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">
        6. useEffect Hook - 副作用
      </h3>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">计数器</h4>
            <p className="text-3xl font-bold text-blue-600 mb-4">{count}</p>
            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
            >
              +1（触发 Effect）
            </button>
            <p className="text-sm text-gray-500 mt-2">查看控制台日志</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">窗口大小</h4>
            <p className="text-3xl font-bold text-green-600 mb-4">
              {windowWidth}px
            </p>
            <p className="text-sm text-gray-500">调整窗口大小以触发 Effect</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 计算器组件
function CalculatorDemo() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState("+");

  const result = useMemo(() => {
    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return num2 !== 0 ? num1 / num2 : 0;
      default:
        return 0;
    }
  }, [num1, num2, operator]);

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">
        7. useMemo - 性能优化
      </h3>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex space-x-2">
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">*</option>
              <option value="/">/</option>
            </select>
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="p-6 bg-blue-50 rounded-lg text-center">
            <p className="text-gray-600 mb-2">计算结果：</p>
            <p className="text-4xl font-bold text-blue-600">{result}</p>
          </div>
          <p className="text-sm text-gray-500 text-center">
            💡 使用 useMemo 缓存计算结果，避免重复计算
          </p>
        </div>
      </div>
    </div>
  );
}

// 主题切换组件
function ThemeDemo() {
  const [theme, setTheme] = useState("light");
  const [todos, setTodos] = useState([
    { id: 1, text: "学习 React 基础", done: false },
    { id: 2, text: "掌握 Hooks", done: true },
  ]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const addTodo = (text) => {
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text,
        done: false,
      },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-gray-700">
        8. 综合示例 - 待办事项
      </h3>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div
          className={`${theme === "dark" ? "bg-gray-800 text-white" : ""} p-6 rounded-lg transition`}
        >
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-semibold">我的待办事项</h4>
            <button
              onClick={toggleTheme}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              {theme === "light" ? "🌙 深色模式" : "☀️ 浅色模式"}
            </button>
          </div>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="添加新任务..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addTodo(e.target.value);
                  e.target.value = "";
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                if (input.value) {
                  addTodo(input.value);
                  input.value = "";
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
            >
              添加
            </button>
          </div>
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => toggleTodo(todo.id)}
                    className="mr-3"
                  />
                  <span className={todo.done ? "line-through opacity-50" : ""}>
                    {todo.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// 主要组件
function App() {
  useEffect(() => {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }, []);

  return (
    <div>
      {/* 导航栏 */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">React</span>
              <span className="ml-3 text-gray-500">UI 库</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                核心特性
              </a>
              <a
                href="#hooks"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Hooks
              </a>
              <a
                href="#examples"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                示例
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 英雄区块 */}
      <HeroSection />

      {/* 核心特性 */}
      <section
        id="features"
        className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          ⭐ 核心特性
        </h2>
        <p className="text-center text-gray-600 mb-12">
          React 的核心功能和 Hooks 演示
        </p>

        <CounterDemo />
        <InputDemo />
        <ConditionalRenderDemo />
        <ListRenderDemo />
      </section>

      {/* Hooks 演示 */}
      <section id="hooks" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            🪝 React Hooks
          </h2>

          <ParentChildDemo />
          <EffectDemo />
          <CalculatorDemo />
        </div>
      </section>

      {/* 综合示例 */}
      <section
        id="examples"
        className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          💡 综合示例
        </h2>

        <ThemeDemo />
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">React Demo</h3>
            <p className="text-gray-400 mb-6">用于构建用户界面的库</p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://react.dev"
                className="text-gray-400 hover:text-white transition"
                target="_blank"
              >
                官方文档
              </a>
              <a
                href="https://github.com/facebook/react"
                className="text-gray-400 hover:text-white transition"
                target="_blank"
              >
                GitHub
              </a>
              <a
                href="https://react.docschina.org/"
                className="text-gray-400 hover:text-white transition"
                target="_blank"
              >
                中文文档
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                © 2024 React Demo. Created with ❤️ using React
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
