'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: string;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: string) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        const errorString = errorInfo.componentStack || error.stack || 'Unknown error';

        this.setState({
            error,
            errorInfo: errorString
        });

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorString);
        }

        // Log error for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleGoHome = () => {
        if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
        }
    };

    handleReportBug = () => {
        const { error, errorInfo } = this.state;
        const errorDetails = `Error: ${error?.message || 'Unknown error'}\n\nStack trace:\n${errorInfo || 'No stack trace available'}`;

        // In a real app, you might send this to a bug tracking service
        console.log('Bug report:', errorDetails);

        // For now, just copy to clipboard
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(errorDetails).then(() => {
                alert('Error details copied to clipboard. Please send this to support.');
            });
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
                            {/* Error Icon */}
                            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>

                            {/* Error Message */}
                            <h2 className="text-2xl font-bold text-white mb-3">
                                Oops! Something went wrong
                            </h2>
                            <p className="text-slate-400 mb-6">
                                We&apos;re sorry, but an unexpected error occurred. Our team has been notified and is working to fix this issue.
                            </p>

                            {/* Error Details (Development) */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-left mb-6 bg-slate-900/50 rounded-lg p-4">
                                    <summary className="cursor-pointer text-sm text-slate-300 font-medium mb-2">
                                        Error Details (Development)
                                    </summary>
                                    <div className="text-xs text-red-400 font-mono whitespace-pre-wrap overflow-auto max-h-32">
                                        {this.state.error.message}
                                        {this.state.errorInfo && (
                                            <div className="mt-2 text-slate-400">
                                                {this.state.errorInfo}
                                            </div>
                                        )}
                                    </div>
                                </details>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={this.handleRetry}
                                    className="w-full bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={this.handleGoHome}
                                        className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Home className="w-4 h-4" />
                                        Home
                                    </button>

                                    <button
                                        onClick={this.handleReportBug}
                                        className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Bug className="w-4 h-4" />
                                        Report
                                    </button>
                                </div>
                            </div>

                            {/* Help Text */}
                            <p className="text-xs text-slate-500 mt-4">
                                If this problem persists, please contact support with the error details.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Simpler error display component for inline errors
interface ErrorDisplayProps {
    error: string | Error;
    retry?: () => void;
    className?: string;
    compact?: boolean;
}

export function ErrorDisplay({
    error,
    retry,
    className = '',
    compact = false
}: ErrorDisplayProps) {
    const errorMessage = typeof error === 'string' ? error : error.message;

    if (compact) {
        return (
            <div className={`flex items-center gap-2 text-red-600 dark:text-red-400 text-sm ${className}`}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{errorMessage}</span>
                {retry && (
                    <button
                        onClick={retry}
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-xs underline"
                    >
                        Retry
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                        Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300">
                        {errorMessage}
                    </p>
                    {retry && (
                        <div className="mt-3">
                            <button
                                onClick={retry}
                                className="text-sm bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded transition-colors duration-200 flex items-center gap-1"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Hook for handling async errors
export function useErrorHandler() {
    const handleError = (error: Error, context?: string) => {
        console.error('Error handled:', error, context ? `Context: ${context}` : '');

        // In a real app, you might want to send errors to a logging service
        // Example: logErrorToService(error, context);
    };

    return { handleError };
}