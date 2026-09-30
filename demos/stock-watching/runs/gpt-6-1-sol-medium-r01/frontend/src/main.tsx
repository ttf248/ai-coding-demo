import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { request, type Contract, type Draft } from "./api";
import "./style.css";
const markets = [
  ["CN", "A 股", "CNY"],
  ["HK", "港股", "HKD"],
  ["US", "美股", "USD"],
];
function App() {
  const [market, setMarket] = useState("CN"),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState(""),
    [rows, setRows] = useState<Contract[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [revision, setRevision] = useState(0),
    [editing, setEditing] = useState<Contract | null>(null),
    [open, setOpen] = useState(false),
    [deleting, setDeleting] = useState<Contract | null>(null),
    [busy, setBusy] = useState(false),
    [formError, setFormError] = useState(""),
    [draft, setDraft] = useState<Draft>({
      market: "CN",
      symbol: "",
      name: "",
      note: "",
    }),
    [updated, setUpdated] = useState("");
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setRows([]);
    request<{ data: Contract[] }>(
      `/contracts?market=${market}&q=${encodeURIComponent(search)}`,
      "GET",
      undefined,
      controller.signal,
    )
      .then((result) => {
        if (!controller.signal.aborted) {
          setRows(result.data);
          setUpdated(new Date().toLocaleTimeString());
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [market, search, revision]);
  useEffect(() => {
    const t = setInterval(() => {
      if (!open && !deleting) setRevision((r) => r + 1);
    }, 30000);
    return () => clearInterval(t);
  }, [open, deleting]);
  useEffect(() => {
    if (!open && !deleting) return;
    const previous = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const el = dialog.current;
    el?.querySelector<HTMLInputElement>("input,button")?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) {
        setOpen(false);
        setDeleting(null);
      }
      if (e.key === "Tab" && el) {
        const items = Array.from(
          el.querySelectorAll<HTMLElement>(
            "button:not(:disabled),input,select,textarea",
          ),
        );
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [open, deleting, busy]);
  function edit(v?: Contract) {
    setEditing(v || null);
    setDraft(
      v
        ? { market: v.market, symbol: v.symbol, name: v.name, note: v.note }
        : { market, symbol: "", name: "", note: "" },
    );
    setFormError("");
    setOpen(true);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFormError("");
    try {
      await request(
        editing ? `/contracts/${editing.id}` : "/contracts",
        editing ? "PATCH" : "POST",
        {
          ...draft,
          symbol: draft.symbol.trim().toUpperCase(),
          name: draft.name.trim(),
          note: draft.note.trim(),
        },
      );
      setOpen(false);
      setRevision((r) => r + 1);
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setFormError("");
    try {
      await request(`/contracts/${deleting.id}`, "DELETE");
      setDeleting(null);
      setRevision((r) => r + 1);
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href="#">
          ◈ <b>Stockroom</b>
        </a>
        <p className="nav-label">WORKSPACE</p>
        <a className="nav-item active" href="#">
          ▦　自选股
        </a>
        <span className="nav-item muted">◷　行情观察</span>
        <div className="sidebar-bottom">
          <span className="avatar">观</span>
          <div>
            观察者空间<small>本地单用户 demo</small>
          </div>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <p className="eyebrow">YOUR PERSONAL WATCHLIST</p>
            <h1>
              关注市场，保持清晰<span>.</span>
            </h1>
            <p className="subtitle">让每一次观察，都有自己的节奏。</p>
          </div>
          <button className="primary" onClick={() => edit()}>
            ＋ 添加合约
          </button>
        </header>
        <div className="market-tabs">
          {markets.map(([id, label]) => (
            <button
              key={id}
              aria-pressed={market === id}
              className={market === id ? "selected" : ""}
              onClick={() => setMarket(id)}
            >
              {label}
              <span>{id}</span>
            </button>
          ))}
        </div>
        <div className="market-summary">
          <div>
            <span className="dot" />
            模拟行情<p>所有报价均为演示生成，非真实市场数据。</p>
          </div>
          <div>
            <b>{rows.length}</b>
            <span>当前查询合约</span>
          </div>
          <div>
            <b>{updated || "—"}</b>
            <span>最近同步 · 30 秒刷新</span>
          </div>
        </div>
        <section className="list">
          <div className="list-header">
            <h2>
              我的自选{" "}
              <small>{markets.find((m) => m[0] === market)?.[1]}</small>
            </h2>
            <div className="search">
              <input
                aria-label="搜索合约"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索代码或名称"
              />
              <button
                onClick={() => setRevision((r) => r + 1)}
                disabled={loading}
                aria-label="刷新"
              >
                ↻
              </button>
            </div>
          </div>
          {error && (
            <div className="alert" role="alert">
              <div>
                <b>连接异常</b>
                <p>{error}</p>
              </div>
              <button onClick={() => setRevision((r) => r + 1)}>重试</button>
            </div>
          )}
          {loading ? (
            <div className="empty" role="status">
              <span className="spinner" />
              正在同步自选股…
            </div>
          ) : !error && !rows.length ? (
            <div className="empty">
              <span className="empty-icon">◈</span>
              <h3>{search ? "未找到相关合约" : "从一只关注的股票开始"}</h3>
              <p>
                {search
                  ? "换一个关键词，或切换市场。"
                  : "添加合约后，在这里查看和管理模拟行情。"}
              </p>
              <button className="primary" onClick={() => edit()}>
                添加第一只合约
              </button>
            </div>
          ) : (
            !error && (
              <>
                <div className="table-head">
                  <span>合约</span>
                  <span>最新价</span>
                  <span>涨跌幅</span>
                  <span>成交量</span>
                  <span>操作</span>
                </div>
                {rows.map((v) => (
                  <article className="stock-row" key={v.id}>
                    <div className="contract-name">
                      <span className="stock-avatar">{v.name[0]}</span>
                      <div>
                        <b>{v.name}</b>
                        <small>
                          {v.symbol} · {v.market}
                        </small>
                        {v.note && <p>{v.note}</p>}
                      </div>
                    </div>
                    <div className="price">
                      {v.quote.price.toFixed(2)}
                      <small>{v.quote.currency}</small>
                    </div>
                    <div
                      className={`change ${v.quote.change >= 0 ? "up" : "down"}`}
                    >
                      {v.quote.change >= 0 ? "+" : ""}
                      {v.quote.changePercent.toFixed(2)}%
                      <small>
                        {v.quote.change >= 0 ? "+" : ""}
                        {v.quote.change.toFixed(2)}
                      </small>
                    </div>
                    <div className="volume">
                      {v.quote.volume.toLocaleString()}
                      <small>模拟成交量</small>
                    </div>
                    <div className="actions">
                      <button
                        onClick={() => edit(v)}
                        aria-label={`编辑 ${v.name}`}
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => {
                          setDeleting(v);
                          setFormError("");
                        }}
                        aria-label={`删除 ${v.name}`}
                      >
                        删除
                      </button>
                    </div>
                  </article>
                ))}
              </>
            )
          )}
          <footer>
            报价来源：模拟生成　·　{markets.find((m) => m[0] === market)?.[2]}
            　·　每个市场最多显示 500 条查询结果
          </footer>
        </section>
      </main>
      {(open || deleting) && (
        <div
          className="overlay"
          onClick={() => {
            if (!busy) {
              setOpen(false);
              setDeleting(null);
            }
          }}
        >
          <div
            ref={dialog}
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-label={
              deleting ? "删除合约" : editing ? "编辑合约" : "添加合约"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              disabled={busy}
              aria-label="关闭"
              onClick={() => {
                setOpen(false);
                setDeleting(null);
              }}
            >
              ✕
            </button>
            {deleting ? (
              <>
                <h2>移除这只合约？</h2>
                <p className="subtitle">
                  {deleting.name}（{deleting.symbol}）将从自选股中删除。
                </p>
                {formError && (
                  <p role="alert" className="form-error">
                    {formError}
                  </p>
                )}
                <div className="dialog-actions">
                  <button disabled={busy} onClick={() => setDeleting(null)}>
                    取消
                  </button>
                  <button
                    className="danger"
                    disabled={busy}
                    onClick={() => void remove()}
                  >
                    {busy ? "正在删除…" : "确认删除"}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={save}>
                <p className="eyebrow">WATCHLIST / CONTRACT</p>
                <h2>{editing ? "编辑合约" : "添加关注的合约"}</h2>
                <label>
                  市场
                  <select
                    disabled={busy}
                    value={draft.market}
                    onChange={(e) =>
                      setDraft({ ...draft, market: e.target.value })
                    }
                  >
                    {markets.map(([id, label]) => (
                      <option key={id} value={id}>
                        {label} · {id}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  代码
                  <input
                    disabled={busy}
                    required
                    maxLength={24}
                    pattern="[A-Za-z0-9][A-Za-z0-9.\-]{0,23}"
                    value={draft.symbol}
                    onChange={(e) =>
                      setDraft({ ...draft, symbol: e.target.value })
                    }
                    placeholder="600519 / 00700 / AAPL"
                  />
                </label>
                <label>
                  名称
                  <input
                    disabled={busy}
                    required
                    maxLength={80}
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                    placeholder="填写合约名称"
                  />
                </label>
                <label>
                  备注
                  <textarea
                    disabled={busy}
                    maxLength={240}
                    value={draft.note}
                    onChange={(e) =>
                      setDraft({ ...draft, note: e.target.value })
                    }
                    placeholder="写下你关注的原因（可选）"
                  />
                </label>
                {formError && (
                  <p role="alert" className="form-error">
                    {formError}
                  </p>
                )}
                <button className="primary full" disabled={busy}>
                  {busy ? "正在保存…" : "保存合约"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
