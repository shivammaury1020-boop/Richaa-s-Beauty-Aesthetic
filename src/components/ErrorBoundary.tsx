import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let friendly = 'An unexpected error occurred while loading this view.';
    if (error?.message) {
      try {
        const parsed = JSON.parse(error.message) as { error?: string };
        if (parsed.error && parsed.error.toLowerCase().includes('permission')) {
          friendly =
            'You do not have permission to access or update this salon record. Please sign in with an authorised administrator account.';
        } else if (parsed.error) {
          friendly = parsed.error;
        }
      } catch {
        friendly = error.message;
      }
    }
    return { hasError: true, message: friendly };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F3EE] text-[#382D28] flex items-center justify-center px-6 py-12">
          <div className="max-w-lg w-full bg-white border border-[#E8D5CA] rounded-2xl p-8 md:p-10 text-center shadow-[0_18px_45px_rgba(56,45,40,0.06)]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-3">
              Richaa&apos;s Beauty &amp; Aesthetic
            </p>
            <h1 className="font-serif text-3xl text-[#382D28] mb-4">
              Something Interrupted This Page
            </h1>
            <p className="text-sm text-[#6B5A50] leading-relaxed mb-7">
              {this.state.message}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, message: '' });
                  window.location.href = '/';
                }}
                className="px-6 py-3 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#b5916c] transition-colors cursor-pointer"
              >
                Return to Home
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#F8F3EE] border border-[#E8D5CA] text-[#382D28] text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#F2E8DF] transition-colors cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
