'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Calendar, MapPin, Users, Clock, FileText, Save, X } from 'lucide-react';
import { Card, Button, Input } from '@runday/ui';

interface EventFormData {
    name: string;
    description: string;
    date: string;
    location: string;
    distance: string;
    maxParticipants: number | '';
    status: 'upcoming' | 'completed' | 'cancelled';
}

interface EventFormProps {
    initialData?: Partial<EventFormData>;
    isEditing?: boolean;
    onSubmit?: (data: EventFormData) => void;
    onCancel?: () => void;
    isLoading?: boolean;
    className?: string;
}

const defaultData: EventFormData = {
    name: '',
    description: '',
    date: '',
    location: '',
    distance: '',
    maxParticipants: '',
    status: 'upcoming',
};

const distanceOptions = [
    '5K',
    '10K',
    '15K',
    'Half Marathon (21.1K)',
    'Marathon (42.2K)',
    'Ultra Marathon (50K+)',
    'Custom Distance'
];

export function EventForm({
    initialData = {},
    isEditing = false,
    onSubmit,
    onCancel,
    isLoading = false,
    className = ""
}: EventFormProps) {
    const [formData, setFormData] = useState<EventFormData>({
        ...defaultData,
        ...initialData,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
    const [customDistance, setCustomDistance] = useState(
        initialData.distance && !distanceOptions.includes(initialData.distance)
            ? initialData.distance
            : ''
    );

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof EventFormData, string>> = {};

        // Required field validations
        if (!formData.name.trim()) {
            newErrors.name = 'Event name is required';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Event name must be at least 3 characters';
        }

        if (!formData.date) {
            newErrors.date = 'Event date is required';
        } else {
            const eventDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (!isEditing && eventDate < today) {
                newErrors.date = 'Event date cannot be in the past';
            }
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.distance) {
            newErrors.distance = 'Distance is required';
        }

        if (formData.maxParticipants !== '' && formData.maxParticipants < 1) {
            newErrors.maxParticipants = 'Maximum participants must be at least 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof EventFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleDistanceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'Custom Distance') {
            handleInputChange('distance', customDistance || '');
        } else {
            handleInputChange('distance', value);
            setCustomDistance('');
        }
    };

    const handleCustomDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomDistance(value);
        handleInputChange('distance', value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            const finalData = {
                ...formData,
                maxParticipants: formData.maxParticipants === '' ? 0 : Number(formData.maxParticipants),
            };
            onSubmit?.(finalData as EventFormData);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <Card className={`w-full max-w-2xl mx-auto ${className}`}>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#8D99AE]/20 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-[#2B2D42]">
                            {isEditing ? 'Edit Event' : 'Create New Event'}
                        </h2>
                        <p className="text-[#8D99AE] mt-1">
                            {isEditing ? 'Update event details below' : 'Fill in the details to create your running event'}
                        </p>
                    </div>
                </div>

                {/* Event Name */}
                <div>
                    <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                        <FileText className="inline h-4 w-4 mr-2" />
                        Event Name *
                    </label>
                    <Input
                        type="text"
                        value={formData.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                        placeholder="Enter event name (e.g., Summer 5K Fun Run)"
                        className={errors.name ? 'border-red-500' : ''}
                        maxLength={100}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your event (optional)"
                        className="w-full px-3 py-2 border border-[#8D99AE]/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                        rows={3}
                        maxLength={500}
                    />
                    <p className="text-xs text-[#8D99AE] mt-1">{formData.description.length}/500 characters</p>
                </div>

                {/* Date and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                            <Calendar className="inline h-4 w-4 mr-2" />
                            Event Date *
                        </label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('date', e.target.value)}
                            min={isEditing ? undefined : today}
                            className={errors.date ? 'border-red-500' : ''}
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                            <MapPin className="inline h-4 w-4 mr-2" />
                            Location *
                        </label>
                        <Input
                            type="text"
                            value={formData.location}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                            placeholder="Event location"
                            className={errors.location ? 'border-red-500' : ''}
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>
                </div>

                {/* Distance and Max Participants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                            <Clock className="inline h-4 w-4 mr-2" />
                            Distance *
                        </label>
                        <select
                            value={
                                distanceOptions.includes(formData.distance)
                                    ? formData.distance
                                    : 'Custom Distance'
                            }
                            onChange={handleDistanceChange}
                            className={`w-full px-3 py-2 border border-[#8D99AE]/20 rounded-lg bg-white text-[#2B2D42] focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent ${errors.distance ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select distance</option>
                            {distanceOptions.map(distance => (
                                <option key={distance} value={distance}>
                                    {distance}
                                </option>
                            ))}
                        </select>

                        {(formData.distance && !distanceOptions.includes(formData.distance)) && (
                            <Input
                                type="text"
                                value={customDistance}
                                onChange={handleCustomDistanceChange}
                                placeholder="Enter custom distance"
                                className="mt-2"
                            />
                        )}
                        {errors.distance && <p className="text-red-500 text-sm mt-1">{errors.distance}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                            <Users className="inline h-4 w-4 mr-2" />
                            Max Participants
                        </label>
                        <Input
                            type="number"
                            value={formData.maxParticipants}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleInputChange('maxParticipants', e.target.value === '' ? '' : parseInt(e.target.value))
                            }
                            placeholder="Leave empty for unlimited"
                            min="1"
                            className={errors.maxParticipants ? 'border-red-500' : ''}
                        />
                        {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants}</p>}
                    </div>
                </div>

                {/* Status (only for editing) */}
                {isEditing && (
                    <div>
                        <label className="block text-sm font-medium text-[#2B2D42] mb-2">
                            Event Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                handleInputChange('status', e.target.value as EventFormData['status'])
                            }
                            className="w-full px-3 py-2 border border-[#8D99AE]/20 rounded-lg bg-white text-[#2B2D42] focus:outline-none focus:ring-2 focus:ring-[#FF9F1C] focus:border-transparent"
                        >
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#8D99AE]/20">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        className="flex items-center gap-2 min-w-32"
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                    </Button>
                </div>
            </form>
        </Card>
    );
}