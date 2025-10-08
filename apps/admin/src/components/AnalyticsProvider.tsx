'use client';

import { useEffect } from 'react';
import { Analytics } from '@runday/ui';

interface AnalyticsProviderProps {
    children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Initialize analytics for admin app
        Analytics.initialize('admin');

        // Track initial page view
        Analytics.trackPageView(window.location.pathname);

        // Track page changes
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        const trackPageChange = () => {
            Analytics.trackPageView(window.location.pathname);
        };

        history.pushState = function (...args) {
            originalPushState.apply(history, args);
            setTimeout(trackPageChange, 0);
        };

        history.replaceState = function (...args) {
            originalReplaceState.apply(history, args);
            setTimeout(trackPageChange, 0);
        };

        window.addEventListener('popstate', trackPageChange);

        // Cleanup
        return () => {
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            window.removeEventListener('popstate', trackPageChange);
        };
    }, []);

    return <>{children}</>;
}