import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { api, Contract, ContractInput, isServiceUnavailable, MarketId } from "./api";

const markets: { id: MarketId; label: string; name: string; currency: string; locale: string }[] = [
  { id: "CN", label: "A 股", name: "沪深市场", currency: "CNY", locale: "zh-CN" },
  { id: "HK", label: "港股", name: "香港市场", currency: "HKD", locale: "zh-HK" },
  { id: "US", label: "美股", name: "美国市场", currency: "USD", locale: "en-US" },
];

const marketSymbolHint: Record<MarketId, string> = {
  CN: "例如 600519",
  HK: "例如 00700",
  US: "例如 NVDA",
};

type EditorState = { mode: "create" } | { mode: "edit"; contract: Contract };
type SortKey = "symbol" | "price" | "changePercent" | "volume";

function money(value: number, market: MarketId) {
  const currency = markets.find((item) => item.id === market)?.currency ?? "USD";
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function number(value: number) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value);
}

function compact(value: number) {
  return new Intl.NumberFormat("zh-CN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function marketDate(dateString: string | null) {
  if (!dateString) return "等待数据";
  return new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(dateString));
}

function App() {
  const [activeMarket, setActiveMarket] = useState<MarketId>("CN");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [health, setHealth] = useState<"checking" | "online" | "offline">("checking");
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "symbol", direction: "asc" });
  const loadSequence = useRef(0);
  const searchInput = useRef<HTMLInputElement>(null);
  const selectedMarket = markets.find((item) => item.id === activeMarket)!;

  const checkHealth = useCallback(async () => {
    try {
      await api.health();
      setHealth("online");
    } catch {
      setHealth("offline");
    }
  }, []);

  useEffect(() => {
    void checkHealth();
    const timer = window.setInterval(() => void checkHealth(), 20_000);
    return () => window.clearInterval(timer);
  }, [checkHealth]);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const loadContracts = useCallback(async (market: MarketId, query: string) => {
    const sequence = ++loadSequence.current;
    setBusy(true);
    try {
      const result = await api.listContracts(market, query);
      if (sequence !== loadSequence.current) return;
      setContracts(result.data ?? []);
      setHealth("online");
    } catch (error) {
      if (sequence === loadSequence.current && isServiceUnavailable(error)) setHealth("offline");
    } finally {
      if (sequence === loadSequence.current) setBusy(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadContracts(activeMarket, search), search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [activeMarket, search, loadContracts]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3_200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const sortedContracts = useMemo(() => {
    const sorted = [...contracts].sort((a, b) => {
      const first = a[sort.key];
      const second = b[sort.key];
      const compared = typeof first === "string" && typeof second === "string" ? first.localeCompare(second) : Number(first) - Number(second);
      return sort.direction === "asc" ? compared : -compared;
    });
    return sorted;
  }, [contracts, sort]);

  const risingCount = contracts.filter((contract) => contract.change >= 0).length;
  const averageChange = contracts.length ? contracts.reduce((sum, contract) => sum + contract.changePercent, 0) / contracts.length : 0;
  const newestQuote = contracts.reduce<string | null>((latest, contract) => !latest || contract.updatedAt > latest ? contract.updatedAt : latest, null);

  function toggleSort(key: SortKey) {
    setSort((current) => current.key === key
      ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
      : { key, direction: key === "symbol" ? "asc" : "desc" });
  }

  function sortIndicator(key: SortKey) {
    return sort.key === key ? `sort-indicator ${sort.direction}` : "sort-muted";
  }

  async function refresh() {
    await Promise.all([checkHealth(), loadContracts(activeMarket, search)]);
  }

  async function saveContract(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const formData = new FormData(event.currentTarget);
    const symbol = String(formData.get("symbol") ?? "").trim().toUpperCase();
    const name = String(formData.get("name") ?? "").trim();
    const sector = String(formData.get("sector") ?? "").trim();

    if (!name || name.length > 80) {
      setFormError("名称为必填项，最多 80 个字符。");
      return;
    }
    const validSymbol = activeMarket === "CN"
      ? /^\d{6}$/.test(symbol)
      : activeMarket === "HK"
        ? /^\d{4,5}$/.test(symbol)
        : /^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol);
    if (!validSymbol) {
      setFormError(activeMarket === "CN" ? "A 股代码应为 6 位数字。" : activeMarket === "HK" ? "港股代码应为 4 至 5 位数字。" : "美股代码应为 1 至 10 位字母、数字或 . - 符号。");
      return;
    }
    const input: ContractInput = { market: activeMarket, symbol, name, sector };

    try {
      if (editor?.mode === "edit") {
        await api.updateContract(editor.contract.id, { symbol, name, sector });
        setToast("合约信息已更新");
      } else {
        await api.createContract(input);
        setToast("已加入自选合约");
      }
      setEditor(null);
      await loadContracts(activeMarket, search);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "保存失败，请重试。");
      if (isServiceUnavailable(error)) setHealth("offline");
    }
  }

  async function removeContract(contract: Contract) {
    const confirmed = window.confirm(`从 ${selectedMarket.label} 自选列表删除 ${contract.symbol} ${contract.name}？`);
    if (!confirmed) return;
    try {
      await api.deleteContract(contract.id);
      setToast(`${contract.symbol} 已删除`);
      await loadContracts(activeMarket, search);
    } catch (error) {
      if (isServiceUnavailable(error)) setHealth("offline");
      setToast(error instanceof Error ? error.message : "删除失败，请重试。");
    }
  }

  function openEditor(next: EditorState) {
    setFormError(null);
    setEditor(next);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Northstar 自选股首页">
          <span className="brand-mark"><Activity size={18} strokeWidth={2.5} /></span>
          <span className="brand-copy"><strong>northstar</strong><small>MARKET DESK</small></span>
        </a>
        <div className="topbar-center"><span className="topbar-dot" />个人工作台 <span className="crumb-slash">/</span> 自选列表</div>
        <div className="topbar-right">
          <span className={`connection-pill ${health}`}><span className="connection-dot" />{health === "online" ? "服务已连接" : health === "checking" ? "连接中" : "服务离线"}</span>
          <button className="icon-button refresh-button" onClick={() => void refresh()} aria-label="刷新数据" title="刷新数据"><RefreshCw size={16} className={busy ? "spinning" : ""} /></button>
          <span className="avatar">N</span>
        </div>
      </header>

      <main id="top" className="main-content">
        {health === "offline" && (
          <section className="backend-warning" role="alert">
            <span className="warning-icon"><ShieldAlert size={19} /></span>
            <div><strong>后端服务暂不可用</strong><p>自选数据无法读取或保存。请确认 PostgreSQL 与 Go API 已启动，然后重试连接。</p></div>
            <button className="warning-retry" onClick={() => void refresh()}><RefreshCw size={14} />重新连接</button>
          </section>
        )}

        <section className="page-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" />MARKET OVERVIEW <span className="eyebrow-date">{new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", weekday: "long" }).format(new Date())}</span></div>
            <h1>自选股 <span className="title-count">{contracts.length.toString().padStart(2, "0")}</span></h1>
            <p className="page-subtitle">跨市场追踪你关注的每一份合约。</p>
          </div>
          <button className="primary-button heading-add" onClick={() => openEditor({ mode: "create" })}><Plus size={17} strokeWidth={2.5} />添加合约</button>
        </section>

        <section className="market-panel" aria-label="市场选择">
          <div className="market-tabs" role="tablist" aria-label="选择市场">
            {markets.map((market) => (
                <button key={market.id} role="tab" aria-selected={activeMarket === market.id} className={`market-tab ${activeMarket === market.id ? "active" : ""}`} onClick={() => { if (activeMarket === market.id) return; setActiveMarket(market.id); setContracts([]); setSearch(""); setBusy(true); }}>
                <span className={`market-flag flag-${market.id.toLowerCase()}`}>{market.id === "CN" ? "CN" : market.id}</span>
                <span>{market.label}</span><span className="tab-count">{activeMarket === market.id ? contracts.length : ""}</span>
              </button>
            ))}
          </div>
          <div className="market-panel-right"><Globe2 size={15} /><span>{selectedMarket.name}</span><ChevronDown size={14} /></div>
        </section>

        <section className="overview-grid" aria-label="自选概览">
          <article className="overview-card primary-overview">
            <div className="card-label"><span>当前市场</span><span className="subtle-chip"><span className="live-pulse" />{selectedMarket.label}</span></div>
            <div className="market-name">{selectedMarket.name}<span>{activeMarket === "CN" ? "CN" : activeMarket}</span></div>
            <div className="market-card-footer"><span><Clock3 size={13} /> 演示行情快照</span><span>仅供界面演示</span></div>
            <div className="card-orbit orbit-one" /><div className="card-orbit orbit-two" />
          </article>
          <article className="overview-card">
            <div className="card-label">自选合约 <BarChart3 size={15} /></div>
            <div className="stat-number">{contracts.length}<small> 只</small></div>
            <div className="stat-caption">{busy ? "正在同步列表" : `当前 ${selectedMarket.label} 列表`}</div>
          </article>
          <article className="overview-card">
            <div className="card-label">上涨合约 <TrendingUp size={15} /></div>
            <div className="stat-number">{risingCount}<small> / {contracts.length}</small></div>
            <div className="stat-caption">按当日演示涨跌计算</div>
          </article>
          <article className="overview-card change-overview">
            <div className="card-label">平均日涨跌 <Activity size={15} /></div>
            <div className={`stat-number ${averageChange >= 0 ? "positive-text" : "negative-text"}`}>{averageChange >= 0 ? "+" : ""}{averageChange.toFixed(2)}<small>%</small></div>
            <div className="stat-caption">等权平均 · 非投资组合收益</div>
          </article>
        </section>

        <section className="watchlist-section">
          <div className="list-heading">
            <div className="list-title-group"><h2>关注列表</h2><span className="record-count">{contracts.length} 个结果</span></div>
            <div className="list-actions">
              <label className="search-box"><Search size={16} /><input ref={searchInput} aria-label="搜索代码、名称或行业" maxLength={80} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索代码、名称或行业" /><kbd>Ctrl K</kbd>{search && <button className="clear-search" onClick={() => setSearch("")} aria-label="清除搜索"><X size={14} /></button>}</label>
              <button className="filter-button" onClick={() => void refresh()} title="重新加载"><RefreshCw size={15} /><span>更新</span></button>
              <button className="primary-button compact-add" onClick={() => openEditor({ mode: "create" })}><Plus size={16} /><span>添加</span></button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="watchlist-table">
              <thead><tr>
                <th><button className="sort-button" onClick={() => toggleSort("symbol")}>合约 <span className="th-secondary">/ 名称</span><ChevronDown size={12} className={sortIndicator("symbol")} /></button></th>
                <th>市场</th>
                <th className="align-right"><button className="sort-button" onClick={() => toggleSort("price")}>最新价<ChevronDown size={12} className={sortIndicator("price")} /></button></th>
                <th className="align-right"><button className="sort-button" onClick={() => toggleSort("changePercent")}>日涨跌<ChevronDown size={12} className={sortIndicator("changePercent")} /></button></th>
                <th className="align-right volume-column"><button className="sort-button" onClick={() => toggleSort("volume")}>成交量<ChevronDown size={12} className={sortIndicator("volume")} /></button></th>
                <th>最近更新</th>
                <th className="actions-head">操作</th>
              </tr></thead>
              <tbody>
                {sortedContracts.map((contract) => (
                  <tr key={contract.id}>
                    <td><div className="contract-cell"><span className={`ticker-avatar ticker-${contract.market.toLowerCase()}`}>{contract.symbol.slice(0, 2)}</span><div className="contract-copy"><strong>{contract.symbol}</strong><span>{contract.name}{contract.sector ? ` · ${contract.sector}` : ""}</span></div></div></td>
                    <td><span className="exchange-label"><span className={`market-mini market-${contract.market.toLowerCase()}`} />{contract.exchange}</span></td>
                    <td className="align-right price-cell">{money(contract.price, contract.market)}</td>
                    <td className="align-right"><span className={`change-value ${contract.change >= 0 ? "positive" : "negative"}`}>{contract.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{contract.change >= 0 ? "+" : ""}{number(contract.change)} <span>({contract.changePercent >= 0 ? "+" : ""}{contract.changePercent.toFixed(2)}%)</span></span></td>
                    <td className="align-right volume-column"><span className="volume-value">{compact(contract.volume)}</span><span className="volume-unit">股</span></td>
                    <td><span className="updated-cell"><span className="updated-dot" />{marketDate(contract.updatedAt)}</span></td>
                    <td><div className="row-actions"><button className="row-action" aria-label={`编辑 ${contract.symbol}`} title="编辑" onClick={() => openEditor({ mode: "edit", contract })}><Pencil size={15} /></button><button className="row-action delete-action" aria-label={`删除 ${contract.symbol}`} title="删除" onClick={() => void removeContract(contract)}><Trash2 size={15} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {busy && contracts.length === 0 && <div className="empty-state"><LoaderCircle className="spinning" size={25} /><strong>正在连接自选服务</strong><span>正在读取 {selectedMarket.label} 合约列表…</span></div>}
            {!busy && contracts.length === 0 && <div className="empty-state"><span className="empty-icon"><BarChart3 size={22} /></span><strong>{search ? "没有找到匹配的合约" : "这片列表还很安静"}</strong><span>{search ? "调整搜索词，或试试合约代码。" : `添加第一只 ${selectedMarket.label} 合约，开始整理你的关注列表。`}</span>{!search && health === "online" && <button className="text-button" onClick={() => openEditor({ mode: "create" })}><Plus size={15} />添加第一只合约</button>}</div>}
          </div>
          <div className="table-footer"><span><span className="footer-live-dot" />{busy ? "正在同步" : "列表已同步"}</span><span>最后行情更新时间：{marketDate(newestQuote)}</span><span className="footer-note">行情数据为演示快照</span></div>
        </section>

        <footer className="app-footer"><span>© 2026 NORTHSTAR MARKET DESK</span><span><span className={`footer-connection ${health}`} />{health === "online" ? "API 正常" : health === "checking" ? "正在检查 API" : "API 不可用"}</span></footer>
      </main>

      {editor && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditor(null); }}>
        <section className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
          <div className="modal-heading"><div><span className="modal-kicker">CONTRACT MANAGER</span><h2 id="editor-title">{editor.mode === "edit" ? "编辑合约" : "添加至自选"}</h2><p>{editor.mode === "edit" ? "更新这份合约的识别信息。" : `在${selectedMarket.name}创建一份自选合约。`}</p></div><button className="icon-button modal-close" onClick={() => setEditor(null)} aria-label="关闭"><X size={18} /></button></div>
          <form onSubmit={(event) => void saveContract(event)}>
            {editor.mode === "create" && <div className="form-field"><label htmlFor="market-name">所属市场</label><div className="market-readonly" id="market-name"><span className={`market-flag flag-${activeMarket.toLowerCase()}`}>{activeMarket}</span>{selectedMarket.label}<span className="readonly-note">可从顶部切换市场</span></div></div>}
            <div className="form-grid"><div className="form-field"><label htmlFor="contract-symbol">合约代码 <span>*</span></label><input id="contract-symbol" name="symbol" defaultValue={editor.mode === "edit" ? editor.contract.symbol : ""} placeholder={marketSymbolHint[activeMarket]} maxLength={10} required autoFocus /></div><div className="form-field"><label htmlFor="contract-name">合约名称 <span>*</span></label><input id="contract-name" name="name" defaultValue={editor.mode === "edit" ? editor.contract.name : ""} placeholder="输入公司或合约名称" maxLength={80} required /></div></div>
            <div className="form-field"><label htmlFor="contract-sector">行业 / 分类 <small>选填</small></label><input id="contract-sector" name="sector" defaultValue={editor.mode === "edit" ? editor.contract.sector : ""} placeholder="例如：半导体、消费品" maxLength={50} /></div>
            {formError && <div className="form-error" role="alert"><ShieldAlert size={15} />{formError}</div>}
            <div className="form-hint"><span className="hint-dot" />{activeMarket === "CN" ? "A 股使用 6 位数字代码" : activeMarket === "HK" ? "港股使用 4–5 位数字代码" : "美股代码支持字母、数字、点号与连字符"}</div>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setEditor(null)}>取消</button><button type="submit" className="primary-button" disabled={health !== "online"}>{health !== "online" ? <><ShieldAlert size={15} />服务未连接</> : <><Check size={16} />{editor.mode === "edit" ? "保存修改" : "加入自选"}</>}</button></div>
          </form>
        </section>
      </div>}

      {toast && <div className="toast-message" role="status"><Check size={16} />{toast}<button onClick={() => setToast(null)} aria-label="关闭提示"><X size={14} /></button></div>}
      <span className="sr-only">{busy ? "正在加载自选合约" : ""}</span>
    </div>
  );
}

export default App;
