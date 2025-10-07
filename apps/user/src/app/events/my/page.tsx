'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, Button } from '@runday/ui';
import { 
    Calendar, 
    MapPin, 
    Users, 
    Clock,
    Trophy,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    Download
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
    getUserRegisteredEvents,
    cancelRegistration,
    EventRegistrationData
} from '@/lib/event-operations';

export default function MyEventsPage() {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState<EventRegistrationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

    useEffect(() => {
        loadMyEvents();
    }, [user]);

    const loadMyEvents = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const result = await getUserRegisteredEvents(user.id);
            if (result.success && result.data) {
                setRegistrations(result.data);
                setError(null);
            } else {
                setError(result.error || 'Failed to load your events');
            }
        } catch (err) {
            console.error('Error loading user events:', err);
            setError('An unexpected error occurred while loading your events');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelRegistration = async (eventId: string, eventName: string) => {
        if (!user || isUpdating) return;

        if (!confirm(`Are you sure you want to cancel your registration for "${eventName}"?`)) {
            return;
        }

        setIsUpdating(eventId);
        try {
            const result = await cancelRegistration(eventId, user.id);
            if (result.success) {
                // Refresh events to update the list
                await loadMyEvents();
                alert('Registration cancelled successfully');
            } else {
                alert(`Cancellation failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Error cancelling registration:', error);
            alert('An unexpected error occurred during cancellation');
        } finally {
            setIsUpdating(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatTime = (timeString?: string) => {
        if (!timeString) return '-';
        // Handle both time formats that might come from the database
        if (timeString.includes(':')) {
            return timeString;
        }
        return timeString;
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

    const filteredRegistrations = registrations.filter(reg => {
        const status = getEventStatus(reg.event);
        return activeTab === 'upcoming' ? status === 'upcoming' : status === 'completed';
    });

    const upcomingCount = registrations.filter(reg => getEventStatus(reg.event) === 'upcoming').length;
    const completedCount = registrations.filter(reg => getEventStatus(reg.event) === 'completed').length;

    if (isLoading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">My Events</h1>
                                <p className="mt-2 text-slate-300">Manage your event registrations</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent mx-auto mb-4"></div>
                                <p className="text-slate-300">Loading your events...</p>
                            </div>
                        </div>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">My Events</h1>
                            <p className="mt-2 text-slate-300">Manage your event registrations</p>
                        </div>
                        <button
                            onClick={loadMyEvents}
                            disabled={isLoading}
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                <p className="font-medium">Error loading events</p>
                            </div>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="border-b border-slate-700">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('upcoming')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'upcoming'
                                        ? 'border-[#FF9F1C] text-[#FF9F1C]'
                                        : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                                }`}
                            >
                                Upcoming Events ({upcomingCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'completed'
                                        ? 'border-[#FF9F1C] text-[#FF9F1C]'
                                        : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                                }`}
                            >
                                Completed Events ({completedCount})
                            </button>
                        </nav>
                    </div>

                    {/* Events List */}
                    <div className="space-y-4">
                        {filteredRegistrations.length > 0 ? (
                            filteredRegistrations.map((registration) => (
                                <div key={registration.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Event Header */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <h3 className="text-xl font-semibold text-white">{registration.event?.name}</h3>
                                                {activeTab === 'completed' && registration.finish_time && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30">
                                                        <Trophy className="h-3 w-3 inline mr-1" />
                                                        Finished
                                                    </span>
                                                )}
                                            </div>

                                            {/* Event Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Calendar className="h-4 w-4" />
                                                    <div>
                                                        <p className="text-xs text-slate-400">Date</p>
                                                        <p className="text-sm font-medium">{formatDate(registration.event?.event_date || '')}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <MapPin className="h-4 w-4" />
                                                    <div>
                                                        <p className="text-xs text-slate-400">Location</p>
                                                        <p className="text-sm font-medium">{registration.event?.location || 'TBA'}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Clock className="h-4 w-4" />
                                                    <div>
                                                        <p className="text-xs text-slate-400">Distance</p>
                                                        <p className="text-sm font-medium">{registration.event?.distance}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Users className="h-4 w-4" />
                                                    <div>
                                                        <p className="text-xs text-slate-400">Bib Number</p>
                                                        <p className="text-sm font-medium font-mono">
                                                            {registration.bib_number || 'Not assigned'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Results (for completed events) */}
                                            {activeTab === 'completed' && (registration.finish_time || registration.position) && (
                                                <div className="flex items-center gap-6 p-4 bg-slate-700/30 rounded-lg mb-4">
                                                    {registration.finish_time && (
                                                        <div className="text-center">
                                                            <p className="text-xs text-slate-400">Finish Time</p>
                                                            <p className="text-lg font-mono font-semibold text-emerald-400">
                                                                {formatTime(registration.finish_time)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {registration.position && (
                                                        <div className="text-center">
                                                            <p className="text-xs text-slate-400">Position</p>
                                                            <p className="text-lg font-semibold text-amber-400">
                                                                #{registration.position}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Description */}
                                            {registration.event?.description && (
                                                <p className="text-sm text-slate-400 mt-2">
                                                    {registration.event.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 ml-6">
                                            {activeTab === 'upcoming' && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleCancelRegistration(registration.event_id, registration.event?.name || '')}
                                                    disabled={isUpdating === registration.event_id}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                >
                                                    {isUpdating === registration.event_id ? 'Cancelling...' : 'Cancel Registration'}
                                                </Button>
                                            )}
                                            
                                            {activeTab === 'completed' && registration.finish_time && (
                                                <Button
                                                    size="sm"
                                                    className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                                                >
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Certificate
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
                                    {activeTab === 'upcoming' ? (
                                        <>
                                            <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-white mb-2">No upcoming events</h3>
                                            <p className="text-slate-400 mb-4">You haven't registered for any upcoming events yet.</p>
                                            <Button
                                                onClick={() => window.location.href = '/events'}
                                                className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                                            >
                                                Browse Events
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Trophy className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-white mb-2">No completed events</h3>
                                            <p className="text-slate-400">You haven't completed any events yet. Register for events to start building your running history!</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}