'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[400px] flex items-center justify-center"
          >
            <div className="card-glass p-10 text-center max-w-sm">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-white font-bold text-lg mb-2">Something went wrong</h3>
              <p className="text-white/60 text-sm mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="btn-primary text-sm px-6 py-2"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )
      );
    }

    return this.props.children;
  }
}
