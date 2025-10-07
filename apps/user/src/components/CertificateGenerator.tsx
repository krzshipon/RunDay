'use client';

import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@runday/ui';
import { Download, FileText, Trophy, Medal, Award, RefreshCw } from 'lucide-react';
import { EventRegistrationData } from '@/lib/event-operations';
import { useAuth } from '@/components/auth/AuthProvider';
import { CertificatePreview } from './CertificatePreview';
import { useCertificateManager } from '@/lib/certificate-manager';

interface CertificateGeneratorProps {
    registration: EventRegistrationData;
    className?: string;
}

export function CertificateGenerator({
    registration,
    className = ''
}: CertificateGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasExistingCertificate, setHasExistingCertificate] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const { storeCertificate, getCertificateRecord, getDownloadUrl } = useCertificateManager(); const event = registration.event;
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

    // Check for existing certificate on component mount
    useEffect(() => {
        const checkExistingCertificate = async () => {
            if (user?.id) {
                const record = await getCertificateRecord(registration.id, user.id);
                setHasExistingCertificate(!!record);
            }
        };
        checkExistingCertificate();
    }, [registration.id, user?.id, getCertificateRecord]);

    const generateCertificate = async () => {
        if (!certificateRef.current) return;

        setIsGenerating(true);

        try {
            // Create canvas from the certificate component
            const canvas = await html2canvas(certificateRef.current, {
                background: '#ffffff',
                width: 1200,
                height: 848, // A4 landscape ratio
                useCORS: true,
                allowTaint: true,
            });

            // Create PDF
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 297; // A4 landscape width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Generate PDF blob for storage
            const pdfBlob = pdf.output('blob');

            // Store certificate in Supabase if user is logged in
            if (user?.id) {
                const storeResult = await storeCertificate(pdfBlob, registration, user.id);
                if (storeResult.success) {
                    setHasExistingCertificate(true);
                    console.log('Certificate stored successfully');
                } else {
                    console.error('Failed to store certificate:', storeResult.error);
                }
            }

            // Generate filename for download
            const eventName = event.name.replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `RunDay_Certificate_${eventName}_${user?.email || 'user'}.pdf`;

            // Download the PDF
            pdf.save(filename);
        } catch (error) {
            console.error('Error generating certificate:', error);
            // You could add toast notification here
        } finally {
            setIsGenerating(false);
        }
    };

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

    return (
        <div className={`flex gap-2 ${className}`}>
            {/* Preview Button */}
            <CertificatePreview registration={registration} />

            {/* Download Button */}
            <Button
                onClick={generateCertificate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                size="sm"
            >
                {isGenerating ? (
                    <>
                        <FileText className="h-3 w-3 mr-1 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        {hasExistingCertificate ? (
                            <>
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Regenerate Certificate
                            </>
                        ) : (
                            <>
                                <Download className="h-3 w-3 mr-1" />
                                Download Certificate
                            </>
                        )}
                    </>
                )}
            </Button>

            {/* Hidden Certificate Template */}
            <div
                ref={certificateRef}
                className="fixed top-[-9999px] left-[-9999px] w-[1200px] h-[848px] bg-white p-12 font-serif"
                style={{ fontFamily: 'serif' }}
            >
                {/* Certificate Border */}
                <div className={`w-full h-full border-8 ${colors.border} relative bg-gradient-to-br ${colors.secondary}`}>
                    {/* Inner Border */}
                    <div className="absolute inset-4 border-2 border-gray-300"></div>

                    {/* Content */}
                    <div className="flex flex-col items-center justify-center h-full text-center px-16 relative">
                        {/* Header */}
                        <div className="mb-8">
                            <div className={`inline-block px-8 py-4 bg-gradient-to-r ${colors.primary} rounded-lg shadow-lg mb-4`}>
                                <h1 className="text-4xl font-bold text-white tracking-wider">
                                    RUNDAY CERTIFICATE
                                </h1>
                            </div>
                            <p className="text-xl text-gray-600 font-medium">
                                of Completion & Achievement
                            </p>
                        </div>

                        {/* Achievement Icon */}
                        <div className="mb-6">
                            {performanceLevel === 'winner' && (
                                <Trophy className="h-20 w-20 text-yellow-500 mx-auto" />
                            )}
                            {performanceLevel === 'podium' && (
                                <Medal className="h-20 w-20 text-gray-500 mx-auto" />
                            )}
                            {performanceLevel === 'top10' && (
                                <Award className="h-20 w-20 text-orange-500 mx-auto" />
                            )}
                            {performanceLevel === 'finisher' && (
                                <Trophy className="h-20 w-20 text-emerald-500 mx-auto" />
                            )}
                        </div>

                        {/* Recipient */}
                        <div className="mb-8">
                            <p className="text-lg text-gray-600 mb-2">This is to certify that</p>
                            <h2 className={`text-5xl font-bold ${colors.accent} border-b-2 ${colors.border} pb-2 px-8`}>
                                {user.email}
                            </h2>
                        </div>

                        {/* Event Details */}
                        <div className="mb-8 space-y-2">
                            <p className="text-lg text-gray-600">has successfully completed the</p>
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">
                                {event.name}
                            </h3>

                            {/* Event Info Grid */}
                            <div className="grid grid-cols-2 gap-8 text-lg text-gray-700 max-w-2xl mx-auto">
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
                                    <strong>Bib Number:</strong> #{registration.bib_number || 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="mb-8">
                            <div className="flex justify-center space-x-12 text-xl">
                                {registration.position && (
                                    <div className="text-center">
                                        <p className="text-gray-600">Position</p>
                                        <p className={`text-3xl font-bold ${colors.accent}`}>
                                            #{registration.position}
                                        </p>
                                    </div>
                                )}
                                <div className="text-center">
                                    <p className="text-gray-600">Finish Time</p>
                                    <p className={`text-3xl font-bold ${colors.accent}`}>
                                        {formatFinishTime(registration.finish_time)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto">
                            <div className="text-gray-600 text-sm">
                                <p className="mb-2">Certificate issued by RunDay Event Management</p>
                                <p>Generated on {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 left-4 opacity-10">
                            <Trophy className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="absolute top-4 right-4 opacity-10">
                            <Medal className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-10">
                            <Award className="h-16 w-16 text-gray-400" />
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-10">
                            <Trophy className="h-16 w-16 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}