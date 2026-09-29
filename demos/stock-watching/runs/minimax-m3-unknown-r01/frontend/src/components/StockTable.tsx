import React from 'react';
import type { Stock } from '../types/stock';

interface Props {
  stocks: Stock[];
  loading: boolean;
  onEdit: (stock: Stock) => void;
  onDelete: (stock: Stock) => void;
}

function fmtPrice(v: number): string {
  if (typeof v !== 'number' || Number.isNaN(v)) return '-';
  return v.toFixed(2);
}

function changeCls(pct: number): string {
  if (typeof pct !== 'number' || Number.isNaN(pct) || pct === 0) return 'stock-change-flat';
  return pct > 0 ? 'stock-change-up' : 'stock-change-down';
}

function fmtPct(pct: number): string {
  if (typeof pct !== 'number' || Number.isNaN(pct)) return '-';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

const StockTable: React.FC<Props> = ({ stocks, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="stock-table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th>代码</th>
              <th>名称</th>
              <th>市场</th>
              <th>价格</th>
              <th>涨跌幅</th>
              <th style={{ width: 160 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="empty-cell" colSpan={6}>
                加载中…
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="stock-table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th>代码</th>
              <th>名称</th>
              <th>市场</th>
              <th>价格</th>
              <th>涨跌幅</th>
              <th style={{ width: 160 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="empty-cell" colSpan={6}>
                当前市场暂无自选股，点击「新增」添加一只吧。
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="stock-table-wrapper">
      <table className="stock-table">
        <thead>
          <tr>
            <th>代码</th>
            <th>名称</th>
            <th>市场</th>
            <th>价格</th>
            <th>涨跌幅</th>
            <th style={{ width: 160 }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s.id}>
              <td className="stock-code">{s.code}</td>
              <td className="stock-name">{s.name}</td>
              <td>
                <span className="stock-market">{s.market}</span>
              </td>
              <td className="stock-price">{fmtPrice(s.price)}</td>
              <td className={changeCls(s.changePercent)}>{fmtPct(s.changePercent)}</td>
              <td>
                <div className="stock-actions">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => onEdit(s)}
                    aria-label={`编辑 ${s.code}`}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(s)}
                    aria-label={`删除 ${s.code}`}
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;