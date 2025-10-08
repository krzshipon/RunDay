// Basic Analytics and Monitoring Utilities

export interface AnalyticsEvent {
    event: string;
    properties?: Record<string, any>;
    timestamp?: Date;
}

export class Analytics {
    private static appName: string;

    private static get isClient() {
        return typeof window !== 'undefined';
    }

    private static get isProduction() {
        return this.isClient && process.env.NODE_ENV === 'production';
    }

    static initialize(appName: 'user' | 'admin') {
        // Only initialize on client side
        if (!this.isClient) {
            console.log('Analytics.initialize called on server side, skipping');
            return;
        }

        this.appName = appName;
        console.log(`🔍 Analytics initialized for ${appName} app`);
    }

    static track(event: string, properties?: Record<string, any>) {
        // Only track on client side
        if (!this.isClient) return;

        const analyticsEvent: AnalyticsEvent = {
            event,
            properties: {
                ...properties,
                app: this.appName,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: window.navigator.userAgent
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
        if (!this.isClient) return;

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
        if (!this.isClient) return [];

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
        if (!this.isClient) return;
        this.track('page_view', { page });
    }

    static trackUserAction(action: string, details?: Record<string, any>) {
        if (!this.isClient) return;
        this.track('user_action', { action, ...details });
    }

    static trackError(error: string, details?: Record<string, any>) {
        if (!this.isClient) return;
        this.track('error', { error, ...details });
    }

    static trackRegistration(eventId: string) {
        if (!this.isClient) return;
        this.track('event_registration', { eventId });
    }

    static trackCertificateGeneration(eventId: string) {
        if (!this.isClient) return;
        this.track('certificate_generated', { eventId });
    }

    static trackEventCreation(eventId: string) {
        if (!this.isClient) return;
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