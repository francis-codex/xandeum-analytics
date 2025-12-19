'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-600">
              Something went wrong
            </h2>
            <p className="mb-6 text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
