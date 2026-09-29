import React, { useEffect, useState } from 'react';
import type { Stock, StockFormValues } from '../types/stock';
import { MARKETS } from '../types/stock';

export interface StockFormProps {
  initial?: Partial<Stock> | null;
  onCancel: () => void;
  onSubmit: (values: StockFormValues) => Promise<void> | void;
}

interface FormState extends StockFormValues {
  errors: Partial<Record<keyof StockFormValues, string>>;
}

const empty: FormState = {
  code: '',
  name: '',
  market: 'SH',
  price: '',
  changePercent: '',
  errors: {},
};

function validate(s: StockFormValues): Partial<Record<keyof StockFormValues, string>> {
  const errs: Partial<Record<keyof StockFormValues, string>> = {};
  if (!s.code.trim()) errs.code = '代码不能为空';
  if (!s.name.trim()) errs.name = '名称不能为空';
  if (!s.market) errs.market = '请选择市场';
  if (s.price !== '' && Number.isNaN(Number(s.price))) errs.price = '价格必须是数字';
  if (s.changePercent !== '' && Number.isNaN(Number(s.changePercent))) {
    errs.changePercent = '涨跌幅必须是数字';
  }
  return errs;
}

const StockForm: React.FC<StockFormProps> = ({ initial, onCancel, onSubmit }) => {
  const [state, setState] = useState<FormState>(empty);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setState({
        code: initial.code ?? '',
        name: initial.name ?? '',
        market: (initial.market as StockFormValues['market']) ?? 'SH',
        price: typeof initial.price === 'number' ? initial.price : '',
        changePercent:
          typeof initial.changePercent === 'number' ? initial.changePercent : '',
        errors: {},
      });
    } else {
      setState(empty);
    }
  }, [initial]);

  const change = <K extends keyof StockFormValues>(k: K, v: StockFormValues[K]) => {
    setState((s) => ({ ...s, [k]: v, errors: { ...s.errors, [k]: undefined } }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(state);
    if (Object.keys(errs).length > 0) {
      setState((s) => ({ ...s, errors: errs }));
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        code: state.code.trim(),
        name: state.name.trim(),
        market: state.market,
        price: state.price === '' ? '' : Number(state.price),
        changePercent:
          state.changePercent === '' ? '' : Number(state.changePercent),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        noValidate
      >
        <div className="modal-header">
          <span>{initial?.id ? '编辑自选股' : '新增自选股'}</span>
          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <label htmlFor="code">股票代码</label>
            <input
              id="code"
              type="text"
              value={state.code}
              onChange={(e) => change('code', e.target.value)}
              placeholder="如 AAPL / 00700 / 600519"
            />
            {state.errors.code && <span className="field-error">{state.errors.code}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="name">名称</label>
            <input
              id="name"
              type="text"
              value={state.name}
              onChange={(e) => change('name', e.target.value)}
              placeholder="如 苹果公司"
            />
            {state.errors.name && <span className="field-error">{state.errors.name}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="market">市场</label>
            <select
              id="market"
              value={state.market}
              onChange={(e) => change('market', e.target.value as StockFormValues['market'])}
            >
              {MARKETS.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.label}（{m.code}）
                </option>
              ))}
            </select>
            {state.errors.market && <span className="field-error">{state.errors.market}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="price">价格（留空自动生成）</label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={state.price}
              onChange={(e) =>
                change('price', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="如 188.50"
            />
            {state.errors.price && <span className="field-error">{state.errors.price}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="change">涨跌幅 %（留空自动生成）</label>
            <input
              id="change"
              type="number"
              step="0.01"
              value={state.changePercent}
              onChange={(e) =>
                change('changePercent', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="如 1.23 表示 +1.23%"
            />
            {state.errors.changePercent && (
              <span className="field-error">{state.errors.changePercent}</span>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn" onClick={onCancel} disabled={submitting}>
            取消
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '提交中…' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockForm;