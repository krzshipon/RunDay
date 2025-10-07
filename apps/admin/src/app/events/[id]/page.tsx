'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, Button, Input } from '@runday/ui';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Clock,
    Edit2,
    Trash2,
    Copy,
    Play,
    Pause,
    CheckCircle,
    XCircle,
    RefreshCw,
    Search,
    Hash,
    Download,
    Trophy
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import {
    getAllEvents,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    updateEventStatus,
    EventData,
    EventFormData
} from '../../../lib/event-operations';
import {
    getEventParticipants,
    updateParticipant,
    assignBibNumbers,
    removeParticipant,
    getParticipantStats,
    EventParticipant,
    ParticipantFormData
} from '../../../lib/participant-operations';

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const eventId = params.id as string;

    // Event state
    const [event, setEvent] = useState<EventData | null>(null);
    const [isLoadingEvent, setIsLoadingEvent] = useState(true);
    const [eventError, setEventError] = useState<string | null>(null);

    // Participants state
    const [participants, setParticipants] = useState<EventParticipant[]>([]);
    const [filteredParticipants, setFilteredParticipants] = useState<EventParticipant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
    const [participantsError, setParticipantsError] = useState<string | null>(null);

    // Participant stats
    const [stats, setStats] = useState<{
        total: number;
        withBibNumbers: number;
        completed: number;
        averageTime?: string;
    }>({
        total: 0,
        withBibNumbers: 0,
        completed: 0,
        averageTime: undefined
    });

    // Edit states
    const [isUpdating, setIsUpdating] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<ParticipantFormData>({});

    // Tab state
    const [activeTab, setActiveTab] = useState<'overview' | 'participants'>('overview');

    useEffect(() => {
        if (eventId) {
            loadEventDetails();
            loadParticipants();
            loadStats();
        }
    }, [eventId]);

    useEffect(() => {
        // Filter participants based on search query
        if (!searchQuery) {
            setFilteredParticipants(participants);
        } else {
            const filtered = participants.filter(p =>
                p.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.user_name && p.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p.bib_number && p.bib_number.toString().includes(searchQuery))
            );
            setFilteredParticipants(filtered);
        }
    }, [searchQuery, participants]);

    const loadEventDetails = async () => {
        setIsLoadingEvent(true);
        try {
            const result = await getAllEvents();
            if (result.success && result.data) {
                const foundEvent = result.data.find((e: EventData) => e.id === eventId);
                if (foundEvent) {
                    setEvent(foundEvent);
                    setEventError(null);
                } else {
                    setEventError('Event not found');
                }
            } else {
                setEventError(result.error || 'Failed to load event');
            }
        } catch (err) {
            console.error('Error loading event:', err);
            setEventError('An unexpected error occurred while loading event');
        } finally {
            setIsLoadingEvent(false);
        }
    };

    const loadParticipants = async () => {
        setIsLoadingParticipants(true);
        try {
            const result = await getEventParticipants(eventId);
            if (result.success && result.data) {
                setParticipants(result.data);
                setParticipantsError(null);
            } else {
                setParticipantsError(result.error || 'Failed to load participants');
            }
        } catch (err) {
            console.error('Error loading participants:', err);
            setParticipantsError('An unexpected error occurred while loading participants');
        } finally {
            setIsLoadingParticipants(false);
        }
    };

    const loadStats = async () => {
        try {
            const result = await getParticipantStats(eventId);
            if (result.success && result.data) {
                setStats(result.data);
            }
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };

    const handleAssignBibNumbers = async () => {
        if (!user) return;

        setIsUpdating(true);
        try {
            const result = await assignBibNumbers(eventId, user.id);
            if (result.success) {
                alert(`Successfully assigned ${result.assigned} bib numbers`);
                await loadParticipants();
                await loadStats();
            } else {
                alert(`Failed to assign bib numbers: ${result.error}`);
            }
        } catch (error) {
            console.error('Error assigning bib numbers:', error);
            alert('An unexpected error occurred while assigning bib numbers');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleEditParticipant = (participant: EventParticipant) => {
        setEditingParticipant(participant.id);
        setEditFormData({
            bib_number: participant.bib_number,
            finish_time: participant.finish_time,
            position: participant.position,
        });
    };

    const handleSaveEdit = async (participantId: string) => {
        if (!user) return;

        setIsUpdating(true);
        try {
            const result = await updateParticipant(participantId, editFormData, user.id);
            if (result.success) {
                setEditingParticipant(null);
                setEditFormData({});
                await loadParticipants();
                await loadStats();
                alert('Participant updated successfully');
            } else {
                alert(`Failed to update participant: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating participant:', error);
            alert('An unexpected error occurred while updating participant');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingParticipant(null);
        setEditFormData({});
    };

    const handleRemoveParticipant = async (participantId: string, participantName: string) => {
        if (!user) return;

        if (!confirm(`Are you sure you want to remove ${participantName} from this event?`)) {
            return;
        }

        setIsUpdating(true);
        try {
            const result = await removeParticipant(participantId, user.id);
            if (result.success) {
                await loadParticipants();
                await loadStats();
                alert('Participant removed successfully');
            } else {
                alert(`Failed to remove participant: ${result.error}`);
            }
        } catch (error) {
            console.error('Error removing participant:', error);
            alert('An unexpected error occurred while removing participant');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleStatusChange = async (newStatus: 'upcoming' | 'completed' | 'cancelled') => {
        if (!user || !event) return;

        try {
            const result = await updateEventStatus(eventId, newStatus, user.id);
            if (result.success) {
                setEvent({ ...event, status: newStatus });
                alert('Event status updated successfully');
            } else {
                alert(`Failed to update event status: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating event status:', error);
            alert('An unexpected error occurred while updating event status');
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
        if (timeString.includes(':')) {
            return timeString;
        }
        return timeString;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-[#FF9F1C]/10 text-[#FF9F1C] border-[#FF9F1C]/20';
            case 'completed':
                return 'bg-[#28A745]/10 text-[#28A745] border-[#28A745]/20';
            case 'cancelled':
                return 'bg-[#EF233C]/10 text-[#EF233C] border-[#EF233C]/20';
            default:
                return 'bg-[#8D99AE]/10 text-[#8D99AE] border-[#8D99AE]/20';
        }
    };

    const getParticipantStatusBadge = (participant: EventParticipant) => {
        if (participant.finish_time) {
            return <span className="px-2 py-1 bg-[#28A745]/10 text-[#28A745] rounded text-xs">Completed</span>;
        }
        if (participant.bib_number) {
            return <span className="px-2 py-1 bg-[#FF9F1C]/10 text-[#FF9F1C] rounded text-xs">Ready</span>;
        }
        return <span className="px-2 py-1 bg-[#8D99AE]/10 text-[#8D99AE] rounded text-xs">Registered</span>;
    };

    if (isLoadingEvent) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/events"
                                className="flex items-center gap-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Events
                            </Link>
                        </div>
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent mx-auto mb-4"></div>
                                <p className="text-[#8D99AE]">Loading event details...</p>
                            </div>
                        </div>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (eventError || !event) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/events"
                                className="flex items-center gap-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Events
                            </Link>
                        </div>
                        <div className="p-4 bg-[#EF233C]/10 border border-[#EF233C]/20 text-[#EF233C] rounded-lg">
                            <p className="font-medium">Error loading event</p>
                            <p className="text-sm mt-1">{eventError || 'Event not found'}</p>
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
                        <div className="flex items-center gap-4">
                            <Link
                                href="/events"
                                className="flex items-center gap-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Events
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-[#2B2D42]">{event.name}</h1>
                                <p className="mt-2 text-[#8D99AE]">Event Details & Management</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    loadEventDetails();
                                    loadParticipants();
                                    loadStats();
                                }}
                                disabled={isLoadingEvent || isLoadingParticipants}
                                className="flex items-center gap-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoadingEvent || isLoadingParticipants ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-[#8D99AE]/20">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                                        ? 'border-[#FF9F1C] text-[#FF9F1C]'
                                        : 'border-transparent text-[#8D99AE] hover:text-[#2B2D42] hover:border-[#8D99AE]'
                                    }`}
                            >
                                Event Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('participants')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'participants'
                                        ? 'border-[#FF9F1C] text-[#FF9F1C]'
                                        : 'border-transparent text-[#8D99AE] hover:text-[#2B2D42] hover:border-[#8D99AE]'
                                    }`}
                            >
                                Participants ({stats.total})
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Event Details Card */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-semibold text-[#2B2D42]">Event Information</h2>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-5 w-5 text-[#8D99AE]" />
                                                    <div>
                                                        <p className="text-sm text-[#8D99AE]">Date</p>
                                                        <p className="font-medium text-[#2B2D42]">{formatDate(event.date)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-5 w-5 text-[#8D99AE]" />
                                                    <div>
                                                        <p className="text-sm text-[#8D99AE]">Location</p>
                                                        <p className="font-medium text-[#2B2D42]">{event.location || 'Not specified'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-5 w-5 text-[#8D99AE]" />
                                                    <div>
                                                        <p className="text-sm text-[#8D99AE]">Distance</p>
                                                        <p className="font-medium text-[#2B2D42]">{event.distance}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Users className="h-5 w-5 text-[#8D99AE]" />
                                                    <div>
                                                        <p className="text-sm text-[#8D99AE]">Participants</p>
                                                        <p className="font-medium text-[#2B2D42]">
                                                            {event.registeredCount || 0}
                                                            {event.maxParticipants && ` / ${event.maxParticipants}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {event.description && (
                                            <div className="mt-6 pt-6 border-t border-[#8D99AE]/20">
                                                <h3 className="text-sm font-medium text-[#8D99AE] mb-2">Description</h3>
                                                <p className="text-[#2B2D42]">{event.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>

                            {/* Quick Actions & Stats */}
                            <div className="space-y-6">
                                {/* Participant Stats */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-[#2B2D42] mb-4">Participant Stats</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#8D99AE]">Total Registered</span>
                                                <span className="font-bold text-[#2B2D42]">{stats.total}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#8D99AE]">With Bib Numbers</span>
                                                <span className="font-bold text-[#2B2D42]">{stats.withBibNumbers}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#8D99AE]">Completed</span>
                                                <span className="font-bold text-[#2B2D42]">{stats.completed}</span>
                                            </div>
                                            {stats.averageTime && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#8D99AE]">Average Time</span>
                                                    <span className="font-bold text-[#2B2D42] font-mono">{stats.averageTime}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>

                                {/* Quick Actions */}
                                <Card>
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-[#2B2D42] mb-4">Quick Actions</h3>
                                        <div className="space-y-3">
                                            <Button
                                                onClick={() => setActiveTab('participants')}
                                                className="w-full flex items-center justify-center gap-2"
                                            >
                                                <Users className="h-4 w-4" />
                                                Manage Participants
                                            </Button>

                                            {event.status === 'upcoming' && (
                                                <Button
                                                    onClick={() => handleStatusChange('completed')}
                                                    variant="ghost"
                                                    className="w-full flex items-center justify-center gap-2 text-[#28A745] hover:bg-[#28A745]/10"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Mark as Completed
                                                </Button>
                                            )}

                                            {event.status === 'upcoming' && (
                                                <Button
                                                    onClick={() => handleStatusChange('cancelled')}
                                                    variant="ghost"
                                                    className="w-full flex items-center justify-center gap-2 text-[#EF233C] hover:bg-[#EF233C]/10"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Cancel Event
                                                </Button>
                                            )}

                                            <Link
                                                href={`/events/edit/${event.id}`}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8D99AE]/10 hover:bg-[#8D99AE]/20 text-[#2B2D42] rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Edit Event
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Participants Tab Content */}
                    {activeTab === 'participants' && (
                        <div className="space-y-6">
                            {/* Participants Header with Actions */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8D99AE]" />
                                    <Input
                                        type="text"
                                        placeholder="Search by name, email, or bib number..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAssignBibNumbers}
                                        disabled={isUpdating}
                                        className="flex items-center gap-2"
                                    >
                                        <Hash className="h-4 w-4" />
                                        Assign Bib Numbers
                                    </Button>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        Export CSV
                                    </Button>
                                </div>
                            </div>

                            {participantsError && (
                                <div className="p-4 bg-[#EF233C]/10 border border-[#EF233C]/20 text-[#EF233C] rounded-lg">
                                    <p className="font-medium">Error loading participants</p>
                                    <p className="text-sm mt-1">{participantsError}</p>
                                </div>
                            )}

                            {/* Participants Table */}
                            <Card>
                                <div className="overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#8D99AE]/5 border-b border-[#8D99AE]/20">
                                                <tr>
                                                    <th className="text-left p-4 font-medium text-[#2B2D42]">Participant</th>
                                                    <th className="text-left p-4 font-medium text-[#2B2D42]">Bib #</th>
                                                    <th className="text-left p-4 font-medium text-[#2B2D42]">Finish Time</th>
                                                    <th className="text-left p-4 font-medium text-[#2B2D42]">Position</th>
                                                    <th className="text-left p-4 font-medium text-[#2B2D42]">Status</th>
                                                    <th className="text-left p-4 font-medium text-[#2B2D42]">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoadingParticipants ? (
                                                    <>
                                                        {[1, 2, 3].map((i) => (
                                                            <tr key={i} className="border-b border-[#8D99AE]/10">
                                                                <td className="p-4">
                                                                    <div className="space-y-2">
                                                                        <div className="h-4 w-32 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                                        <div className="h-3 w-48 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="h-4 w-8 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="h-4 w-16 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="h-4 w-8 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="h-6 w-20 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                                </td>
                                                                <td className="p-4">
                                                                    <div className="flex gap-2">
                                                                        <div className="h-8 w-8 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                                        <div className="h-8 w-8 bg-[#8D99AE]/20 rounded animate-pulse"></div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ) : filteredParticipants.length > 0 ? (
                                                    filteredParticipants.map((participant) => (
                                                        <tr key={participant.id} className="border-b border-[#8D99AE]/10 hover:bg-[#8D99AE]/5">
                                                            <td className="p-4">
                                                                <div>
                                                                    <p className="font-medium text-[#2B2D42]">
                                                                        {participant.user_name || 'No name provided'}
                                                                    </p>
                                                                    <p className="text-sm text-[#8D99AE]">{participant.user_email}</p>
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                {editingParticipant === participant.id ? (
                                                                    <Input
                                                                        type="number"
                                                                        value={editFormData.bib_number || ''}
                                                                        onChange={(e) => setEditFormData({
                                                                            ...editFormData,
                                                                            bib_number: e.target.value ? parseInt(e.target.value) : undefined
                                                                        })}
                                                                        className="w-20"
                                                                        placeholder="Bib #"
                                                                    />
                                                                ) : (
                                                                    <span className="text-[#2B2D42] font-mono">
                                                                        {participant.bib_number || '-'}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4">
                                                                {editingParticipant === participant.id ? (
                                                                    <Input
                                                                        type="text"
                                                                        value={editFormData.finish_time || ''}
                                                                        onChange={(e) => setEditFormData({
                                                                            ...editFormData,
                                                                            finish_time: e.target.value
                                                                        })}
                                                                        className="w-24"
                                                                        placeholder="HH:MM:SS"
                                                                    />
                                                                ) : (
                                                                    <span className="text-[#2B2D42] font-mono">
                                                                        {formatTime(participant.finish_time)}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4">
                                                                {editingParticipant === participant.id ? (
                                                                    <Input
                                                                        type="number"
                                                                        value={editFormData.position || ''}
                                                                        onChange={(e) => setEditFormData({
                                                                            ...editFormData,
                                                                            position: e.target.value ? parseInt(e.target.value) : undefined
                                                                        })}
                                                                        className="w-20"
                                                                        placeholder="Pos"
                                                                    />
                                                                ) : (
                                                                    <span className="text-[#2B2D42]">
                                                                        {participant.position || '-'}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-4">
                                                                {getParticipantStatusBadge(participant)}
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-2">
                                                                    {editingParticipant === participant.id ? (
                                                                        <>
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => handleSaveEdit(participant.id)}
                                                                                disabled={isUpdating}
                                                                                className="px-3 py-1"
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={handleCancelEdit}
                                                                                disabled={isUpdating}
                                                                                className="px-3 py-1"
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleEditParticipant(participant)}
                                                                                className="p-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors"
                                                                                title="Edit participant"
                                                                            >
                                                                                <Edit2 className="h-4 w-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleRemoveParticipant(
                                                                                    participant.id,
                                                                                    participant.user_name || participant.user_email
                                                                                )}
                                                                                className="p-2 text-[#8D99AE] hover:text-[#EF233C] transition-colors"
                                                                                title="Remove participant"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6} className="p-8 text-center">
                                                            <div className="flex flex-col items-center gap-3">
                                                                <Users className="h-12 w-12 text-[#8D99AE]/30" />
                                                                <div>
                                                                    <p className="font-medium text-[#2B2D42]">No participants yet</p>
                                                                    <p className="text-sm text-[#8D99AE] mt-1">
                                                                        {searchQuery ? 'No participants match your search.' : 'Participants will appear here once they register.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}