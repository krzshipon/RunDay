'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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

    useEffect(() => {
        const checkAdminStatus = async (user: User | null) => {
            if (!user) {
                setIsAdmin(false);
                setIsCheckingAdmin(false);
                return;
            }

            setIsCheckingAdmin(true);
            try {
                console.log('Checking admin status for user:', user.id);
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Profile query error:', profileError);
                    setIsAdmin(false);
                    return;
                }

                console.log('Profile found:', profile);
                const isUserAdmin = profile?.role === 'admin';
                console.log('Is admin:', isUserAdmin);
                setIsAdmin(isUserAdmin);
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            } finally {
                setIsCheckingAdmin(false);
            }
        };

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
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await checkAdminStatus(session.user);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error initializing auth:', error);
                setSession(null);
                setUser(null);
                setIsAdmin(false);
                setLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);

            // Only set loading for significant auth changes, not token refresh
            const isSignificantChange = [
                'SIGNED_IN',
                'SIGNED_OUT',
                'INITIAL_SESSION'
            ].includes(event);

            if (isSignificantChange) {
                console.log('Significant auth change, setting loading to true');
                setLoading(true);
            }

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await checkAdminStatus(session.user);
            } else {
                setIsAdmin(false);
                setIsCheckingAdmin(false);
            }

            // Only set loading to false for significant changes
            if (isSignificantChange) {
                console.log('Setting loading to false after auth state change');
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading: loading || isCheckingAdmin,
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