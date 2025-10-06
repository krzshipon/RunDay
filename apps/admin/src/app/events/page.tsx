import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EventSearchBar, EventCard } from '@runday/ui';
import { Plus } from 'lucide-react';

// Mock data for demonstration
const mockEvents = [
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
    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    const handleFilter = (filters: any) => {
        console.log('Applying filters:', filters);
    };

    const handleEditEvent = (eventId: string) => {
        console.log('Edit event:', eventId);
    };

    const handleViewEvent = (eventId: string) => {
        console.log('View event:', eventId);
    };

    const handleDeleteEvent = (eventId: string) => {
        console.log('Delete event:', eventId);
    };

    const handleDuplicateEvent = (eventId: string) => {
        console.log('Duplicate event:', eventId);
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
                        <button className="flex items-center gap-2 bg-[#FF9F1C] hover:bg-[#FF9F1C]/90 text-white px-4 py-2 rounded-lg transition-colors">
                            <Plus className="h-4 w-4" />
                            Create Event
                        </button>
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
                                Showing {mockEvents.length} events
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
                            {mockEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onEdit={handleEditEvent}
                                    onView={handleViewEvent}
                                    onDelete={handleDeleteEvent}
                                    onDuplicate={handleDuplicateEvent}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Empty State (hidden when we have events) */}
                    {mockEvents.length === 0 && (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-[#8D99AE]/10 rounded-full flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-[#8D99AE]" />
                            </div>
                            <h3 className="text-lg font-medium text-[#2B2D42] mb-2">No events yet</h3>
                            <p className="text-[#8D99AE] mb-4">Get started by creating your first running event.</p>
                            <button className="bg-[#FF9F1C] hover:bg-[#FF9F1C]/90 text-white px-6 py-2 rounded-lg transition-colors">
                                Create Your First Event
                            </button>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}