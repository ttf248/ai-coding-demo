import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset: () => void;
}

/** Keeps a rendering error in one view from unmounting the whole app. */
export default class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('View crashed:', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-white text-gray-500">
        <p>页面出错了，请稍后再试</p>
        <button
          type="button"
          onClick={() => {
            this.setState({ failed: false });
            this.props.onReset();
          }}
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white"
        >
          返回首页
        </button>
      </div>
    );
  }
}
