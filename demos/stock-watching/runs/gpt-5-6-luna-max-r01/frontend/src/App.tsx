import { useCallback, useEffect, useMemo, useState } from "react";
import type { Market, Stock, StockDraft } from "./types";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const labels: Record<Market, string> = { CN: "A 股", HK: "港股", US: "美股" };
const initialDraft: StockDraft = { code: "", name: "", market: "CN", price: 0, change: 0, changePercent: 0, volume: 0 };
const fallback: Stock[] = [
  { id: "CN-600519", code: "600519", name: "贵州茅台", market: "CN", price: 1482.6, change: 12.4, changePercent: 0.84, volume: 183200 },
  { id: "CN-300750", code: "300750", name: "宁德时代", market: "CN", price: 214.18, change: -2.22, changePercent: -1.03, volume: 492800 },
  { id: "HK-00700", code: "00700", name: "腾讯控股", market: "HK", price: 482.4, change: 5.8, changePercent: 1.22, volume: 672100 },
  { id: "US-AAPL", code: "AAPL", name: "Apple", market: "US", price: 228.87, change: 1.14, changePercent: 0.5, volume: 1200400 },
];

function Icon({ name }: { name: "search" | "plus" | "edit" | "trash" | "refresh" | "close" | "terminal" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    edit: <><path d="m4 20 4.2-1 9.8-9.8-3.2-3.2L5 15.8Z" /><path d="m13.8 6.2 3.2 3.2" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v5M14 11v5" /><path d="m6 7 1 13h10l1-13M9 7V4h6v3" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.7-4L4 9" /><path d="M4 4v5h5" /><path d="M4 13a8 8 0 0 0 14.7 4L20 15" /><path d="v20h-5" /></>,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    terminal: <><path d="m4 17 6-5-6-5" /><path d="M12 19h8" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function App() {
  const [stocks, setStocks] = useState<Stock[]>(fallback);
  const [market, setMarket] = useState<Market>("CN");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Stock | null>(null);
  const [draft, setDraft] = useState<StockDraft>(initialDraft);
  const [dialog, setDialog] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [logs, setLogs] = useState<string[]>(["[ready] API client initialized", "[fallback] showing local sample until API responds"]);

  const log = useCallback((line: string) => setLogs((current) => [`${new Date().toLocaleTimeString()} ${line}`, ...current].slice(0, 8)), []);
  const request = useCallback(async (path: string, options?: RequestInit) => {
    const url = `${API}${path}`;
    log(`[request] ${options?.method || "GET"} ${path}`);
    const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options?.headers || {}) } });
    const body = await response.json().catch(() => ({}));
    log(`[response] ${response.status} ${path}`);
    if (!response.ok) throw new Error(body.error?.message || "API request failed");
    return body;
  }, [log]);
  const load = useCallback(async () => {
    try { const body = await request(`/stocks?market=${market}${query ? `&q=${encodeURIComponent(query)}` : ""}`); setStocks(body.data); setNotice(null); }
    catch (error) { setNotice({ kind: "error", text: `API 不可用：${error instanceof Error ? error.message : "请检查后端"}` }); }
  }, [market, query, request]);
  useEffect(() => { const timer = window.setTimeout(load, 220); return () => window.clearTimeout(timer); }, [load]);
  const visible = useMemo(() => stocks.filter((stock) => stock.market === market && `${stock.code}${stock.name}`.toLowerCase().includes(query.toLowerCase())), [market, query, stocks]);
  const gain = visible.filter((stock) => stock.change >= 0).length;

  function openCreate() { setEditing(null); setDraft({ ...initialDraft, market }); setDialog(true); }
  function openEdit(stock: Stock) { setEditing(stock); setDraft({ code: stock.code, name: stock.name, market: stock.market, price: stock.price, change: stock.change, changePercent: stock.changePercent, volume: stock.volume }); setDialog(true); }
  async function save() { try { const body = JSON.stringify(draft); const result = editing ? await request(`/stocks/${editing.id}`, { method: "PUT", body }) : await request("/stocks", { method: "POST", body }); setStocks((current) => editing ? current.map((stock) => stock.id === editing.id ? result.data : stock) : [...current, result.data]); setDialog(false); setNotice({ kind: "ok", text: editing ? "已更新自选股" : "已加入自选股" }); } catch (error) { setNotice({ kind: "error", text: error instanceof Error ? error.message : "保存失败" }); } }
  async function remove(id: string) { try { await request(`/stocks/${id}`, { method: "DELETE" }); setStocks((current) => current.filter((stock) => stock.id !== id)); setSelected((current) => current.filter((value) => value !== id)); setNotice({ kind: "ok", text: "已删除" }); } catch (error) { setNotice({ kind: "error", text: error instanceof Error ? error.message : "删除失败" }); } }
  async function removeSelected() { if (!selected.length) return; try { await request("/stocks", { method: "DELETE", body: JSON.stringify({ ids: selected }) }); setStocks((current) => current.filter((stock) => !selected.includes(stock.id))); setSelected([]); setNotice({ kind: "ok", text: `已删除 ${selected.length} 项` }); } catch (error) { setNotice({ kind: "error", text: error instanceof Error ? error.message : "批量删除失败" }); } }
  function updateDraft(key: keyof StockDraft, value: string) { setDraft((current) => ({ ...current, [key]: ["price", "change", "changePercent", "volume"].includes(key) ? Number(value) : value })); }

  return <div className="app"><header className="top"><div className="brand"><span className="brand-mark">↗</span><div><p>MARKET NOTE / 02</p><h1>自选股<span>.</span></h1></div></div><div className="top-meta"><span><i></i> LIVE DATA</span><button onClick={load} aria-label="刷新"><Icon name="refresh" /></button></div></header>
    {notice && <div className={`notice ${notice.kind}`}><span>{notice.kind === "ok" ? "✓" : "!"}</span>{notice.text}<button onClick={() => setNotice(null)}><Icon name="close" /></button></div>}
    <main className="content"><section className="intro"><div><p className="eyebrow">PERSONAL MARKET BOARD</p><h2>关注值得<br /><em>等待的变化。</em></h2></div><div className="summary"><div><b>{visible.length}</b><span>关注标的</span></div><div><b>{gain}</b><span>上涨中</span></div><div><b>¥ 12.8k</b><span>组合估值</span></div></div></section>
      <section className="board"><div className="board-head"><div className="markets">{(Object.keys(labels) as Market[]).map((item) => <button key={item} className={market === item ? "active" : ""} onClick={() => { setMarket(item); setSelected([]); }}>{labels[item]} <small>{item}</small></button>)}</div><div className="actions"><label className="search"><Icon name="search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索代码或名称" /></label><button className="add" onClick={openCreate}><Icon name="plus" />新增</button></div></div>
        <div className="table-tools"><span>{selected.length ? `已选择 ${selected.length} 项` : `今日 · ${new Date().toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })}`}</span>{selected.length > 0 && <button onClick={removeSelected}><Icon name="trash" />批量删除</button>}<button className="logs-toggle" onClick={() => document.querySelector(".debug")?.classList.toggle("open")}><Icon name="terminal" />通信日志</button></div>
        <div className="table-wrap"><table><thead><tr><th><input type="checkbox" checked={visible.length > 0 && selected.length === visible.length} onChange={(event) => setSelected(event.target.checked ? visible.map((stock) => stock.id) : [])} /></th><th>标的</th><th>最新价</th><th>日涨跌</th><th>成交量</th><th>状态</th><th></th></tr></thead><tbody>{visible.map((stock) => <tr key={stock.id}><td><input type="checkbox" checked={selected.includes(stock.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, stock.id] : current.filter((id) => id !== stock.id))} /></td><td><div className="stock-name"><span className={`market-dot ${stock.market.toLowerCase()}`}>{stock.market}</span><div><b>{stock.name}</b><small>{stock.code}</small></div></div></td><td><strong>{stock.price.toFixed(2)}</strong></td><td className={stock.change >= 0 ? "up" : "down"}><b>{stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}</b><small>{stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%</small></td><td className="volume">{(stock.volume / 10000).toFixed(1)} 万</td><td><span className={`trend ${stock.change >= 0 ? "positive" : "negative"}`}>{stock.change >= 0 ? "↑ 活跃" : "↓ 回撤"}</span></td><td><div className="row-actions"><button onClick={() => openEdit(stock)} aria-label="编辑"><Icon name="edit" /></button><button onClick={() => remove(stock.id)} aria-label="删除"><Icon name="trash" /></button></div></td></tr>)}</tbody></table>{visible.length === 0 && <div className="empty"><b>没有找到标的</b><span>换个市场或关键词试试</span></div>}</div></section>
      <section className="below"><div><p className="eyebrow">DATA CONTRACT</p><p>行情数据仅用于原型展示。后端不可用时保留本地样例，并在页面上明确告警；不会把样例误标成实时行情。</p></div><span className="timestamp">LAST CHECK · {new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</span></section>
    </main>
    <aside className="debug"><div><b>COMMUNICATION LOG</b><button onClick={() => document.querySelector(".debug")?.classList.remove("open")}><Icon name="close" /></button></div><pre>{logs.join("\n")}</pre></aside>
    {dialog && <div className="backdrop"><form className="dialog" onSubmit={(event) => { event.preventDefault(); save(); }}><div className="dialog-head"><div><p className="eyebrow">{editing ? "EDIT SYMBOL" : "ADD SYMBOL"}</p><h3>{editing ? "编辑自选股" : "新增自选股"}</h3></div><button type="button" onClick={() => setDialog(false)}><Icon name="close" /></button></div><div className="fields"><label>代码<input required value={draft.code} onChange={(event) => updateDraft("code", event.target.value)} /></label><label>名称<input required value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} /></label><label>市场<select value={draft.market} onChange={(event) => updateDraft("market", event.target.value)}>{(Object.keys(labels) as Market[]).map((item) => <option key={item} value={item}>{labels[item]}</option>)}</select></label><label>最新价<input type="number" min="0" step=".01" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} /></label><label>涨跌<input type="number" step=".01" value={draft.change} onChange={(event) => updateDraft("change", event.target.value)} /></label><label>涨跌幅 %<input type="number" step=".01" value={draft.changePercent} onChange={(event) => updateDraft("changePercent", event.target.value)} /></label><label>成交量<input type="number" min="0" value={draft.volume} onChange={(event) => updateDraft("volume", event.target.value)} /></label></div><button className="save" type="submit">{editing ? "保存修改" : "加入自选"}<span>↗</span></button></form></div>}
  </div>;
}
