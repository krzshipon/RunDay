'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
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

// Storage keys for persisting auth state
const AUTH_STORAGE_KEY = 'runday_admin_auth_state';
const ADMIN_STATUS_KEY = 'runday_admin_status';
const LAST_AUTH_CHECK_KEY = 'runday_last_auth_check';

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
    const preventTabSwitchUpdatesRef = useRef<boolean>(false);

    // Storage utilities
    const saveAuthState = useCallback((authData: { user: User | null; isAdmin: boolean; lastCheck: number }) => {
        try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                userId: authData.user?.id || null,
                email: authData.user?.email || null,
                isAdmin: authData.isAdmin,
                lastCheck: authData.lastCheck
            }));
        } catch (error) {
            console.warn('Failed to save auth state to localStorage:', error);
        }
    }, []);

    const loadAuthState = useCallback(() => {
        try {
            const saved = localStorage.getItem(AUTH_STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load auth state from localStorage:', error);
        }
        return null;
    }, []);

    const clearAuthState = useCallback(() => {
        try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(ADMIN_STATUS_KEY);
            localStorage.removeItem(LAST_AUTH_CHECK_KEY);
        } catch (error) {
            console.warn('Failed to clear auth state from localStorage:', error);
        }
    }, []);

    const checkAdminStatus = async (user: User | null, forceCheck: boolean = false) => {
        if (!user) {
            setIsAdmin(false);
            clearAuthState();
            return false;
        }

        // Check if we have cached admin status for this user
        const savedState = loadAuthState();
        const isSameUser = user.id === savedState?.userId && user.id === previousUserIdRef.current;
        const cacheAge = Date.now() - (savedState?.lastCheck || 0);
        const cacheValid = cacheAge < 300000; // 5 minutes cache

        // If we have valid cached data and this isn't a forced check, use cache
        if (savedState && isSameUser && cacheValid && !forceCheck) {
            console.log('Using cached admin status for user:', user.id);
            setIsAdmin(savedState.isAdmin);
            return savedState.isAdmin;
        }

        // Skip admin check if tab switching prevention is active
        if (preventTabSwitchUpdatesRef.current && !forceCheck) {
            console.log('Tab switch prevention active, skipping admin check');
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
            
            // Save to cache
            const now = Date.now();
            lastAuthCheckRef.current = now;
            saveAuthState({ user, isAdmin: isUserAdmin, lastCheck: now });
            
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
                // First, try to load from cache
                const savedState = loadAuthState();
                
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
                    // Check if we have valid cached data for this user
                    const isSameUser = session.user.id === savedState?.userId;
                    const cacheAge = Date.now() - (savedState?.lastCheck || 0);
                    const cacheValid = cacheAge < 300000; // 5 minutes

                    if (savedState && isSameUser && cacheValid) {
                        console.log('Using cached admin status on initialization');
                        setIsAdmin(savedState.isAdmin);
                        lastAuthCheckRef.current = savedState.lastCheck;
                    } else {
                        console.log('Cache invalid or missing, checking admin status');
                        await checkAdminStatus(session.user, true); // Force check on initial load
                    }
                }

                setLoading(false);
                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing auth:', error);
                clearAuthState();
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
            } else {
                console.log('Token refresh or tab switch detected, maintaining current state. Event:', event, 'User ID unchanged:', newUserId);
            }

            // Only update refs and state if not a tab switch
            if (!isLikelyTabSwitch || isUserChanging || isSignOut) {
                previousUserIdRef.current = newUserId;
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    // Only check admin status for significant changes
                    const forceCheck = shouldShowLoading;
                    
                    if (forceCheck) {
                        lastAuthCheckRef.current = now;
                        await checkAdminStatus(session.user, forceCheck);
                    }
                } else {
                    setIsAdmin(false);
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