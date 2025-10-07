'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { EventForm } from '@runday/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateEventPage() {
    const handleEventSubmit = (data: any) => {
        console.log('Creating event:', data);
        // TODO: Implement actual event creation logic
        // This would typically make an API call to create the event
        alert('Event creation functionality will be implemented when we connect to the database!');
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
                    />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}