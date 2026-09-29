import React, { useEffect, useState } from 'react';

export type ToastKind = 'success' | 'error' | 'warning';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
  duration?: number;
}

const Toast: React.FC<Props> = ({ toasts, onDismiss, duration = 2800 }) => {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <ToastView key={t.id} item={t} duration={duration} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastView: React.FC<{
  item: ToastItem;
  duration: number;
  onDismiss: (id: number) => void;
}> = ({ item, duration, onDismiss }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss(item.id);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [duration, item.id, onDismiss]);

  if (!visible) return null;
  return <div className={`toast toast-${item.kind}`}>{item.message}</div>;
};

export default Toast;