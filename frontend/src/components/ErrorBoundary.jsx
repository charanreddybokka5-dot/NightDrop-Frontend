import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NightDrop Global ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="night-gradient-bg min-vh-100 d-flex align-items-center justify-content-center p-4">
          <div className="glass-card p-5 text-center shadow-lg" style={{ maxWidth: '520px', width: '100%', borderRadius: '1.25rem' }}>
            <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3 border border-danger border-opacity-25">
              <AlertCircle size={40} />
            </div>
            <h3 className="fw-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Temporary Display Glitch
            </h3>
            <p className="text-muted small mb-4">
              NightDrop caught an unhandled interface exception. Refreshing or checking your network connection usually resolves this.
            </p>
            {this.state.error?.message && (
              <div className="p-3 mb-4 rounded-3 text-start small font-monospace bg-dark bg-opacity-75 text-danger border border-secondary border-opacity-25 text-break">
                {this.state.error.message}
              </div>
            )}
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <button onClick={this.handleReload} className="btn btn-night-primary d-inline-flex align-items-center gap-2">
                <RefreshCw size={16} /> Reload Page
              </button>
              <button onClick={this.handleGoHome} className="btn btn-night-secondary d-inline-flex align-items-center gap-2">
                <Home size={16} /> Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
