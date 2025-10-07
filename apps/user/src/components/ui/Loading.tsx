'use client';

import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

interface LoadingStateProps {
    loading: boolean;
    children: ReactNode;
    loadingComponent?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
    };

    return (
        <Loader2
            className={`animate-spin ${sizeClasses[size]} ${className}`}
        />
    );
}

export function LoadingState({
    loading,
    children,
    loadingComponent,
    size = 'md',
    className = ''
}: LoadingStateProps) {
    if (loading) {
        return (
            <div className={`flex items-center justify-center py-8 ${className}`}>
                {loadingComponent || (
                    <div className="flex items-center gap-2 text-gray-500">
                        <LoadingSpinner size={size} />
                        <span className="text-sm">Loading...</span>
                    </div>
                )}
            </div>
        );
    }

    return <>{children}</>;
}

export function LoadingOverlay({
    visible,
    message = 'Loading...',
    size = 'lg',
    className = ''
}: LoadingOverlayProps) {
    if (!visible) return null;

    return (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
                <div className="flex items-center gap-3">
                    <LoadingSpinner size={size} className="text-[#FF9F1C]" />
                    <span className="text-gray-900 dark:text-white font-medium">{message}</span>
                </div>
            </div>
        </div>
    );
}

// Button loading states
interface LoadingButtonProps {
    loading?: boolean;
    children: ReactNode;
    loadingText?: string;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingButton({
    loading = false,
    children,
    loadingText,
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md'
}: LoadingButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0 focus:ring-amber-500',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
        ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                ${baseClasses} 
                ${variantClasses[variant]} 
                ${sizeClasses[size]}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
        >
            {loading && (
                <LoadingSpinner
                    size={size === 'lg' ? 'md' : 'sm'}
                    className="mr-2"
                />
            )}
            <span>{loading && loadingText ? loadingText : children}</span>
        </button>
    );
}

// Skeleton loaders for better perceived performance
interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    rounded?: boolean;
}

export function Skeleton({
    className = '',
    width,
    height,
    rounded = true
}: SkeletonProps) {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`
                animate-pulse bg-gray-200 dark:bg-gray-700 
                ${rounded ? 'rounded' : ''}
                ${className}
            `}
            style={style}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Skeleton width={40} height={40} />
                    <div className="space-y-2 flex-1">
                        <Skeleton height={16} width="60%" />
                        <Skeleton height={14} width="40%" />
                    </div>
                </div>
                <Skeleton height={12} width="100%" />
                <Skeleton height={12} width="80%" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton width={80} height={24} />
                    <Skeleton width={100} height={32} />
                </div>
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5, columns = 4 }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} height={20} width="80%" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} height={16} width={colIndex === 0 ? "90%" : "70%"} />
                    ))}
                </div>
            ))}
        </div>
    );
}