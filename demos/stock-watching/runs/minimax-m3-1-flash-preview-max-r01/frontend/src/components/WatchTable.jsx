import { useMemo, useState } from "react";

const fmt = (value, digits = 2) =>
  value == null ? "—" : Number(value).toLocaleString("zh-CN", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const fmtVolume = (v) => {
  if (v == null) return "—";
  if (v >= 1e8) return `${(v / 1e8).toFixed(2)} 亿`;
  if (v >= 1e4) return `${(v / 1e4).toFixed(2)} 万`;
  return String(v);
};

/** 自选股表格：行情 + 备注 + 提醒价 + 增删改。 */
export default function WatchTable({ items, quotes, loading, busyId, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  const quoteMap = useMemo(() => {
    const map = new Map();
    (quotes || []).forEach((q) => map.set(q.code, q));
    return map;
  }, [quotes]);

  if (loading) {
    return (
      <div className="card">
        {[0, 1, 2, 3].map((i) => (
          <div className="skeleton" key={i}>
            <i style={{ width: `${90 - i * 12}%` }} />
          </div>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="card">
        <div className="empty">
          <p>这个市场还没有自选股。</p>
          <p className="hint">点右上角「添加自选股」开始。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>代码 / 名称</th>
            <th className="num">最新价</th>
            <th className="num">涨跌幅</th>
            <th className="num">今开</th>
            <th className="num">最高 / 最低</th>
            <th className="num">成交量</th>
            <th>备注 / 提醒价</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const q = quoteMap.get(item.symbol.code);
            const up = (q?.changePct ?? 0) >= 0;
            const hit = item.alertPrice != null && q != null && q.price <= item.alertPrice;
            const busy = busyId === item.id;
            return (
              <tr key={item.id}>
                <td>
                  <div className="code">
                    {item.symbol.code} <span className="sub">{item.market?.name}</span>
                  </div>
                  <div className="sub">
                    {item.symbol.name} · {item.symbol.sector}
                  </div>
                </td>
                <td className="num code">{fmt(q?.price)}</td>
                <td className={`num ${up ? "up" : "down"}`}>
                  {q ? `${up ? "+" : ""}${fmt(q.changePct)}%` : "—"}
                </td>
                <td className="num">{fmt(q?.open)}</td>
                <td className="num sub">
                  {fmt(q?.high)} / {fmt(q?.low)}
                </td>
                <td className="num sub">{fmtVolume(q?.volume)}</td>
                <td>
                  {item.note ? <div className="sub">{item.note}</div> : <div className="sub">—</div>}
                  {item.alertPrice != null && (
                    <span className={`pill ${hit ? "alert-hit" : ""}`}>
                      {hit ? "已触发" : "提醒"} {fmt(item.alertPrice)}
                    </span>
                  )}
                </td>
                <td>
                  <div className="row-actions">
                    {confirmId === item.id ? (
                      <>
                        <button className="btn danger" disabled={busy} onClick={() => onDelete(item)}>
                          确认删除
                        </button>
                        <button className="btn" onClick={() => setConfirmId(null)}>
                          取消
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn" onClick={() => onEdit(item)}>
                          编辑
                        </button>
                        <button className="btn danger" onClick={() => setConfirmId(item.id)}>
                          删除
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
