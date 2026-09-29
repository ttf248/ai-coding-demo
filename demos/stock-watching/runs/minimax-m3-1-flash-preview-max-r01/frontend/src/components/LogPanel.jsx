import { useState } from "react";

/** 通信日志面板：折叠展示前后端每一次请求与应答。 */
export default function LogPanel({ entries, onClear }) {
  const [filter, setFilter] = useState("all");

  const shown = entries.filter((e) => (filter === "all" ? true : filter === "error" ? !!e.error : !e.error));
  const errors = entries.filter((e) => e.error).length;

  return (
    <details className="card logpanel">
      <summary>
        通信日志 · {entries.length} 条
        {errors > 0 && <span className="pill" style={{ color: "#ff9d97" }}>{errors} 条失败</span>}
      </summary>
      <div className="loglist">
        {shown.length === 0 && <div className="empty">暂无日志</div>}
        {[...shown].reverse().map((e) => {
          const text = e.error
            ? e.error
            : e.payload && typeof e.payload === "object"
              ? JSON.stringify(e.payload)
              : String(e.payload ?? "");
          return (
            <div className={`logrow ${e.error ? "err" : ""}`} key={e.id}>
              <span className="time">{e.at}</span>
              <span className={`dir ${e.direction === "→" ? "req" : "resp"}`}>{e.direction}</span>
              <span className="detail">
                {e.method} {e.url}
                {e.status ? ` · ${e.status}` : ""}
                {e.duration ? ` · ${e.duration}ms` : ""}
              </span>
              <span className="detail">{text}</span>
            </div>
          );
        })}
      </div>
      <div className="foot">
        <div className="toolbar" style={{ margin: 0 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">全部</option>
            <option value="error">仅失败</option>
            <option value="ok">仅成功</option>
          </select>
          <span className="grow" />
          <button className="btn" onClick={onClear}>
            清空
          </button>
        </div>
      </div>
    </details>
  );
}
