import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; errorMessage: string; errorStack: string }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: "", errorStack: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message, errorStack: error.stack || "" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("ErrorBoundary caught:", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303] text-[#FAFAFA] px-6">
          <div className="max-w-md text-center">
            <h1 className="font-display italic text-4xl mb-4">Something went wrong</h1>
            <p className="font-mono text-[11px] text-[#D9A02D] mb-2 break-all">
              {this.state.errorMessage}
            </p>
            <details className="mb-8">
              <summary className="font-mono text-[9px] text-[#64748B] cursor-pointer hover:text-[#94A3B8]">
                Stack trace
              </summary>
              <pre className="mt-2 text-[9px] text-[#64748B] text-left max-h-40 overflow-y-auto">
                {this.state.errorStack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="font-mono text-[10px] uppercase tracking-[0.22em] bg-[#D9A02D] text-[#030303] px-8 py-3 rounded-lg hover:bg-[#D9A02D]/90 transition-all"
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
