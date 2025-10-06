'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EventSearchBar, EventCard, EventEditDialog, EventDuplicateButton, EventStatusToggle } from '@runday/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    distance: string;
    maxParticipants: number;
    registeredCount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
}

// Mock data for demonstration
const mockEvents: Event[] = [
    {
        id: '1',
        name: 'Morning 5K Run',
        description: 'Start your day with an energizing 5K run through the city park.',
        date: '2024-12-15',
        location: 'Central Park, New York',
        distance: '5K',
        maxParticipants: 100,
        registeredCount: 67,
        status: 'upcoming' as const,
    },
    {
        id: '2',
        name: 'City Marathon 2024',
        description: 'The biggest running event of the year! Join thousands of runners from around the world.',
        date: '2024-11-28',
        location: 'Downtown, Boston',
        distance: 'Marathon (42.2K)',
        maxParticipants: 5000,
        registeredCount: 4200,
        status: 'completed' as const,
    },
    {
        id: '3',
        name: 'Fun Run for Charity',
        description: 'Run for a good cause and help raise funds for local charities.',
        date: '2024-11-20',
        location: 'Community Center, Seattle',
        distance: '10K',
        maxParticipants: 200,
        registeredCount: 180,
        status: 'completed' as const,
    },
    {
        id: '4',
        name: 'Trail Running Challenge',
        description: 'Test your endurance on challenging mountain trails.',
        date: '2025-01-10',
        location: 'Mountain View Trail, Colorado',
        distance: '15K',
        maxParticipants: 50,
        registeredCount: 23,
        status: 'upcoming' as const,
    },
];

export default function EventsPage() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState<Event[]>(mockEvents);

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

    const handleDeleteEvent = (eventId: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            setEvents(prev => prev.filter(event => event.id !== eventId));
            console.log('Delete event:', eventId);
            // TODO: Implement actual deletion
        }
    };

    const handleDuplicateEvent = (eventData: any) => {
        // Create new event with duplicated data
        const newEvent = {
            ...eventData,
            id: `${Date.now()}`, // Simple ID generation for demo
        };
        setEvents(prev => [newEvent, ...prev]);
        console.log('Duplicated event:', newEvent);
        // TODO: Implement actual duplication API call
    };

    const handleSaveEvent = (eventId: string, data: any) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setEvents(prev => prev.map(event =>
                event.id === eventId ? { ...event, ...data } : event
            ));
            setIsLoading(false);
            setIsEditDialogOpen(false);
            console.log('Updated event:', eventId, data);
        }, 1000);
    };

    const handleStatusChange = (eventId: string, newStatus: 'upcoming' | 'completed' | 'cancelled') => {
        setEvents(prev => prev.map(event =>
            event.id === eventId ? { ...event, status: newStatus } : event
        ));
        console.log('Status changed:', eventId, newStatus);
        // TODO: Implement actual status update API call
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
                        <Link
                            href="/events/create"
                            className="flex items-center gap-2 bg-[#FF9F1C] hover:bg-[#FF9F1C]/90 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Event
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <EventSearchBar
                        onSearch={handleSearch}
                        onFilter={handleFilter}
                        placeholder="Search events by name, location, or description..."
                    />

                    {/* Events Grid */}
                    <div>
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
                                        onDuplicate={(eventId) => {
                                            const eventToDuplicate = events.find(e => e.id === eventId);
                                            if (eventToDuplicate) {
                                                handleDuplicateEvent(eventToDuplicate);
                                            }
                                        }}
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