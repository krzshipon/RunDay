'use client';

import { useState, useEffect } from 'react';
import { Card, Button } from '@runday/ui';
import { Download, Trash2, FileText, Trophy, Calendar, MapPin, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCertificateManager, CertificateRecord } from '@/lib/certificate-manager';

export function CertificateHistory() {
    const { user } = useAuth();
    const { certificates, loading, loadUserCertificates, getDownloadUrl, deleteCertificate } = useCertificateManager();
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            loadUserCertificates(user.id);
        }
    }, [user?.id, loadUserCertificates]);

    const handleDownload = async (certificate: CertificateRecord) => {
        setDownloadingId(certificate.id);
        try {
            const result = await getDownloadUrl(certificate.file_path);
            if (result.success && result.url) {
                // Create a temporary link to download the file
                const link = document.createElement('a');
                link.href = result.url;
                link.download = `RunDay_Certificate_${(certificate as any).registrations?.events?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Event'}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to get download URL:', result.error);
            }
        } catch (error) {
            console.error('Error downloading certificate:', error);
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDelete = async (certificate: CertificateRecord) => {
        if (!user?.id) return;

        const confirmed = window.confirm('Are you sure you want to delete this certificate? This action cannot be undone.');
        if (!confirmed) return;

        setDeletingId(certificate.id);
        try {
            const result = await deleteCertificate(certificate.id, user.id);
            if (!result.success) {
                console.error('Failed to delete certificate:', result.error);
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
                    <span className="ml-2 text-gray-600">Loading certificates...</span>
                </div>
            </Card>
        );
    }

    if (certificates.length === 0) {
        return (
            <Card className="p-6">
                <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
                    <p className="text-gray-500">Complete some events and download your certificates to see them here.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Certificate History</h2>
                <Button
                    onClick={() => user?.id && loadUserCertificates(user.id)}
                    variant="ghost"
                    size="sm"
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4">
                {certificates.map((certificate) => {
                    const event = (certificate as any).registrations?.events;
                    const registration = (certificate as any).registrations;
                    const eventDate = event?.event_date ? new Date(event.event_date) : null;

                    return (
                        <Card key={certificate.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Trophy className="h-4 w-4 text-amber-500" />
                                        <h3 className="font-semibold text-gray-900">
                                            {event?.name || 'Event Certificate'}
                                        </h3>
                                        {certificate.regenerated_count > 0 && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                Regenerated {certificate.regenerated_count}x
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                        {eventDate && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>Event: {eventDate.toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {event?.distance && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>Distance: {event.distance}</span>
                                            </div>
                                        )}
                                        {event?.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>Location: {event.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>Generated: {formatDate(certificate.generated_at)}</span>
                                        <span>Size: {formatFileSize(certificate.file_size)}</span>
                                        {registration?.position && (
                                            <span>Position: #{registration.position}</span>
                                        )}
                                        {registration?.finish_time && (
                                            <span>Time: {registration.finish_time}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <Button
                                        onClick={() => handleDownload(certificate)}
                                        disabled={downloadingId === certificate.id}
                                        size="sm"
                                        className="bg-gradient-to-r from-[#FF9F1C] to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white border-0"
                                    >
                                        {downloadingId === certificate.id ? (
                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Download className="h-3 w-3" />
                                        )}
                                    </Button>

                                    <Button
                                        onClick={() => handleDelete(certificate)}
                                        disabled={deletingId === certificate.id}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        {deletingId === certificate.id ? (
                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}