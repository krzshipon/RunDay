'use client';

import { useState } from 'react';
import { Button } from '@runday/ui';
import { Eye, X, Trophy, Medal, Award } from 'lucide-react';
import { EventRegistrationData } from '@/lib/event-operations';
import { useAuth } from '@/components/auth/AuthProvider';

interface CertificatePreviewProps {
    registration: EventRegistrationData;
    className?: string;
}

export function CertificatePreview({
    registration,
    className = ''
}: CertificatePreviewProps) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const { user } = useAuth();

    const event = registration.event;
    if (!event || !user || !registration.finish_time) return null;

    // Format finish time for display
    const formatFinishTime = (timeString: string) => {
        const parts = timeString.split(':');
        if (parts.length === 3) {
            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const seconds = parseInt(parts[2]);

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
        return timeString;
    };

    // Get performance level for certificate design
    const getPerformanceLevel = () => {
        if (!registration.position) return 'finisher';

        if (registration.position === 1) return 'winner';
        if (registration.position <= 3) return 'podium';
        if (registration.position <= 10) return 'top10';
        return 'finisher';
    };

    const performanceLevel = getPerformanceLevel();
    const eventDate = new Date(event.event_date);

    // Get certificate colors based on performance
    const getCertificateColors = () => {
        switch (performanceLevel) {
            case 'winner':
                return {
                    primary: 'from-yellow-400 via-yellow-500 to-amber-600',
                    secondary: 'from-yellow-100 to-amber-100',
                    accent: 'text-yellow-700',
                    border: 'border-yellow-400'
                };
            case 'podium':
                return {
                    primary: 'from-gray-300 via-gray-400 to-gray-500',
                    secondary: 'from-gray-50 to-gray-100',
                    accent: 'text-gray-700',
                    border: 'border-gray-400'
                };
            case 'top10':
                return {
                    primary: 'from-amber-600 via-orange-500 to-red-600',
                    secondary: 'from-orange-50 to-red-50',
                    accent: 'text-orange-700',
                    border: 'border-orange-400'
                };
            default:
                return {
                    primary: 'from-emerald-500 via-teal-500 to-cyan-600',
                    secondary: 'from-emerald-50 to-teal-50',
                    accent: 'text-emerald-700',
                    border: 'border-emerald-400'
                };
        }
    };

    const colors = getCertificateColors();

    if (!isPreviewOpen) {
        return (
            <Button
                onClick={() => setIsPreviewOpen(true)}
                variant="ghost"
                size="sm"
                className={`text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 ${className}`}
            >
                <Eye className="h-3 w-3 mr-1" />
                Preview Certificate
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto relative">
                {/* Close Button */}
                <Button
                    onClick={() => setIsPreviewOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200"
                >
                    <X className="h-4 w-4" />
                </Button>

                {/* Certificate Preview */}
                <div className="w-full aspect-[1.414/1] bg-white p-8 font-serif">
                    {/* Certificate Border */}
                    <div className={`w-full h-full border-6 ${colors.border} relative bg-gradient-to-br ${colors.secondary}`}>
                        {/* Inner Border */}
                        <div className="absolute inset-3 border-2 border-gray-300"></div>

                        {/* Content */}
                        <div className="flex flex-col items-center justify-center h-full text-center px-12 relative">
                            {/* Header */}
                            <div className="mb-6">
                                <div className={`inline-block px-6 py-3 bg-gradient-to-r ${colors.primary} rounded-lg shadow-lg mb-3`}>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
                                        RUNDAY CERTIFICATE
                                    </h1>
                                </div>
                                <p className="text-lg text-gray-600 font-medium">
                                    of Completion & Achievement
                                </p>
                            </div>

                            {/* Achievement Icon */}
                            <div className="mb-4">
                                {performanceLevel === 'winner' && (
                                    <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />
                                )}
                                {performanceLevel === 'podium' && (
                                    <Medal className="h-12 w-12 text-gray-500 mx-auto" />
                                )}
                                {performanceLevel === 'top10' && (
                                    <Award className="h-12 w-12 text-orange-500 mx-auto" />
                                )}
                                {performanceLevel === 'finisher' && (
                                    <Trophy className="h-12 w-12 text-emerald-500 mx-auto" />
                                )}
                            </div>

                            {/* Recipient */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-2">This is to certify that</p>
                                <h2 className={`text-2xl md:text-3xl font-bold ${colors.accent} border-b-2 ${colors.border} pb-2 px-6`}>
                                    {user.email}
                                </h2>
                            </div>

                            {/* Event Details */}
                            <div className="mb-6 space-y-2">
                                <p className="text-sm text-gray-600">has successfully completed the</p>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                                    {event.name}
                                </h3>

                                {/* Event Info Grid */}
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 max-w-lg mx-auto">
                                    <div>
                                        <strong>Date:</strong> {eventDate.toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div>
                                        <strong>Distance:</strong> {event.distance}
                                    </div>
                                    <div>
                                        <strong>Location:</strong> {event.location || 'RunDay Event'}
                                    </div>
                                    <div>
                                        <strong>Bib #:</strong> {registration.bib_number || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="mb-6">
                                <div className="flex justify-center space-x-8 text-lg">
                                    {registration.position && (
                                        <div className="text-center">
                                            <p className="text-gray-600 text-sm">Position</p>
                                            <p className={`text-xl font-bold ${colors.accent}`}>
                                                #{registration.position}
                                            </p>
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <p className="text-gray-600 text-sm">Finish Time</p>
                                        <p className={`text-xl font-bold ${colors.accent}`}>
                                            {formatFinishTime(registration.finish_time)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto">
                                <div className="text-gray-600 text-xs">
                                    <p className="mb-1">Certificate issued by RunDay Event Management</p>
                                    <p>Generated on {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-2 left-2 opacity-10">
                                <Trophy className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="absolute top-2 right-2 opacity-10">
                                <Medal className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="absolute bottom-2 left-2 opacity-10">
                                <Award className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="absolute bottom-2 right-2 opacity-10">
                                <Trophy className="h-8 w-8 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}