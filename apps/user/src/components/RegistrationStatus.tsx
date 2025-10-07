'use client';

import { Badge, Button } from '@runday/ui';
import { Clock, Users, CheckCircle, XCircle, Calendar, AlertTriangle } from 'lucide-react';
import { PublicEventData } from '@/lib/event-operations';

interface RegistrationStatusProps {
    event: PublicEventData;
    onRegister?: () => void;
    onCancel?: () => void;
    loading?: boolean;
}

export function RegistrationStatus({
    event,
    onRegister,
    onCancel,
    loading = false
}: RegistrationStatusProps) {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    const isEventPast = eventDate < now;
    const isFull = event.max_participants ? (event.registeredCount || 0) >= event.max_participants : false;
    const spotsLeft = event.max_participants ? event.max_participants - (event.registeredCount || 0) : null;

    // Calculate hours until event
    const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const canCancelRegistration = hoursUntilEvent > 24; // Can't cancel within 24 hours

    // Status indicator
    const getStatusBadge = () => {
        if (isEventPast) {
            return (
                <Badge variant="info" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Event Past
                </Badge>
            );
        }

        if (event.status === 'cancelled') {
            return (
                <Badge variant="danger" className="flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Cancelled
                </Badge>
            );
        }

        if (isFull && !event.isUserRegistered) {
            return (
                <Badge variant="danger" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Event Full
                </Badge>
            );
        }

        if (event.isUserRegistered) {
            return (
                <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Registered
                </Badge>
            );
        }

        return (
            <Badge variant="neutral" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Available
            </Badge>
        );
    };

    // Spots remaining indicator
    const getSpotsIndicator = () => {
        if (!event.max_participants) return null;

        const percentage = ((event.registeredCount || 0) / event.max_participants) * 100;
        let colorClass = 'bg-green-500';

        if (percentage >= 90) colorClass = 'bg-red-500';
        else if (percentage >= 70) colorClass = 'bg-yellow-500';
        else if (percentage >= 50) colorClass = 'bg-blue-500';

        return (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${colorClass} transition-all duration-300`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                    </div>
                    <span className="text-xs font-medium">
                        {spotsLeft} of {event.max_participants} spots left
                    </span>
                </div>
            </div>
        );
    };

    // Registration action button
    const getActionButton = () => {
        if (isEventPast || event.status === 'cancelled') {
            return null;
        }

        if (event.isUserRegistered) {
            return (
                <div className="space-y-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onCancel}
                        disabled={loading || !canCancelRegistration}
                        className="w-full"
                    >
                        {loading ? 'Processing...' : 'Cancel Registration'}
                    </Button>
                    {!canCancelRegistration && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-3 h-3" />
                            Can&apos;t cancel within 24 hours
                        </div>
                    )}
                </div>
            );
        }

        if (isFull) {
            return (
                <Button variant="secondary" size="sm" disabled className="w-full">
                    Event Full
                </Button>
            );
        }

        return (
            <Button
                size="sm"
                onClick={onRegister}
                disabled={loading}
                className="w-full bg-[#FF9F1C] hover:bg-[#FF9F1C]/90 text-white"
            >
                {loading ? 'Registering...' : 'Register Now'}
            </Button>
        );
    };

    // Warning indicators
    const getWarnings = () => {
        const warnings = [];

        if (spotsLeft && spotsLeft <= 5 && spotsLeft > 0) {
            warnings.push({
                icon: <AlertTriangle className="w-3 h-3" />,
                message: `Only ${spotsLeft} spots left!`,
                color: 'text-amber-600 dark:text-amber-400'
            });
        }

        if (hoursUntilEvent < 48 && hoursUntilEvent > 24) {
            warnings.push({
                icon: <Clock className="w-3 h-3" />,
                message: 'Event starts soon!',
                color: 'text-blue-600 dark:text-blue-400'
            });
        }

        if (event.isUserRegistered && !canCancelRegistration) {
            warnings.push({
                icon: <AlertTriangle className="w-3 h-3" />,
                message: 'Cancellation deadline passed',
                color: 'text-amber-600 dark:text-amber-400'
            });
        }

        return warnings;
    };

    const warnings = getWarnings();

    return (
        <div className="space-y-3">
            {/* Status Badge */}
            <div className="flex justify-between items-center">
                {getStatusBadge()}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {event.registeredCount || 0} registered
                </span>
            </div>

            {/* Spots Indicator */}
            {getSpotsIndicator()}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="space-y-1">
                    {warnings.map((warning, index) => (
                        <div key={index} className={`flex items-center gap-1 text-xs ${warning.color}`}>
                            {warning.icon}
                            {warning.message}
                        </div>
                    ))}
                </div>
            )}

            {/* Action Button */}
            {getActionButton()}
        </div>
    );
}