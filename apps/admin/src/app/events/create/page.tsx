'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EventForm } from '@runday/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { createEvent, EventFormData } from '../../../lib/event-operations';

export default function CreateEventPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleEventSubmit = async (data: EventFormData) => {
        if (!user) {
            alert('You must be logged in to create an event');
            return;
        }

        setIsLoading(true);

        try {
            const result = await createEvent(data, user.id);

            if (result.success) {
                alert('Event created successfully!');
                router.push('/events');
            } else {
                alert(`Failed to create event: ${result.error}`);
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('An unexpected error occurred while creating the event');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header with Back Link */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/events"
                            className="flex items-center gap-2 text-[#8D99AE] hover:text-[#2B2D42] transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Events
                        </Link>
                    </div>

                    {/* Form */}
                    <EventForm
                        onSubmit={handleEventSubmit}
                        onCancel={() => window.history.back()}
                        isLoading={isLoading}
                    />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}