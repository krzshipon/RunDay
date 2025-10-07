'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, Button, Input } from '@runday/ui';
import {
    Calendar,
    MapPin,
    Clock,
    Trophy,
    Search,
    Filter,
    RefreshCw,
    Download,
    BarChart3,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
    getUserRegisteredEvents,
    EventRegistrationData
} from '@/lib/event-operations';

export default function EventHistoryPage() {
    const { user } = useAuth();
    const [allRegistrations, setAllRegistrations] = useState<EventRegistrationData[]>([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState<EventRegistrationData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'date' | 'time' | 'distance'>('date');

    useEffect(() => {
        loadEventHistory();
    }, [user]);

    useEffect(() => {
        filterAndSortEvents();
    }, [searchQuery, selectedYear, sortBy, allRegistrations]);

    const loadEventHistory = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const result = await getUserRegisteredEvents(user.id);
            if (result.success && result.data) {
                setAllRegistrations(result.data);
                setError(null);
            } else {
                setError(result.error || 'Failed to load event history');
            }
        } catch (err) {
            console.error('Error loading event history:', err);
            setError('An unexpected error occurred while loading your event history');
        } finally {
            setIsLoading(false);
        }
    };

    const filterAndSortEvents = () => {
        let filtered = [...allRegistrations];

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(reg =>
                reg.event?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reg.event?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reg.event?.distance.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by year
        if (selectedYear !== 'all') {
            filtered = filtered.filter(reg => {
                const eventYear = new Date(reg.event?.event_date || '').getFullYear().toString();
                return eventYear === selectedYear;
            });
        }

        // Sort events
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.event?.event_date || '').getTime() - new Date(a.event?.event_date || '').getTime();
                case 'time':
                    if (!a.finish_time && !b.finish_time) return 0;
                    if (!a.finish_time) return 1;
                    if (!b.finish_time) return -1;
                    return a.finish_time.localeCompare(b.finish_time);
                case 'distance':
                    const getDistanceValue = (distance: string) => {
                        const match = distance.match(/(\d+\.?\d*)/);
                        return match ? parseFloat(match[1]) : 0;
                    };
                    return getDistanceValue(b.event?.distance || '') - getDistanceValue(a.event?.distance || '');
                default:
                    return 0;
            }
        });

        setFilteredRegistrations(filtered);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString?: string) => {
        if (!timeString) return '-';
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

    const getUniqueYears = () => {
        const years = allRegistrations.map(reg =>
            new Date(reg.event?.event_date || '').getFullYear().toString()
        );
        return [...new Set(years)].sort().reverse();
    };

    const getStatistics = () => {
        const completedEvents = filteredRegistrations.filter(reg =>
            getEventStatus(reg.event) === 'completed' && reg.finish_time
        );

        const totalDistance = filteredRegistrations.reduce((total, reg) => {
            const distance = reg.event?.distance?.replace(/[^0-9.]/g, '') || '0';
            return total + (parseFloat(distance) || 0);
        }, 0);

        const averageTime = completedEvents.length > 0 ? 'Avg. calculation needed' : '-';

        return {
            totalEvents: filteredRegistrations.length,
            completedEvents: completedEvents.length,
            totalDistance: `${totalDistance}K`,
            averageTime,
        };
    };

    const stats = getStatistics();

    if (isLoading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Event History</h1>
                                <p className="mt-2 text-slate-300">Your complete running event history</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent mx-auto mb-4"></div>
                                <p className="text-slate-300">Loading your event history...</p>
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
                            <h1 className="text-3xl font-bold text-white">Event History</h1>
                            <p className="mt-2 text-slate-300">Your complete running event history</p>
                        </div>
                        <button
                            onClick={loadEventHistory}
                            disabled={isLoading}
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-[#FF9F1C]" />
                                <p className="text-xs text-slate-400">Total Events</p>
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="h-4 w-4 text-emerald-400" />
                                <p className="text-xs text-slate-400">Completed</p>
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.completedEvents}</p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-purple-400" />
                                <p className="text-xs text-slate-400">Total Distance</p>
                            </div>
                            <p className="text-2xl font-bold text-white">{stats.totalDistance}</p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-amber-400" />
                                <p className="text-xs text-slate-400">Average Time</p>
                            </div>
                            <p className="text-lg font-bold text-white">{stats.averageTime}</p>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                            {/* Year Filter */}
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                            >
                                <option value="all">All Years</option>
                                {getUniqueYears().map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'date' | 'time' | 'distance')}
                                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="time">Sort by Time</option>
                                <option value="distance">Sort by Distance</option>
                            </select>

                            {/* Export */}
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 text-slate-300 hover:text-white"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                            <p className="font-medium">Error loading event history</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {/* Events List */}
                    <div className="space-y-4">
                        {filteredRegistrations.length > 0 ? (
                            filteredRegistrations.map((registration, index) => (
                                <div key={registration.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-xl font-semibold text-white">{registration.event?.name}</h3>
                                                <span className="text-sm text-slate-400">#{index + 1}</span>
                                                {getEventStatus(registration.event) === 'completed' && registration.finish_time && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-400 rounded-full text-sm border border-emerald-500/30">
                                                        Completed
                                                    </span>
                                                )}
                                                {getEventStatus(registration.event) === 'cancelled' && (
                                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">
                                                        Cancelled
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                                                    <Trophy className="h-4 w-4" />
                                                    <div>
                                                        <p className="text-xs text-slate-400">Bib #</p>
                                                        <p className="text-sm font-medium font-mono">
                                                            {registration.bib_number || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Results for completed events */}
                                            {getEventStatus(registration.event) === 'completed' && (registration.finish_time || registration.position) && (
                                                <div className="flex items-center gap-6 p-4 bg-slate-700/30 rounded-lg">
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
                                                    {registration.finish_time && (
                                                        <div className="ml-auto">
                                                            <Button
                                                                size="sm"
                                                                className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                                                            >
                                                                <Download className="h-3 w-3 mr-1" />
                                                                Certificate
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
                                    <BarChart3 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        {searchQuery || selectedYear !== 'all'
                                            ? 'No events match your filters'
                                            : 'No event history yet'
                                        }
                                    </h3>
                                    <p className="text-slate-400 mb-4">
                                        {searchQuery || selectedYear !== 'all'
                                            ? 'Try adjusting your search criteria'
                                            : 'Start participating in events to build your running history!'
                                        }
                                    </p>
                                    {searchQuery || selectedYear !== 'all' ? (
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedYear('all');
                                            }}
                                            className="text-[#FF9F1C] hover:text-amber-400"
                                        >
                                            Clear Filters
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => window.location.href = '/events'}
                                            className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                                        >
                                            Browse Events
                                        </Button>
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