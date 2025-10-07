'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
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

// Storage keys for persisting auth state
const USER_AUTH_STORAGE_KEY = 'runday_user_auth_state';

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const previousUserIdRef = useRef<string | null>(null);
    const isTabVisibleRef = useRef<boolean>(true);
    const lastAuthCheckRef = useRef<number>(Date.now());
    const preventTabSwitchUpdatesRef = useRef<boolean>(false);

    // Storage utilities
    const saveAuthState = useCallback((authData: { user: User | null; isVerified: boolean; lastCheck: number }) => {
        try {
            localStorage.setItem(USER_AUTH_STORAGE_KEY, JSON.stringify({
                userId: authData.user?.id || null,
                email: authData.user?.email || null,
                isVerified: authData.isVerified,
                lastCheck: authData.lastCheck
            }));
        } catch (error) {
            console.warn('Failed to save user auth state to localStorage:', error);
        }
    }, []);

    const loadAuthState = useCallback(() => {
        try {
            const saved = localStorage.getItem(USER_AUTH_STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load user auth state from localStorage:', error);
        }
        return null;
    }, []);

    const clearAuthState = useCallback(() => {
        try {
            localStorage.removeItem(USER_AUTH_STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to clear user auth state from localStorage:', error);
        }
    }, []);

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
            const wasVisible = isTabVisibleRef.current;
            isTabVisibleRef.current = !document.hidden;

            console.log('Tab visibility changed:', isTabVisibleRef.current ? 'visible' : 'hidden');

            if (isTabVisibleRef.current && !wasVisible) {
                // Tab became visible - activate prevention for a short period
                console.log('Tab became visible, activating update prevention');
                preventTabSwitchUpdatesRef.current = true;

                // Disable prevention after 3 seconds to allow genuine updates
                setTimeout(() => {
                    preventTabSwitchUpdatesRef.current = false;
                    console.log('Tab switch prevention deactivated');
                }, 3000);
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

            // Enhanced tab switch detection
            const isLikelyTabSwitch = (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') &&
                !isUserChanging &&
                isInitialized &&
                (timeSinceLastCheck < 10000 || preventTabSwitchUpdatesRef.current);

            // Skip ALL updates if prevention is active (tab switch scenario)
            if (preventTabSwitchUpdatesRef.current && !isSignOut && !isUserChanging) {
                console.log('Tab switch prevention active, completely skipping auth state update. Event:', event);
                return; // Exit early without any state changes
            }

            // Only show loading for actual user changes, sign out, or initial session
            const shouldShowLoading = (isUserChanging || isSignOut || (isInitialSession && !isInitialized)) &&
                !isTokenRefresh &&
                !isLikelyTabSwitch;

            if (shouldShowLoading) {
                console.log('User state changing, setting loading to true. Event:', event, 'Previous:', previousUserId, 'New:', newUserId);
                setLoading(true);
                lastAuthCheckRef.current = now;
            } else {
                console.log('Token refresh or tab switch detected, maintaining current state. Event:', event, 'User ID unchanged:', newUserId);
            }

            // Only update refs and state if not a tab switch
            if (!isLikelyTabSwitch || isUserChanging || isSignOut) {
                previousUserIdRef.current = newUserId;
                setSession(session);
                setUser(session?.user ?? null);
                setIsVerified(session?.user?.email_confirmed_at ? true : false);

                // Save state for persistence
                if (session?.user) {
                    saveAuthState({
                        user: session.user,
                        isVerified: session.user.email_confirmed_at ? true : false,
                        lastCheck: now
                    });
                } else {
                    clearAuthState();
                }

                // Set loading to false and mark as initialized
                if (shouldShowLoading) {
                    console.log('Setting loading to false after auth state change');
                    setLoading(false);
                }

                if (!isInitialized) {
                    setIsInitialized(true);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const signOut = async () => {
        clearAuthState();
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
    if (typeof window === 'undefined') {
        // Return default values during SSR
        return {
            user: null,
            session: null,
            loading: true,
            isVerified: false,
            signOut: async () => { }
        };
    }
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};