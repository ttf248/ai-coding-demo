import { useEffect, useState, useCallback } from "react";
import { bindToast } from "./api/client";
import {
  fetchMarkets,
  fetchStocks,
  fetchWatchlist,
  fetchQuote,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  type Market,
  type Stock,
  type Watchlist,
  type Quote,
} from "./api/stocks";

const DEMO_USER_ID = 1;

type Toast = { id: number; message: string; level: "info" | "error" };

export default function App() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  const [quotes, setQuotes] = useState<Record<number, Quote>>({});
  const [activeMarket, setActiveMarket] = useState<string>("");
  const [editing, setEditing] = useState<Watchlist | null>(null);
  const [adding, setAdding] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback(
    (message: string, level: "info" | "error") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, level }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3500);
    },
    [],
  );

  useEffect(() => {
    bindToast(pushToast);
  }, [pushToast]);

  useEffect(() => {
    fetchMarkets().then(setMarkets).catch(() => setMarkets([]));
  }, []);

  useEffect(() => {
    fetchStocks(activeMarket || undefined).then(setStocks).catch(() => setStocks([]));
  }, [activeMarket]);

  const reloadWatchlist = useCallback(async () => {
    try {
      const list = await fetchWatchlist(DEMO_USER_ID);
      setWatchlist(list);
      const entries = await Promise.all(
        list.map((w) => fetchQuote(w.stock!.code).catch(() => null)),
      );
      const next: Record<number, Quote> = {};
      list.forEach((w, i) => {
        if (entries[i]) next[w.stock_id] = entries[i] as Quote;
      });
      setQuotes(next);
    } catch {
      // 错误已由拦截器处理
    }
  }, []);

  useEffect(() => {
    reloadWatchlist();
    const id = setInterval(reloadWatchlist, 8000);
    return () => clearInterval(id);
  }, [reloadWatchlist]);

  async function handleCreate(values: {
    stock_id: number;
    note: string;
    target_price: string | null;
  }) {
    await createWatchlist({
      user_id: DEMO_USER_ID,
      stock_id: values.stock_id,
      note: values.note,
      target_price: values.target_price,
    });
    setAdding(false);
    pushToast("已加入自选", "info");
    await reloadWatchlist();
  }

  async function handleUpdate(values: {
    stock_id: number;
    note: string;
    target_price: string | null;
  }) {
    if (!editing) return;
    await updateWatchlist(editing.id, {
      user_id: DEMO_USER_ID,
      ...values,
    });
    setEditing(null);
    pushToast("已更新", "info");
    await reloadWatchlist();
  }

  async function handleDelete(id: number) {
    await deleteWatchlist(id);
    pushToast("已删除", "info");
    await reloadWatchlist();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">自选股实战</div>
            <div className="text-xs text-slate-500">
              React + Go gin + GORM + PostgreSQL
            </div>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="rounded-full bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700"
          >
            + 新增自选
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-slate-700">行情总览</h2>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
            {markets.map((m) => (
              <div
                key={m.code}
                className={`rounded-xl border p-4 cursor-pointer transition ${
                  activeMarket === m.code
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-white hover:border-indigo-300"
                }`}
                onClick={() =>
                  setActiveMarket(activeMarket === m.code ? "" : m.code)
                }
              >
                <div className="text-xs text-slate-500">{m.code.toUpperCase()}</div>
                <div className="text-base font-medium mt-1">{m.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {m.currency} · {m.timezone}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              {activeMarket
                ? `${activeMarket.toUpperCase()} 可选标的`
                : "全部标的"}
            </h2>
            <span className="text-xs text-slate-500">{stocks.length} 只</span>
          </div>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">代码</th>
                  <th className="px-4 py-2 text-left">名称</th>
                  <th className="px-4 py-2 text-left">市场</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-2 font-mono">{s.code}</td>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2 text-slate-500">
                      {s.market?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">我的自选</h2>
            <span className="text-xs text-slate-500">
              {watchlist.length} 条 · 每 8 秒自动刷新
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {watchlist.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-sm">
                还没有自选股，点击右上角“新增自选”开始添加。
              </div>
            )}
            {watchlist.map((w) => (
              <WatchlistRow
                key={w.id}
                item={w}
                quote={quotes[w.stock_id]}
                onEdit={() => setEditing(w)}
                onDelete={() => handleDelete(w.id)}
              />
            ))}
          </div>
        </section>
      </main>

      {adding && (
        <EditDialog
          stocks={stocks}
          onClose={() => setAdding(false)}
          onSubmit={handleCreate}
          title="新增自选"
        />
      )}
      {editing && (
        <EditDialog
          stocks={stocks}
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={handleUpdate}
          title="修改自选"
        />
      )}

      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg px-3 py-2 text-xs shadow-md ${
              t.level === "error"
                ? "bg-rose-600 text-white"
                : "bg-slate-800 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function WatchlistRow({
  item,
  quote,
  onEdit,
  onDelete,
}: {
  item: Watchlist;
  quote?: Quote;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const changeNum = quote ? Number(quote.change) : 0;
  const color = changeNum >= 0 ? "text-rose-500" : "text-emerald-500";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-center gap-4">
      <div className="flex-1">
        <div className="text-sm font-medium">
          {item.stock?.name}{" "}
          <span className="text-xs text-slate-500 ml-2 font-mono">
            {item.stock?.code}
          </span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          目标价 {item.target_price ?? "—"} · 备注 {item.note || "无"}
        </div>
      </div>
      <div className="text-right">
        <div className="text-base font-mono">{quote?.price ?? "—"}</div>
        <div className={`text-xs ${color}`}>
          {quote ? `${changeNum >= 0 ? "+" : ""}${changeNum.toFixed(2)}%` : "—"}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="text-xs px-3 py-1.5 rounded-full border border-slate-300 hover:bg-slate-100"
        >
          修改
        </button>
        <button
          onClick={onDelete}
          className="text-xs px-3 py-1.5 rounded-full border border-rose-300 text-rose-500 hover:bg-rose-50"
        >
          删除
        </button>
      </div>
    </div>
  );
}

function EditDialog({
  stocks,
  initial,
  onClose,
  onSubmit,
  title,
}: {
  stocks: Stock[];
  initial?: Watchlist;
  onClose: () => void;
  onSubmit: (values: {
    stock_id: number;
    note: string;
    target_price: string | null;
  }) => Promise<void>;
  title: string;
}) {
  const [stockId, setStockId] = useState<number>(initial?.stock_id ?? stocks[0]?.id ?? 0);
  const [note, setNote] = useState(initial?.note ?? "");
  const [targetPrice, setTargetPrice] = useState(initial?.target_price ?? "");
  return (
    <div className="fixed inset-0 bg-slate-900/40 grid place-items-center z-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="text-base font-semibold">{title}</div>
        <label className="block text-xs text-slate-500">股票</label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={stockId}
          onChange={(e) => setStockId(Number(e.target.value))}
        >
          {stocks.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} · {s.name}
            </option>
          ))}
        </select>
        <label className="block text-xs text-slate-500">目标价</label>
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          placeholder="例如 198.50"
        />
        <label className="block text-xs text-slate-500">备注</label>
        <textarea
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full border border-slate-300 text-sm"
          >
            取消
          </button>
          <button
            onClick={() =>
              onSubmit({
                stock_id: stockId,
                note,
                target_price: targetPrice || null,
              })
            }
            className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-sm"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}