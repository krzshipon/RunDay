'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Button, Input, Label } from '@runday/ui';
import { User, Mail, Calendar, Trophy, Target, Clock, Edit, Save, X, RefreshCw } from 'lucide-react';

interface UserProfile {
    id: string;
    full_name: string;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

interface UserStats {
    totalEvents: number;
    completedEvents: number;
    totalCertificates: number;
    averagePosition: number | null;
    bestPosition: number | null;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchUserProfile();
            fetchUserStats();
        }
    }, [user]);

    const fetchUserProfile = async () => {
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
                await createUserProfile();
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        }
    };

    const createUserProfile = async () => {
        const defaultName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

        try {
            const { data, error } = await supabase
                .from('profiles')
                .insert({
                    id: user?.id as string,
                    full_name: defaultName,
                    role: 'user',
                })
                .select()
                .single();

            if (error) throw error;

            setProfile(data);
            setEditedName(data.full_name);
        } catch (err) {
            console.error('Error creating profile:', err);
            setError('Failed to create profile');
        }
    };

    const fetchUserStats = async () => {
        try {
            // Fetch user registrations
            const { data: registrations, error: regError } = await supabase
                .from('registrations')
                .select(`
                    *,
                    events (
                        status,
                        event_date
                    )
                `)
                .eq('user_id', user?.id);

            if (regError) throw regError;

            // Calculate stats
            const totalEvents = registrations?.length || 0;
            const completedEvents = registrations?.filter((reg: any) =>
                reg.events?.status === 'completed' && reg.finish_time
            ).length || 0;

            const positions = registrations
                ?.filter((reg: any) => reg.position && reg.finish_time)
                .map((reg: any) => reg.position) || [];

            const averagePosition = positions.length > 0
                ? Math.round(positions.reduce((sum: number, pos: number) => sum + (pos || 0), 0) / positions.length)
                : null; const bestPosition = positions.length > 0 ? Math.min(...positions) : null;

            // Count certificates (completed events with finish times)
            const totalCertificates = completedEvents;

            setStats({
                totalEvents,
                completedEvents,
                totalCertificates,
                averagePosition,
                bestPosition
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
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
            fetchUserProfile();
            fetchUserStats();
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
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Profile</h1>
                        <p className="text-slate-300 text-lg">Manage your account and view your running statistics</p>
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
                                <User className="h-6 w-6 text-[#FF9F1C]" />
                                Profile Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column - Avatar and Basic Info */}
                            <div className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF9F1C] to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-white">
                                            {profile?.full_name || 'Loading...'}
                                        </h4>
                                        <p className="text-slate-400 capitalize">
                                            {profile?.role} Account
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
                                        Member Since
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
                            </div>
                        </div>
                    </div>

                    {/* Statistics Grid */}
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
                                    <Target className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Completed</p>
                                    <p className="text-2xl font-bold text-white">{stats?.completedEvents || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Certificates</p>
                                    <p className="text-2xl font-bold text-white">{stats?.totalCertificates || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-slate-300">Best Position</p>
                                    <p className="text-2xl font-bold text-white">
                                        {stats?.bestPosition ? `#${stats.bestPosition}` : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Button
                                variant="secondary"
                                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600 p-4 h-auto"
                                onClick={() => window.location.href = '/events'}
                            >
                                <Target className="h-5 w-5 text-[#FF9F1C]" />
                                <div className="text-left">
                                    <div className="font-medium">Browse Events</div>
                                    <div className="text-xs text-slate-400">Find new races</div>
                                </div>
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600 p-4 h-auto"
                                onClick={() => window.location.href = '/events/my'}
                            >
                                <Calendar className="h-5 w-5 text-[#FF9F1C]" />
                                <div className="text-left">
                                    <div className="font-medium">My Events</div>
                                    <div className="text-xs text-slate-400">View registrations</div>
                                </div>
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600 p-4 h-auto"
                                onClick={() => window.location.href = '/certificates'}
                            >
                                <Trophy className="h-5 w-5 text-[#FF9F1C]" />
                                <div className="text-left">
                                    <div className="font-medium">Certificates</div>
                                    <div className="text-xs text-slate-400">Download awards</div>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}