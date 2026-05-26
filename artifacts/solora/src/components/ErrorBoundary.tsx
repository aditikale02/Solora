import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("UI crash captured by ErrorBoundary", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#F7F2EC] px-6 text-center text-[#1A1714]">
          <div>
            <h1 className="font-serif text-3xl">Something went wrong</h1>
            <p className="mt-3 text-sm text-[#1A1714]/70">
              Please refresh the page. If the issue persists, contact support.
            </p>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
