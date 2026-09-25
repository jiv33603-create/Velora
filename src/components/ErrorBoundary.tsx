import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-sm p-8 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h1 className="font-serif text-2xl font-light tracking-wide text-stone-100">
              MAISON VELORA
            </h1>
            
            <p className="text-xs uppercase tracking-widest text-stone-400">
              Experience Restored
            </p>

            <p className="text-xs text-stone-400 leading-relaxed">
              An unexpected render anomaly occurred. Your boutique cart and settings are safely stored.
            </p>

            <button
              onClick={this.handleReset}
              className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-stone-100 text-stone-950 text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-stone-200 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Boutique
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
