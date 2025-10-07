'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isVerified: boolean;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    isVerified: false,
    signOut: async () => { },
});

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const previousUserIdRef = useRef<string | null>(null);
    const isTabVisibleRef = useRef<boolean>(true);
    const lastAuthCheckRef = useRef<number>(Date.now());

    useEffect(() => {
        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Error getting session:', error);
                    setLoading(false);
                    return;
                }

                console.log('Initial session:', session?.user?.email);

                // Initialize the ref with the current user ID
                previousUserIdRef.current = session?.user?.id ?? null;

                setSession(session);
                setUser(session?.user ?? null);
                setIsVerified(session?.user?.email_confirmed_at ? true : false);

                setLoading(false);
                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing auth:', error);
                setSession(null);
                setUser(null);
                setIsVerified(false);
                setLoading(false);
                setIsInitialized(true);
            }
        };

        initializeAuth();

        // Handle page visibility changes
        const handleVisibilityChange = () => {
            isTabVisibleRef.current = !document.hidden;
            console.log('Tab visibility changed:', isTabVisibleRef.current ? 'visible' : 'hidden');
        };

        // Add visibility change listener
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            
            const now = Date.now();
            const timeSinceLastCheck = now - lastAuthCheckRef.current;
            const newUserId = session?.user?.id ?? null;
            const previousUserId = previousUserIdRef.current;

            // Determine if this is a real user change
            const isUserChanging = previousUserId !== newUserId;
            const isSignOut = event === 'SIGNED_OUT';
            const isInitialSession = event === 'INITIAL_SESSION';
            const isTokenRefresh = event === 'TOKEN_REFRESHED';
            
            // Check if this might be triggered by tab switching
            const isLikelyTabSwitch = event === 'SIGNED_IN' && 
                                    !isUserChanging && 
                                    isInitialized && 
                                    timeSinceLastCheck < 10000; // Less than 10 seconds since last check

            // Only show loading for actual user changes, sign out, or initial session
            // Skip loading for token refreshes and likely tab switches
            const shouldShowLoading = (isUserChanging || isSignOut || (isInitialSession && !isInitialized)) && 
                                    !isTokenRefresh && 
                                    !isLikelyTabSwitch;

            if (shouldShowLoading) {
                console.log('User state changing, setting loading to true. Event:', event, 'Previous:', previousUserId, 'New:', newUserId);
                setLoading(true);
                lastAuthCheckRef.current = now;
            } else {
                console.log('Token refresh or tab switch detected, keeping current state. Event:', event, 'User ID unchanged:', newUserId, 'Likely tab switch:', isLikelyTabSwitch);
            }

            // Update the ref with the new user ID
            previousUserIdRef.current = newUserId;

            setSession(session);
            setUser(session?.user ?? null);
            setIsVerified(session?.user?.email_confirmed_at ? true : false);

            // Set loading to false and mark as initialized
            if (shouldShowLoading) {
                console.log('Setting loading to false after auth state change');
                setLoading(false);
            }

            if (!isInitialized) {
                setIsInitialized(true);
            }
        });

        return () => {
            subscription.unsubscribe();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                isVerified,
                signOut,
            }}
        >
            {children as any}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};