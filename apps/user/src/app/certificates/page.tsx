'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CertificateHistory } from '@/components/CertificateHistory';

export default function CertificatesPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-6xl mx-auto">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">My Certificates</h1>
                                <p className="text-slate-400">
                                    View and manage your race completion certificates
                                </p>
                            </div>

                            <CertificateHistory />
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}