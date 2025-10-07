'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, Button } from '@runday/ui';
import { Calendar, MapPin, Trophy, Users, Activity, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
    getUserEventStats,
    getUserRegisteredEvents,
    getPublicEvents,
    EventRegistrationData,
    PublicEventData
} from '@/lib/event-operations';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalRegistered: 0,
        upcomingEvents: 0,
        completedEvents: 0,
        totalDistance: '0K',
    });
    const [recentEvents, setRecentEvents] = useState<EventRegistrationData[]>([]);
    const [upcomingPublicEvents, setUpcomingPublicEvents] = useState<PublicEventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Load user stats
            const statsResult = await getUserEventStats(user.id);
            if (statsResult.success && statsResult.data) {
                setStats(statsResult.data);
            }

            // Load user's recent events
            const eventsResult = await getUserRegisteredEvents(user.id);
            if (eventsResult.success && eventsResult.data) {
                // Get the most recent 3 events
                setRecentEvents(eventsResult.data.slice(0, 3));
            }

            // Load upcoming public events for suggestions
            const publicEventsResult = await getPublicEvents(user.id);
            if (publicEventsResult.success && publicEventsResult.data) {
                // Get next 2 events that user hasn't registered for
                const availableEvents = publicEventsResult.data
                    .filter(event => !event.isUserRegistered)
                    .slice(0, 2);
                setUpcomingPublicEvents(availableEvents);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getEventStatus = (event: any) => {
        const eventDate = new Date(event.event_date);
        const now = new Date();
        
        if (event.status === 'completed' || eventDate < now) {
            return 'completed';
        } else if (event.status === 'cancelled') {
            return 'cancelled';
        } else {
            return 'upcoming';
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="text-center">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Welcome to RunDay</h1>
                        <p className="text-slate-300 text-lg">Discover and join amazing running events</p>
                        {!isLoading && (
                            <button
                                onClick={loadDashboardData}
                                className="mt-2 text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                <RefreshCw className="h-3 w-3 inline mr-1" />
                                Refresh
                            </button>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-[#FF9F1C] to-amber-500 rounded-xl shadow-lg">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Upcoming Events</p>
                                    <p className="text-2xl font-bold text-white">
                                        {isLoading ? '-' : stats.upcomingEvents}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Completed</p>
                                    <p className="text-2xl font-bold text-white">
                                        {isLoading ? '-' : stats.completedEvents}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Total Distance</p>
                                    <p className="text-2xl font-bold text-white">
                                        {isLoading ? '-' : stats.totalDistance}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* My Recent Events */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">My Recent Events</h3>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.location.href = '/events/my'}
                                className="text-[#FF9F1C] hover:text-amber-400"
                            >
                                View All
                            </Button>
                        </div>
                        
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                                        <div className="flex items-center">
                                            <div className="h-5 w-5 bg-slate-600 rounded mr-3 animate-pulse"></div>
                                            <div>
                                                <div className="h-4 w-32 bg-slate-600 rounded mb-1 animate-pulse"></div>
                                                <div className="h-3 w-48 bg-slate-600 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="h-6 w-16 bg-slate-600 rounded animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ) : recentEvents.length > 0 ? (
                            <div className="space-y-4">
                                {recentEvents.map((registration) => (
                                    <div key={registration.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                                        <div className="flex items-center">
                                            <MapPin className="h-5 w-5 text-slate-300 mr-3" />
                                            <div>
                                                <p className="font-medium text-white">{registration.event?.name}</p>
                                                <p className="text-sm text-slate-300">
                                                    {formatDate(registration.event?.event_date || '')} • {registration.event?.location || 'Location TBA'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {getEventStatus(registration.event) === 'completed' && registration.finish_time ? (
                                                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30">
                                                    {registration.finish_time}
                                                </span>
                                            ) : getEventStatus(registration.event) === 'upcoming' ? (
                                                <span className="px-3 py-1 bg-gradient-to-r from-[#FF9F1C] to-amber-500 text-white rounded-full text-sm shadow-md">
                                                    Registered
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-slate-600/50 text-slate-400 rounded-full text-sm">
                                                    {registration.event?.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400 mb-4">No events registered yet</p>
                                <Button
                                    size="sm"
                                    onClick={() => window.location.href = '/events'}
                                    className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                                >
                                    Browse Events
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Discover New Events */}
                    {upcomingPublicEvents.length > 0 && (
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Discover New Events</h3>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.location.href = '/events'}
                                    className="text-[#FF9F1C] hover:text-amber-400"
                                >
                                    Browse All
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {upcomingPublicEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                                        <div className="flex items-center">
                                            <MapPin className="h-5 w-5 text-slate-300 mr-3" />
                                            <div>
                                                <p className="font-medium text-white">{event.name}</p>
                                                <p className="text-sm text-slate-300">
                                                    {formatDate(event.event_date)} • {event.location || 'Location TBA'} • {event.distance}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => window.location.href = '/events'}
                                            className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg"
                                        >
                                            Register
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}