'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EventSearchBar, EventCard, EventEditDialog, EventDuplicateButton, EventStatusToggle } from '@runday/ui';
import { Plus, RefreshCw } from 'lucide-react';
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
} from '../../lib/event-operations';

export default function EventsPage() {
    const { user } = useAuth();
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);
    const [events, setEvents] = useState<EventData[]>([]);

    // Load events on component mount
    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setIsLoadingEvents(true);
        try {
            const result = await getAllEvents();
            if (result.success && result.data) {
                setEvents(result.data);
            } else {
                console.error('Failed to load events:', result.error);
                alert(`Failed to load events: ${result.error}`);
            }
        } catch (error) {
            console.error('Error loading events:', error);
            alert('An unexpected error occurred while loading events');
        } finally {
            setIsLoadingEvents(false);
        }
    };

    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
        // TODO: Implement search functionality
    };

    const handleFilter = (filters: any) => {
        console.log('Applying filters:', filters);
        // TODO: Implement filter functionality
    };

    const handleEditEvent = (eventId: string) => {
        const event = events.find(e => e.id === eventId);
        if (event) {
            setSelectedEvent(event);
            setIsEditDialogOpen(true);
        }
    };

    const handleViewEvent = (eventId: string) => {
        console.log('View event:', eventId);
        // TODO: Navigate to event details page
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!user) {
            alert('You must be logged in to delete events');
            return;
        }

        if (confirm('Are you sure you want to delete this event?')) {
            setIsLoading(true);
            try {
                const result = await deleteEvent(eventId, user.id);
                if (result.success) {
                    setEvents(prev => prev.filter(event => event.id !== eventId));
                    alert('Event deleted successfully');
                } else {
                    alert(`Failed to delete event: ${result.error}`);
                }
            } catch (error) {
                console.error('Error deleting event:', error);
                alert('An unexpected error occurred while deleting the event');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDuplicateEvent = async (eventId: string) => {
        if (!user) {
            alert('You must be logged in to duplicate events');
            return;
        }

        setIsLoading(true);
        try {
            const result = await duplicateEvent(eventId, user.id);
            if (result.success && result.data) {
                setEvents(prev => [result.data!, ...prev]);
                alert('Event duplicated successfully');
            } else {
                alert(`Failed to duplicate event: ${result.error}`);
            }
        } catch (error) {
            console.error('Error duplicating event:', error);
            alert('An unexpected error occurred while duplicating the event');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveEvent = async (eventId: string, data: EventFormData) => {
        if (!user) {
            alert('You must be logged in to edit events');
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateEvent(eventId, data, user.id);
            if (result.success && result.data) {
                setEvents(prev => prev.map(event =>
                    event.id === eventId ? result.data! : event
                ));
                setIsEditDialogOpen(false);
                alert('Event updated successfully');
            } else {
                alert(`Failed to update event: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('An unexpected error occurred while updating the event');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (eventId: string, newStatus: 'upcoming' | 'completed' | 'cancelled') => {
        if (!user) {
            alert('You must be logged in to change event status');
            return;
        }

        try {
            const result = await updateEventStatus(eventId, newStatus, user.id);
            if (result.success) {
                setEvents(prev => prev.map(event =>
                    event.id === eventId ? { ...event, status: newStatus } : event
                ));
                alert('Event status updated successfully');
            } else {
                alert(`Failed to update event status: ${result.error}`);
            }
        } catch (error) {
            console.error('Error updating event status:', error);
            alert('An unexpected error occurred while updating the event status');
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#2B2D42]">Events</h1>
                            <p className="mt-2 text-[#8D99AE]">Manage all your running events</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={loadEvents}
                                disabled={isLoadingEvents}
                                className="flex items-center gap-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoadingEvents ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <Link
                                href="/events/create"
                                className="flex items-center gap-2 bg-[#FF9F1C] hover:bg-[#FF9F1C]/90 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Create Event
                            </Link>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <EventSearchBar
                        onSearch={handleSearch}
                        onFilter={handleFilter}
                        placeholder="Search events by name, location, or description..."
                    />

                    {/* Events Grid */}
                    <div>
                        {isLoadingEvents ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9F1C] border-t-transparent mx-auto mb-4"></div>
                                    <p className="text-[#8D99AE]">Loading events...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-[#8D99AE]">
                                        Showing {events.length} events
                                    </p>
                                    <div className="flex gap-2">
                                        <select className="px-3 py-1 text-sm border border-[#8D99AE]/20 rounded-lg bg-white text-[#2B2D42] focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent">
                                            <option>Sort by Date</option>
                                            <option>Sort by Name</option>
                                            <option>Sort by Status</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {events.map((event) => (
                                        <div key={event.id} className="space-y-4">
                                            <EventCard
                                                event={event}
                                                onEdit={handleEditEvent}
                                                onView={handleViewEvent}
                                                onDelete={handleDeleteEvent}
                                                onDuplicate={handleDuplicateEvent}
                                            />
                                            {/* Event Status Toggle */}
                                            <EventStatusToggle
                                                eventId={event.id}
                                                currentStatus={event.status}
                                                eventName={event.name}
                                                onStatusChange={handleStatusChange}
                                                className="px-6 pb-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Empty State (hidden when we have events) */}
                    {events.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-[#8D99AE]/10 rounded-full flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-[#8D99AE]" />
                            </div>
                            <h3 className="text-lg font-medium text-[#2B2D42] mb-2">No events yet</h3>
                            <p className="text-[#8D99AE] mb-4">Get started by creating your first running event.</p>
                            <Link
                                href="/events/create"
                                className="bg-[#FF9F1C] hover:bg-[#FF9F1C]/90 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                            >
                                Create Your First Event
                            </Link>
                        </div>
                    )}

                    {/* Edit Dialog */}
                    <EventEditDialog
                        event={selectedEvent}
                        isOpen={isEditDialogOpen}
                        onClose={() => {
                            setIsEditDialogOpen(false);
                            setSelectedEvent(null);
                        }}
                        onSave={handleSaveEvent}
                        isLoading={isLoading}
                    />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}