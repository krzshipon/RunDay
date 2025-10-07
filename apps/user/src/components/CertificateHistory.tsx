'use client';

import { useState, useEffect } from 'react';
import { Card, Button } from '@runday/ui';
import { Download, Trash2, FileText, Trophy, Calendar, MapPin, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useCertificateManager, CertificateRecord } from '@/lib/certificate-manager';

export default function CertificateHistory() {
    const { user } = useAuth();
    const { certificates, loading, loadUserCertificates, getDownloadUrl, deleteCertificate } = useCertificateManager();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadUserCertificates(user.id).catch(err => {
                setError('Failed to load certificates');
                console.error('Load certificates error:', err);
            });
        }
    }, [user, loadUserCertificates]);

    const handleDownload = async (certificate: CertificateRecord) => {
        try {
            const result = await getDownloadUrl(certificate.file_path);
            if (result.success && result.url) {
                window.open(result.url, '_blank');
            } else {
                setError(result.error || 'Failed to get download URL');
            }
        } catch (err) {
            setError('Failed to download certificate');
            console.error('Download failed:', err);
        }
    };

    const handleDelete = async (certificateId: string) => {
        if (window.confirm('Are you sure you want to delete this certificate?')) {
            try {
                await deleteCertificate(certificateId, user!.id);
            } catch (err) {
                setError('Failed to delete certificate');
                console.error('Delete failed:', err);
            }
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your certificates</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Portfolio</h1>
                    <p className="text-gray-600">Manage and download your race certificates</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                        <span className="ml-2 text-gray-600">Loading certificates...</span>
                    </div>
                ) : error ? (
                    <Card className="p-6 text-center bg-red-50 border-red-200">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={() => user && loadUserCertificates(user.id)} variant="secondary">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                    </Card>
                ) : certificates.length === 0 ? (
                    <Card className="p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates yet</h3>
                        <p className="text-gray-600 mb-6">Create your first certificate to get started</p>
                        <Button onClick={() => window.location.href = '/certificates/generator'}>
                            <Trophy className="w-4 h-4 mr-2" />
                            Create Certificate
                        </Button>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Your Certificates ({certificates.length})
                            </h2>
                            <Button onClick={() => window.location.href = '/certificates/generator'} variant="secondary">
                                <Trophy className="w-4 h-4 mr-2" />
                                Create New
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {certificates.map((certificate) => (
                                <Card key={certificate.id} className="p-4 hover:shadow-md transition-shadow">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                Certificate #{certificate.id.slice(-8)}
                                            </h3>
                                            <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span>{new Date(certificate.generated_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span className="truncate">Event ID: {certificate.event_id}</span>
                                            </div>
                                            {certificate.regenerated_count > 0 && (
                                                <div className="flex items-center">
                                                    <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span>Regenerated {certificate.regenerated_count} times</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={() => handleDownload(certificate)}
                                                size="sm"
                                                className="flex-1"
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(certificate.id)}
                                                variant="danger"
                                                size="sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}