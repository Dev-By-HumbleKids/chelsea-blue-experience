import { Component, type ReactNode } from 'react';

/** Keeps a failing page from taking down the navigation and footer. */
export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(prev: { resetKey?: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="container-x grid min-h-[70vh] place-items-center pt-[var(--nav-h)] text-center" role="alert">
        <div>
          <p className="display text-5xl">Something went wrong</p>
          <p className="mt-3 text-ivory-muted">This section couldn’t be displayed. Try reloading the page.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 h-12 rounded-full bg-royal px-6 text-[13px] font-semibold uppercase tracking-[0.14em]">
            Reload
          </button>
        </div>
      </div>
    );
  }
}
