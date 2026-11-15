'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  label?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary: ${this.props.label || 'unknown'}]`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark p-8 text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-crimson/10 flex items-center justify-center border border-brand-crimson/30">
            <AlertTriangle className="w-6 h-6 text-brand-crimson" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-1">
              {this.props.label || 'Component Error'}
            </p>
            <p className="text-sm text-neutral-500 max-w-xs">
              {this.state.error?.message || 'Something went wrong rendering this section.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-charcoal border border-brand-surface-borderDark text-xs font-mono uppercase tracking-widest text-neutral-300 hover:border-brand-crimson/50 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lightweight functional wrapper for use around 3D canvases
export function ThreeDErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      label="3D Viewer"
      fallback={
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px] rounded-2xl bg-brand-charcoal border border-brand-surface-borderDark gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-black flex items-center justify-center border border-brand-surface-borderDark">
            <span className="text-2xl">🧥</span>
          </div>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">3D Viewer Unavailable</p>
            <p className="text-xs text-neutral-500 mt-1">Your browser may not support WebGL. Try Chrome or Firefox.</p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
