import { useEffect, useMemo, useState } from "react";

/**
 * 新增 / 编辑自选股的表单弹窗。
 * 新增时选择市场与代码，编辑时只允许改备注、提醒价与排序。
 */
export default function WatchDialog({ mode, marketCode, symbols, initial, onClose, onSubmit, busy }) {
  const [form, setForm] = useState(() => ({
    symbolCode: initial?.symbol?.code || "",
    note: initial?.note || "",
    alertPrice: initial?.alertPrice != null ? String(initial.alertPrice) : "",
    sortOrder: initial?.sortOrder ?? "",
  }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [form.symbolCode]);

  const isEdit = mode === "edit";
  const selected = useMemo(
    () => symbols.find((s) => s.code === form.symbolCode),
    [symbols, form.symbolCode],
  );

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const validate = () => {
    const next = {};
    if (!isEdit && !form.symbolCode) next.symbolCode = "请选择一个代码";
    if (form.note.length > 200) next.note = "备注不能超过 200 字";
    if (form.alertPrice !== "" && Number.isNaN(Number(form.alertPrice))) {
      next.alertPrice = "提醒价必须是数字";
    }
    if (form.alertPrice !== "" && Number(form.alertPrice) < 0) {
      next.alertPrice = "提醒价不能为负";
    }
    if (form.sortOrder !== "" && (!Number.isInteger(Number(form.sortOrder)) || Number(form.sortOrder) < 0)) {
      next.sortOrder = "排序需为非负整数";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = {
      note: form.note.trim(),
      alertPrice: form.alertPrice === "" ? null : Number(form.alertPrice),
      sortOrder: form.sortOrder === "" ? null : Number(form.sortOrder),
    };
    if (!isEdit) {
      payload.marketCode = marketCode;
      payload.symbolCode = form.symbolCode;
    }
    await onSubmit(payload);
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <header>{isEdit ? `编辑 ${initial?.symbol?.name || ""}` : `添加自选股 · ${marketCode}`}</header>
        <div className="body">
          {!isEdit && (
            <div className={`field ${errors.symbolCode ? "invalid" : ""}`}>
              <label htmlFor="symbolCode">代码</label>
              <select id="symbolCode" value={form.symbolCode} onChange={set("symbolCode")}>
                <option value="">请选择…</option>
                {symbols.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} · {s.name}
                  </option>
                ))}
              </select>
              {errors.symbolCode ? (
                <span className="err">{errors.symbolCode}</span>
              ) : (
                <span className="hint">{selected ? `行业：${selected.sector}` : "从当前市场的代码列表中选择"}</span>
              )}
            </div>
          )}

          <div className={`field ${errors.note ? "invalid" : ""}`}>
            <label htmlFor="note">备注</label>
            <input
              id="note"
              value={form.note}
              onChange={set("note")}
              placeholder="例如：等回调到 1600 再加仓"
              maxLength={240}
            />
            {errors.note ? <span className="err">{errors.note}</span> : <span className="hint">{form.note.length}/200</span>}
          </div>

          <div className={`field ${errors.alertPrice ? "invalid" : ""}`}>
            <label htmlFor="alertPrice">提醒价（可留空）</label>
            <input
              id="alertPrice"
              inputMode="decimal"
              value={form.alertPrice}
              onChange={set("alertPrice")}
              placeholder="例如 1600"
            />
            {errors.alertPrice && <span className="err">{errors.alertPrice}</span>}
          </div>

          <div className={`field ${errors.sortOrder ? "invalid" : ""}`}>
            <label htmlFor="sortOrder">排序（可留空，留空则追加到末尾）</label>
            <input id="sortOrder" inputMode="numeric" value={form.sortOrder} onChange={set("sortOrder")} />
            {errors.sortOrder && <span className="err">{errors.sortOrder}</span>}
          </div>
        </div>
        <footer>
          <button type="button" className="btn" onClick={onClose}>
            取消
          </button>
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? "提交中…" : isEdit ? "保存" : "添加"}
          </button>
        </footer>
      </form>
    </div>
  );
}
