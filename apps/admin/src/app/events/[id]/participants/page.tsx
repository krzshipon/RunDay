'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, Button, Input } from '@runday/ui';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  UserPlus, 
  Download, 
  Trophy,
  Clock,
  Hash,
  RefreshCw,
  Edit2,
  Trash2,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  getEventParticipants, 
  updateParticipant,
  assignBibNumbers,
  removeParticipant,
  getParticipantStats,
  EventParticipant,
  ParticipantFormData
} from '../../../../lib/participant-operations';

export default function EventParticipantsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.id as string;

  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<EventParticipant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Edit mode states
  const [editingParticipant, setEditingParticipant] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<ParticipantFormData>({});

  useEffect(() => {
    if (eventId) {
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

  const loadParticipants = async () => {
    setIsLoading(true);
    try {
      const result = await getEventParticipants(eventId);
      if (result.success && result.data) {
        setParticipants(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to load participants');
      }
    } catch (err) {
      console.error('Error loading participants:', err);
      setError('An unexpected error occurred while loading participants');
    } finally {
      setIsLoading(false);
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

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    // Handle different time formats
    if (timeString.includes(':')) {
      return timeString;
    }
    return timeString;
  };

  const getStatusBadge = (participant: EventParticipant) => {
    if (participant.finish_time) {
      return <span className="px-2 py-1 bg-[#28A745]/10 text-[#28A745] rounded text-xs">Completed</span>;
    }
    if (participant.bib_number) {
      return <span className="px-2 py-1 bg-[#FF9F1C]/10 text-[#FF9F1C] rounded text-xs">Ready</span>;
    }
    return <span className="px-2 py-1 bg-[#8D99AE]/10 text-[#8D99AE] rounded text-xs">Registered</span>;
  };

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
                <h1 className="text-3xl font-bold text-[#2B2D42]">Event Participants</h1>
                <p className="mt-2 text-[#8D99AE]">Manage registrations and race results</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  loadParticipants();
                  loadStats();
                }}
                disabled={isLoading}
                className="flex items-center gap-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Button
                onClick={handleAssignBibNumbers}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                <Hash className="h-4 w-4" />
                Assign Bib Numbers
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-[#EF233C]/10 border border-[#EF233C]/20 text-[#EF233C] rounded-lg">
              <p className="font-medium">Error loading participants</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-[#FF9F1C]/10 rounded-lg">
                    <Users className="h-5 w-5 text-[#FF9F1C]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[#8D99AE]">Total Registered</p>
                    <p className="text-xl font-bold text-[#2B2D42]">{stats.total}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-[#2B2D42]/10 rounded-lg">
                    <Hash className="h-5 w-5 text-[#2B2D42]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[#8D99AE]">With Bib Numbers</p>
                    <p className="text-xl font-bold text-[#2B2D42]">{stats.withBibNumbers}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-[#28A745]/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-[#28A745]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[#8D99AE]">Completed</p>
                    <p className="text-xl font-bold text-[#2B2D42]">{stats.completed}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-[#8D99AE]/10 rounded-lg">
                    <Clock className="h-5 w-5 text-[#8D99AE]" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[#8D99AE]">Avg. Time</p>
                    <p className="text-xl font-bold text-[#2B2D42]">
                      {stats.averageTime || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Actions */}
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
              <Button variant="ghost" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

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
                    {isLoading ? (
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
                            {getStatusBadge(participant)}
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
      </DashboardLayout>
    </ProtectedRoute>
  );
}