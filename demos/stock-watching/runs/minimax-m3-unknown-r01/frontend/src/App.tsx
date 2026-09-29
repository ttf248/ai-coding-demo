import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import MarketTabs from './components/MarketTabs';
import StockForm, { StockFormProps } from './components/StockForm';
import StockTable from './components/StockTable';
import Toast, { ToastItem, ToastKind } from './components/Toast';
import { ApiError, NetworkError, stocksApi, StockPayload } from './api';
import type { Stock, StockFormValues } from './types/stock';

interface ModalState {
  mode: 'create' | 'edit';
  initial?: Stock | null;
}

// 把任意值规整成中文消息
function normalizeError(err: unknown): string {
  if (err instanceof NetworkError) {
    return '后端服务不可用，请检查服务是否启动';
  }
  if (err instanceof ApiError) {
    return err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return '未知错误';
}

const App: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<string>('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [networkDown, setNetworkDown] = useState(false);

  const [modal, setModal] = useState<ModalState | null>(null);

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const pushToast = useCallback((kind: ToastKind, message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, kind, message }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchStocks = useCallback(
    async (market: string) => {
      setLoading(true);
      try {
        const resp = await stocksApi.list({ market });
        setStocks(resp.data);
        setNetworkDown(false);
      } catch (err) {
        const msg = normalizeError(err);
        if (err instanceof NetworkError) {
          setNetworkDown(true);
        }
        pushToast('error', msg);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    },
    [pushToast],
  );

  useEffect(() => {
    fetchStocks(activeMarket);
  }, [activeMarket, fetchStocks]);

  const handleSubmit = useCallback<NonNullable<StockFormProps['onSubmit']>>(
    async (values) => {
      try {
        if (modal?.mode === 'edit' && modal.initial) {
          const payload: Partial<StockPayload> = {
            code: values.code,
            name: values.name,
            market: values.market,
          };
          if (values.price !== '')
            payload.price = Number(values.price);
          if (values.changePercent !== '')
            payload.changePercent = Number(values.changePercent);
          await stocksApi.update(modal.initial.id, payload);
          pushToast('success', `已更新 ${values.code}`);
        } else {
          const payload: StockPayload = {
            code: values.code,
            name: values.name,
            market: values.market,
          };
          if (values.price !== '')
            payload.price = Number(values.price);
          if (values.changePercent !== '')
            payload.changePercent = Number(values.changePercent);
          await stocksApi.create(payload);
          pushToast('success', `已添加 ${values.code}`);
        }
        setModal(null);
        fetchStocks(activeMarket);
      } catch (err) {
        pushToast('error', normalizeError(err));
      }
    },
    [modal, activeMarket, fetchStocks, pushToast],
  );

  const handleDelete = useCallback(
    async (stock: Stock) => {
      if (!window.confirm(`确认删除 ${stock.code} (${stock.name}) ？`)) return;
      try {
        await stocksApi.remove(stock.id);
        pushToast('success', `已删除 ${stock.code}`);
        fetchStocks(activeMarket);
      } catch (err) {
        pushToast('error', normalizeError(err));
      }
    },
    [activeMarket, fetchStocks, pushToast],
  );

  const handleClearAll = useCallback(async () => {
    const scope = activeMarket ? `当前市场（${activeMarket}）` : '所有市场';
    if (!window.confirm(`确认清空${scope}的自选股？此操作不可恢复。`)) return;
    try {
      await stocksApi.removeAll(activeMarket || undefined);
      pushToast('success', `已清空${scope}的自选股`);
      fetchStocks(activeMarket);
    } catch (err) {
      pushToast('error', normalizeError(err));
    }
  }, [activeMarket, fetchStocks, pushToast]);

  const total = stocks.length;

  const toolbarInfo = useMemo(() => {
    if (loading) return '加载中…';
    if (networkDown) return '后端服务不可用';
    return `共 ${total} 条`;
  }, [loading, networkDown, total]);

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">自选股票</h1>
          <div className="app-subtitle">MiniMax M3 · stock-watching demo</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setModal({ mode: 'create' })}
          >
            新增
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClearAll}
            disabled={total === 0}
          >
            清空
          </button>
        </div>
      </header>

      {networkDown && (
        <div className="error-banner" role="alert">
          <span>后端服务不可用，请检查服务是否启动</span>
          <div className="error-banner-actions">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => fetchStocks(activeMarket)}
            >
              重试
            </button>
          </div>
        </div>
      )}

      <MarketTabs active={activeMarket} onChange={setActiveMarket} />

      <div className="toolbar">
        <div className="toolbar-info">{toolbarInfo}</div>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => fetchStocks(activeMarket)}
          disabled={loading}
        >
          刷新
        </button>
      </div>

      <StockTable
        stocks={stocks}
        loading={loading}
        onEdit={(s) => setModal({ mode: 'edit', initial: s })}
        onDelete={handleDelete}
      />

      {modal && (
        <StockForm
          initial={modal.initial ?? null}
          onCancel={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;