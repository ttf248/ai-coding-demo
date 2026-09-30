import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  LayoutDashboard,
  Star,
  Activity,
  Settings,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Trash2,
  Pencil,
  AlertTriangle,
  X,
  Check,
  LoaderCircle,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  request,
  ApiError,
  localRead,
  localSave,
  localItem,
  marketInfo,
  type Item,
  type Input,
  type Market,
} from "./api";
function Sparkline({ item, large = false }: { item: Item; large?: boolean }) {
  const data = item.quote.series,
    min = Math.min(...data),
    range = Math.max(...data) - min || 1;
  const path = data
    .map(
      (n, i) =>
        `${i ? "L" : "M"}${(i / (data.length - 1)) * 160},${48 - ((n - min) / range) * 40}`,
    )
    .join(" ");
  return (
    <svg
      className={large ? "large-chart" : "sparkline"}
      viewBox="0 0 160 52"
      preserveAspectRatio="none"
      role="img"
      aria-label={`${item.name} 模拟行情走势`}
    >
      <path
        d={`${path}L160,52L0,52Z`}
        fill={item.quote.change >= 0 ? "#ef444416" : "#17a27b16"}
      />
      <path
        d={path}
        fill="none"
        stroke={item.quote.change >= 0 ? "#e75d64" : "#18a67c"}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
function ContractForm({
  item,
  onClose,
  onSave,
  busy,
}: {
  item: Item | null;
  onClose: () => void;
  onSave: (input: Input) => Promise<void>;
  busy: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    [market, setMarket] = useState<Market>(item?.market || "CN"),
    [error, setError] = useState("");
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget),
      body: Input = {
        market,
        symbol: String(form.get("symbol")).trim().toUpperCase(),
        name: String(form.get("name")).trim(),
        notes: String(form.get("notes")).trim(),
      };
    if (!marketInfo[market].pattern.test(body.symbol) || !body.name) {
      setError("请填写正确的合约代码与名称");
      return;
    }
    try {
      setError("");
      await onSave(body);
    } catch (err) {
      setError((err as Error).message);
    }
  }
  return (
    <dialog
      ref={ref}
      aria-label={item ? "编辑合约" : "新增合约"}
      onCancel={() => {
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <form onSubmit={submit}>
        <div className="dialog-heading">
          <h2>{item ? "编辑合约" : "添加到我的自选"}</h2>
          <button
            type="button"
            disabled={busy}
            aria-label="关闭"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <p className="muted">用合约代码找到你想关注的下一种可能。</p>
        <label>
          所属市场
          <select
            value={market}
            onChange={(e) => setMarket(e.target.value as Market)}
            disabled={busy}
          >
            {Object.entries(marketInfo).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          合约代码
          <input
            name="symbol"
            aria-label="合约代码"
            defaultValue={item?.symbol}
            placeholder={marketInfo[market].hint}
            maxLength={16}
            required
            disabled={busy}
          />
        </label>
        <label>
          合约名称
          <input
            name="name"
            aria-label="合约名称"
            defaultValue={item?.name}
            placeholder="例如：贵州茅台"
            maxLength={64}
            required
            disabled={busy}
          />
        </label>
        <label>
          备注
          <textarea
            name="notes"
            aria-label="备注"
            defaultValue={item?.notes}
            rows={3}
            placeholder="写下关注它的理由…"
            maxLength={200}
            disabled={busy}
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={onClose}
          >
            取消
          </button>
          <button className="primary" disabled={busy}>
            {busy ? (
              <LoaderCircle size={16} className="spin" />
            ) : (
              <Check size={16} />
            )}
            保存合约
          </button>
        </div>
      </form>
    </dialog>
  );
}
export default function App() {
  const [items, setItems] = useState<Item[]>([]),
    [market, setMarket] = useState<Market | "ALL">("ALL"),
    [query, setQuery] = useState(""),
    [loading, setLoading] = useState(true),
    [offline, setOffline] = useState(""),
    [demo, setDemo] = useState(false),
    [form, setForm] = useState<{ item: Item | null } | null>(null),
    [busy, setBusy] = useState(false),
    [sort, setSort] = useState("default"),
    [selected, setSelected] = useState<Item | null>(null),
    [toast, setToast] = useState(""),
    [pendingDelete, setPendingDelete] = useState<Item | null>(null);
  const loadToken = useRef(0),
    demoRef = useRef(demo);
  demoRef.current = demo;
  async function load() {
    const token = ++loadToken.current;
    setLoading(true);
    try {
      const response = await request<{ items: Item[] }>("/watchlist");
      if (token !== loadToken.current || demoRef.current) return;
      setItems(response.items);
      setSelected(
        (s) =>
          response.items.find((i) => i.id === s?.id) ||
          response.items[0] ||
          null,
      );
      setOffline("");
    } catch (e) {
      if (token === loadToken.current && !demoRef.current)
        setOffline((e as Error).message);
    } finally {
      if (token === loadToken.current) setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(id);
  }, [toast]);
  function update(next: Item[]) {
    setItems(next);
    if (demo) localSave(next);
    setSelected((s) => next.find((i) => i.id === s?.id) || next[0] || null);
  }
  function enterDemo() {
    loadToken.current++;
    demoRef.current = true;
    setDemo(true);
    setLoading(false);
    const data = localRead();
    setItems(data);
    setSelected(data[0] || null);
    setToast("已切换至本地演示，操作不会写入后端");
  }
  async function save(body: Input) {
    setBusy(true);
    try {
      if (
        items.some(
          (i) =>
            i.market === body.market &&
            i.symbol === body.symbol &&
            i.id !== form?.item?.id,
        )
      )
        throw new ApiError("同一市场已存在此合约", 409);
      let result: Item;
      if (demo)
        result = localItem(
          body,
          form?.item?.id || Math.max(0, ...items.map((i) => i.id)) + 1,
        );
      else
        result = await request<Item>(
          "/watchlist" + (form?.item ? "/" + form.item.id : ""),
          form?.item ? "PUT" : "POST",
          body,
        );
      update(
        form?.item
          ? items.map((i) => (i.id === result.id ? result : i))
          : [result, ...items],
      );
      setForm(null);
      setToast("自选合约已保存");
      if (!demo) setOffline("");
    } catch (e) {
      if (e instanceof ApiError && (e.status === 0 || e.status === 503))
        setOffline(e.message);
      throw e;
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      if (!demo) await request("/watchlist/" + pendingDelete.id, "DELETE");
      update(items.filter((i) => i.id !== pendingDelete.id));
      setPendingDelete(null);
      setToast("已从自选中移除");
    } catch (e) {
      setOffline((e as Error).message);
      setToast("删除未成功，合约仍保留");
    } finally {
      setBusy(false);
    }
  }
  const visible = useMemo(() => {
    let data = items.filter(
      (i) =>
        (market === "ALL" || i.market === market) &&
        `${i.symbol} ${i.name} ${i.notes}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
    if (sort === "change")
      data.sort((a, b) => b.quote.changePercent - a.quote.changePercent);
    if (sort === "name")
      data.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
    return data;
  }, [items, market, query, sort]);
  const active =
    (selected && visible.find((i) => i.id === selected.id)) || visible[0];
  const rising = visible.filter((i) => i.quote.change >= 0).length;
  return (
    <div className="app">
      <aside className="sidebar">
        <a className="logo" href="./">
          <span>
            <ChartNoAxesCombined size={23} />
          </span>
          <b>
            行情台<small>WATCHDESK</small>
          </b>
        </a>
        <p className="nav-title">工作空间</p>
        <nav>
          <button onClick={() => setToast("总览已显示在当前工作台")}>
            <LayoutDashboard size={18} />
            市场总览
          </button>
          <button
            className="active"
            onClick={() => {
              setQuery("");
              setMarket("ALL");
            }}
          >
            <Star size={18} />
            我的自选<span>{items.length}</span>
          </button>
          <button
            onClick={() => setToast("价格提醒为后续扩展，当前提供自选 CRUD")}
          >
            <Activity size={18} />
            价格提醒
          </button>
        </nav>
        <div className="sidebar-footer">
          <span className="avatar">满</span>
          <span>
            小满<small>个人观察工作台</small>
          </span>
          <Settings size={17} />
        </div>
      </aside>
      <div className="workspace">
        <header>
          <div className="breadcrumb">
            工作空间 <span>/</span> <b>我的自选</b>
          </div>
          <div className="connection">
            <i className={demo ? "demo" : offline ? "offline" : "online"}></i>
            {demo ? "本地演示" : offline ? "服务离线" : "API 连接"}
            <span className="quote-badge">模拟行情</span>
          </div>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <p className="eyebrow">YOUR PERSONAL WATCHLIST</p>
              <h1>
                我的自选<span>。</span>
              </h1>
              <p className="subtitle">让关注更有条理，让每一次观察都有记录。</p>
            </div>
            <div className="heading-actions">
              {demo ? (
                <button
                  className="secondary"
                  onClick={() => {
                    setDemo(false);
                    demoRef.current = false;
                    setItems([]);
                    void load();
                  }}
                >
                  连接后端
                </button>
              ) : (
                <button className="secondary" onClick={enterDemo}>
                  体验本地演示
                </button>
              )}
              <button
                className="primary"
                onClick={() => setForm({ item: null })}
              >
                <Plus size={16} />
                添加合约
              </button>
            </div>
          </div>
          {offline && !demo && (
            <div className="alert" role="alert">
              <AlertTriangle size={18} />
              <div>
                <strong>后端服务不可用</strong>
                <p>{offline}。当前列表可能不是最新数据。</p>
              </div>
              <button onClick={() => void load()} disabled={loading}>
                重试连接
              </button>
            </div>
          )}
          {demo && (
            <div className="demo-banner">
              当前是本地演示。CRUD 保存在浏览器，与 PostgreSQL
              数据分开；全部价格均为模拟值。
            </div>
          )}
          <div className="summary-grid">
            <div className="summary">
              <span>关注的合约</span>
              <b>
                {visible.length}
                <small> 个</small>
              </b>
              <p>横跨 {new Set(visible.map((i) => i.market)).size} 个市场</p>
            </div>
            <div className="summary">
              <span>模拟上涨</span>
              <b className="up">
                {rising}
                <small> 个</small>
              </b>
              <p>仅演示界面中的价格变化</p>
            </div>
            <div className="summary">
              <span>模拟下跌</span>
              <b className="down">
                {visible.length - rising}
                <small> 个</small>
              </b>
              <p>不提供实时行情与交易能力</p>
            </div>
          </div>
          <div className="content-grid">
            <section className="watchlist">
              <div className="list-toolbar">
                <div className="market-tabs">
                  {(["ALL", "CN", "HK", "US"] as const).map((m) => (
                    <button
                      key={m}
                      aria-pressed={market === m}
                      className={market === m ? "selected" : ""}
                      onClick={() => setMarket(m)}
                    >
                      {m === "ALL" ? "全部市场" : marketInfo[m].name}
                    </button>
                  ))}
                </div>
                <div className="search-controls">
                  <label className="search">
                    <Search size={16} />
                    <input
                      aria-label="搜索合约"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="搜索代码 / 名称"
                      maxLength={64}
                    />
                    {query && (
                      <button
                        aria-label="清空搜索"
                        onClick={() => setQuery("")}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </label>
                  <select
                    aria-label="排序"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="default">默认排序</option>
                    <option value="change">涨幅排序</option>
                    <option value="name">名称排序</option>
                  </select>
                  <button
                    aria-label="刷新行情"
                    disabled={loading}
                    className="refresh"
                    onClick={() => {
                      if (demo) {
                        setToast("模拟数据已刷新");
                      } else void load();
                    }}
                  >
                    <RefreshCw size={16} className={loading ? "spin" : ""} />
                  </button>
                </div>
              </div>
              <div className="table-header">
                <span>合约 / 市场</span>
                <span>最新价</span>
                <span>涨跌幅</span>
                <span>模拟走势</span>
                <span>操作</span>
              </div>
              {loading && (
                <div className="loading" role="status">
                  <LoaderCircle size={22} className="spin" />
                  正在读取自选列表
                </div>
              )}
              {!loading &&
                visible.map((i) => (
                  <article
                    className={`contract ${active?.id === i.id ? "focused" : ""}`}
                    key={i.id}
                  >
                    <button
                      className="contract-title"
                      onClick={() => setSelected(i)}
                    >
                      <span className="contract-avatar">{i.name[0]}</span>
                      <span>
                        <b>{i.name}</b>
                        <small>
                          {i.symbol} <i>{marketInfo[i.market].name}</i>
                        </small>
                      </span>
                    </button>
                    <div className="price">
                      <b>{i.quote.price.toFixed(2)}</b>
                      <small>{i.quote.currency}</small>
                    </div>
                    <div
                      className={
                        i.quote.change >= 0 ? "change up" : "change down"
                      }
                    >
                      <b>
                        {i.quote.change >= 0 ? "+" : ""}
                        {i.quote.changePercent.toFixed(2)}%
                      </b>
                      <small>
                        {i.quote.change >= 0 ? "+" : ""}
                        {i.quote.change.toFixed(2)}
                      </small>
                    </div>
                    <Sparkline item={i} />
                    <div className="row-actions">
                      <button
                        aria-label={`编辑${i.name}`}
                        onClick={() => setForm({ item: i })}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        aria-label={`删除${i.name}`}
                        onClick={() => setPendingDelete(i)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              {!loading && !visible.length && (
                <div className="empty">
                  <Star size={30} />
                  <h3>{query ? "没有找到相关合约" : "你的关注，从这里开始"}</h3>
                  <p>
                    {query
                      ? "试试其他名称或代码。"
                      : "添加第一个合约，建立自己的观察清单。"}
                  </p>
                  <button
                    className="primary"
                    onClick={() => setForm({ item: null })}
                  >
                    <Plus size={16} />
                    添加合约
                  </button>
                </div>
              )}
              <footer>
                {visible.length} 个自选合约{" "}
                <span>报价来源：Mock · 演示数据</span>
              </footer>
            </section>
            <aside className="detail-panel">
              {active ? (
                <>
                  <div className="detail-heading">
                    <span className="market-label">
                      {marketInfo[active.market].name}
                    </span>
                    <ChevronDown size={16} />
                  </div>
                  <h2>{active.name}</h2>
                  <p className="detail-symbol">
                    {active.symbol} · {active.quote.currency}
                  </p>
                  <div className="detail-price">
                    <b>{active.quote.price.toFixed(2)}</b>
                    <span className={active.quote.change >= 0 ? "up" : "down"}>
                      {active.quote.change >= 0 ? (
                        <ArrowUpRight size={17} />
                      ) : (
                        <ArrowDownRight size={17} />
                      )}{" "}
                      {active.quote.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <p className="muted">价格为模拟值，与真实市场无关</p>
                  <Sparkline item={active} large />
                  <div className="detail-data">
                    <span>
                      演示成交量
                      <b>{(active.quote.volume / 10000).toFixed(1)} 万</b>
                    </span>
                    <span>
                      数据生成时间
                      <b>
                        {new Date(active.quote.asOf).toLocaleTimeString(
                          "zh-CN",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </b>
                    </span>
                  </div>
                  <div className="note">
                    <p>我的关注备注</p>
                    <span>
                      {active.notes || "还没有备注，写下关注它的理由吧。"}
                    </span>
                    <button onClick={() => setForm({ item: active })}>
                      <Pencil size={13} />
                      编辑备注
                    </button>
                  </div>
                </>
              ) : (
                <div className="detail-placeholder">
                  <ChartNoAxesCombined size={32} />
                  <p>选择一个合约，查看详情</p>
                </div>
              )}
              <p className="detail-footnote">
                这是本地全栈开发示例。
                <br />
                无真实行情接口、账户权限或交易服务。
              </p>
            </aside>
          </div>
          <p className="page-footnote">
            React + Gin + GORM + PostgreSQL ·
            查看浏览器控制台与后端终端获取通讯日志
          </p>
        </main>
      </div>
      {form && (
        <ContractForm
          item={form.item}
          onClose={() => setForm(null)}
          onSave={save}
          busy={busy}
        />
      )}{" "}
      {pendingDelete && (
        <div className="confirm-overlay" role="presentation">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="confirm"
          >
            <h2 id="delete-title">移除 {pendingDelete.name}？</h2>
            <p>仅从自选清单移除，可随时重新添加。</p>
            <div className="dialog-actions">
              <button
                className="secondary"
                onClick={() => setPendingDelete(null)}
                disabled={busy}
              >
                取消
              </button>
              <button
                className="danger"
                onClick={() => void remove()}
                disabled={busy}
              >
                {busy ? "正在移除…" : "确认移除"}
              </button>
            </div>
          </section>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
