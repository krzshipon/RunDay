'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
}

import { createContext, useContext } from 'react';

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (toast: Omit<Toast, 'id'>): string => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = {
            ...toast,
            id,
            duration: toast.duration || 5000,
        };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, newToast.duration);
        }

        return id;
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const clearAllToasts = () => {
        setToasts([]);
    };

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast, clearAllToasts }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(onClose, 150); // Match animation duration
    };

    const getToastStyles = () => {
        const baseStyles = "relative flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-150 ease-out";

        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700`;
            case 'error':
                return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700`;
            case 'warning':
                return `${baseStyles} bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700`;
            case 'info':
                return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700`;
            default:
                return `${baseStyles} bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700`;
        }
    };

    const getIconColor = () => {
        switch (toast.type) {
            case 'success':
                return 'text-emerald-500';
            case 'error':
                return 'text-red-500';
            case 'warning':
                return 'text-amber-500';
            case 'info':
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    };

    const getIcon = () => {
        const iconClass = `h-5 w-5 ${getIconColor()}`;
        switch (toast.type) {
            case 'success':
                return <CheckCircle className={iconClass} />;
            case 'error':
                return <AlertCircle className={iconClass} />;
            case 'warning':
                return <AlertTriangle className={iconClass} />;
            case 'info':
                return <Info className={iconClass} />;
            default:
                return <Info className={iconClass} />;
        }
    };

    const transformClass = isLeaving
        ? 'translate-x-full opacity-0 scale-95'
        : isVisible
            ? 'translate-x-0 opacity-100 scale-100'
            : 'translate-x-full opacity-0 scale-95';

    return (
        <div className={`transform ${transformClass} transition-all duration-150 ease-out`}>
            <div className={getToastStyles()}>
                <div className="flex-shrink-0 mt-0.5">
                    {getIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {toast.title}
                    </h4>
                    {toast.message && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {toast.message}
                        </p>
                    )}
                    {toast.action && (
                        <div className="mt-2">
                            <button
                                onClick={toast.action.onClick}
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {toast.action.label}
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleClose}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}