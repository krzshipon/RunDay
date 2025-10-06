'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from './Button';

interface EventStatusToggleProps {
    eventId: string;
    currentStatus: 'upcoming' | 'completed' | 'cancelled';
    eventName?: string;
    onStatusChange?: (eventId: string, newStatus: 'upcoming' | 'completed' | 'cancelled') => void;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    showConfirmation?: boolean;
}

export function EventStatusToggle({
    eventId,
    currentStatus,
    eventName,
    onStatusChange,
    isLoading = false,
    disabled = false,
    className = '',
    showConfirmation = true
}: EventStatusToggleProps) {
    const [isChanging, setIsChanging] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<'upcoming' | 'completed' | 'cancelled' | null>(null);

    const statusConfig = {
        upcoming: {
            label: 'Upcoming',
            icon: Calendar,
            color: 'text-[#FF9F1C]',
            bgColor: 'bg-[#FF9F1C]/10',
            borderColor: 'border-[#FF9F1C]/20',
            nextActions: [
                { status: 'completed' as const, label: 'Mark as Completed', icon: CheckCircle },
                { status: 'cancelled' as const, label: 'Cancel Event', icon: XCircle }
            ]
        },
        completed: {
            label: 'Completed',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            nextActions: [
                { status: 'upcoming' as const, label: 'Revert to Upcoming', icon: Calendar }
            ]
        },
        cancelled: {
            label: 'Cancelled',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            nextActions: [
                { status: 'upcoming' as const, label: 'Reactivate Event', icon: Calendar }
            ]
        }
    };

    const currentConfig = statusConfig[currentStatus];
    const CurrentIcon = currentConfig.icon;

    const handleStatusChange = (newStatus: 'upcoming' | 'completed' | 'cancelled') => {
        if (showConfirmation) {
            setPendingStatus(newStatus);
            setShowConfirmDialog(true);
        } else {
            executeStatusChange(newStatus);
        }
    };

    const executeStatusChange = async (newStatus: 'upcoming' | 'completed' | 'cancelled') => {
        if (onStatusChange && !isLoading && !disabled) {
            setIsChanging(true);
            try {
                await onStatusChange(eventId, newStatus);
            } catch (error) {
                console.error('Failed to update event status:', error);
            } finally {
                setIsChanging(false);
                setShowConfirmDialog(false);
                setPendingStatus(null);
            }
        }
    };

    const handleConfirm = () => {
        if (pendingStatus) {
            executeStatusChange(pendingStatus);
        }
    };

    const handleCancel = () => {
        setShowConfirmDialog(false);
        setPendingStatus(null);
    };

    const getConfirmationMessage = () => {
        if (!pendingStatus || !eventName) return '';

        const messages = {
            completed: `Mark "${eventName}" as completed? This will indicate that the event has finished.`,
            cancelled: `Cancel "${eventName}"? This will mark the event as cancelled and may affect registrations.`,
            upcoming: `Reactivate "${eventName}"? This will change the event back to upcoming status.`
        };

        return messages[pendingStatus];
    };

    if (showConfirmDialog && pendingStatus) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black opacity-50" onClick={handleCancel} />
                <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                    <h3 className="text-lg font-semibold text-[#2B2D42] mb-3">
                        Confirm Status Change
                    </h3>
                    <p className="text-[#8D99AE] mb-6">
                        {getConfirmationMessage()}
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={isChanging}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            disabled={isChanging}
                            className="flex items-center gap-2"
                        >
                            {isChanging ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                statusConfig[pendingStatus].icon && React.createElement(statusConfig[pendingStatus].icon, { className: "h-4 w-4" })
                            )}
                            {isChanging ? 'Updating...' : 'Confirm'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`inline-flex flex-col gap-2 ${className}`}>
            {/* Current Status Badge */}
            <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border ${currentConfig.bgColor} ${currentConfig.color} ${currentConfig.borderColor}`}>
                <CurrentIcon className="h-4 w-4 mr-2" />
                {currentConfig.label}
            </div>

            {/* Status Change Actions */}
            {!disabled && currentConfig.nextActions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {currentConfig.nextActions.map((action) => {
                        const ActionIcon = action.icon;
                        return (
                            <Button
                                key={action.status}
                                variant="ghost"
                                onClick={() => handleStatusChange(action.status)}
                                disabled={isLoading || isChanging}
                                className="text-xs px-2 py-1 h-auto flex items-center gap-1"
                                title={action.label}
                            >
                                {isChanging ? (
                                    <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                                ) : (
                                    <ActionIcon className="h-3 w-3" />
                                )}
                                <span className="hidden sm:inline">{action.label}</span>
                            </Button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}