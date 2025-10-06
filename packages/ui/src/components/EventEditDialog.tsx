'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EventForm } from './EventForm';

interface Event {
    id: string;
    name: string;
    description?: string;
    date: string;
    location?: string;
    distance: string;
    maxParticipants?: number;
    registeredCount?: number;
    status: 'upcoming' | 'completed' | 'cancelled';
}

interface EventFormData {
    name: string;
    description: string;
    date: string;
    location: string;
    distance: string;
    maxParticipants: number | '';
    status: 'upcoming' | 'completed' | 'cancelled';
}

interface EventEditDialogProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (eventId: string, data: EventFormData) => void;
    isLoading?: boolean;
}

export function EventEditDialog({
    event,
    isOpen,
    onClose,
    onSave,
    isLoading = false
}: EventEditDialogProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            const timer = setTimeout(() => setIsVisible(false), 150);
            return () => clearTimeout(timer);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = (data: EventFormData) => {
        if (event && onSave) {
            onSave(event.id, data);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-150 ${isOpen ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-150 ${isOpen ? 'opacity-50' : 'opacity-0'
                    }`}
            />

            {/* Dialog Content */}
            <div
                className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl transition-all duration-150 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 z-10 p-2 text-[#8D99AE] hover:text-[#2B2D42] hover:bg-[#8D99AE]/10 rounded-lg transition-colors"
                    aria-label="Close dialog"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Form */}
                {event && (
                    <EventForm
                        initialData={{
                            name: event.name,
                            description: event.description || '',
                            date: formatDateForInput(event.date),
                            location: event.location || '',
                            distance: event.distance,
                            maxParticipants: event.maxParticipants || '',
                            status: event.status,
                        }}
                        isEditing={true}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        isLoading={isLoading}
                        className="border-0 shadow-none"
                    />
                )}
            </div>
        </div>
    );
}