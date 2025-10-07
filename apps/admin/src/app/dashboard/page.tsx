'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card } from '@runday/ui';
import { Calendar, Users, Trophy, TrendingUp, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, getRecentEvents, DashboardStats, RecentEventData } from '@/lib/dashboard-operations';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalEvents: 0,
        totalParticipants: 0,
        completedEvents: 0,
        eventsThisMonth: 0,
    });
    const [recentEvents, setRecentEvents] = useState<RecentEventData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [statsResult, eventsResult] = await Promise.all([
                getDashboardStats(),
                getRecentEvents(3)
            ]);

            if (statsResult.success && statsResult.data) {
                setStats(statsResult.data);
            } else {
                console.error('Failed to load stats:', statsResult.error);
                setError(statsResult.error || 'Failed to load dashboard statistics');
            }

            if (eventsResult.success && eventsResult.data) {
                setRecentEvents(eventsResult.data);
            } else {
                console.error('Failed to load recent events:', eventsResult.error);
            }
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            setError('An unexpected error occurred while loading dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-[#FF9F1C]/10 text-[#FF9F1C]';
            case 'completed':
                return 'bg-[#28A745]/10 text-[#28A745]';
            case 'cancelled':
                return 'bg-[#EF233C]/10 text-[#EF233C]';
            default:
                return 'bg-[#8D99AE]/10 text-[#8D99AE]';
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#2B2D42]">Dashboard</h1>
                            <p className="mt-2 text-[#8D99AE]">Welcome to your event management dashboard</p>
                        </div>
                        <button
                            onClick={loadDashboardData}
                            disabled={isLoading}
                            className="flex items-center gap-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-[#EF233C]/10 border border-[#EF233C]/20 text-[#EF233C] rounded-lg">
                            <p className="font-medium">Error loading dashboard data</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[#FF9F1C]/10 rounded-lg">
                                        <Calendar className="h-6 w-6 text-[#FF9F1C]" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-[#8D99AE]">Total Events</p>
                                        {isLoading ? (
                                            <div className="h-8 w-16 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                        ) : (
                                            <p className="text-2xl font-bold text-[#2B2D42]">{stats.totalEvents}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[#2B2D42]/10 rounded-lg">
                                        <Users className="h-6 w-6 text-[#2B2D42]" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-[#8D99AE]">Total Participants</p>
                                        {isLoading ? (
                                            <div className="h-8 w-20 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                        ) : (
                                            <p className="text-2xl font-bold text-[#2B2D42]">{stats.totalParticipants.toLocaleString()}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[#28A745]/10 rounded-lg">
                                        <Trophy className="h-6 w-6 text-[#28A745]" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-[#8D99AE]">Completed Events</p>
                                        {isLoading ? (
                                            <div className="h-8 w-12 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                        ) : (
                                            <p className="text-2xl font-bold text-[#2B2D42]">{stats.completedEvents}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[#8D99AE]/10 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-[#8D99AE]" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-[#8D99AE]">This Month</p>
                                        {isLoading ? (
                                            <div className="h-8 w-8 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                        ) : (
                                            <p className="text-2xl font-bold text-[#2B2D42]">{stats.eventsThisMonth}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-[#2B2D42]">Recent Events</h3>
                                    <Link
                                        href="/events"
                                        className="text-sm text-[#FF9F1C] hover:text-[#FF9F1C]/80 transition-colors"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {isLoading ? (
                                        <>
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center justify-between py-2">
                                                    <div>
                                                        <div className="h-5 w-32 bg-[#8D99AE]/20 rounded animate-pulse mb-2"></div>
                                                        <div className="h-4 w-20 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                    </div>
                                                    <div className="h-6 w-20 bg-[#8D99AE]/20 rounded-full animate-pulse"></div>
                                                </div>
                                            ))}
                                        </>
                                    ) : recentEvents.length > 0 ? (
                                        recentEvents.map((event) => (
                                            <div key={event.id} className="flex items-center justify-between py-2">
                                                <div>
                                                    <p className="font-medium text-[#2B2D42]">{event.name}</p>
                                                    <p className="text-sm text-[#8D99AE]">{formatDate(event.date)}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(event.status)}`}>
                                                    {event.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Calendar className="h-12 w-12 text-[#8D99AE]/30 mx-auto mb-3" />
                                            <p className="text-[#8D99AE] text-sm">No events yet</p>
                                            <Link
                                                href="/events/create"
                                                className="text-[#FF9F1C] hover:text-[#FF9F1C]/80 text-sm transition-colors"
                                            >
                                                Create your first event
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#2B2D42] mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link
                                        href="/events/create"
                                        className="block w-full text-left p-3 bg-[#FF9F1C]/5 hover:bg-[#FF9F1C]/10 border border-[#FF9F1C]/20 rounded-lg transition-colors"
                                    >
                                        <p className="font-medium text-[#2B2D42]">Create New Event</p>
                                        <p className="text-sm text-[#8D99AE]">Set up a new running event</p>
                                    </Link>
                                    <Link
                                        href="/events"
                                        className="block w-full text-left p-3 bg-[#2B2D42]/5 hover:bg-[#2B2D42]/10 border border-[#2B2D42]/20 rounded-lg transition-colors"
                                    >
                                        <p className="font-medium text-[#2B2D42]">Manage Events</p>
                                        <p className="text-sm text-[#8D99AE]">View and edit all events</p>
                                    </Link>
                                    <button
                                        onClick={loadDashboardData}
                                        disabled={isLoading}
                                        className="w-full text-left p-3 bg-[#8D99AE]/5 hover:bg-[#8D99AE]/10 border border-[#8D99AE]/20 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <p className="font-medium text-[#2B2D42]">Refresh Data</p>
                                        <p className="text-sm text-[#8D99AE]">Update dashboard statistics</p>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}