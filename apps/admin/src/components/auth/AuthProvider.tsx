'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    isCheckingAdmin: boolean;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
    isCheckingAdmin: false,
    signOut: async () => { },
});

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const previousUserIdRef = useRef<string | null>(null);
    const isTabVisibleRef = useRef<boolean>(true);
    const lastAuthCheckRef = useRef<number>(Date.now());

    const checkAdminStatus = async (user: User | null, forceCheck: boolean = false) => {
        if (!user) {
            setIsAdmin(false);
            return false;
        }

        // If we already know the admin status and this isn't a forced check, skip
        // Also check if this is the same user as before
        const isSameUser = user.id === previousUserIdRef.current;
        if (isAdmin && !forceCheck && isSameUser) {
            console.log('Admin status already known for same user, skipping check');
            return isAdmin;
        }

        try {
            setIsCheckingAdmin(true);
            console.log('Checking admin status for user:', user.id);

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.error('Profile query error:', profileError);
                setIsAdmin(false);
                return false;
            }

            console.log('Profile found:', profile);
            const isUserAdmin = profile?.role === 'admin';
            console.log('Is admin:', isUserAdmin);
            setIsAdmin(isUserAdmin);
            return isUserAdmin;
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
            return false;
        } finally {
            setIsCheckingAdmin(false);
        }
    };

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

                if (session?.user) {
                    await checkAdminStatus(session.user, true); // Force check on initial load
                }

                setLoading(false);
                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing auth:', error);
                setSession(null);
                setUser(null);
                setIsAdmin(false);
                setLoading(false);
                setIsInitialized(true);
            }
        };

        initializeAuth();

        // Handle page visibility changes
        const handleVisibilityChange = () => {
            isTabVisibleRef.current = !document.hidden;
            console.log('Tab visibility changed:', isTabVisibleRef.current ? 'visible' : 'hidden');

            // When tab becomes visible, don't trigger auth checks if we just did one recently
            if (isTabVisibleRef.current) {
                const now = Date.now();
                const timeSinceLastCheck = now - lastAuthCheckRef.current;
                console.log('Time since last auth check:', timeSinceLastCheck + 'ms');

                // If we checked auth in the last 5 seconds, skip
                if (timeSinceLastCheck < 5000) {
                    console.log('Recent auth check detected, skipping reload on tab focus');
                }
            }
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
            } else {
                console.log('Token refresh or tab switch detected, keeping current state. Event:', event, 'User ID unchanged:', newUserId, 'Likely tab switch:', isLikelyTabSwitch);
            }

            // Update the ref with the new user ID
            previousUserIdRef.current = newUserId;

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // Force check admin status only for significant changes
                const forceCheck = shouldShowLoading;

                // Update last auth check time
                if (forceCheck || !isAdmin) {
                    lastAuthCheckRef.current = now;
                    await checkAdminStatus(session.user, forceCheck);
                } else {
                    console.log('Skipping admin check - already verified and not a significant change');
                }
            } else {
                setIsAdmin(false);
            }

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
                loading: loading || isCheckingAdmin, // Include admin checking in loading state
                isAdmin,
                isCheckingAdmin,
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