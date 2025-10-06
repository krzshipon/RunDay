'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card } from '@runday/ui';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const code = searchParams.get('access_token');
                const refreshToken = searchParams.get('refresh_token');

                if (code && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: code,
                        refresh_token: refreshToken
                    });

                    if (error) {
                        setError(error.message);
                        setStatus('error');
                        return;
                    }
                }

                // Check if user is now authenticated and verified
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) {
                    setError(userError.message);
                    setStatus('error');
                    return;
                }

                if (user?.email_confirmed_at) {
                    setStatus('success');
                    // Redirect to dashboard after a brief success message
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 2000);
                } else {
                    setError('Email verification failed. Please try again.');
                    setStatus('error');
                }
            } catch (err) {
                setError('An unexpected error occurred during verification.');
                setStatus('error');
            }
        };

        handleAuthCallback();
    }, [searchParams, router]);

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundColor: '#EDF2F4',
                background: 'linear-gradient(135deg, #EDF2F4 0%, rgba(141, 153, 174, 0.2) 100%)',
                minHeight: '100vh',
                width: '100%',
            }}
        >
            <Card variant="glass" className="w-full max-w-md">
                <div className="p-6">
                    {status === 'loading' && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF9F1C] rounded-full mb-4">
                                <Loader className="h-8 w-8 text-white animate-spin" />
                            </div>
                            <h1 className="text-2xl font-bold text-[#EDF2F4] mb-2">Verifying Email</h1>
                            <p className="text-[#8D99AE]">Please wait while we verify your email...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                                <CheckCircle className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-[#EDF2F4] mb-2">Email Verified!</h1>
                            <p className="text-[#8D99AE] mb-4">
                                Your account has been successfully verified. Redirecting to your dashboard...
                            </p>
                            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm">
                                <p className="text-sm text-green-400">Welcome to RunDay!</p>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#EF233C] rounded-full mb-4">
                                <AlertCircle className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-[#EDF2F4] mb-2">Verification Failed</h1>
                            <p className="text-[#8D99AE] mb-4">{error}</p>

                            <div className="space-y-3">
                                <Link href="/auth/signin">
                                    <button className="w-full px-4 py-2 bg-[#FF9F1C] text-white rounded-lg hover:bg-[#FF9F1C]/90 transition-colors">
                                        Try Signing In
                                    </button>
                                </Link>
                                <Link href="/auth/signup">
                                    <button className="w-full px-4 py-2 bg-transparent border border-[#8D99AE] text-[#8D99AE] rounded-lg hover:bg-[#8D99AE]/10 transition-colors">
                                        Create New Account
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}