'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './Button';

interface Event {
    id: string;
    name: string;
    description?: string;
    date: string;
    location?: string;
    distance: string;
    maxParticipants?: number;
    status: 'upcoming' | 'completed' | 'cancelled';
}

interface EventDuplicateButtonProps {
    event: Event;
    onDuplicate?: (eventData: Omit<Event, 'id'>) => void;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showIcon?: boolean;
    children?: React.ReactNode;
}

export function EventDuplicateButton({
    event,
    onDuplicate,
    isLoading = false,
    variant = 'ghost',
    size = 'md',
    className = '',
    showIcon = true,
    children
}: EventDuplicateButtonProps) {
    const [isSuccess, setIsSuccess] = useState(false);

    const handleDuplicate = async () => {
        if (onDuplicate && !isLoading) {
            // Create duplicate event data
            const duplicatedEventData: Omit<Event, 'id'> = {
                name: `Copy of ${event.name}`,
                description: event.description,
                date: getNextAvailableDate(event.date),
                location: event.location,
                distance: event.distance,
                maxParticipants: event.maxParticipants,
                status: 'upcoming', // Always set duplicated events as upcoming
            };

            try {
                await onDuplicate(duplicatedEventData);

                // Show success state
                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 2000);
            } catch (error) {
                console.error('Failed to duplicate event:', error);
            }
        }
    };

    // Calculate next available date (adds 7 days to original date)
    const getNextAvailableDate = (originalDate: string): string => {
        const date = new Date(originalDate);
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    };

    const getButtonContent = () => {
        if (isSuccess) {
            return (
                <>
                    {showIcon && <Check className="h-4 w-4" />}
                    {children || 'Duplicated!'}
                </>
            );
        }

        if (isLoading) {
            return (
                <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {children || 'Duplicating...'}
                </>
            );
        }

        return (
            <>
                {showIcon && <Copy className="h-4 w-4" />}
                {children || 'Duplicate'}
            </>
        );
    };

    return (
        <Button
            onClick={handleDuplicate}
            disabled={isLoading || isSuccess}
            variant={isSuccess ? 'accent' : variant}
            className={`flex items-center gap-2 transition-all duration-200 ${isSuccess ? 'bg-green-500 text-white hover:bg-green-600' : ''
                } ${className}`}
            title={`Duplicate "${event.name}" with date set to ${getNextAvailableDate(event.date)}`}
        >
            {getButtonContent()}
        </Button>
    );
}