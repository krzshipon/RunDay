'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('ProtectedRoute state:', { user: !!user, loading, isAdmin });

        if (!loading) {
            if (!user) {
                console.log('No user, redirecting to signin');
                router.push('/auth/signin');
            } else if (!isAdmin) {
                console.log('User exists but not admin, redirecting to signin');
                router.push('/auth/signin');
            } else {
                console.log('User is authenticated and admin, allowing access');
            }
        }
    }, [user, loading, isAdmin, router]);

    // Show loading while auth state is being determined
    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #EDF2F4 0%, rgba(141, 153, 174, 0.2) 100%)',
                }}
            >
                <div className="text-center">
                    <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"
                        style={{ borderColor: '#FF9F1C' }}
                    ></div>
                    <p className="mt-4" style={{ color: '#8D99AE' }}>Loading...</p>
                </div>
            </div>
        );
    }

    // Only render children if user is authenticated AND admin
    if (!user || !isAdmin) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: 'linear-gradient(135deg, #EDF2F4 0%, rgba(141, 153, 174, 0.2) 100%)',
                }}
            >
                <div className="text-center">
                    <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"
                        style={{ borderColor: '#FF9F1C' }}
                    ></div>
                    <p className="mt-4" style={{ color: '#8D99AE' }}>Verifying permissions...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}