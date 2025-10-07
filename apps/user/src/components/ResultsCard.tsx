'use client';

import { Card, Badge } from '@runday/ui';
import { Clock, Trophy, MapPin, Calendar, Users, Target, Timer } from 'lucide-react';
import { EventRegistrationData } from '@/lib/event-operations';

interface ResultsCardProps {
    registration: EventRegistrationData;
    showPosition?: boolean;
    showStats?: boolean;
}

export function ResultsCard({
    registration,
    showPosition = true,
    showStats = true
}: ResultsCardProps) {
    const event = registration.event;
    if (!event) return null;

    const eventDate = new Date(event.event_date);
    const hasResults = registration.finish_time || registration.position;

    // Format finish time
    const formatFinishTime = (timeString?: string) => {
        if (!timeString) return null;

        // Assume format is HH:MM:SS or MM:SS
        const parts = timeString.split(':');
        if (parts.length === 3) {
            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const seconds = parseInt(parts[2]);

            if (hours > 0) {
                return `${hours}h ${minutes}m ${seconds}s`;
            } else {
                return `${minutes}m ${seconds}s`;
            }
        }
        return timeString;
    };

    // Calculate pace (assuming distance in format like "5K", "10K")
    const calculatePace = () => {
        if (!registration.finish_time || !event.distance) return null;

        const distance = parseFloat(event.distance.replace(/[^0-9.]/g, '')) || 0;
        if (distance === 0) return null;

        const timeParts = registration.finish_time.split(':');
        let totalMinutes = 0;

        if (timeParts.length === 3) {
            totalMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) + parseInt(timeParts[2]) / 60;
        } else if (timeParts.length === 2) {
            totalMinutes = parseInt(timeParts[0]) + parseInt(timeParts[1]) / 60;
        }

        const paceMinutes = totalMinutes / distance;
        const paceMin = Math.floor(paceMinutes);
        const paceSec = Math.round((paceMinutes - paceMin) * 60);

        return `${paceMin}:${paceSec.toString().padStart(2, '0')}/km`;
    };

    const pace = calculatePace();

    // Get performance level based on position
    const getPerformanceLevel = () => {
        if (!registration.position || !showStats) return null;

        const position = registration.position;
        if (position === 1) return { label: 'Winner!', variant: 'success' as const, icon: <Trophy className="w-4 h-4" /> };
        if (position <= 3) return { label: 'Podium!', variant: 'success' as const, icon: <Trophy className="w-4 h-4" /> };
        if (position <= 10) return { label: 'Top 10!', variant: 'warning' as const, icon: <Target className="w-4 h-4" /> };

        return null;
    };

    const performance = getPerformanceLevel();

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
                {/* Event Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {event.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Calendar className="w-4 h-4" />
                            {eventDate.toLocaleDateString()}
                        </div>
                    </div>
                    <Badge variant={event.status === 'completed' ? 'success' : 'warning'}>
                        {event.status}
                    </Badge>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{event.distance}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    )}
                    {registration.bib_number && (
                        <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>Bib #{registration.bib_number}</span>
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {hasResults ? (
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            Your Results
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Finish Time */}
                            {registration.finish_time && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 text-xs mb-1">
                                        <Clock className="w-3 h-3" />
                                        Finish Time
                                    </div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                                        {formatFinishTime(registration.finish_time)}
                                    </div>
                                </div>
                            )}

                            {/* Position */}
                            {registration.position && showPosition && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 text-xs mb-1">
                                        <Trophy className="w-3 h-3" />
                                        Position
                                    </div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                                        #{registration.position}
                                    </div>
                                </div>
                            )}

                            {/* Pace */}
                            {pace && (
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-gray-400 text-xs mb-1">
                                        <Timer className="w-3 h-3" />
                                        Avg Pace
                                    </div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">
                                        {pace}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Performance Badge */}
                        {performance && (
                            <div className="flex justify-center">
                                <Badge
                                    variant={performance.variant}
                                    className="flex items-center gap-1 px-3 py-1"
                                >
                                    {performance.icon}
                                    {performance.label}
                                </Badge>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                            {event.status === 'completed' ? 'Results not yet available' : 'Event not completed'}
                        </div>
                    </div>
                )}

                {/* Registration Info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    Registered: {new Date(registration.registered_at).toLocaleDateString()}
                </div>
            </div>
        </Card>
    );
}