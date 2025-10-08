'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { getDashboardStats, getEventsByStatus } from '@/lib/dashboard-operations';
import { Button, Input, Label } from '@runday/ui';
import {
    User,
    Mail,
    Calendar,
    Trophy,
    Users,
    BarChart3,
    Edit,
    Save,
    X,
    RefreshCw,
    Shield,
    Settings,
    Activity,
    Target
} from 'lucide-react';

interface AdminProfile {
    id: string;
    full_name: string;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

interface AdminStats {
    totalEvents: number;
    totalParticipants: number;
    completedEvents: number;
    eventsThisMonth: number;
    upcomingEvents: number;
    cancelledEvents: number;
}

export default function AdminProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchAdminProfile();
            fetchAdminStats();
        }
    }, [user]);

    const fetchAdminProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setProfile(data);
                setEditedName(data.full_name);
            } else {
                // Create profile if it doesn't exist
                await createAdminProfile();
            }
        } catch (err) {
            console.error('Error fetching admin profile:', err);
            setError('Failed to load profile');
        }
    };

    const createAdminProfile = async () => {
        const defaultName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';

        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert({
                    id: user?.id as string,
                    full_name: defaultName,
                    role: 'admin',
                })
                .select()
                .single();

            if (error) throw error;

            setProfile(data);
            setEditedName(data.full_name);
        } catch (err) {
            console.error('Error creating admin profile:', err);
            setError('Failed to create profile');
        }
    };

    const fetchAdminStats = async () => {
        try {
            // Fetch dashboard statistics
            const dashboardStatsResult = await getDashboardStats();
            const eventsByStatusResult = await getEventsByStatus();

            if (dashboardStatsResult.success && eventsByStatusResult.success) {
                const dashboardStats = dashboardStatsResult.data!;
                const eventsByStatus = eventsByStatusResult.data!;

                setStats({
                    totalEvents: dashboardStats.totalEvents,
                    totalParticipants: dashboardStats.totalParticipants,
                    completedEvents: dashboardStats.completedEvents,
                    eventsThisMonth: dashboardStats.eventsThisMonth,
                    upcomingEvents: eventsByStatus.upcoming,
                    cancelledEvents: eventsByStatus.cancelled,
                });
            }
        } catch (err) {
            console.error('Error fetching admin stats:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!profile || !editedName.trim()) return;

        setIsSaving(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    full_name: editedName.trim(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', user?.id)
                .select()
                .single();

            if (error) throw error;

            setProfile(data);
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedName(profile?.full_name || '');
        setIsEditing(false);
        setError(null);
    };

    const refreshData = () => {
        if (user) {
            fetchAdminProfile();
            fetchAdminStats();
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9F1C]"></div>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-8">
                    {/* Page Header */}
                    <div className="text-center">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Admin Profile</h1>
                        <p className="text-slate-300 text-lg">Manage your admin account and view platform statistics</p>
                        <button
                            onClick={refreshData}
                            className="mt-2 text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            <RefreshCw className="h-3 w-3 inline mr-1" />
                            Refresh
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Profile Information Section */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Shield className="h-6 w-6 text-[#FF9F1C]" />
                                Administrator Profile
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Avatar and Basic Info */}
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF9F1C] to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-orange-500/20">
                                        {(profile?.full_name || user?.email || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-white">
                                            {profile?.full_name || 'Loading...'}
                                        </h4>
                                        <p className="text-orange-400 capitalize font-medium flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Administrator
                                        </p>
                                    </div>
                                </div>

                                {/* Full Name Edit */}
                                <div>
                                    <Label className="text-sm font-medium text-slate-300 mb-2 block">
                                        Full Name
                                    </Label>
                                    {isEditing ? (
                                        <div className="flex gap-2">
                                            <Input
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                placeholder="Enter your full name"
                                                className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                                            />
                                            <Button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving || !editedName.trim()}
                                                size="sm"
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                            >
                                                {isSaving ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                onClick={handleCancelEdit}
                                                variant="secondary"
                                                size="sm"
                                                className="bg-slate-600 hover:bg-slate-500 text-white border-slate-500"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white">
                                                {profile?.full_name || 'Not set'}
                                            </div>
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                variant="secondary"
                                                size="sm"
                                                className="bg-slate-600 hover:bg-slate-500 text-white border-slate-500"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Account Details */}
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-sm font-medium text-slate-300 mb-2 block">
                                        Email Address
                                    </Label>
                                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-white">{user?.email}</span>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-slate-300 mb-2 block">
                                        Administrator Since
                                    </Label>
                                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                        <span className="text-white">
                                            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'Unknown'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-slate-300 mb-2 block">
                                        Access Level
                                    </Label>
                                    <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-orange-900/20 to-amber-900/20 border border-orange-500/30 rounded-lg">
                                        <Shield className="h-4 w-4 text-orange-400" />
                                        <span className="text-orange-300 font-medium">Full Administrative Access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Platform Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-[#FF9F1C] to-amber-500 rounded-xl shadow-lg">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Total Events</p>
                                    <p className="text-2xl font-bold text-white">{stats?.totalEvents || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Total Participants</p>
                                    <p className="text-2xl font-bold text-white">{stats?.totalParticipants || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Completed Events</p>
                                    <p className="text-2xl font-bold text-white">{stats?.completedEvents || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">This Month</p>
                                    <p className="text-2xl font-bold text-white">{stats?.eventsThisMonth || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Event Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                            <div className="text-center">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg w-fit mx-auto mb-3">
                                    <Target className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-sm font-medium text-slate-300 mb-1">Upcoming Events</p>
                                <p className="text-3xl font-bold text-white">{stats?.upcomingEvents || 0}</p>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                            <div className="text-center">
                                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg w-fit mx-auto mb-3">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-sm font-medium text-slate-300 mb-1">Completed Events</p>
                                <p className="text-3xl font-bold text-white">{stats?.completedEvents || 0}</p>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                            <div className="text-center">
                                <div className="p-3 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl shadow-lg w-fit mx-auto mb-3">
                                    <X className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-sm font-medium text-slate-300 mb-1">Cancelled Events</p>
                                <p className="text-3xl font-bold text-white">{stats?.cancelledEvents || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Quick Actions */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Admin Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Button
                                variant="secondary"
                                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600 p-4 h-auto"
                                onClick={() => window.location.href = '/events/create'}
                            >
                                <Calendar className="h-5 w-5 text-[#FF9F1C]" />
                                <div className="text-left">
                                    <div className="font-medium">Create Event</div>
                                    <div className="text-xs text-slate-400">New event</div>
                                </div>
                            </Button>

                            <Button
                                variant="secondary"
                                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600 p-4 h-auto"
                                onClick={() => window.location.href = '/events'}
                            >
                                <BarChart3 className="h-5 w-5 text-[#FF9F1C]" />
                                <div className="text-left">
                                    <div className="font-medium">Manage Events</div>
                                    <div className="text-xs text-slate-400">View all events</div>
                                </div>
                            </Button>

                            <Button
                                variant="secondary"
                                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600 p-4 h-auto"
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                <Activity className="h-5 w-5 text-[#FF9F1C]" />
                                <div className="text-left">
                                    <div className="font-medium">Dashboard</div>
                                    <div className="text-xs text-slate-400">Overview</div>
                                </div>
                            </Button>

                            <Button
                                variant="secondary"
                                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600 p-4 h-auto"
                                onClick={() => window.location.href = '/settings'}
                            >
                                <Settings className="h-5 w-5 text-[#FF9F1C]" />
                                <div className="text-left">
                                    <div className="font-medium">Settings</div>
                                    <div className="text-xs text-slate-400">Configure</div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}