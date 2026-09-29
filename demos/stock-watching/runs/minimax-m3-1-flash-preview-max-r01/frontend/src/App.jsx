import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError, setLogger } from "./api.js";
import WatchTable from "./components/WatchTable.jsx";
import WatchDialog from "./components/WatchDialog.jsx";
import LogPanel from "./components/LogPanel.jsx";

const MAX_LOGS = 300;

export default function App() {
  const [logs, setLogs] = useState([]);
  const [health, setHealth] = useState({ status: "checking" });
  const [markets, setMarkets] = useState([]);
  const [market, setMarket] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [dialog, setDialog] = useState(null); // { mode, item }
  const [notice, setNotice] = useState(null); // { kind, title, detail }
  const refreshTimer = useRef(null);

  // 注册通信日志
  useEffect(() => {
    setLogger((entry) => setLogs((prev) => [...prev, entry].slice(-MAX_LOGS)));
  }, []);

  const pushNotice = useCallback((notice) => {
    setNotice(notice);
    if (notice) window.setTimeout(() => setNotice((cur) => (cur === notice ? null : cur)), 6000);
  }, []);

  /** 统一的错误处理：网络不可达时给出明确的排查建议。 */
  const handleError = useCallback(
    (err, fallback) => {
      if (err instanceof ApiError && err.offline) {
        setHealth({ status: "offline" });
        pushNotice({
          kind: "error",
          title: "后端服务不可用",
          detail:
            `${err.message}。已停止自动刷新，恢复后会自动重试。` +
            "请确认 `go run .` 已启动，且 CORS_ORIGINS 包含当前前端地址。",
        });
        return;
      }
      const fields = Object.entries(err?.fields || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("；");
      pushNotice({
        kind: "error",
        title: err?.message || fallback || "操作失败",
        detail: [err?.code, fields].filter(Boolean).join(" · "),
      });
    },
    [pushNotice],
  );

  // 启动：健康检查 → 市场列表 → 选中第一个市场
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const h = await api.health();
        if (cancelled) return;
        setHealth({ ...h.data, status: h.data.status });
      } catch (err) {
        if (cancelled) return;
        setHealth({ status: err instanceof ApiError && err.offline ? "offline" : "degraded" });
        setLoading(false);
        handleError(err, "健康检查失败");
        return;
      }
      try {
        const m = await api.markets();
        if (cancelled) return;
        setMarkets(m.data);
        if (m.data?.length) setMarket(m.data[0].code);
      } catch (err) {
        if (cancelled) return;
        setLoading(false);
        handleError(err, "获取市场列表失败");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [handleError]);

  // 切换市场：加载代码列表 + 自选股 + 行情
  useEffect(() => {
    if (!market) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [syms, list] = await Promise.all([api.symbols(market), api.list(market)]);
        if (cancelled) return;
        setSymbols(syms.data);
        setItems(list.data.items);
        setHealth((h) => ({ ...h, status: "ok" }));
      } catch (err) {
        if (!cancelled) handleError(err, "加载自选股失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [market, handleError]);

  // 行情轮询：后端不可用时自动停止，恢复后由健康检查重新拉起
  const loadQuotes = useCallback(async () => {
    if (!items.length) {
      setQuotes([]);
      return;
    }
    try {
      const res = await api.quotes(market, items.map((i) => i.symbol.code));
      setQuotes(res.data.quotes);
      setHealth((h) => (h.status === "offline" ? h : { ...h, status: "ok" }));
    } catch (err) {
      if (err instanceof ApiError && err.offline) {
        setHealth({ status: "offline" });
        setQuotes([]);
      }
    }
  }, [items, market]);

  useEffect(() => {
    loadQuotes();
    clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(loadQuotes, 15000);
    return () => clearInterval(refreshTimer.current);
  }, [loadQuotes]);

  // 后端恢复后自动重试
  useEffect(() => {
    if (health.status !== "offline") return;
    const timer = setInterval(async () => {
      try {
        const h = await api.health();
        if (h.data?.status === "ok" || h.data?.status === "degraded") {
          setHealth({ ...h.data });
          pushNotice({ kind: "info", title: "后端已恢复", detail: "行情刷新已重新开始。" });
        }
      } catch {
        /* 仍未恢复，等待下一次重试 */
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [health.status, pushNotice]);

  const reload = async () => {
    setLoading(true);
    try {
      const list = await api.list(market);
      setItems(list.data.items);
    } catch (err) {
      handleError(err, "刷新失败");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (payload) => {
    try {
      if (dialog.mode === "edit") {
        await api.update(dialog.item.id, payload);
      } else {
        await api.create(payload);
      }
      setDialog(null);
      await reload();
      await loadQuotes();
    } catch (err) {
      handleError(err, "保存失败");
    }
  };

  const remove = async (item) => {
    setBusyId(item.id);
    try {
      await api.remove(item.id);
      setDialog(null);
      await reload();
      pushNotice({ kind: "info", title: `已删除 ${item.symbol.name}`, detail: "" });
    } catch (err) {
      handleError(err, "删除失败");
    } finally {
      setBusyId(null);
    }
  };

  const filtered = keyword.trim()
    ? items.filter((it) =>
        [it.symbol.code, it.symbol.name, it.note].some((v) =>
          (v || "").toLowerCase().includes(keyword.trim().toLowerCase()),
        ),
      )
    : items;

  const statusText =
    health.status === "ok"
      ? "后端正常"
      : health.status === "degraded"
        ? "后端降级"
        : health.status === "offline"
          ? "后端不可用"
          : "检查中…";

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>自选股</h1>
          <div className="sub">React + Gin + GORM + PostgreSQL · 支持多市场切换与增删改查</div>
        </div>
        <span className="spacer" />
        <span className={`status ${health.status === "ok" ? "ok" : health.status === "degraded" ? "degraded" : ""}`}>
          <i className="dot" />
          {statusText}
        </span>
        <button className="btn" onClick={reload}>
          刷新
        </button>
        <button className="btn primary" disabled={!symbols.length} onClick={() => setDialog({ mode: "create" })}>
          添加自选股
        </button>
      </header>

      {notice && (
        <div className={`banner ${notice.kind === "error" ? "error" : ""}`}>
          <span className="icon">{notice.kind === "error" ? "⚠️" : "ℹ️"}</span>
          <div className="body">
            <b>{notice.title}</b>
            {notice.detail}
          </div>
          <button onClick={() => setNotice(null)}>知道了</button>
        </div>
      )}

      {health.status === "offline" && (
        <div className="banner error">
          <span className="icon">🔌</span>
          <div className="body">
            <b>后端服务不可用</b>
            所有数据均为最后一次成功获取的缓存，页面每 8 秒自动重试。
          </div>
        </div>
      )}

      <div className="tabs">
        {markets.map((m) => (
          <button key={m.code} className={m.code === market ? "on" : ""} onClick={() => setMarket(m.code)}>
            {m.name}
            <span className="sub" style={{ marginLeft: 6 }}>{m.currency}</span>
          </button>
        ))}
        {markets.length === 0 && (
          <span className="sub">
            {health.status === "offline" || health.status === "degraded"
              ? "市场列表不可用，请先恢复后端服务"
              : "市场列表加载中…"}
          </span>
        )}
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="搜索代码、名称或备注"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span className="grow" />
        <span className="sub">
          {market ? `${market} · ` : ""}共 {filtered.length} 条
          {quotes.length > 0 && ` · 行情来自 ${quotes[0].source}`}
        </span>
      </div>

      <WatchTable
        items={filtered}
        quotes={quotes}
        loading={loading}
        busyId={busyId}
        onEdit={(item) => setDialog({ mode: "edit", item })}
        onDelete={remove}
      />

      <LogPanel entries={logs} onClear={() => setLogs([])} />

      {dialog && (
        <WatchDialog
          mode={dialog.mode}
          marketCode={market}
          symbols={symbols}
          initial={dialog.item}
          busy={busyId != null}
          onClose={() => setDialog(null)}
          onSubmit={submit}
        />
      )}
    </div>
  );
}
