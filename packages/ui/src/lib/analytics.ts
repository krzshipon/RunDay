// Basic Analytics and Monitoring Utilities
'use client';

export interface AnalyticsEvent {
    event: string;
    properties?: Record<string, any>;
    timestamp?: Date;
}

export class Analytics {
    private static isProduction = process.env.NODE_ENV === 'production';
    private static appName: string;

    static initialize(appName: 'user' | 'admin') {
        this.appName = appName;
        if (this.isProduction) {
            console.log(`🔍 Analytics initialized for ${appName} app`);
        }
    }

    static track(event: string, properties?: Record<string, any>) {
        const analyticsEvent: AnalyticsEvent = {
            event,
            properties: {
                ...properties,
                app: this.appName,
                timestamp: new Date().toISOString(),
                url: typeof window !== 'undefined' ? window.location.href : 'server',
                userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
            },
            timestamp: new Date()
        };

        // In development, just log to console
        if (!this.isProduction) {
            console.log('📈 Analytics Event:', analyticsEvent);
            return;
        }

        // In production, you could send to analytics service
        // For now, we'll store in localStorage for basic tracking
        this.storeEvent(analyticsEvent);
    }

    private static storeEvent(event: AnalyticsEvent) {
        try {
            const events = this.getStoredEvents();
            events.push(event);

            // Keep only last 100 events to prevent localStorage bloat
            const recentEvents = events.slice(-100);
            localStorage.setItem('runday_analytics', JSON.stringify(recentEvents));
        } catch (error) {
            console.warn('Analytics storage failed:', error);
        }
    }

    static getStoredEvents(): AnalyticsEvent[] {
        try {
            const stored = localStorage.getItem('runday_analytics');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Analytics retrieval failed:', error);
            return [];
        }
    }

    // Common event tracking methods
    static trackPageView(page: string) {
        this.track('page_view', { page });
    }

    static trackUserAction(action: string, details?: Record<string, any>) {
        this.track('user_action', { action, ...details });
    }

    static trackError(error: string, details?: Record<string, any>) {
        this.track('error', { error, ...details });
    }

    static trackRegistration(eventId: string) {
        this.track('event_registration', { eventId });
    }

    static trackCertificateGeneration(eventId: string) {
        this.track('certificate_generated', { eventId });
    }

    static trackEventCreation(eventId: string) {
        this.track('event_created', { eventId });
    }
}

// Error monitoring
export const trackError = (error: Error, context?: string) => {
    Analytics.trackError(error.message, {
        stack: error.stack,
        context,
        name: error.name
    });
};

// Performance monitoring  
export const trackPerformance = (name: string, duration: number) => {
    Analytics.track('performance', {
        metric: name,
        duration,
        timestamp: Date.now()
    });
};