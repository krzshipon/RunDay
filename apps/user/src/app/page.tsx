'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function UserHome() {
  const { user, isVerified, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/signup');
      } else if (user && isVerified) {
        router.push('/dashboard');
      } else if (user && !isVerified) {
        router.push('/auth/verify-email');
      }
    }
  }, [user, isVerified, loading, router]);

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

  return null;
}
