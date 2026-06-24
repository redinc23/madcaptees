import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
            <div className="max-w-md text-center">
              <h1 className="text-3xl text-[#0A0A0A] mb-4" style={{ fontFamily: "'Anton', sans-serif" }}>
                SOMETHING WENT WRONG
              </h1>
              <p className="text-[#64748B] mb-6">{this.state.error?.message || 'An unexpected error occurred'}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 text-white text-sm uppercase tracking-wider"
                style={{ backgroundColor: '#C41E3A', fontFamily: "'Space Mono', monospace" }}
              >
                Back to Home
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
