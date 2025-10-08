'use client';

import { useEffect } from 'react';

interface AnalyticsProviderProps {
    children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        let cleanup: (() => void) | undefined;

        // Dynamic import to ensure client-side only execution
        import('@runday/ui').then(({ Analytics }) => {
            // Initialize analytics for user app
            Analytics.initialize('user');

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

            // Setup cleanup
            cleanup = () => {
                history.pushState = originalPushState;
                history.replaceState = originalReplaceState;
                window.removeEventListener('popstate', trackPageChange);
            };
        });

        // Return cleanup function
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    return <>{children}</>;
}