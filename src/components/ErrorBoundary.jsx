// src/components/ErrorBoundary.jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-white text-[#0B0B0B] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full border border-[#E3E5E0] rounded-[28px] p-8 bg-[#F4F5F2] shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
            <p className="text-xs text-[#5C625C] mb-6 leading-relaxed">
              An unexpected error occurred during rendering.
            </p>
            {this.state.error && (
              <div className="text-left bg-white border border-[#E3E5E0] rounded-[14px] p-4 text-xs font-mono text-[#C0392B] mb-6 break-words overflow-x-auto max-h-40">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-full bg-[#0B0B0B] text-white hover:bg-[#0E4F2C] text-xs font-bold transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
