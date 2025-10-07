'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RegistrationStatus } from '@/components/RegistrationStatus';
import { Card, Button, Input } from '@runday/ui';
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    Search,
    Filter,
    RefreshCw,
    Heart,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
    getPublicEvents,
    registerForEvent,
    cancelRegistration,
    PublicEventData
} from '@/lib/event-operations';

export default function EventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<PublicEventData[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<PublicEventData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [selectedDistance, setSelectedDistance] = useState<string>('all');
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

    useEffect(() => {
        loadEvents();
    }, [user]);

    useEffect(() => {
        filterEvents();
    }, [searchQuery, selectedDistance, showOnlyAvailable, events]);

    const loadEvents = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const result = await getPublicEvents(user.id);
            if (result.success && result.data) {
                setEvents(result.data);
                setError(null);
            } else {
                setError(result.error || 'Failed to load events');
            }
        } catch (err) {
            console.error('Error loading events:', err);
            setError('An unexpected error occurred while loading events');
        } finally {
            setIsLoading(false);
        }
    };

    const filterEvents = () => {
        let filtered = [...events];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(event =>
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Distance filter
        if (selectedDistance !== 'all') {
            filtered = filtered.filter(event =>
                event.distance.toLowerCase().includes(selectedDistance.toLowerCase())
            );
        }

        // Availability filter
        if (showOnlyAvailable) {
            filtered = filtered.filter(event =>
                !event.max_participants ||
                (event.registeredCount || 0) < event.max_participants
            );
        }

        setFilteredEvents(filtered);
    };

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Auto-clear messages after 5 seconds
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                setErrorMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const handleRegister = async (eventId: string) => {
        if (!user || isRegistering) return;

        setIsRegistering(eventId);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await registerForEvent(eventId, user.id);
            if (result.success) {
                // Refresh events to update registration status
                await loadEvents();
                setSuccessMessage('Successfully registered for the event! 🎉');
            } else {
                // Handle specific validation errors with better messages
                let errorMsg = result.error || 'Registration failed';

                switch (result.validationError) {
                    case 'ALREADY_REGISTERED':
                        errorMsg = 'You are already registered for this event';
                        break;
                    case 'EVENT_FULL':
                        errorMsg = 'Sorry, this event is full. Try checking back for cancellations.';
                        break;
                    case 'EVENT_PAST':
                        errorMsg = 'Cannot register for past events';
                        break;
                    case 'EVENT_CANCELLED':
                        errorMsg = 'This event has been cancelled';
                        break;
                    case 'REGISTRATION_CLOSED':
                        errorMsg = 'Registration is closed (events close 2 hours before start time)';
                        break;
                }

                setErrorMessage(errorMsg);
            }
        } catch (error) {
            console.error('Error registering for event:', error);
            setErrorMessage('An unexpected error occurred during registration. Please try again.');
        } finally {
            setIsRegistering(null);
        }
    };

    const handleCancelRegistration = async (eventId: string) => {
        if (!user || isRegistering) return;

        setIsRegistering(eventId);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await cancelRegistration(eventId, user.id);
            if (result.success) {
                // Refresh events to update registration status
                await loadEvents();
                setSuccessMessage('Registration cancelled successfully');
            } else {
                setErrorMessage(result.error || 'Failed to cancel registration');
            }
        } catch (error) {
            console.error('Error cancelling registration:', error);
            setErrorMessage('An unexpected error occurred during cancellation');
        } finally {
            setIsRegistering(null);
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

    const getAvailabilityInfo = (event: PublicEventData) => {
        if (!event.max_participants) {
            return { text: 'Unlimited spots', color: 'text-emerald-400', available: true };
        }

        const registered = event.registeredCount || 0;
        const remaining = event.max_participants - registered;

        if (remaining <= 0) {
            return { text: 'Event Full', color: 'text-red-400', available: false };
        } else if (remaining <= 5) {
            return { text: `${remaining} spots left`, color: 'text-amber-400', available: true };
        } else {
            return { text: `${remaining} spots available`, color: 'text-emerald-400', available: true };
        }
    };

    const getUniqueDistances = () => {
        const distances = events.map(event => event.distance);
        return [...new Set(distances)].sort();
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Browse Events</h1>
                                <p className="mt-2 text-slate-300">Discover and register for running events</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent mx-auto mb-4"></div>
                                <p className="text-slate-300">Loading events...</p>
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
                            <h1 className="text-3xl font-bold text-white">Browse Events</h1>
                            <p className="mt-2 text-slate-300">Discover and register for running events</p>
                        </div>
                        <button
                            onClick={loadEvents}
                            disabled={isLoading}
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                                />
                            </div>

                            {/* Distance Filter */}
                            <select
                                value={selectedDistance}
                                onChange={(e) => setSelectedDistance(e.target.value)}
                                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                            >
                                <option value="all">All Distances</option>
                                {getUniqueDistances().map(distance => (
                                    <option key={distance} value={distance}>{distance}</option>
                                ))}
                            </select>

                            {/* Availability Filter */}
                            <label className="flex items-center gap-2 text-white">
                                <input
                                    type="checkbox"
                                    checked={showOnlyAvailable}
                                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                    className="rounded border-slate-600 bg-slate-700/50 text-[#FF9F1C] focus:ring-[#FF9F1C]"
                                />
                                Show only available events
                            </label>
                        </div>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <p className="font-medium">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <p className="font-medium">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Loading Error Display */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <p className="font-medium">Error loading events</p>
                            </div>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => {
                                const availabilityInfo = getAvailabilityInfo(event);

                                return (
                                    <div key={event.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-200">
                                        <div className="p-6">
                                            {/* Event Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                                                <button className="text-slate-400 hover:text-[#FF9F1C] transition-colors">
                                                    <Heart className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Event Details */}
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-sm">{formatDate(event.event_date)}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-sm">{event.location || 'Location TBA'}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-sm">{event.distance}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-slate-400" />
                                                    <span className={`text-sm ${availabilityInfo.color}`}>
                                                        {availabilityInfo.text}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            {event.description && (
                                                <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                                                    {event.description}
                                                </p>
                                            )}

                                            {/* Enhanced Registration Status */}
                                            <div className="mt-4">
                                                <RegistrationStatus
                                                    event={event}
                                                    onRegister={() => handleRegister(event.id)}
                                                    onCancel={() => handleCancelRegistration(event.id)}
                                                    loading={isRegistering === event.id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Calendar className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">
                                    {searchQuery || selectedDistance !== 'all' || showOnlyAvailable
                                        ? 'No events match your filters'
                                        : 'No events available'
                                    }
                                </h3>
                                <p className="text-slate-400">
                                    {searchQuery || selectedDistance !== 'all' || showOnlyAvailable
                                        ? 'Try adjusting your search criteria'
                                        : 'Check back later for new running events'
                                    }
                                </p>
                                {(searchQuery || selectedDistance !== 'all' || showOnlyAvailable) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedDistance('all');
                                            setShowOnlyAvailable(false);
                                        }}
                                        className="mt-4 text-[#FF9F1C] hover:text-amber-400"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}